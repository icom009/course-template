#!/usr/bin/env python3
"""학습계획서 hwpx 채우기 — 양식: TempShare/260818_Nodejs/학습계획서_Node_승환.hwpx

사용: python3 fill_plan_hwpx.py <양식.hwpx> <내용.py> <출력.hwpx>

내용.py 는 PLAN dict 하나를 정의한다 (키는 아래 fill() 참고).
양식 구조 (2026-10-02 실측):
  표0  = 1쪽 표지 (과목·기간·강사·대상·개요·목표·교재·방법·학습과정 7일)
  표1~3 = 「세부 학습 내용」 2일씩, 표4 = 1일
일차 수가 양식(7일)보다 적으면 학습과정 행과 세부 표를 지운다.
"""
import copy, importlib.util, re, shutil, sys, tempfile, zipfile
from pathlib import Path
from lxml import etree

HP = "http://www.hancom.co.kr/hwpml/2011/paragraph"
NS = {"hp": HP}
T = f"{{{HP}}}t"


def q(el, path):
    return el.findall(path, NS)


def set_lines(tc, lines):
    """셀의 문단을 lines 로 갈아 끼운다. 첫 문단을 틀로 복제 (글꼴·문단 모양 유지)."""
    sub = tc.find("hp:subList", NS)
    paras = q(sub, "hp:p")
    proto = paras[0]
    for p in paras:
        sub.remove(p)
    for line in lines:
        p = copy.deepcopy(proto)
        for lsa in q(p, "hp:linesegarray"):   # 줄 배치 캐시 — 한글이 열 때 다시 계산
            p.remove(lsa)
        runs = q(p, "hp:run")
        for r in runs[1:]:
            p.remove(r)
        run = runs[0]
        for t in q(run, "hp:t")[1:]:
            run.remove(t)
        ts = q(run, "hp:t")
        t = ts[0] if ts else etree.SubElement(run, T)
        for ch in list(t):
            t.remove(ch)
        t.text = line
        sub.append(p)


def cell(tbl, col, row):
    for tc in tbl.iter(f"{{{HP}}}tc"):
        a = tc.find("hp:cellAddr", NS)
        if int(a.get("colAddr")) == col and int(a.get("rowAddr")) == row:
            return tc
    raise KeyError((col, row))


def drop_rows(tbl, rows):
    """표에서 행을 지우고 rowCnt·표 높이를 맞춘다 (rows 는 끝쪽 연속 행)."""
    trs = q(tbl, "hp:tr")
    removed_h = 0
    for i in sorted(rows, reverse=True):
        tr = trs[i]
        removed_h += int(tr.find("hp:tc/hp:cellSz", NS).get("height"))
        tbl.remove(tr)
    tbl.set("rowCnt", str(int(tbl.get("rowCnt")) - len(rows)))
    sz = tbl.find("hp:sz", NS)
    if sz is not None:
        sz.set("height", str(int(sz.get("height")) - removed_h))


ROW_H = 7400   # 세부 표 한 교시 칸 높이 (양식 6564 = 4줄 빠듯 → 렌더러에 따라 4번째 줄이 잘림)


def set_row_heights(tbl, h):
    """머리행을 뺀 모든 행을 h 높이로 (여러 행을 덮는 칸은 h×행수)."""
    old_total = 0
    trs = q(tbl, "hp:tr")
    for tr in trs[1:]:
        old_total += int(tr.find("hp:tc/hp:cellSz", NS).get("height")) if \
            tr.find("hp:tc/hp:cellSpan", NS).get("rowSpan") == "1" else 0
    for tr in trs[1:]:
        for tc in q(tr, "hp:tc"):
            span = int(tc.find("hp:cellSpan", NS).get("rowSpan"))
            tc.find("hp:cellSz", NS).set("height", str(h * span))
    sz = tbl.find("hp:sz", NS)
    if sz is not None:
        head = int(trs[0].find("hp:tc/hp:cellSz", NS).get("height"))
        sz.set("height", str(head + h * (len(trs) - 1)))


