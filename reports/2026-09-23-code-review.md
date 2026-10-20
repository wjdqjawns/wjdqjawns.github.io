# 포트폴리오 사이트 코드 리뷰

- **대상**: `wjdqjawns.github.io` (main 브랜치, 작업 트리 기준)
- **리뷰 일자**: 2026-09-23
- **리뷰 범위**: HTML 22개, JS 9개, CSS 4개 (총 약 5,100줄)
- **전제**: 코드는 수정하지 않고 평가만 수행함

> 주의: 리뷰 시점의 작업 트리에는 커밋되지 않은 변경(`M` 9개, `??` 11개)이 있었습니다.
> 아래 "치명" 항목 일부는 진행 중인 작업일 수 있으나, 현재 상태 그대로 배포하면 실제로 깨집니다.

---

## 1. 총평

**구조 설계는 좋습니다.** 데이터(`data/*.js`) → 렌더러(`scripts/render_*.js`) → 페이지(HTML) 3단 분리가 명확하고, 빌드 시스템 없이 GitHub Pages에 바로 올라가는 구성이라 유지보수 부담이 낮습니다. "세부 프로젝트/논문만 추가하면 된다"는 목표에 맞는 방향입니다.

**다만 그 목표는 절반만 달성됐습니다.**

| 영역 | 새 항목 추가 시 필요한 작업 | 평가 |
|---|---|---|
| Publications | 데이터 1블록 + 상세 HTML 복사 + 에셋 | **달성** — 경로 자동 매칭이라 HTML에 ID를 쓸 필요 없음 |
| Projects | 데이터 1블록 + 상세 HTML 복사 + **HTML 안의 ID 문자열 수정** + 에셋 | **미달성** — 실제로 3개 페이지에서 이 수정을 놓쳤음 |

그리고 **현재 상태로는 Publications 관련 화면이 전부 빈 화면입니다.** (3.1 참고)

**점수 요약**

| 항목 | 평가 |
|---|---|
| 아키텍처 / 관심사 분리 | 좋음 |
| 데이터 무결성 | 나쁨 (문법 오류, ID 중복, 경로 불일치) |
| 확장성 (목표 달성도) | 보통 (Publications 좋음 / Projects 나쁨) |
| 모바일 대응 | 나쁨 (상단바 미대응, 터치 드롭다운 불가) |
| SEO / 공유 메타데이터 | 없음 |
| 코드 중복 | 보통 (페이지 3중복, 렌더러 함수 2중복) |
| 마무리 (플레이스홀더/오타) | 나쁨 |

---

## 2. 잘 된 점

먼저 유지할 가치가 있는 설계들입니다.

1. **경로 기반 자동 매칭** — `render_publications_detail.js`의 `getPublicationByCurrentPath()`는 `window.location.pathname`과 데이터의 `page` 값을 맞춰 자동으로 항목을 찾습니다. 상세 페이지 HTML에 식별자를 손으로 적을 필요가 없어집니다. **이 사이트에서 가장 잘 설계된 부분이며, Projects 쪽에도 그대로 적용해야 합니다.**

2. **`figure-group` + `data-fig-indices` 패턴** — 섹션마다 `<div class="figure-group" data-fig-indices="0,1">` 한 줄만 쓰면, 그림이 1장이면 단일 이미지로, 여러 장이면 썸네일 달린 슬라이더로 자동 전환됩니다. 그림 풀은 데이터에서 한 번만 관리합니다. 깔끔한 설계입니다.

3. **`createLinkChip()`의 방어적 반환** (`render_detail.js:1-4`) — href가 없으면 빈 문자열을 반환하므로, 포스터가 없는 논문은 "Poster" 칩이 자동으로 사라집니다. 데이터에 필드를 빼기만 하면 UI가 따라옵니다.

