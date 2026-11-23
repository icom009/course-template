#!/usr/bin/env python3
"""차시 사양(spec/*.py) + 원본 덱 HTML → 편집 가능한 pptx.
글자·코드·표 = 상자(편집 가능) · 캡처 = 그림 · 노트 = 강사 대본.

사용: python3 build_pptx.py spec/streamlit_day2.py out/streamlit_2차시.pptx [--theme dark|light] [--only 1,4,7]
글꼴: Pretendard(본문) · D2Coding(코드·도식, 한글 고정폭) — fonts/ 폴더를 받는 쪽 PC에 설치.
"""
import argparse, html as H, importlib.util, math, re, sys, tempfile, unicodedata
from pathlib import Path
from PIL import Image, ImageChops
from lxml import etree
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.shapes import MSO_SHAPE, MSO_CONNECTOR
from pptx.enum.text import PP_ALIGN, MSO_ANCHOR
from pygments import lex
from pygments.lexers import PythonLexer, TextLexer
from pygments.token import Token

HERE = Path(__file__).resolve().parent
sys.path.insert(0, str(HERE))
from extract_deck import deck as extract

EDU = HERE.parents[1]
A = "{http://schemas.openxmlformats.org/drawingml/2006/main}"

# ───────────────────────── 테마 ─────────────────────────
THEMES = {
    "dark": dict(bg="0E1117", surf="161A22", surf2="1F242E", line="2B313D", text="F3F4F6", muted="9AA1AF",
                 code="0A0C10", codebar="151922", coral="FF5A5F", blue="5EA8FF", violet="A78BFA", amber="FBBF24",
                 tint=0.16),
    "light": dict(bg="FFFFFF", surf="F6F7F9", surf2="EEF0F4", line="E2E5EB", text="15171C", muted="636B78",
                  code="0F1218", codebar="1A1F29", coral="E5484D", blue="2F7BEA", violet="7C5CE0", amber="C98A00",
                  tint=0.10),
}
ACCENT_LIGHT = {"3DD68C": "12A150", "FF4B4B": "E5484D", "FF9F45": "E07A10", "A78BFA": "7C5CE0", "2DD4BF": "0E9F92",
                "14B8A6": "0D9488", "3B82F6": "2563EB", "22C55E": "16A34A", "A855F7": "9333EA", "F97316": "EA580C", "06B6D4": "0891B2"}
FONT, MONO = "Pretendard", "D2Coding"
W, Hh = 13.333, 7.5
MX = 0.75
CW = W - 2 * MX
TOP, BOTTOM = 2.3, 6.95
T = {}   # 현재 테마 (build 에서 채움)
CUR = [""]   # 지금 만드는 장 제목 (경고용)

STAGE = {   # 제목 앞 기호 → (꼬리표, 색 키)
    "⚠️": ("불편", "coral"), "🛠️": ("도구", "accent"), "💻": ("코드", "blue"),
    "🔄": ("비교", "violet"), "✋": ("실습", "amber"), "★": ("완성", "amber"),
    "📊": ("정리", "violet"), "📇": ("카드", "blue"), "📖": ("문서", "blue"), "📦": ("정리", "violet"),
    "▣": ("실습", "amber"), "🆕": ("새 파일", "blue"), "✏️": ("고치기", "blue"),
}
LEAD_EMOJI = re.compile(r"^([\U0001F300-\U0001FAFF\u2600-\u27BF\u2B00-\u2BFF\u25A0-\u25FF★]\ufe0f?)\s*")

def rgb(h): return RGBColor.from_string(h)

def mix(h1, h2, t):
    a = [int(h1[i:i + 2], 16) for i in (0, 2, 4)]; b = [int(h2[i:i + 2], 16) for i in (0, 2, 4)]
    return "".join(f"{round(x + (y - x) * t):02X}" for x, y in zip(a, b))

def width(s):
    return sum(2 if unicodedata.east_asian_width(c) in "WF" else 1 for c in s)

def strip_md(s): return s.replace("**", "").replace("`", "")

def est_lines(txt, pt, box_w, mono=False):
    unit = pt * (0.6 if mono else 0.56) / 72
    per = max(1, int(box_w / unit))
    return sum(max(1, math.ceil(width(strip_md(l)) / per)) for l in txt.split("\n"))

# ───────────────────────── 기본 도형 ─────────────────────────
def no_shadow(shape):
    """테마 기본 효과(그림자) 참조를 없앤다 — 밝은 배경에서 회색 그림자가 생긴다."""
    st = shape._element.find("{http://schemas.openxmlformats.org/presentationml/2006/main}style")
    if st is not None: shape._element.remove(st)