def fill(sec, P):
    top = list(sec)
    tbls = q(sec, ".//hp:tbl")
    t0 = tbls[0]
    set_lines(cell(t0, 1, 0), [P["subject"]])
    set_lines(cell(t0, 5, 0), [P["period"], f"({P['hours']}시간)"])
    set_lines(cell(t0, 1, 1), [P["author"]])
    set_lines(cell(t0, 5, 1), [P["target"]])
    set_lines(cell(t0, 1, 2), P["overview"])
    set_lines(cell(t0, 1, 3), P["goals"])
    set_lines(cell(t0, 3, 4), [P["textbook"]])
    set_lines(cell(t0, 3, 5), [P["reference"]])
    set_lines(cell(t0, 3, 6), [P["tools"]])
    set_lines(cell(t0, 1, 7), P["method"])

    days = P["days"]
    n = len(days)
    for i, d in enumerate(days):
        set_lines(cell(t0, 2, 9 + i), [d["summary"]])
        set_lines(cell(t0, 6, 9 + i), [str(len(d["periods"]))])
    if n < 7:
        drop_rows(t0, range(9 + n, 16))
        cell(t0, 0, 8).find("hp:cellSpan", NS).set("rowSpan", str(1 + n))

    # 세부 표: 2일짜리 표를 앞에서부터 쓰고, 홀수면 마지막 1일짜리 표를 쓴다
    two_day = tbls[1:4]
    one_day = tbls[4]
    plan = []
    k = 0
    for tb in two_day:
        if n - k >= 2:
            plan.append((tb, days[k:k + 2], k)); k += 2
    used = {id(tb) for tb, _, _ in plan}
    if n - k == 1:
        plan.append((one_day, days[k:k + 1], k)); used.add(id(one_day)); k += 1
    assert k == n, "양식 표가 모자란다"

    for tb, ds, start in plan:
        set_row_heights(tb, ROW_H)
        for j, d in enumerate(ds):
            base = 1 + j * 4
            set_lines(cell(tb, 0, base), [f"{start + j + 1}일차"])
            for pi, lines in enumerate(d["periods"]):
                set_lines(cell(tb, 2, base + pi), lines)

    # 안 쓰는 세부 표: 표를 담은 문단 + 그 앞 제목 문단(+ 그 앞 쪽 나눔 문단)을 지운다
    for tb in tbls[1:]:
        if id(tb) in used:
            continue
        holder = next(p for p in top if tb in p.iter())
        idx = top.index(holder)
        doomed = [holder, top[idx - 1]]
        if idx >= 2 and top[idx - 2].get("pageBreak") == "1" and \
                not "".join(top[idx - 2].itertext()).strip():
            doomed.append(top[idx - 2])
        for p in doomed:
            if p.getparent() is not None:
                sec.remove(p)
    # 마지막 제목 문단이 쪽 나눔을 갖도록 (앞 쪽 나눔 문단을 지웠을 때)
    titles = [p for p in sec if "".join(p.itertext()).strip() == "세부 학습 내용"]
    for p in titles[1:]:
        prev = p.getprevious()
        if prev is not None and prev.get("pageBreak") != "1":
            p.set("pageBreak", "1")


def width(s):
    """표시 폭 — 한글·전각 2, 나머지 1."""
    import unicodedata
    return sum(2 if unicodedata.east_asian_width(c) in "WF" else 1 for c in s)


# 양식 실측 (LibreOffice+H2Orestart 렌더, 2026-10-02): 세부 칸은 4줄 고정, 한 줄 ≈ 60폭에서 접힌다.
# 접히거나 넘치면 다음 줄과 겹치거나 잘린다 → 만들기 전에 막는다.
CELL_LINES, CELL_WIDTH = 4, 56


def check(P):
    bad = []
    if sum(width(x) for x in P["method"]) > 170:
        bad.append(f"강의방법: 폭 {sum(width(x) for x in P['method'])} > 170 (2줄)")
    for di, d in enumerate(P["days"], 1):
        for pi, lines in enumerate(d["periods"], 1):
            if len(lines) > CELL_LINES:
                bad.append(f"{di}일차 {pi}교시: {len(lines)}줄 (최대 {CELL_LINES})")
            for l in lines:
                if width(l) > CELL_WIDTH:
                    bad.append(f"{di}일차 {pi}교시: 폭 {width(l)} > {CELL_WIDTH} — {l}")
    return bad


def main(tpl, content, out):
    spec = importlib.util.spec_from_file_location("content", content)
    mod = importlib.util.module_from_spec(spec); spec.loader.exec_module(mod)
    P = mod.PLAN
    bad = check(P)
    if bad:
        print("\n".join(bad)); sys.exit(1)
    with tempfile.TemporaryDirectory() as d:
        d = Path(d)
        with zipfile.ZipFile(tpl) as z:
            z.extractall(d)
            order = z.namelist()
        sp = d / "Contents/section0.xml"
        tree = etree.parse(str(sp))
        fill(tree.getroot(), P)
        tree.write(str(sp), xml_declaration=True, encoding="UTF-8", standalone=True)
        # 미리보기 글 (탐색기 미리보기용)
        prv = [P["subject"], P["author"]] + P["overview"] + [d_["summary"] for d_ in P["days"]]
        (d / "Preview/PrvText.txt").write_text("\r\n".join(prv), encoding="utf-8")
        with zipfile.ZipFile(out, "w") as z:
            for name in order:   # mimetype 은 맨 앞 · 무압축
                ct = zipfile.ZIP_STORED if name == "mimetype" else zipfile.ZIP_DEFLATED
                z.write(d / name, name, compress_type=ct)
    print("ok", out)


if __name__ == "__main__":
    main(*sys.argv[1:4])