4. **렌더러 전반의 일관된 방어 코드** — `project.assets?.code`, `|| ""`, `if (!container) return` 패턴이 모든 렌더러에 일관되게 적용되어 있어, 필드가 빠진 데이터가 들어와도 페이지 전체가 죽지 않습니다.

5. **CSS 토큰화** — `--bg`, `--text`, `--line`, `--radius` 등 디자인 토큰을 `base.css:1-13`에 모아둬서 색 변경이 한 곳에서 됩니다.

6. **빌드리스(build-less) 정적 구조** — npm/번들러 의존이 없어 몇 년 뒤에 열어도 그대로 동작합니다. 개인 포폴에는 옳은 선택입니다.

---

## 3. 치명 — 지금 배포하면 깨집니다

### 3.1 `data/publications.js`가 로드 시점에 터집니다 ⚠️ 최우선

`selected` 필드에 JavaScript에 존재하지 않는 대문자 리터럴 `TRUE` / `FALSE`가 쓰였습니다.

- `FALSE` — 라인 **11, 63, 111, 163**
- `TRUE` — 라인 **211**

JS에서 참/거짓은 소문자 `true` / `false`입니다. 대문자는 "선언되지 않은 변수"로 해석되어 `ReferenceError`가 납니다.

**검증 결과:**
```
$ node -e "require('./data/publications.js')"
RUNTIME ERROR: ReferenceError FALSE is not defined
```

**파급 범위 (배열 자체가 만들어지지 않으므로 전부 영향):**

| 화면 | 증상 |
|---|---|
| `pages/publications.html` | 목록 전체 빈 화면 |
| `index.html` Selected Publications | 빈 화면 |
| `pages_detail/publications/**/*.html` 전 8개 | 제목·요약·링크 모두 빈 화면 |

**재발 방지가 더 중요합니다.** 포맷 템플릿 블록(라인 11)의 주석 자체가 `// TRUE / FALSE`라고 적혀 있어서, 템플릿을 복사할 때마다 같은 실수를 유도합니다. 주석을 `// true / false`로 고쳐야 합니다.

> 참고: `node --check`(문법 검사)는 통과합니다. `FALSE`는 문법적으로 유효한 식별자이기 때문입니다. 실제로 실행해봐야 잡힙니다.

---

### 3.2 프로젝트 상세 페이지 5개가 전부 같은 데이터를 보여줍니다

프로젝트 상세 페이지는 표시할 항목의 ID를 HTML 안에 직접 적는 방식입니다. 그런데 **5개 페이지 전부 `"format-project"`로 하드코딩**되어 있습니다.

```
pages_detail/projects/personal/2026-spacedyn.html:108       renderProjectDetailById("format-project");
pages_detail/projects/personal/2026-thermoviz.html:108      renderProjectDetailById("format-project");
pages_detail/projects/personal/project-format.html:108      renderProjectDetailById("format-project");
pages_detail/projects/personal/project-multi-format.html:107 renderProjectDetailById("format-project");
pages_detail/projects/team/2026-medguard.html:108           renderProjectDetailById("format-project");
```

**결과:** ThermoViz 페이지를 열어도 제목은 "Format Project", 그림도 format-project의 그림이 뜹니다. SpaceDyn, MedGuard도 마찬가지입니다. 목록에서 카드를 클릭해 들어간 방문자는 전부 같은 페이지를 보게 됩니다.

**이게 핵심 문제입니다.** "데이터만 추가하면 된다"는 목표가 Projects에서 깨진 지점이 정확히 여기입니다. 새 프로젝트를 추가할 때마다 HTML 안쪽 두 줄의 문자열을 고쳐야 하는데, 5개 중 3개에서 놓쳤습니다. 사람이 기억해야 하는 단계는 결국 빠집니다.

**해법은 이미 코드 안에 있습니다.** Publications 쪽의 `renderPublicationDetailFromCurrentPage()`와 동일한 경로 매칭 함수를 Projects에도 만들면, HTML에 ID를 적는 단계 자체가 사라집니다. 구조 변경 없이 함수 하나 추가 + 각 페이지 2줄 교체로 끝납니다.

