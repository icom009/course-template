# 이미지 스타일 카드 — <코스명>

> **템플릿입니다.** `<...>` 자리를 이 코스의 실제 값으로 채우세요.
> 값은 추측하지 말고 `slides/css/custom.css` 의 `:root` 에서 읽어 옵니다.
> 작업 절차 전체는 `/슬라이드이미지` skill — `/home/programs/edu/.claude/skills/슬라이드이미지/SKILL.md`

## 만들기 전에 먼저 찾는다 🔑

| 그리려는 것 | 조달 |
|---|---|
| 실존 인물 · 역사 사진 · 로고 · 실제 제품 | 🔍 **검색해서 받는다** (자유 라이선스만) |
| 실행 화면 · 콘솔 · 결과 | 📸 **직접 캡처** — AI 생성 금지 |
| 비유 장면 · 추상 개념 · 분위기 삽화 | 🎨 **AI 생성** (아래 스타일 블록 사용) |
| 구조 · 관계 · 계층 · 흐름 · 수치 | ✏️ **SVG** — 이미지가 아니다 |

```bash
S=/home/programs/edu/.claude/skills/슬라이드이미지/scripts
python3 $S/fetch-commons.py search "<검색어>" --limit 5
python3 $S/fetch-commons.py get "File:..." --out <코스루트>/images/<이름>.jpg --width 1200
```

## 고정 스타일 블록 (AI 생성 시 모든 프롬프트 끝에 그대로 붙인다)

```
<flat vector illustration | soft editorial illustration | cinematic photo> ,
clean shapes, minimal detail,
limited palette: <ACCENT_HEX> accent with <보조색 계열>,
<BG_HEX> background, soft rim light,
no gradients, no text, no letters, no numbers, no logos,
centered composition with generous negative space, 16:9
```

**매번 새로 쓰지 말고 이 블록을 복사해 쓸 것.** 이게 코스 화풍을 붙잡아 두는 유일한 장치다.

## 이 코스의 결정

| 항목 | 값 | 근거 |
|---|---|---|
| 배경 | `<BG_HEX>` | `slides/css/custom.css` 의 다크 베이스와 동일해야 화면에 얹힌다 |
| accent | `<ACCENT_HEX>` | 비유 사전에서 도출한 1차 색 |
| 화풍 | `<플랫 벡터 / 반실사 / 사진>` | 코스 성격에 맞게 택1 후 고정 |
| 인물 | 자유 라이선스 실사진 우선, 없을 때만 실루엣 | AI 로 실존 인물 얼굴을 만들지 않는다 |
| 비율 | 16:9 (가로) · 4:3 (본문) · 1:1 (아이콘) | |
| 권장 가로 | 1600px | 720px 캔버스에 얹히므로 그 이상은 낭비 |

## 이미 SVG 로 그려 둔 것 — 이미지로 중복 제작하지 말 것

<`js/infographics.js` 에 만들어 둔 도식·부품을 여기에 적어 둔다. 나중에 같은 장면을 AI 로 또 만드는 낭비를 막는다.>

| 이미 있는 것 | 어디 |
|---|---|
| | |

## 금지 (전 코스 공통)

- 이미지 안에 **글자 금지** — 특히 한글. 라벨은 HTML·SVG 로 얹는다
- **실존 인물 얼굴 AI 생성 금지** — 실사진을 받는다
- 가짜 UI · 가짜 코드 · 가짜 그래프 금지 — 화면은 실제 캡처, 수치는 SVG
- 흰 배경 금지 (다크 슬라이드에서 튄다) — 배경 hex 명시 또는 투명 PNG
- 새 CSS 클래스 발명 금지 — 인라인 `style` 또는 기존 클래스만
