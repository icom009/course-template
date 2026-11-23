# 차시 pptx 제작 지시서 (하위 에이전트 공용)

너는 기존 강의 덱(reveal.js HTML)을 외부 공유용 **편집 가능한 pptx** 로 옮기는 작업 하나를 맡았다.
작업 폴더: `/home/programs/edu/making/share-tools/` (이하 ST). 도구는 이미 완성돼 있다 — **build_pptx.py · extract_deck.py · fig_capture.js · qa_grid.sh · lint_pptx.py 는 고치지 마라** (다른 에이전트가 동시에 쓴다). 빌더의 진짜 한계를 만나면 고치지 말고 최종 보고에 적어라.
원본 코스 파일(`streamlit/`, `fastapi/`)도 절대 고치지 마라.

## 먼저 읽을 것 (순서대로, 전부)
1. `/home/programs/edu/.claude/skills/배포판/SKILL.md` — 규칙 8개 · 사양 키 표 · 함정
2. `ST/spec/streamlit_day2.py` — **완성 견본.** 제목·부제목·노트·look·answer·순서 조정의 어투와 밀도를 이 파일에 맞춰라
3. 네가 맡은 원본 덱 — 전문을 Read 하지 말고 아래 명령으로 장별 개요만 본다:
   ```bash
   cd ST && python3 - <<'PY' 2>/dev/null
   from extract_deck import deck
   d = deck('/home/programs/edu/<코스>/slides/<덱>.html')
   for i, s in enumerate(d['slides']):
       src = [b for b in s['blocks'] if b['type'] not in ('kicker','badge','subtitle','cap')]
       print(f"--[{i}] {s['title']}")
       for j, b in enumerate(src):
           t = b['type']; txt = b.get('text') or b.get('title') or str(b.get('items') or b.get('rows') or b.get('src','')).split('/')[-1]
           print(f"   {j}:{t} {str(txt)[:110]!r}")
       if s['notes']: print('   NOTES:', s['notes'][:200])
   PY
   ```
   블록 번호(`j`)는 cap·kicker·badge·subtitle 을 뺀 뒤의 번호다 — `keep`/`edit` 은 이 번호를 쓴다. 블록 전문이 필요하면 그 장만 골라 출력해 봐라.

## 만들 것
- 사양 파일 `ST/spec/<과목>_day<N>.py` (변수: SOURCES · COURSE · ACCENT · DAY_LABEL · URL(선택) · SLIDES)
- `ST/out/<과목>_<N>차시_light.pptx` 와 `_dark.pptx`
  ```bash
  cd ST && python3 build_pptx.py spec/<파일>.py "out/<과목>_<N>차시_light.pptx" --theme light
  python3 build_pptx.py spec/<파일>.py "out/<과목>_<N>차시_dark.pptx" --theme dark
  python3 lint_pptx.py "out/<과목>_<N>차시_light.pptx"        # 위반 0 이어야 한다
  DPI=40 ./qa_grid.sh "out/<과목>_<N>차시_light.pptx" /tmp/claude-0/-home-programs-edu/64d28552-f648-4f38-9da5-1643d27d09fc/scratchpad/qa_<과목><N>
  ```
  qa 폴더의 `grid*.jpg` 를 **전부 한 번** Read 해서 넘침·겹침·잘린 캡처·빈 장을 찾고, 고친 뒤에는 고친 장이 든 격자만 다시 본다.

## 규칙 (견본과 SKILL.md 가 우선, 요약)
- **원본의 모든 장을 원래 순서로 옮긴다.** 새 내용·새 예제를 만들지 않는다. 빼도 되는 것: 원본의 표지 장(kicker 만 있는 장 → `kind="divider"` 로 대체), 화면이 넘칠 때 장 안의 보조 문장(→ 노트로 옮김).
- 차시 덱 구조: `kind="cover"`(numeral="0N", items=그 날의 챕터/섹션 목록) → 챕터/섹션마다 `kind="divider"` → 그 덱의 장들. 학습 목표·정리 장은 `kind="objectives"`/`"summary"` + `items`(명사형 개조식 4개 안팎).
- **제목 = 명사형**(~다 끝 금지, 비유 금지 — 비유는 노트로). 원본 제목 앞 기호(⚠️🛠️💻🔄✋★📊📇📖)는 **그대로 남긴다** — 빌더가 꼬리표로 바꾼다.
- **부제목 = 「~합니다」 합쇼체 한 줄**(한글 40자 안팎). 모든 일반 장에 있어야 한다.
- 카드 제목(`edit` 의 title)·전후 비교(`before/after` text)·목표/정리 items 는 **명사형 개조식**. 본문 문단은 원본 합쇼체 그대로 둬도 된다.
- **노트 = 강사 대본 — 모든 장 필수.** 개조식 `- ` 불릿 2~5줄, `[핵심]`·`[개념]`·`[주의]`·`(클릭)`·⏱ 사용. 원본 `aside.notes` 내용은 빠짐없이 옮겨 개조식으로. 함께 치는 코드 장엔 「어디에: 파일 · 위치」. 구어체 금지(…해요/봅시다/습니다. 로 끝나는 줄 금지 — 따옴표 안 질문은 괜찮다).
- 캡처(shot) 장은 `look=("보는 곳", "확인")` 을 반드시 단다. 긴 캡처는 `edit={n: {"focus": 0~1}}` 로 보여 줄 부분을 고른다.
- 그림(figure)은 자동으로 들어간다 (그림만 있는 장은 그대로 두면 된다).
- 실습(✋/tryit) 장: `edit={n: {"drop_first_line": True}}` 로 첫 안내 줄을 부제목으로 옮기고, 답은 `answer=("<코스>/examples/<덱>.html", "<문제 제목 일부>")` (examples 맨 끝 「해보세요 답」에 있을 때만 — 없으면 `[답]` 은 생략하고 노트에 풀이 요점만).
- 「재실행 사이클 안의 자리」 장(streamlit)은 `edit={0: {"type": "rerun"}}` + keep=[0].
- 순서 조정이 지시된 곳은 지시대로. 그 밖의 순서는 바꾸지 마라.
- 빌드 경고 `⚠ 넘침 추정 — n장` 이 0 이 될 때까지 그 장의 keep 을 줄여라(뺀 문장은 노트로).

## 끝나면 보고 (짧게)
사양 파일 · pptx 두 개 경로 · 장 수 · lint 결과 · 순서 조정한 곳 · 남은 문제(빌더 한계 등).