---

### 3.3 publications 데이터 앞 4개 항목이 동일한 ID/경로를 가리킵니다

```
ids: format-publication-dc, format-publication-dc, format-publication-dc, format-publication-dc, 2026-dj-kitpa-medugard
DUPLICATE IDS: format-publication-dc
```

주석으로는 `2024-dc-ksas-gbsat`, `2025-dc-kroc-ert`, `2026-dj-jksas-gbsat`로 구분해뒀지만, 실제 `id`·`page`·`title`·내용은 전부 템플릿 그대로 복사된 상태입니다. 4개 항목 모두 `page: "/pages_detail/publications/domestic/domestic-format-c.html"`을 가리킵니다.

**파급:**

- 실제로 존재하는 상세 페이지 `2024-dc-ksas-gbsat.html`, `2025-dc-kroc-ert.html`, `2026-dj-jksas-gbsat.html`은 경로 매칭에 실패 → 콘솔에 `Publication not found for current path:` 출력 후 빈 페이지
- 목록에는 "Format Publication -dc"라는 동일 카드가 4개 나열됨
- `getPublicationById()`는 `find()`를 쓰므로 중복 ID 중 항상 첫 번째만 반환 — 나머지 3개는 영원히 접근 불가

3.1을 고쳐서 파일이 로드되기 시작하면, 이 문제가 바로 화면에 드러납니다.

---

### 3.4 MedGuard 논문의 PDF 링크가 404입니다

데이터가 가리키는 경로와 실제 파일 위치가 다릅니다.

| 항목 | 데이터의 경로 (`publications.js:232-233`) | 실제 파일 |
|---|---|---|
| paper | `/assets/publications/domestic/**format-publication**/documents/2026_kitpa_paper.pdf` | `/assets/publications/domestic/**2026-dj-kitpa-medguard**/documents/2026_kitpa_paper.pdf` |
| slide | `/assets/publications/domestic/**format-publication**/documents/2026_kitpa_slide.pdf` | `/assets/publications/domestic/**2026-dj-kitpa-medguard**/documents/2026_kitpa_slide.pdf` |

폴더명만 `format-publication`으로 남아 있습니다. 템플릿에서 복사한 뒤 파일명은 바꿨지만 폴더명은 놓친 경우입니다.

**결과:** 유일하게 내용이 제대로 채워진 논문의 "Paper"·"Slides" 칩을 누르면 404가 뜹니다. 포폴에서 가장 아픈 종류의 링크 깨짐입니다.

`thumbnail`과 `fig` 3장도 여전히 `format-publication` 폴더의 더미 이미지를 가리킵니다(파일은 존재하므로 404는 아니지만, 내용은 MedGuard와 무관합니다).

---

## 4. 높음

### 4.1 모바일에서 상단바가 깨집니다

`styles/components.css`에 `#topbar` / `.topbar-nav` 관련 **미디어 쿼리가 하나도 없습니다.** 전체 CSS에서 미디어 쿼리는 `pages.css` 3곳뿐이고, 모두 본문 그리드용입니다.

```css
.topbar-inner { width: min(1200px, calc(100% - 80px)); }
.topbar-nav   { display: flex; gap: 28px; }   /* flex-wrap 없음 */
```

375px 화면 기준 사용 가능 폭은 295px인데, 브랜드("Beomjun Chung", 1.35rem bold) + 메뉴 6개 + 간격 140px을 합치면 500px를 넘습니다. `flex-wrap`이 없어 줄바꿈도 되지 않으므로 가로 overflow가 발생합니다.

**그리고 드롭다운이 터치 기기에서 열리지 않습니다:**

```css
.dropdown:hover .dropdown-content { display: block; }   /* hover 전용 */
```