def rect(slide, x, y, w, h, fill, line=None, radius=0.12, name=None, shape=MSO_SHAPE.ROUNDED_RECTANGLE):
    s = slide.shapes.add_shape(shape, Inches(x), Inches(y), Inches(w), Inches(h))
    if shape == MSO_SHAPE.ROUNDED_RECTANGLE:
        s.adjustments[0] = min(0.5, radius / max(min(w, h), 0.01))
    if fill: s.fill.solid(); s.fill.fore_color.rgb = rgb(fill)
    else: s.fill.background()
    if line: s.line.color.rgb = rgb(line); s.line.width = Pt(1)
    else: s.line.fill.background()
    no_shadow(s)
    if name: s.name = name
    return s

def circle(slide, x, y, d, fill, line=None):
    return rect(slide, x, y, d, d, fill, line, shape=MSO_SHAPE.OVAL)

def add_runs(par, txt, size, color, bold=False, font=FONT):
    """**굵게** · `코드` (굵게 안의 코드도) → run."""
    for chunk in re.split(r"(\*\*.+?\*\*)", txt):
        if not chunk: continue
        b = bold or chunk.startswith("**")
        inner = chunk[2:-2] if chunk.startswith("**") else chunk
        for part in re.split(r"(`[^`]+`)", inner):
            if not part: continue
            r = par.add_run(); f = r.font
            f.size = Pt(size); f.name = font; f.color.rgb = rgb(color); f.bold = b
            if part.startswith("`") and part.endswith("`") and len(part) > 1:
                r.text = part[1:-1]; f.name = MONO; f.color.rgb = rgb(T["accent"])
            else:
                r.text = part

def text(slide, x, y, w, h, lines, size, color=None, bold=False, align=PP_ALIGN.LEFT, anchor=MSO_ANCHOR.TOP,
         font=FONT, space=6, line_sp=1.18, name=None):
    color = color or T["text"]
    tb = slide.shapes.add_textbox(Inches(x), Inches(y), Inches(w), Inches(h))
    if name: tb.name = name
    tf = tb.text_frame; tf.word_wrap = True
    tf.margin_left = tf.margin_right = tf.margin_top = tf.margin_bottom = 0
    tf.vertical_anchor = anchor
    if isinstance(lines, str): lines = lines.split("\n")
    for i, line in enumerate(lines):
        p = tf.paragraphs[0] if i == 0 else tf.add_paragraph()
        p.alignment = align; p.space_after = Pt(space); p.line_spacing = line_sp
        add_runs(p, line, size, color, bold, font)
    return tb

_ICON = {}
def icon(slide, name, x, y, d, color):
    key = (name, color)
    if key not in _ICON:
        im = Image.open(HERE / "icons" / f"{name}.png").convert("RGBA")
        solid = Image.new("RGBA", im.size, "#" + color); solid.putalpha(im.getchannel("A"))
        p = Path(tempfile.gettempdir()) / f"ic_{name}_{color}.png"; solid.save(p); _ICON[key] = p
    slide.shapes.add_picture(str(_ICON[key]), Inches(x), Inches(y), Inches(d), Inches(d))

def icon_badge(slide, name, x, y, d, color):
    circle(slide, x, y, d, mix(T["bg"], color, 0.2))
    icon(slide, name, x + d * 0.25, y + d * 0.25, d * 0.5, color)

def pill(slide, x, y, label, color, size=12):
    w = 0.36 + width(label) * size * 0.56 / 72
    rect(slide, x, y, w, 0.34, mix(T["bg"], color, 0.18), radius=0.17)
    text(slide, x, y, w, 0.34, label, size, color, bold=True, align=PP_ALIGN.CENTER, anchor=MSO_ANCHOR.MIDDLE)
    return w

def arrow(slide, x1, y1, x2, y2, color, head=True, wpt=2.0):
    c = slide.shapes.add_connector(MSO_CONNECTOR.STRAIGHT, Inches(x1), Inches(y1), Inches(x2), Inches(y2))
    c.line.color.rgb = rgb(color); c.line.width = Pt(wpt)
    if head:
        ln = c.line._get_or_add_ln()
        te = etree.SubElement(ln, A + "tailEnd"); te.set("type", "triangle"); te.set("w", "med"); te.set("len", "med")
    return c

# ───────────────────────── 코드 창 ─────────────────────────
TOKC = {Token.Keyword: "FF7B72", Token.Name.Builtin: "FFA657", Token.Literal.String: "A5D6FF",
        Token.Literal.Number: "79C0FF", Token.Comment: "7D8590", Token.Name.Function: "D2A8FF",
        Token.Operator: "FF7B72", Token.Name.Decorator: "D2A8FF"}
def tokc(t):
    while t is not Token:
        if t in TOKC: return TOKC[t]
        t = t.parent
    return "E6EDF3"

def mono_fit(txt, pt, box_w):
    longest = max((width(l) for l in txt.split("\n")), default=1)
    return max(11, min(pt, box_w * 72 / (0.6 * longest)))

