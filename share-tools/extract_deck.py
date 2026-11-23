#!/usr/bin/env python3
"""reveal 덱 HTML → 슬라이드 블록 JSON (pptx 변환의 1단계).

사용: python3 extract_deck.py <slides/xxx.html> [...] > deck.json

블록 종류: subtitle · p · pain · tool · diagram · code · shot · tryit · ba · objectives · flow · summary · list · table
글자는 <strong>/<code> 를 **굵게** / `코드` 표시로 남긴다 (빌더가 run 으로 나눈다).
"""
import json, re, sys
from pathlib import Path
from lxml import html as LH

def inline(el):
    """요소 안 글을 **굵게**·`코드` 표시를 살려 한 줄 문자열로."""
    out = []
    def walk(e):
        tag = e.tag if isinstance(e.tag, str) else ""
        if tag == "br":
            out.append("\n")
        elif tag in ("strong", "b"):
            out.append("**" + e.text_content() + "**")
        elif tag == "code":
            out.append("`" + e.text_content() + "`")
        elif tag == "aside":
            pass
        else:
            if e.text: out.append(e.text)
            for c in e:
                walk(c)
                if c.tail: out.append(c.tail)
            return
        if e.tail is not None and e is not el:
            pass
    if el.text: out.append(el.text)
    for c in el:
        walk(c)
        if c.tail: out.append(c.tail)
    s = "".join(out)
    s = re.sub(r"[ \t]*\n[ \t]*", "\n", s)
    s = re.sub(r"[ \t]+", " ", s)
    s = re.sub(r"\n{2,}", "\n", s)   # 원본 다단 배치의 빈 줄은 화면에서 공백만 만든다
    return s.strip()

def is_figure(el):
    tag = el.tag if isinstance(el.tag, str) else ""
    if tag.split("}")[-1] == "svg" or el.get("data-infographic") is not None: return True
    return any((isinstance(d.tag, str) and (d.tag.split("}")[-1] == "svg" or d.get("data-infographic") is not None)) for d in el.iterdescendants())

def cls(el):
    return (el.get("class") or "").split()

def block(el, base):
    c = cls(el); tag = el.tag
    if tag == "aside": return None
    if "pain-point" in c:
        t = el.find_class("pain-title")
        body = [inline(p) for p in el if p.tag in ("p", "ul", "div") and "pain-title" not in cls(p)]
        return {"type": "pain", "title": inline(t[0]) if t else "", "text": "\n".join(b for b in body if b)}
    if "new-tool" in c:
        t = el.find_class("tool-title")
        body = [inline(p) for p in el if p.tag in ("p", "ul", "div") and "tool-title" not in cls(p)]
        return {"type": "tool", "title": inline(t[0]) if t else "", "text": "\n".join(b for b in body if b)}
    if "diagram" in c:
        return {"type": "diagram", "text": el.text_content().strip("\n")}
    if tag == "pre":
        code = el.find(".//code")
        lang = next((x[9:] for x in cls(code) if x.startswith("language-")), "") if code is not None else ""
        txt = (code if code is not None else el).text_content()
        return {"type": "code", "lang": lang, "text": txt.strip("\n")}
    if tag == "img":
        return {"type": "shot", "src": str((base / el.get("src")).resolve()), "alt": el.get("alt", "")}
    if "shot-cap" in c or "caption" in c:
        return {"type": "cap", "text": inline(el)}
    if "try-it" in c:
        return {"type": "tryit", "together": "together" in c, "text": "\n".join(inline(p) for p in el if p.tag in ("p", "div", "ul", "ol"))}
    if "before-after" in c:
        def side(k):
            s = el.find_class(k)
            if not s: return {}
            s = s[0]; lab = s.find_class("label")
            return {"label": inline(lab[0]) if lab else k, "text": "\n".join(inline(x) for x in s if "label" not in cls(x))}
        return {"type": "ba", "before": side("before"), "after": side("after")}
    if "objectives" in c:
        return {"type": "objectives", "items": [inline(li) for li in el.iter("li")]}
    if "flow-diagram" in c:
        boxes = [{"text": inline(b), "state": ("new" if "new" in cls(b) else "empty" if "empty" in cls(b) else "done")} for b in el.find_class("box")]
        cap = el.find_class("caption")
        return {"type": "flow", "boxes": boxes, "caption": inline(cap[0]) if cap else ""}
    if "summary" in c:
        return {"type": "summary", "items": [inline(li) for li in el.iter("li")] or [inline(el)]}
    if tag in ("ul", "ol"):
        return {"type": "list", "ordered": tag == "ol", "items": [inline(li) for li in el.findall("li")]}
    if tag == "table":
        rows = [[inline(td) for td in tr if td.tag in ("td", "th")] for tr in el.iter("tr")]
        return {"type": "table", "rows": rows}
    if tag in ("p", "h3", "h4", "div", "blockquote"):
        if tag == "div" and len(el) and not el.text_content().strip():
            return None
        if tag == "div":
            kids = [block(k, base) for k in el if isinstance(k.tag, str)]
            kids = [k for k in kids if k]
            if kids and any(k["type"] != "p" for k in kids):
                return {"type": "group", "class": " ".join(c), "blocks": kids}
        t = inline(el)
        return {"type": "p", "text": t, "frag": "fragment" in c} if t else None
    return None

def deck(path):
    path = Path(path); base = path.parent
    doc = LH.fromstring(path.read_text(encoding="utf-8"))
    slides = []
    figdir = Path(__file__).resolve().parent / "cache" / "figures" / path.stem
    leaf = -1
    for sec in doc.iter("section"):
        if sec.find("section") is not None:   # 세로 묶음은 안쪽만
            continue
        leaf += 1; fk = 0
        h = sec.find(".//h1")
        if h is None: h = sec.find(".//h2")
        title = inline(h) if h is not None else ""
        notes = "\n".join(" ".join(n.text_content().split()) for n in sec.iter("aside") if "notes" in cls(n))
        blocks = []
        for el in sec:
            if not isinstance(el.tag, str) or el is h or el.tag in ("h1", "h2", "aside"): continue
            if "session-glyph" in cls(el) or "version-badge" in cls(el):
                blocks.append({"type": "badge", "text": inline(el)}); continue
            if "session-title" in cls(el):
                blocks.append({"type": "kicker", "text": inline(el)}); continue
            if "subtitle" in cls(el):
                blocks.append({"type": "subtitle", "text": inline(el)}); continue
            if is_figure(el):   # 인라인 SVG·인포그래픽 → fig_capture.js 가 떠 온 그림 (같은 규칙)
                blocks.append({"type": "figure", "src": str(figdir / f"{leaf}_{fk}.png")}); fk += 1; continue
            b = block(el, base)
            if b: blocks.append(b)
        slides.append({"title": title, "blocks": blocks, "notes": notes})
    return {"source": str(path), "slides": slides}

if __name__ == "__main__":
    print(json.dumps([deck(p) for p in sys.argv[1:]], ensure_ascii=False, indent=1))