`:hover`만 정의되어 있어서, 모바일에서는 Projects → Personal/Team, Publications → International/Domestic 하위 메뉴에 접근할 수 없습니다. 상위 링크를 눌러 전체 목록으로 가는 우회 경로는 있지만, 카테고리 필터 기능 자체가 모바일에서 사라집니다.

포트폴리오는 링크로 공유되고 휴대폰에서 열리는 비율이 높습니다. **치명 항목을 고친 직후 우선순위**로 두는 것을 권합니다.

### 4.2 Contact 페이지의 메일 주소가 틀렸습니다

`pages/contact.html:30`

```html
<a href="mailto:wjdqjawns@gmail.com">wjdqjawns22@gmail.com</a>
```

표시 텍스트는 `wjdqjawns22@`인데 실제 링크는 `wjdqjawns@` (숫자 `22` 누락)입니다. 주소를 눈으로 읽고 직접 입력한 사람에게는 메일이 오고, 링크를 클릭한 사람의 메일은 엉뚱한 곳으로 갑니다. 연락처 페이지에서 가장 조용하게 손해를 보는 버그입니다.

(`pages/about.html:28`의 mailto는 `wjdqjawns22@gmail.com`으로 올바릅니다.)

### 4.3 SEO / 링크 공유 메타데이터가 전무합니다

전체 HTML 22개를 검사한 결과 **단 하나도** 다음을 갖고 있지 않습니다:

- `<meta name="description">`
- Open Graph (`og:title`, `og:description`, `og:image`) — 카카오톡·슬랙·링크드인 링크 미리보기용
- `<link rel="icon">` (파비콘)
- `<link rel="canonical">`
- `sitemap.xml`, `robots.txt`

게다가 `<title>`이 내부 식별자 형태입니다:

```html
<title>wjdqjawns_portfolio_home</title>
<title>wjdqjawns_portfolio_publications</title>
<title>Publication Detail</title>   <!-- 상세 페이지 -->
```

구글 검색 결과에 `wjdqjawns_portfolio_home`이 그대로 노출되고, 링크를 공유하면 미리보기에 제목·설명·이미지가 전부 비어 보입니다. 포트폴리오 사이트에서 이건 기능 버그와 동급의 손해입니다.

> 상세 페이지의 경우 렌더러가 `document.title`을 실제 제목으로 바꿔주긴 하지만(`render_publications_detail.js:32`), 이건 JS 실행 후이므로 링크 미리보기 크롤러에는 잡히지 않습니다. `<title>` 자체를 채우는 편이 확실합니다.

---

## 5. 중간

### 5.1 about / research / media 페이지 3중 복제

| 파일 | 줄 수 | 상태 |
|---|---|---|
| `pages/about.html` | 268 | 네비게이션에 노출됨 |
| `pages/research.html` | 253 | 네비에서 주석 처리 (`bar.html:9`) |
| `pages/media.html` | 253 | 어디서도 링크되지 않음 |

세 파일 모두 Bio / Research Interests / Skills / Education / Publications / Projects / Work Experience / Coursework 섹션을 동일한 구조로 갖고 있습니다. **그리고 이미 내용이 서로 갈라지기 시작했습니다:**

- Research Interests: about은 "System Identification & State Estimation, Optimal Control", research/media는 "Satellite Systems, Robotics & Control, System Engineering"
- Skills(Embedded): about은 "Teensy / STM32 / Raspberry Pi / Jetson Nano", research/media는 "STM32 / Raspberry Pi / Jetson Nano / FreeRTOS"
- Projects 목록: about에만 MEDGUARD 항목이 있음

이력을 한 번 갱신할 때마다 3곳을 고쳐야 하고, 실제로 이미 놓치고 있습니다. 쓰지 않는 두 파일은 삭제하거나, 세 페이지가 정말 다 필요하다면 공통 섹션을 `data/profile.js` 같은 데이터로 빼는 편이 맞습니다.

### 5.2 렌더러 함수 중복

거의 동일한 코드가 두 벌씩 존재합니다.