def parse_label(label, lang="python", code=""):
    """「✏️ `myapp/app.py` — 바뀐 부분」 → ("app.py", "바뀐 부분"). 라벨이 없으면 언어로 창 이름을 짐작."""
    if not label:
        first = code.lstrip().split("\n")[0] if code else ""
        if lang == "json" or first.startswith(("{", "[")): return "응답 (JSON)", ""
        if lang in ("bash", "shell", "sh", "console", "powershell", "text", "plaintext") or first.startswith(("$", ">", "PS ", "(", "C:\\")):
            return "터미널", ""
        return T.get("default_file", "app.py"), ""
    m = re.search(r"`([^`]+)`", label)
    fname = m.group(1).split("/")[-1] if m else "app.py"
    rest = label.split("—", 1)[1].strip() if "—" in label else ""
    return fname, strip_md(rest)

def code_box(slide, x, y, w, h, code, size, label=None, lang="python"):
    rect(slide, x, y, w, h, T["code"], line=mix(T["code"], "FFFFFF", 0.1), radius=0.14, name="code-window")
    bar = 0.42
    rect(slide, x, y, w, bar, T["codebar"], radius=0.14)
    rect(slide, x, y + bar - 0.14, w, 0.14, T["codebar"], shape=MSO_SHAPE.RECTANGLE)
    for i, c in enumerate(("FF5F57", "FEBC2E", "28C840")):
        circle(slide, x + 0.22 + i * 0.22, y + 0.15, 0.12, c)
    fname, tag = parse_label(label, lang, code)
    text(slide, x + 1.0, y, 4, bar, fname, 12, "C9D1D9", font=MONO, anchor=MSO_ANCHOR.MIDDLE)
    if tag:
        tw = 0.36 + width(tag) * 11 * 0.56 / 72
        rect(slide, x + w - tw - 0.2, y + 0.08, tw, 0.26, mix(T["codebar"], T["accent"], 0.25), radius=0.13)
        text(slide, x + w - tw - 0.2, y + 0.08, tw, 0.26, tag, 11, T["accent"], align=PP_ALIGN.CENTER, anchor=MSO_ANCHOR.MIDDLE)
    lines = code.split("\n")
    lnw = 0.5
    text(slide, x + 0.15, y + bar + 0.16, lnw - 0.1, h - bar - 0.2, [str(i + 1) for i in range(len(lines))],
         size, "4A5262", font=MONO, align=PP_ALIGN.RIGHT, space=0, line_sp=1.25)
    tb = slide.shapes.add_textbox(Inches(x + lnw + 0.12), Inches(y + bar + 0.16), Inches(w - lnw - 0.32), Inches(h - bar - 0.2))
    tb.name = "code"
    tf = tb.text_frame; tf.word_wrap = True   # 줄바꿈 끔(wrap=none)은 LibreOffice 에서 가운데로 밀린다 — 폭은 mono_fit 이 맞춘다
    from pptx.enum.text import MSO_AUTO_SIZE; tf.auto_size = MSO_AUTO_SIZE.NONE
    tf.margin_left = tf.margin_right = tf.margin_top = tf.margin_bottom = 0
    lexer = PythonLexer() if lang in ("python", "py", "") else TextLexer()
    p = tf.paragraphs[0]; p.line_spacing = 1.25; p.space_after = 0
    for ttype, val in lex(code, lexer):
        for i, part in enumerate(val.split("\n")):
            if i > 0:
                p = tf.add_paragraph(); p.line_spacing = 1.25; p.space_after = 0
            if part:
                r = p.add_run(); r.text = part
                r.font.name = MONO; r.font.size = Pt(size); r.font.color.rgb = rgb(tokc(ttype))
    while len(tf.paragraphs) > 1 and not tf.paragraphs[-1].runs:
        tf.paragraphs[-1]._p.getparent().remove(tf.paragraphs[-1]._p)