| Projects | Publications | 중복 규모 |
|---|---|---|
| `render_projects_detail.js` `renderFigureGroups()` | `render_publications_detail.js` `renderPublicationFigureGroups()` | 약 90줄, 슬라이더 로직 전체 |
| `render_projects.js` `createProjectCard()` | `render_publications.js` `createPublicationCard()` | 약 50줄, `metaParts` 구성만 다름 |
| `createProjectScopeBlock()` | `createPublicationScopeBlock()` | 약 20줄 |

실질적 차이는 `metaParts`에 `category`를 쓰느냐 `venue`를 쓰느냐 정도입니다. 슬라이더 동작을 고칠 일이 생기면 두 곳을 동일하게 고쳐야 하고, 한쪽만 고치면 조용히 어긋납니다.

### 5.3 `resolvePath()`의 깊이 하드코딩이 우연히 동작 중입니다

`scripts/include.js:24-27`

```js
if (current.includes("/pages_detail/projects/personal/")) return `../../../../${path}`;
```

`pages_detail/projects/personal/`은 루트에서 **3단계** 깊이인데, 코드는 **4단계**(`../../../../`)를 올라갑니다. 같은 파일의 HTML은 CSS를 `../../../styles/`(3단계)로 올바르게 참조하고 있어 의도가 어긋난 게 확실합니다.

지금 동작하는 이유는 RFC 3986의 경로 정규화가 루트를 넘어가는 `..`를 버리기 때문입니다:

```
https://x.io/pages_detail/publications/domestic/ + ../../../../components/bar.html
  → https://x.io/components/bar.html   (4번째 .. 는 무시됨)
```

**루트 도메인에서만 성립합니다.** 프로젝트 페이지(`user.github.io/repo/`)로 옮기거나 폴더를 한 단계 감싸면 조용히 깨집니다. 또한 `resolvePath()`와 `DOMContentLoaded` 핸들러(`include.js:90-100`)에 동일한 경로 분기가 두 벌 존재합니다.

### 5.4 죽은 코드 / 미사용 필드

| 대상 | 위치 | 상태 |
|---|---|---|
| `data-base` 속성 | 모든 HTML의 `#topbar`, `#footer` | JS에서 **한 번도 읽지 않음** |
| `view_state: "visible" / "hidden"` | `publications.js` 전 항목 | 어떤 렌더러도 참조하지 않음 — 숨김 기능이 동작하지 않음 |
| `main.js`의 `.sidebar-nav` 처리 | `scripts/main.js:4` | `sidebar-nav` 클래스가 HTML/CSS 어디에도 없음 |
| `setTimeout(..., 50)` | `scripts/main.js:3` | 위 코드가 죽었으므로 무의미. 살아있더라도 타이밍 의존은 피해야 함 |

`view_state`는 특히 주의가 필요합니다. "hidden으로 해두면 안 보이겠지"라고 생각하고 미공개 논문을 넣으면 **그대로 공개됩니다.**

### 5.5 경로 방식 혼용

| 절대 경로 (`/styles/...`) | 상대 경로 (`../styles/...`) |
|---|---|
| `index.html`, `pages/about.html`, `pages/contact.html` | `pages/projects.html`, `pages/publications.html`, `pages/research.html`, `pages/media.html` |

`components/bar.html`은 한술 더 떠 세 방식이 섞여 있습니다:

```html
<a data-link="index.html" href="#">Home</a>              <!-- data-link 상대 -->
<a data-link="/pages/contact.html" href="#">Contact</a>  <!-- data-link + 앞 슬래시 -->
<a href="/pages/projects.html" class="dropbtn">Projects</a>  <!-- 순수 절대 -->
```

특히 `data-link="/pages/contact.html"`은 `resolvePath()`가 `../` 를 앞에 붙이면서 `..//pages/contact.html` → `https://wjdqjawns.github.io//pages/contact.html`(슬래시 2개)로 해석됩니다. GitHub Pages는 이를 처리해주지만, 정상 경로는 아닙니다.

### 5.6 저장소 정리 필요

| 항목 | 문제 |
|---|---|
| `data/publications copy.js` (370줄) | 백업 파일이 저장소에 방치. 파일명에 공백까지 포함 |
| `.gitignore` | **0바이트 빈 파일** — 새로 만들었지만 내용이 없음 |
| `pages_detail/publications/domestic/2026-dj-kitpa-**medugard**.html` | 에셋 폴더는 `2026-dj-kitpa-**medguard**` — 파일명 오타 (`medugard`). 현재는 데이터도 같은 오타라 동작하지만 혼란 유발 |

### 5.7 플레이스홀더 데이터가 화면에 노출됩니다

`data/projects.js`의 실제 프로젝트 항목(`2026-thermoviz`, `2026-spacedyn`)에 템플릿 값이 그대로 남아 있습니다:

```js
organization: "Test",
region: "sdfsdf",
keywords: ["STM32", "FreeRTOS", "USB CDC", "CAN"],   // 4개 항목 모두 동일
summary: "Structured relay architecture for USB, UART, and CAN with ...",  // 4개 항목 모두 동일
```

`organization`과 `region`은 상세 페이지에 실제로 출력됩니다(`render_projects_detail.js:34-35`). 3.2를 고쳐서 각 페이지가 자기 데이터를 보여주기 시작하면, 방문자에게 `sdfsdf`가 그대로 보입니다.

상세 페이지 본문 산문도 템플릿 상태입니다:

> "Use this section as the project overview. The body remains manually written in HTML, while metadata and assets are loaded from the centralized project database."
> "Defined communication structure and task separation / Implemented packet parsing and routing / ..."

이 문장들이 MedGuard 논문 상세 페이지(`2026-dj-kitpa-medugard.html:56-58, 79-82`)에도 들어 있습니다. MedGuard는 의료 복약 관리 시스템인데 본문에는 USB CDC 통신 얘기가 적혀 있습니다.

### 5.8 MedGuard BibTeX 형식이 깨져 있습니다

`publications.js:236-242`

```
@article__a1___2026 address=,
    title=An End-to-End Integrated Medication Management ...,
    volume=3, url=..., DOI= number=2,
    author=Kim, Hyebin, Woo, Huidam and Jeong, Beomjun
```

- 엔트리 키가 `__a1___2026` (DBpia 내보내기 아티팩트)
- 전체를 감싸는 중괄호 `{}` 없음, 각 필드 값에도 `{}` 없음
- 필드 구분 쉼표가 불규칙, `DOI=` 는 값이 비어 있음
- **저자명 불일치**: `authors` 필드는 "Chung, Beomjun"인데 citation은 "**Jeong**, Beomjun"

Citation 버튼은 방문자가 인용하려고 누르는 기능입니다. 그대로 복사하면 BibTeX 컴파일이 실패합니다. 다른 항목들은 형식이 올바른 `@misc{...}`라서 이 하나만 튑니다.

---

## 6. 낮음