# ───────────────────────── 캡처 (브라우저 창) ─────────────────────────
def content_bbox(img, pad=28):
    head = 64 if img.size[1] > 300 else 0          # Streamlit 맨 위 Deploy 줄은 뺀다
    body = img.crop((0, head, img.size[0], img.size[1]))
    bg = Image.new("RGB", body.size, body.getpixel((2, body.size[1] // 2)))
    diff = ImageChops.difference(body, bg).convert("L").point(lambda v: 255 if v > 18 else 0)
    l, t, r, b = diff.getbbox() or (0, 0, *body.size)
    return max(0, l - pad), max(0, t + head - pad), min(img.size[0], r + pad), min(img.size[1], b + head + pad)

def browser_shot(slide, b, x, y, w, h):
    """브라우저 창 안에 캡처 (긴 그림은 focus 쪽을 남기고 자름 — 원본은 파일에 그대로). 반환: 차지한 폭."""
    img = Image.open(b["src"]).convert("RGB"); iw, ih = img.size
    l, tp, r_, bt = content_bbox(img)
    cw_, ch_ = r_ - l, bt - tp
    bar = 0.38; ah = h - bar
    pw = max(min(ah * cw_ / ch_, w), min(5.6, w))
    ph = pw * ch_ / cw_
    if ph > ah:
        vis = ah / pw * cw_
        start = tp + (bt - tp - vis) * b.get("focus", 0.0)
        tp, bt = start, start + vis; ph = ah
    rect(slide, x, y, pw, bar + ph, T["surf2"], line=T["line"], radius=0.12, name="browser")
    for i, c in enumerate(("FF5F57", "FEBC2E", "28C840")):
        circle(slide, x + 0.2 + i * 0.2, y + 0.135, 0.11, c)
    uw = min(3.2, pw - 1.3)
    rect(slide, x + (pw - uw) / 2 + 0.2, y + 0.07, uw, 0.24, T["bg"], radius=0.12)
    text(slide, x + (pw - uw) / 2 + 0.2, y + 0.07, uw, 0.24, b.get("url", T["url"]), 10, T["muted"], align=PP_ALIGN.CENTER, anchor=MSO_ANCHOR.MIDDLE)
    pic = slide.shapes.add_picture(b["src"], Inches(x), Inches(y + bar), Inches(pw), Inches(ph))
    pic.crop_left, pic.crop_right = l / iw, 1 - r_ / iw
    pic.crop_top, pic.crop_bottom = tp / ih, 1 - bt / ih
    pic.name = "screenshot"
    return pw

# ───────────────────────── 블록 ─────────────────────────
def need(b, w, s):
    t = b["type"]
    if t == "p":
        return est_lines(b["text"], 19 * s, w) * 19 * s * 1.42 / 72
    if t in ("pain", "tool"):
        n = est_lines(b["text"], 17 * s, w - 1.5)
        return max(1.15, 0.7 + n * 17 * s * 1.42 / 72 + 0.3)
    if t == "diagram":
        return 0.55 + len(b["text"].strip("\n").split("\n")) * mono_fit(b["text"], 15 * s, w - 0.7) * 1.48 / 72
    if t == "code":
        return 0.42 + 0.5 + len(b["text"].split("\n")) * mono_fit(b["text"], 15 * s, w - 1.0) * 1.52 / 72
    if t == "tryit":
        items = [l for l in b["text"].split("\n") if l.strip()]
        return 1.0 + sum(est_lines(i, 18 * s, w - 1.6) for i in items) * 18 * s * 1.45 / 72 + 0.15 * len(items)
    if t == "ba":
        n = max(est_lines(b["before"]["text"], 17 * s, w / 2 - 1.0), est_lines(b["after"]["text"], 17 * s, w / 2 - 1.0))
        return 1.4 + n * 17 * s * 1.45 / 72
    if t == "table": return table_h(b["rows"], w, s)
    if t in ("shot", "figure"): return 99
    if t == "list":
        return sum(est_lines(i, 19 * s, w - 0.5) for i in b["items"]) * 19 * s * 1.45 / 72 + 0.1
    if t == "group":
        n = max(1, len(b["blocks"])); cw = (w - 0.4 * (n - 1)) / n
        hs = [need(c, cw, s) for c in b["blocks"]]
        return 99 if 99 in hs else max(hs)
    if t == "flow": return 2.0 if len(b["boxes"]) <= 6 else 3.3
    if t == "rerun": return 2.7
    return 0.5

def table_h(rows, w, s):
    """셀 글이 접히는 것까지 센 표 높이."""
    nc = max(len(r) for r in rows); cw = w / nc - 0.3
    return sum(max(0.42 * s, max(est_lines(c, 15 * s, cw) for c in r) * 15 * s * 1.35 / 72 + 0.14) for r in rows)

def render(slide, b, x, y, w, h, s):
    t = b["type"]; acc = T["accent"]
    if t == "p":
        text(slide, x, y, w, h, b["text"], 19 * s)
    elif t in ("pain", "tool"):
        c = T["coral"] if t == "pain" else acc
        rect(slide, x, y, w, h, mix(T["bg"], c, T["tint"] * 0.6), line=mix(T["bg"], c, 0.35), radius=0.16, name=t)
        icon_badge(slide, "pain" if t == "pain" else "tool", x + 0.3, y + 0.28, 0.62, c)
        text(slide, x + 1.15, y + 0.27, w - 1.45, 0.45, b.get("title", ""), 20 * s, c, bold=True, name="card-title")
        text(slide, x + 1.15, y + 0.33 + 0.42 * s, w - 1.45, h - 0.8, b["text"], 17 * s)
    elif t == "diagram":
        rect(slide, x, y, w, h, T["surf"], line=T["line"], radius=0.14, name="diagram")
        txt = "\n".join(l.rstrip() for l in b["text"].split("\n")).strip("\n")
        ind = min((len(l) - len(l.lstrip()) for l in txt.split("\n") if l.strip()), default=0)
        txt = "\n".join(l[ind:] for l in txt.split("\n"))
        text(slide, x + 0.35, y + 0.22, w - 0.6, h - 0.3, txt, mono_fit(txt, 15 * s, w - 0.7), font=MONO, space=0, line_sp=1.3)
    elif t == "code":
        code_box(slide, x, y, w, h, b["text"], mono_fit(b["text"], 15 * s, w - 1.0), b.get("label"), b.get("lang", "python"))
    elif t == "tryit":
        c = T["amber"]
        rect(slide, x, y, w, h, mix(T["bg"], c, T["tint"] * 0.55), line=mix(T["bg"], c, 0.4), radius=0.16, name="tryit")
        icon_badge(slide, "try", x + 0.3, y + 0.25, 0.55, c)
        text(slide, x + 1.0, y + 0.25, w - 1.3, 0.55, "직접 해 보기 — 다 되면 손을 듭니다", 16 * s, c, bold=True, anchor=MSO_ANCHOR.MIDDLE)
        yy = y + 1.0
        for line in [l for l in b["text"].split("\n") if l.strip()]:
            m = re.match(r"^([①②③④⑤])\s*(.*)$", line.strip())
            num, body = (str("①②③④⑤".index(m.group(1)) + 1), m.group(2)) if m else ("•", line.strip())
            lh = est_lines(body, 18 * s, w - 1.6) * 18 * s * 1.45 / 72
            circle(slide, x + 0.4, yy + 0.02, 0.38, mix(T["bg"], c, 0.3))
            text(slide, x + 0.4, yy + 0.02, 0.38, 0.38, num, 13, c, bold=True, align=PP_ALIGN.CENTER, anchor=MSO_ANCHOR.MIDDLE)
            text(slide, x + 1.0, yy, w - 1.3, lh, body, 18 * s)
            yy += lh + 0.15
    elif t == "ba":
        gap = 0.7; cw = (w - gap) / 2
        for i, side in enumerate((b["before"], b["after"])):
            cx = x + i * (cw + gap); c = T["muted"] if i == 0 else acc
            rect(slide, cx, y, cw, h, T["surf"] if i == 0 else mix(T["bg"], acc, T["tint"] * 0.6),
                 line=T["line"] if i == 0 else mix(T["bg"], acc, 0.45), radius=0.16)
            lab = side.get("label", "")
            pill(slide, cx + 0.3, y + 0.28, lab.split("—")[0].strip(), c, 11)
            sub = lab.split("—", 1)[1].strip() if "—" in lab else ""
            text(slide, cx + 0.3, y + 0.78, cw - 0.6, 0.4, sub, 18 * s, c if i else T["text"], bold=True)
            text(slide, cx + 0.3, y + 1.28, cw - 0.6, h - 1.35, side.get("text", ""), 17 * s, space=4)
        d = 0.5
        circle(slide, x + cw + (gap - d) / 2, y + h / 2 - d / 2, d, T["bg"], line=T["line"])
        icon(slide, "arrow", x + cw + (gap - d) / 2 + 0.12, y + h / 2 - d / 2 + 0.12, d - 0.24, acc)
    elif t == "table":
        rows = b["rows"]; nr, nc = len(rows), max(len(r) for r in rows)
        gt = slide.shapes.add_table(nr, nc, Inches(x), Inches(y), Inches(w), Inches(min(h, table_h(rows, w, s))))
        tblpr = gt._element.graphic.graphicData.tbl.tblPr
        sid = tblpr.find(A + "tableStyleId")
        if sid is None: sid = etree.SubElement(tblpr, A + "tableStyleId")
        sid.text = "{2D5ABB26-0587-4C30-8999-92F81FD0307C}"   # 표 스타일 없음 · 눈금 없음
        tbl = gt.table
        for ri, row in enumerate(rows):
            for ci in range(nc):
                c = tbl.cell(ri, ci); c.text = ""
                c.fill.solid(); c.fill.fore_color.rgb = rgb(mix(T["bg"], acc, 0.22) if ri == 0 else (T["surf"] if ri % 2 else T["bg"]))
                c.margin_left = c.margin_right = Inches(0.15); c.margin_top = c.margin_bottom = Inches(0.05)
                c.vertical_anchor = MSO_ANCHOR.MIDDLE
                add_runs(c.text_frame.paragraphs[0], row[ci] if ci < len(row) else "", 15 * s, T["text"], ri == 0)
    elif t == "flow":
        boxes = b["boxes"]; N = len(boxes); gap = 0.45
        per = N if N <= 6 else math.ceil(N / 2)        # 6칸 넘으면 두 줄로 접는다
        bw = (w - gap * (per - 1)) / per
        for i, bx in enumerate(boxes):
            row, col_ = divmod(i, per); n = per if row == 0 else N - per
            xx = x + col_ * (bw + gap); st = bx["state"]; yrow = y + row * 1.3
            y_ = y; y = yrow
            fill = acc if st == "new" else (T["surf2"] if st == "done" else T["bg"])
            rect(slide, xx, y + 0.1, bw, 1.05, fill, line=None if st != "empty" else T["line"], radius=0.18)
            fg = (T["bg"] if st == "new" else T["text"]) if st != "empty" else T["muted"]
            text(slide, xx, y + 0.22, bw, 0.3, f"{i + 1:02d}", 11, fg, bold=True, align=PP_ALIGN.CENTER)
            text(slide, xx, y + 0.5, bw, 0.5, bx["text"], 16, fg, bold=(st == "new"), align=PP_ALIGN.CENTER, anchor=MSO_ANCHOR.MIDDLE)
            if col_ < n - 1:
                arrow(slide, xx + bw + 0.08, y + 0.62, xx + bw + gap - 0.08, y + 0.62, T["muted"], wpt=1.5)
            y = y_
        if b.get("caption"):
            text(slide, x, y + (1.5 if N <= 6 else 2.8), w, 0.5, b["caption"].lstrip("● "), 17, T["muted"])
    elif t == "figure":
        im = Image.open(b["src"]); iw, ih = im.size
        r = min(w / iw, h / ih); pw, ph = iw * r, ih * r
        px, py = x + (w - pw) / 2, y + (h - ph) / 2
        rect(slide, px - 0.06, py - 0.06, pw + 0.12, ph + 0.12, "0E1117", line=T["line"], radius=0.14, name="figure-frame")
        slide.shapes.add_picture(b["src"], Inches(px), Inches(py), Inches(pw), Inches(ph)).name = "figure"
    elif t == "list":
        text(slide, x, y, w, h, ["•  " + i for i in b["items"]], 19 * s, space=8)
    elif t == "group":
        kids = b["blocks"]; n = len(kids); gw = 0.4; cw = (w - gw * (n - 1)) / n
        for i, c in enumerate(kids):
            cx = x + i * (cw + gw); ch = min(h, need(c, cw, s)) if need(c, cw, s) < 99 else h
            if c["type"] == "shot": browser_shot(slide, c, cx, y, cw, h)
            else: render(slide, c, cx, y, cw, ch, s)
    elif t == "rerun":
        labels = ["위에서 아래로 전부 실행", "화면을 그린다", "위젯을 만진다"]
        gap = 1.0; bw = (w - 2 * gap) / 3; bh = 1.0; by = y + 0.75
        for i, lab in enumerate(labels):
            bx = x + i * (bw + gap); c = acc if i != 2 else T["coral"]
            rect(slide, bx, by, bw, bh, mix(T["bg"], c, T["tint"]), line=mix(T["bg"], c, 0.5), radius=0.18)
            text(slide, bx, by, bw, bh, lab, 19, bold=True, align=PP_ALIGN.CENTER, anchor=MSO_ANCHOR.MIDDLE)
            if i < 2: arrow(slide, bx + bw + 0.12, by + bh / 2, bx + bw + gap - 0.12, by + bh / 2, T["muted"])
        x1 = x + bw / 2; x3 = x + 2 * (bw + gap) + bw / 2; top = y + 0.25
        arrow(slide, x3, by, x3, top, acc, head=False); arrow(slide, x3, top, x1, top, acc, head=False)
        arrow(slide, x1, top, x1, by - 0.04, acc)
        text(slide, x, by + bh + 0.35, w, 0.45, "매번 처음부터 다시 — 살아남는 것은 **session_state** 와 **캐시**뿐",
             18, T["muted"], align=PP_ALIGN.CENTER)

def layout_blocks(slide, blocks, look=None):
    merged = []
    for b in blocks:   # 「✏️ 파일 — …」 한 줄은 코드 창의 머리로
        if b["type"] == "code" and merged and merged[-1]["type"] == "p" and re.match(r"^[✏️➕▶🆕]", merged[-1]["text"]):
            b = dict(b, label=merged.pop()["text"])
        merged.append(b)
    blocks = merged
    shot = next((b for b in blocks if b["type"] == "shot"), None)
    if shot and look:                       # 캡처 + 「보는 곳 / 확인」 → 두 칸
        pw = browser_shot(slide, shot, MX, TOP - 0.05, CW * 0.6, BOTTOM - TOP + 0.05)
        rx = MX + pw + 0.7; rw = W - MX - rx; yy = TOP + 0.4
        for lab, body, c in (("보는 곳", look[0], T["blue"]), ("확인", look[1], T["accent"])):
            pill(slide, rx, yy, lab, c, 12)
            text(slide, rx, yy + 0.5, rw, 1.4, body, 21, line_sp=1.25)
            yy += 0.6 + est_lines(body, 21, rw) * 21 * 1.4 / 72 + 0.45
        return
    avail = BOTTOM - TOP; gap = 0.28
    for s in (1.15, 1.08, 1.0, 0.93, 0.86, 0.8, 0.74, 0.69, 0.64):
        hs = [need(b, CW, s) for b in blocks]
        fixed = sum(h for h in hs if h < 99) + gap * (len(blocks) - 1)
        if fixed <= avail and (99 not in hs or avail - fixed >= 2.4):
            break
    if 99 in hs:
        k = hs.count(99)
        hs = [max(2.0, (avail - fixed) / k) if h == 99 else h for h in hs]; y = TOP
    else:
        y = TOP + (avail - fixed) * 0.3
    for b, h in zip(blocks, hs):
        if b["type"] == "shot": browser_shot(slide, b, MX, y, CW, h)
        else: render(slide, b, MX, y, CW, h, s)
        y += h + gap
    if y - gap > BOTTOM + 0.05:
        print(f"  ⚠ 넘침 추정 ({y - gap:.2f}in) — {CUR[0]}")

# ───────────────────────── 장 종류 ─────────────────────────
def header(slide, title, sub):
    m = LEAD_EMOJI.match(title)
    if m:
        title = title[m.end():]
        if m.group(1) in STAGE:
            lab, ck = STAGE[m.group(1)]
            pill(slide, MX, 0.52, lab, T[ck])
    text(slide, MX, 0.95, CW, 0.7, title, 32, bold=True, anchor=MSO_ANCHOR.MIDDLE, name="title")
    if sub: text(slide, MX, 1.68, CW, 0.45, sub, 18, T["muted"], name="subtitle")

def footer(slide, left, n):
    text(slide, MX, 7.03, 8, 0.25, left, 10, T["muted"])
    text(slide, W - MX - 1, 7.03, 1, 0.25, str(n), 10, T["muted"], align=PP_ALIGN.RIGHT)

def big_numeral(slide, s):
    text(slide, 6.3, 1.0, 6.3, 5.0, s, 240, mix(T["bg"], T["accent"], 0.25), bold=True, align=PP_ALIGN.RIGHT, anchor=MSO_ANCHOR.MIDDLE)

def cover(slide, S, sd):
    big_numeral(slide, sd.get("numeral", ""))
    pill(slide, MX, 1.9, S.COURSE, T["accent"], 12)
    text(slide, MX, 2.5, 8.5, 1.2, sd["title"], 46, bold=True, anchor=MSO_ANCHOR.MIDDLE, name="title")
    text(slide, MX, 3.75, 8.5, 0.5, sd["sub"], 20, T["muted"], name="subtitle")
    for i, it in enumerate(sd.get("items", [])):
        y = 4.75 + i * 0.62
        rect(slide, MX, y, 6.8, 0.5, T["surf"], line=T["line"], radius=0.25)
        circle(slide, MX + 0.12, y + 0.1, 0.3, T["accent"])
        text(slide, MX + 0.12, y + 0.1, 0.3, 0.3, str(i + 1), 11, T["bg"], bold=True, align=PP_ALIGN.CENTER, anchor=MSO_ANCHOR.MIDDLE)
        text(slide, MX + 0.6, y, 6.1, 0.5, it, 15, anchor=MSO_ANCHOR.MIDDLE)

def divider(slide, S, sd):
    m = re.match(r"(CHAPTER|SECTION|PART)\s+(\w+)\s*·\s*(.*)$", sd["title"])
    kw, num, ttl = (m.group(1), m.group(2), m.group(3)) if m else ("", "", sd["title"])
    big_numeral(slide, num)
    if kw: pill(slide, MX, 2.45, f"{kw} {num}", T["accent"], 13)
    text(slide, MX, 3.0, 8.5, 1.0, ttl, 40, bold=True, anchor=MSO_ANCHOR.MIDDLE, name="title")
    text(slide, MX, 4.05, 8.5, 0.5, sd["sub"], 20, T["muted"], name="subtitle")

def item_grid(slide, items, kind):
    acc = T["accent"]
    if kind == "objectives":
        cw = (CW - 0.4) / 2; ch = 1.75
        for i, it in enumerate(items):
            x = MX + (i % 2) * (cw + 0.4); y = TOP + 0.05 + (i // 2) * (ch + 0.35)
            rect(slide, x, y, cw, ch, T["surf"], line=T["line"], radius=0.18)
            text(slide, x + 0.35, y + 0.28, 1, 0.5, f"{i + 1:02d}", 22, acc, bold=True)
            text(slide, x + 0.35, y + 0.82, cw - 0.7, ch - 0.95, it, 19)
    else:
        for i, it in enumerate(items):
            y = TOP + 0.05 + i * 1.08
            rect(slide, MX, y, CW, 0.88, T["surf"], line=T["line"], radius=0.18)
            icon(slide, "summary", MX + 0.3, y + 0.24, 0.4, acc)
            text(slide, MX + 1.0, y, CW - 1.3, 0.88, it, 20, anchor=MSO_ANCHOR.MIDDLE)

# ───────────────────────── 노트 · 답 ─────────────────────────
def answer_code(src, key):
    s = (EDU / src).read_text(encoding="utf-8")
    seg = s[s.find("해보세요 답"):]
    m = re.search(r"<h[234][^>]*>[^<]*" + re.escape(key) + r".*?</h[234]>.*?<pre[^>]*><code[^>]*>(.*?)</code></pre>", seg, re.S)
    return H.unescape(re.sub(r"<[^>]+>", "", m.group(1))).strip() if m else None

def apply_edit(b, e):
    b = dict(b)
    for k, v in e.items():
        if k == "drop_first_line": b["text"] = "\n".join(b["text"].split("\n")[1:]).strip()
        else: b[k] = v
    return b

def attach_caps(blocks):
    """원본의 캡처 설명(cap)을 바로 앞 캡처에 붙인다."""
    out = []
    for b in blocks:
        if b["type"] == "cap" and out and out[-1]["type"] == "shot":
            out[-1] = dict(out[-1], cap=b["text"])
        elif b["type"] not in ("kicker", "badge", "subtitle", "cap"):
            out.append(b)
    return out

def build(spec_path, out, theme, only=None):
    spec = importlib.util.spec_from_file_location("spec", spec_path)
    S = importlib.util.module_from_spec(spec); spec.loader.exec_module(S)
    T.clear(); T.update(THEMES[theme])
    T["accent"] = S.ACCENT if theme == "dark" else ACCENT_LIGHT.get(S.ACCENT, S.ACCENT)
    T["url"] = getattr(S, "URL", "localhost:8501")
    T["default_file"] = getattr(S, "DEFAULT_FILE", "app.py")   # 라벨 없는 파이썬 코드 창 이름 (fastapi 는 "")   # 캡처 창 주소줄 (fastapi 는 localhost:8000/docs 등)
    for p_ in S.SOURCES:
        src_html = (EDU / p_).read_text(encoding="utf-8")
        if ("<svg" in src_html or "data-infographic" in src_html) and not (HERE / "cache" / "figures" / Path(p_).stem).exists():
            import subprocess
            subprocess.run(["node", str(HERE / "fig_capture.js"), str(EDU), p_], check=True)
    decks = [extract(EDU / p) for p in S.SOURCES]
    prs = Presentation(); prs.slide_width = Inches(W); prs.slide_height = Inches(Hh)
    blank = prs.slide_layouts[6]
    chapter = ""
    for n, sd in enumerate(S.SLIDES, 1):
        kind = sd.get("kind", "")
        if kind == "divider": chapter = sd["title"].split("  ")[0]
        if only and n not in only: continue
        CUR[0] = f"{n}장 {sd.get('title', '')}"
        slide = prs.slides.add_slide(blank)
        slide.background.fill.solid(); slide.background.fill.fore_color.rgb = rgb(T["bg"])
        if kind == "cover": cover(slide, S, sd)
        elif kind == "divider": divider(slide, S, sd)
        else:
            header(slide, sd["title"], sd.get("sub", ""))
            if kind in ("objectives", "summary"):
                item_grid(slide, sd["items"], kind)
            else:
                src = attach_caps(decks[sd["src"][0]]["slides"][sd["src"][1]]["blocks"])
                idx = sd.get("keep", range(len(src)))
                blocks = [apply_edit(src[i], sd.get("edit", {}).get(i, {})) for i in idx] + sd.get("add", [])
                layout_blocks(slide, blocks, sd.get("look"))
            footer(slide, f"{S.DAY_LABEL}  ·  {chapter}", n)
        notes = "\n".join("- " + x for x in sd.get("notes", []))
        if sd.get("answer"):
            code = answer_code(*sd["answer"])
            if code: notes += "\n\n[답]\n" + code
        slide.notes_slide.notes_text_frame.text = notes
    prs.save(out)
    print("ok", out, len(prs.slides._sldIdLst), "장", theme)

if __name__ == "__main__":
    ap = argparse.ArgumentParser()
    ap.add_argument("spec"); ap.add_argument("out")
    ap.add_argument("--theme", default="dark", choices=list(THEMES))
    ap.add_argument("--only", default="")
    a = ap.parse_args()
    build(a.spec, a.out, a.theme, {int(x) for x in a.only.split(",") if x} or None)