| # | 내용 | 위치 |
|---|---|---|
| 1 | `<Menu:context></Menu:context>` — 존재하지 않는 태그가 `<h1>` 안에 삽입됨. IDE 자동완성 사고로 보임 | `about.html:23`, `research.html:23`, `media.html:23` |
| 2 | 오타 `Publicaions` → `Publications` | `research.html:70`, `media.html:70` |
| 3 | 오타 `TheromoViz` → `ThermoViz` | `projects.js:106` |
| 4 | LinkedIn 링크가 `href="#"` 플레이스홀더 | `contact.html:50` |
| 5 | About 페이지의 Publications 목록이 수동 `<li>` 하드코딩 + 전부 `href="#"`. `publications.js`와 이중 관리 → 논문 추가 시 또 놓칠 지점 | `about.html:82-88` |
| 6 | `404.html` 없음 — 오타 URL 접근 시 GitHub 기본 404 페이지 노출 | 루트 |
| 7 | 이미지에 명시적 `width`/`height`가 없어 로딩 중 레이아웃 흔들림(CLS) 발생 | 렌더러 전반 |
| 8 | `.page-shell { width: min(1100px, calc(100% - 80px)) }` — 좌우 여백이 화면 크기와 무관하게 항상 80px. 375px 폰에서 본문 폭이 295px로 좁아짐 | `layout.css:10` |
| 9 | 모든 `<html lang="en">`이지만 본문에 한국어가 섞여 있음(about/research/media의 프로젝트 설명). 스크린리더 발음에 영향 | `about.html` 외 |
| 10 | `index.html`이 스크립트 7개를 개별 로드. 캐시되므로 실사용 영향은 작음 | `index.html:66-72` |

---

## 7. 권장 조치 순서

우선순위 순입니다. 1~4번까지가 "사이트가 실제로 동작하게 만드는" 작업입니다.

### 1단계 — 동작 복구 (필수)

1. **`publications.js`의 `TRUE`/`FALSE` → `true`/`false`** (5곳) — 이것 하나로 Publications 관련 화면 전체가 살아납니다. **포맷 템플릿 블록의 주석 `// TRUE / FALSE`도 `// true / false`로 수정**해야 재발하지 않습니다.
2. **`publications.js` 앞 4개 항목**의 `id` / `page` / `title` / `authors` / 에셋 경로를 실제 값으로 채우거나, 아직 준비가 안 됐으면 제거합니다. ID는 반드시 고유해야 합니다.
3. **MedGuard 에셋 경로 수정** — `format-publication` → `2026-dj-kitpa-medguard` (paper, slide, thumbnail, fig 3장).
4. **프로젝트 상세 페이지를 경로 매칭 방식으로 전환** — `render_projects_detail.js`에 `getProjectByCurrentPath()` / `renderProjectDetailFromCurrentPage()`를 추가하고, 5개 HTML의 `renderProjectDetailById("format-project")` 2줄을 교체합니다. Publications 쪽 구현을 그대로 옮기면 됩니다. **이 작업이 끝나야 "데이터만 추가하면 되는" 목표가 완성됩니다.**

### 2단계 — 방문자 경험

5. **상단바 모바일 대응** — `.topbar-nav`에 `flex-wrap` 또는 햄버거 메뉴, 그리고 `:hover` 드롭다운을 터치에서도 열리게(클릭 토글 또는 `:focus-within`) 수정.
6. **Contact 메일 주소 수정** — `mailto:wjdqjawns@` → `mailto:wjdqjawns22@`.
7. **메타데이터 추가** — 각 페이지에 의미 있는 `<title>`, `<meta name="description">`, Open Graph 태그, 파비콘. `404.html`도 함께.

### 3단계 — 유지보수성

8. **`view_state` 구현 또는 제거** — 현재는 "숨김"이 동작하지 않으므로, 미공개 논문을 넣으면 그대로 공개됩니다. 필터를 구현하거나 필드를 지우세요.
9. **저장소 정리** — `data/publications copy.js` 삭제, `.gitignore` 채우기, `medugard` → `medguard` 파일명 수정(데이터의 `page` 값도 함께).
10. **플레이스홀더 제거** — `Test`, `sdfsdf`, `<Menu:context>`, 중복 summary/keywords, 상세 페이지의 템플릿 산문, `Publicaions`·`TheromoViz` 오타.
11. **`about` / `research` / `media` 정리** — 안 쓰는 두 페이지를 지우거나, 공통 섹션을 데이터로 분리.
12. **렌더러 공통화** — 그림 슬라이더 90줄과 카드 생성 50줄을 공용 함수로 통합.
13. **`data-base` / `.sidebar-nav` / `setTimeout` 죽은 코드 제거**, `resolvePath()`의 4단계 → 3단계 수정.

---

## 8. 재발 방지 제안

지금 나온 문제들은 대부분 **템플릿을 복사한 뒤 일부만 고치고 나머지를 놓친 것**입니다. 사람의 기억에 의존하는 단계를 줄이는 게 근본 해결입니다.

1. **HTML에서 식별자를 없애기** (1단계 4번) — 상세 페이지에 ID를 적을 필요가 없어지면, 복사 후 고칠 곳 자체가 사라집니다. 가장 효과가 큰 조치입니다.

2. **데이터 검증 스크립트 하나** — 리포에 `node tools/check.js` 수준의 20줄짜리 스크립트를 두고 커밋 전에 돌리면 아래를 전부 잡습니다:
   - `publications.js` / `projects.js`가 실제로 로드되는가 (3.1 검출)
   - `id`가 고유한가 (3.3 검출)
   - `page`가 가리키는 HTML이 존재하는가 (3.3 검출)
   - `assets` / `thumbnail` 경로의 파일이 존재하는가 (3.4 검출)
   - `sdfsdf`, `Test`, `format-project` 같은 플레이스홀더 문자열이 남아 있지 않은가 (5.7 검출)

   이번 리뷰에서 발견한 치명 4건 중 3건이 이 스크립트로 자동 검출됩니다.

3. **템플릿 파일의 주석을 실제 값 형식으로** — `// TRUE / FALSE` 같은 주석은 잘못된 값을 유도합니다. 주석은 `// true / false`, `// "conference" | "journal"`처럼 복사해서 바로 쓸 수 있는 형태로 적어두세요.

---

## 부록 A. 검증 방법

이 리뷰에서 사용한 확인 명령입니다.

```bash
# 데이터 파일이 실제로 로드되는지 (문법 검사만으로는 3.1이 안 잡힘)
node -e "require('./data/publications.js'); console.log('OK')"
node -e "require('./data/projects.js'); console.log('OK')"

# 에셋 경로 존재 확인 → 3.4 검출
node -e "
const fs=require('fs');
for(const f of ['data/projects.js','data/publications.js']){
  const src=fs.readFileSync(f,'utf8');
  for(const p of new Set([...src.matchAll(/\"(\/assets\/[^\"]+)\"/g)].map(m=>m[1])))
    if(!fs.existsSync('.'+p)) console.log('MISSING '+f+': '+p);
}"

# ID 중복 / page 경로 확인 → 3.3 검출
node -e "
const fs=require('fs'), src=fs.readFileSync('data/publications.js','utf8');
const ids=[...src.matchAll(/id:\s*\"([^\"]+)\"/g)].map(m=>m[1]);
console.log('dup:', [...new Set(ids.filter((v,i)=>ids.indexOf(v)!==i))]);
for(const m of src.matchAll(/page:\s*\"([^\"]+)\"/g))
  if(!fs.existsSync('.'+m[1])) console.log('MISSING PAGE '+m[1]);"

# 상세 페이지가 어떤 ID를 요청하는지 → 3.2 검출
grep -n 'renderProjectDetailById' pages_detail/projects/*/*.html
```

## 부록 B. 파일별 규모

| 영역 | 파일 수 | 줄 수 |
|---|---|---|
| HTML (페이지) | 6 | 923 |
| HTML (상세) | 13 | 1,548 |
| HTML (컴포넌트 + index) | 3 | 109 |
| JS (렌더러) | 5 | 870 |
| JS (인프라) | 2 | 118 |
| JS (데이터) | 3 | 810 (백업 370 포함) |
| CSS | 4 | 749 |
| **합계** | **36** | **약 5,100** |

가장 큰 파일은 `styles/pages.css`(455줄)와 `data/publications copy.js`(370줄, 삭제 대상)입니다. 개인 포폴 규모로는 적절하며, 5.1·5.2의 중복을 정리하면 500줄 이상 줄어듭니다.
