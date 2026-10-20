# Projects / Publications 데이터 형식 설계안

- **작성일**: 2026-10-20
- **목적**: 이전 형식과 작성 중이던 새 형식이 섞인 `data/projects.js`, `data/publications.js`를 하나의 형식으로 정리하기 전에, **ID 기반 매칭**을 전제로 어떤 형식이 좋은지 비교하고 하나를 추천함
- **전제**: 이 보고서 작성 시점에는 코드를 수정하지 않음

---

## 0. 결론 먼저

| 결정 항목 | 추천 | 한 줄 이유 |
|---|---|---|
| 매칭 방식 | **ID = 상세 HTML 파일명 = 에셋 폴더명** (규칙 기반) | 새 항목을 만들 때 고칠 문자열이 **id 한 곳**뿐이 됨 |
| 저장 형식 | **JS 파일 유지 + `DB` 네임스페이스 + `// @ts-check` 타입 검사** | 지금 구조를 거의 그대로 쓰면서 `FALSE`, `docuements` 같은 실수를 **에디터가 빨간 줄로 잡아줌** |
| 필드 구조 | 작성 중이던 새 형식을 **기반으로 하되 5군데 수정** | 새 형식의 방향(people 배열, figure 객체, related)은 옳음. 다만 `documents`/`link` 분리, `fig` 인덱스 참조, 중복 필드는 고치는 게 좋음 |
| 에셋 경로 | **상대 경로**(`"fig/fig1.png"`)로 쓰고 렌더러가 `/assets/{kind}/{category}/{id}/`를 앞에 붙임 | 템플릿을 복사한 뒤 폴더명을 안 바꿔서 생기는 404(MedGuard 사례)가 구조적으로 사라짐 |
| 검증 | `node tools/check.js` 하나 | ID 중복, 파일 없음, 필수 필드 누락을 커밋 전에 잡음 |

정리하면 **"id 하나만 정하면 페이지 주소, 에셋 폴더, 데이터 매칭이 전부 그 id에서 결정되는 구조"**입니다.

---

## 1. 지금 무엇이 섞여 있나

같은 배열 안에 형식이 세 가지 공존합니다.

| 필드 | 이전 형식 (실제 항목들) | 새 형식 (`format-project` 템플릿) | 렌더러가 읽는 것 |
|---|---|---|---|
| 사람 | `member: "Beomjun Chung"` (문자열) | `member: [{name, me}]` | 문자열 → 배열이면 `[object Object]` 출력 |
| 기간 | `year: "2026"` | `periods: ["2026-01", "2026-12"]` | `year` |
| 썸네일 | `thumbnail` (최상위) | `assets.thumbnail` | 최상위 `thumbnail` |
| 그림 | `assets.fig[]` + `assets.fig_caption[]` (평행 배열) | `assets.figure[{fig, caption}]` | `assets.fig` |
| 문서 | `assets.paper` | `assets.docuements.paper` (오타) | `assets.paper` |
| 외부 링크 | `assets.code` | `assets.link.code` | `assets.code` |
| 데모 | `demo: {type, url}` (최상위) | `assets.link.demo` (문자열) | 최상위 `demo` |
| 숨김 | `view_state: "hidden"` | `visible: true` | **둘 다 안 읽음** |
| 상세 페이지 | `page: "/pages_detail/..."` | 없음 | `page` |
| 연관 항목 | 없음 | `related: {publications: [] ...}` | 안 읽음 |

결과적으로 **어느 형식으로 써도 화면 일부가 깨집니다.** 렌더러를 고치기 전에 형식을 하나로 정해야 하는 이유입니다.

---

## 2. 매칭 방식 비교 — 상세 페이지가 자기 데이터를 어떻게 찾나

| # | 방식 | 예시 | 새 항목 추가 시 사람이 맞춰야 하는 곳 | 장점 | 단점 |
|---|---|---|---|---|---|
| A | **HTML에 ID 직접 기입** (현재 Projects) | `renderProjectDetailById("2026-thermoviz")` | 데이터 id, HTML 안 문자열 2곳, 에셋 폴더 | 가장 단순하고 명시적 | **실제로 7개 페이지 전부 놓침.** 복사 후 고칠 곳이 많음 |
| B | **`page` 경로 일치** (현재 Publications) | `page: "/pages_detail/.../x.html"` ↔ `location.pathname` | 데이터 id, 데이터 page, HTML 파일명, 에셋 폴더 | HTML 수정 불필요 | id와 page가 따로 있어 서로 어긋날 수 있음(현재 4개 항목이 같은 page를 가리킴). 확장자 없는 URL(`/x`)로 접속하면 매칭 실패 |
| C | **파일명 = id** (추천) | `2026-thermoviz.html` → id `"2026-thermoviz"` | 데이터 id, HTML 파일명, 에셋 폴더 **(셋 다 같은 문자열)** | 고칠 곳이 "같은 이름 3번"이라 눈으로 확인하기 쉬움. `page` 필드가 필요 없음. 검증 스크립트로 셋의 일치를 자동 검사 가능 | 파일명이 곧 URL이자 id라서, 이름을 바꾸면 기존 공유 링크가 깨짐(어느 방식이든 같음) |
| D | `<body data-id="...">` | `<body data-id="2026-thermoviz">` | 데이터 id, HTML 속성, 에셋 폴더 | 파일명과 id를 분리할 수 있음 | A와 같은 문제가 남음(복사 후 속성을 안 바꾸면 끝) |
| E | **템플릿 1개 + 쿼리** | `/detail.html?id=2026-thermoviz` | 데이터 id, 에셋 폴더 | HTML 파일 자체가 필요 없음 | 지금처럼 **본문을 HTML로 직접 쓰는 방식이 불가능**해짐. 본문을 데이터나 Markdown으로 옮겨야 함. 검색엔진·링크 미리보기에 불리 |

### 추천: C (파일명 = id)

지금 사이트는 **본문은 HTML에 직접 쓰고, 메타데이터와 그림만 데이터에서 가져오는** 방식입니다. 이 방식을 유지하려면 페이지마다 HTML 파일이 하나씩 있어야 하므로 E는 맞지 않습니다. A, B, D는 모두 "복사한 뒤 고쳐야 할 문자열"이 남습니다. C는 그 문자열을 **파일명 자체**로 만들어 없앱니다.

```js
// 현재 URL에서 id 추출 — /pages_detail/projects/personal/2026-thermoviz(.html)
function getCurrentId()
{
  const file = window.location.pathname.split("/").pop();
  return decodeURIComponent(file).replace(/\.html$/, "");
}
```

`.html`을 떼고 비교하므로, GitHub Pages가 허용하는 확장자 없는 주소(`/.../2026-thermoviz`)로 접속해도 매칭됩니다. B 방식에는 없는 장점입니다.

### id 작명 규칙 (제안)

| 종류 | 규칙 | 예시 |
|---|---|---|
| Project | `YYYY-slug` | `2026-thermoviz`, `2025-assistance` |
| Publication | `YYYY-{d\|i}{c\|j}-venue-slug` | `2026-dj-kitpa-medguard` (domestic journal), `2025-dc-kroc-ert` (domestic conference) |

- 소문자, 숫자, `-`만 사용 (URL·폴더명에 그대로 쓰기 위함)
- Publication id의 `dj`/`dc`는 `category`/`type` 필드와 정보가 겹칩니다. 그대로 두되, 검증 스크립트가 **둘이 일치하는지** 확인하게 하면 오히려 안전장치가 됩니다.

---

## 3. 저장 형식 비교 — 데이터를 어떤 파일에 어떻게 쓰나

| # | 형식 | 오타·잘못된 값 검출 | 주석 | 여러 줄 BibTeX | 로컬 미리보기 | 기존 코드 변경량 | 비고 |
|---|---|---|---|---|---|---|---|
| 1 | **JS 전역 배열** (현재) `const projects = [...]` | ❌ 실행해야 앎(`FALSE`). 오타 필드(`docuements`)는 영원히 모름 | ✅ | ✅ 템플릿 문자열 | ✅ | 없음 | `contact.js`·`courses.js`·`media.js`가 모두 `const courses`를 선언 → 한 페이지에서 같이 불러오면 **스크립트 전체가 멈춤** |
| 2 | **JS + `DB` 네임스페이스 + `@ts-check`** (추천) `DB.projects = [...]` | ✅ **에디터에서 즉시 빨간 줄**: 미정의 변수, 오타 필드, 잘못된 enum 값(`"Personal"`), 필수 필드 누락 | ✅ | ✅ | ✅ | 작음 (변수명 + 타입 파일 1개) | VS Code에 기본 내장된 TypeScript 검사기를 사용. **npm 설치 불필요** |
| 3 | **JSON + `fetch`** | ✅ 문법 오류는 로드 시 확실히 터짐. JSON Schema를 연결하면 에디터 자동완성 | ❌ 주석 불가 | ❌ `\n` 이스케이프 필요 → BibTeX 쓰기가 괴로움 | ⚠️ 로컬 서버 필요 (지금도 `/` 절대경로 때문에 필요하긴 함) | 중간 (렌더러를 비동기로 변경) | 데이터와 코드가 완전히 분리됨 |
| 4 | **항목별 파일** `data/projects/2026-thermoviz.js` | 1 또는 2와 같음 | ✅ | ✅ | ✅ | 중간 | 항목 추가 시 파일 하나만 추가하면 되지만, 목록 페이지가 파일 목록을 알 방법이 없어 **인덱스 파일이나 `<script>` 태그를 따로 관리**해야 함 → 고칠 곳이 다시 늘어남 |
| 5 | **Jekyll 컬렉션** `_projects/2026-thermoviz.md` (front matter + 본문) | ⚠️ 빌드 시 일부 | ✅ | ✅ | ⚠️ Ruby + Jekyll 설치 필요 | **큼 (렌더러 전면 재작성)** | GitHub Pages가 기본 지원. 파일 하나에 메타데이터와 본문이 함께 있고 **id = 파일명이 자동**. HTML이 서버에서 완성되므로 검색엔진·링크 미리보기에 가장 유리 |

### 추천: 2 (JS + `DB` + `@ts-check`)

- **지금 구조를 버리지 않습니다.** 파일 위치, `<script>` 로드 방식, BibTeX 템플릿 문자열, 주석 모두 그대로입니다.
- 지난 리뷰의 치명 버그 중 `FALSE`(미정의 변수)와 이번에 발견된 `docuements`(오타 필드)는 **둘 다 저장하기 전에 에디터가 표시**합니다. 사람이 기억해서 피하는 대신 도구가 막아줍니다.
- `DB.projects`, `DB.publications`처럼 이름 공간을 쓰므로 데이터 파일이 늘어나도 변수 이름이 충돌하지 않습니다.

**5(Jekyll)는 장기적으로 가장 좋은 선택지**입니다. 다만 렌더러 5개를 버리고 Liquid 템플릿을 새로 배워야 하므로, "지금 잘 동작하게 만들기"라는 목표와는 맞지 않습니다. 사이트 내용이 안정된 뒤 검색 노출이 중요해지면 그때 옮기는 것을 권합니다. 2번의 필드 구조는 Jekyll front matter로 거의 그대로 옮길 수 있게 설계했습니다.

---

## 4. 필드 설계 — 작성 중이던 새 형식 평가

작성 중이던 형식은 **방향이 맞습니다.** 그대로 가져갈 것과 고칠 것을 나눴습니다.

### 그대로 가져갈 것 ✅

| 새 형식의 결정 | 왜 좋은가 |
|---|---|
| `member: [{name, me}]` 배열 | 본인 이름을 굵게 표시할 수 있음. 저자 순서와 역할(교신저자 등)을 표현할 수 있음 |
| `figure: [{fig, caption}]` 객체 배열 | 이전의 `fig[]` + `fig_caption[]` 평행 배열은 하나만 지우거나 순서를 바꾸면 **캡션이 다른 그림에 붙음**. 객체로 묶으면 그럴 수 없음 |
| `visible: true/false` | `view_state: "visible"/"hidden"` 문자열보다 오타 여지가 적음 |
| `periods` (기간) | 프로젝트는 연도 하나보다 기간이 정확함 |
| `related: {publications: [], ...}` | **id 기반 상호 참조.** 프로젝트 페이지에서 관련 논문으로, 논문에서 관련 프로젝트로 링크를 자동 생성할 수 있음. 매칭 방식 C와 잘 맞음 |

### 고칠 것 ✏️

| # | 새 형식 | 제안 | 이유 |
|---|---|---|---|
| 1 | `assets.docuements` + `assets.link` 로 분리 | **`links` 하나로 통합** `{paper, poster, slides, code, website}` | 방문자에게는 둘 다 "버튼 하나"입니다. 파일이 사이트 안에 있는지 밖에 있는지로 나눌 이유가 없고, 렌더러가 두 곳을 뒤져야 합니다. 안인지 밖인지는 경로가 `http`로 시작하는지로 자동 판별할 수 있습니다 |
| 2 | `link.demo: "https://youtube..."` (문자열) | **`demo: {type, src}` 별도 유지** | 데모는 버튼이 아니라 **페이지에 영상으로 삽입**됩니다. 유튜브인지 직접 올린 mp4인지를 알아야 하므로 `type`이 필요합니다 |
| 3 | `periods: ["2026-01", "2026-12"]` + `status: "completed"` | **`period: {start, end}`**, `end: null`이면 진행 중 | 배열은 0번과 1번이 각각 무엇인지 주석을 봐야 압니다. 그리고 `status`는 `end`에서 계산할 수 있는 정보라 둘이 어긋날 수 있습니다(끝났는데 `ongoing`) |
| 4 | 그림을 `data-fig-indices="0,1"` 번호로 참조 | **`key`로 참조** `data-figs="arch,setup"` (번호도 계속 지원) | 그림 하나를 앞에 추가하면 **모든 섹션의 그림이 한 칸씩 밀립니다.** 이름으로 부르면 순서와 무관합니다 |
| 5 | 에셋 경로를 절대 경로로 매번 작성 | **에셋 폴더 기준 상대 경로** `"fig/fig1.png"` | 템플릿 복사 후 폴더명을 안 바꿔서 생긴 MedGuard 404가 이 패턴입니다. 상대 경로면 폴더명을 쓸 일이 없습니다. `/`나 `http`로 시작하면 그대로 사용하므로 공용 이미지도 쓸 수 있습니다 |

추가로:

- `member`(Project)와 `authors`(Publication)는 같은 모양 `[{name, me}]`으로 통일합니다. 카드와 상세 렌더러를 공용으로 쓸 수 있게 됩니다.
- `page` 필드는 **삭제**합니다. 주소는 `/pages_detail/{kind}/{category}/{id}.html`로 계산합니다. 상세 페이지가 없는 항목만 `detail: false`로 표시합니다.
- ⚠️ `visible: false`는 **목록에서 숨길 뿐 비공개가 아닙니다.** 데이터 파일은 누구나 열어볼 수 있으므로, 정말 공개하면 안 되는 내용은 저장소에 넣지 않아야 합니다.

---

## 5. 추천 형식 — 전체 예시

### 5.1 타입 정의 (`data/types.d.ts`, 새 파일)

에디터 검사용 파일입니다. 브라우저는 이 파일을 읽지 않습니다.

```ts
type Person   = { name: string; me?: boolean; corresponding?: boolean };
type Figure   = { key?: string; src: string; caption?: string };
type Links    = { paper?: string; poster?: string; slides?: string; code?: string; website?: string };
type Demo     = { type: "youtube" | "video"; src: string };
type Related  = { projects?: string[]; publications?: string[] };

// Project와 Publication이 공유하는 필드
type BaseItem = {
  id: string;                 // = 상세 HTML 파일명 = 에셋 폴더명
  title: string;
  summary: string;
  keywords: string[];

  selected?: boolean;         // 홈 화면 노출 (기본 false)
  visible?: boolean;          // 목록 노출 (기본 true) — 비공개 아님
  detail?: boolean;           // 상세 페이지 존재 여부 (기본 true)

  thumbnail?: string;         // 에셋 폴더 기준 상대 경로
  figures?: Figure[];
  links?: Links;
  demo?: Demo;
  citation?: string;          // BibTeX
  related?: Related;
};

type Project = BaseItem & {
  category: "personal" | "team";
  members: Person[];
  organization?: string;
  role?: string;
  period: { start: string; end: string | null };   // "YYYY-MM", end null = 진행 중
};

type Publication = BaseItem & {
  category: "domestic" | "international";
  type: "conference" | "journal";
  status: "published" | "accepted" | "in-review";
  authors: Person[];
  venue: { short: string; full?: string; volume?: string; number?: string; pages?: string };
  date: string;               // "YYYY-MM"
};

declare const DB: { projects: Project[]; publications: Publication[] };
```

### 5.2 `data/projects.js`

```js
// @ts-check
/// <reference path="./types.d.ts" />
window.DB = window.DB || {};

/** @type {Project[]} */
DB.projects = [
  {
    id: "2026-thermoviz",
    category: "personal",

    title: "ThermoViz",
    members: [{ name: "Beomjun Chung", me: true }],
    organization: "",
    period: { start: "2026-01", end: null },

    selected: true,

    keywords: ["Thermal Analysis", "Visualization"],
    summary: "한 줄 요약",

    thumbnail: "fig/fig1.png",
    figures: [
      { key: "arch",   src: "fig/fig1.png", caption: "Figure 01. System architecture." },
      { key: "ui",     src: "fig/fig2.png", caption: "Figure 02. Visualization UI." },
      { key: "result", src: "fig/fig3.png", caption: "Figure 03. Experimental result." },
    ],

    links: {
      paper: "documents/paper.pdf",
      code:  "https://github.com/wjdqjawns/thermoviz",
    },
    demo: { type: "youtube", src: "https://www.youtube.com/watch?v=xxxx" },

    related: { publications: [] },
  },
];
```

빈 칸은 **쓰지 않는 것**이 규칙입니다. `poster: ""`처럼 비워두지 않고 줄 자체를 지우면 버튼도 자동으로 사라집니다.

### 5.3 `data/publications.js`

```js
// @ts-check
/// <reference path="./types.d.ts" />
window.DB = window.DB || {};

/** @type {Publication[]} */
DB.publications = [
  {
    id: "2026-dj-kitpa-medguard",
    category: "domestic",
    type: "journal",
    status: "published",

    title: "An End-to-End Integrated Medication Management and Drug-Drug Interaction Analysis System Based on On-Device AI and Computer Vision",
    authors: [
      { name: "Hyebin Kim" },
      { name: "Huidam Woo" },
      { name: "Beomjun Chung", me: true },
    ],
    venue: { short: "KITPA", full: "KITPA Journal", volume: "3", number: "2", pages: "304-309" },
    date: "2026-02",

    selected: true,

    keywords: ["Polypharmacy", "Medication Management", "OCR", "DDI", "On-device AI"],
    summary: "...",

    links: {
      paper:  "documents/2026_kitpa_paper.pdf",
      slides: "documents/2026_kitpa_slide.pdf",
      website: "https://www.dbpia.co.kr/journal/articleDetail?nodeId=NODE12936357",
    },

    related: { projects: ["2026-medguard"] },

    citation: `@article{kim2026medguard,
  title     = {An End-to-End Integrated Medication Management and Drug-Drug Interaction Analysis System Based on On-Device AI and Computer Vision},
  author    = {Kim, Hyebin and Woo, Huidam and Chung, Beomjun},
  journal   = {KITPA Journal},
  publisher = {Korea Information Technology Promotion Agency},
  volume    = {3},
  number    = {2},
  pages     = {304--309},
  year      = {2026},
  url       = {https://www.dbpia.co.kr/journal/articleDetail?nodeId=NODE12936357}
}`,
  },
];
```

이 예시 하나에 현재 MedGuard 항목의 문제 3개가 모두 반영돼 있습니다. 에셋 경로는 상대 경로라 폴더명이 틀릴 수 없고, BibTeX는 올바른 형식이며, 저자명이 `Jeong`에서 `Chung`으로 통일됐습니다.

### 5.4 에디터가 잡아주는 실수 (예시)

`@ts-check`를 켜면 VS Code가 아래를 **저장 전에** 빨간 줄로 표시합니다.

```js
selected: FALSE,                       // ❌ Cannot find name 'FALSE'
category: "Personal",                  // ❌ '"Personal"' is not assignable to '"personal" | "team"'
links: { docuements: "..." },          // ❌ Object literal may only specify known properties
period: ["2026-01", "2026-12"],        // ❌ Type 'string[]' is not assignable to '{ start; end }'
// title 누락                          // ❌ Property 'title' is missing
```

---

## 6. 상세 페이지와 렌더러

### 6.1 상세 HTML — id를 적는 곳이 없음

```html
<!-- pages_detail/projects/personal/2026-thermoviz.html -->
<section class="section">
  <h2>System</h2>
  <p>본문은 여기에 직접 작성</p>
  <div class="figure-group" data-figs="arch,ui"></div>
</section>

<section class="section">
  <h2>Experimental Result</h2>
  <div class="figure-group" data-figs="result"></div>
</section>

...
<script src="/data/projects.js"></script>
<script src="/scripts/render_detail.js"></script>
<script>
  document.addEventListener("DOMContentLoaded", () => renderDetailFromCurrentPage("projects"));
</script>
```

맨 아래 스크립트 줄은 **모든 상세 페이지에서 똑같습니다.** 복사한 뒤 고칠 것이 없습니다.

### 6.2 렌더러 핵심 (공용 `render_detail.js`)

```js
function assetUrl(kind, item, path)
{
  if (!path) return null;
  if (/^(https?:)?\/\//.test(path) || path.startsWith("/")) return path;
  return `/assets/${kind}/${item.category}/${item.id}/${path}`;
}

function detailUrl(kind, item)
{
  if (item.detail === false) return null;
  return `/pages_detail/${kind}/${item.category}/${item.id}.html`;
}

function findById(kind, id)
{
  return (DB[kind] || []).find(item => item.id === id) || null;
}

function renderDetailFromCurrentPage(kind)
{
  const item = findById(kind, getCurrentId());
  if (!item)
  {
    console.error(`[${kind}] no item for id:`, getCurrentId());
    return;
  }
  // 메타데이터, 링크, 그림, 데모, related 렌더링 — Projects/Publications 공용
}
```

지난 리뷰에서 지적한 **약 160줄 중복**(그림 슬라이더, 카드 생성)이 이 과정에서 함께 사라집니다. Project와 Publication의 차이는 메타 정보 한 줄(`period`/`organization` 대 `venue`/`date`)뿐이라, 그 부분만 분기하면 됩니다.

---

## 7. 검증 스크립트 (`tools/check.js`)

에디터 검사는 **파일이 실제로 있는지**는 모릅니다. 그것만 Node 스크립트로 보완합니다.

| 검사 | 잡는 문제 (실제 사례) |
|---|---|
| id 중복 | `format-publication-dc` ×4 |
| id 형식 (`^[a-z0-9-]+$`) | 대문자, 공백 |
| `{id}.html`이 존재하는가 | `medugard` vs `medguard` |
| 에셋 폴더와 `links`/`figures` 파일이 존재하는가 | MedGuard PDF 404, `thermoviz/` vs `2026-thermoviz` |
| HTML의 `data-figs` key가 데이터에 있는가 | 그림 key 오타 |
| `related`의 id가 존재하는가 | 삭제된 항목 참조 |
| Publication id의 `dj`/`dc`가 `category`/`type`과 일치하는가 | 분류 실수 |
| 플레이스홀더 문자열 (`sdfsdf`, `Test`, `format-`) | 템플릿 잔재 |

```bash
node tools/check.js
# ✗ publications/2026-dj-kitpa-medugard: page file not found
# ✗ projects/2026-thermoviz: asset folder not found (assets/projects/personal/2026-thermoviz)
# ✓ 12 items, 2 errors
```

브라우저용 JS 파일을 Node의 `vm` 모듈로 실행해 `DB` 객체를 꺼내는 방식이라, 데이터 파일을 Node 전용으로 바꿀 필요가 없습니다.

---

## 8. 새 항목 추가 절차 — 전후 비교

| 단계 | 현재 | 추천 형식 적용 후 |
|---|---|---|
| 1 | 데이터 블록 복사 → `id`, `page`, 에셋 경로 6~8개 수정 | 데이터 블록 복사 → `id` 수정 |
| 2 | 상세 HTML 복사 → **파일 안의 id 문자열 2곳 수정** | 상세 HTML 복사 → 파일명을 id로 |
| 3 | 에셋 폴더 생성 (이름을 경로들과 맞춰야 함) | 에셋 폴더 생성 → 폴더명을 id로 |
| 4 | 직접 열어보며 확인 | `node tools/check.js` |
| **맞춰야 하는 문자열** | **10개 안팎, 4개 파일에 흩어짐** | **id 1개를 3곳에 같은 이름으로** |

---

## 9. 마이그레이션 계획

| 단계 | 작업 | 영향 |
|---|---|---|
| 1 | `data/types.d.ts` 추가, `projects.js`/`publications.js`를 새 형식으로 변환 | 실제 항목 9개 + 템플릿 2개 |
| 2 | 렌더러 통합: `render_detail.js`에 공용 로직, 목록 렌더러는 `DB.*` + `visible` 필터 적용 | `render_*.js` 5개 → 3개 정도 |
| 3 | 상세 HTML 13개의 하단 스크립트 교체, `data-fig-indices` → `data-figs` | HTML 13개 |
| 4 | 이름 맞추기: `2026-dj-kitpa-medugard.html` → `medguard`, `assets/projects/personal/thermoviz` → `2026-thermoviz` | 파일·폴더 이름 변경 |
| 5 | `tools/check.js` 추가 후 실행해 0 error 확인 | 새 파일 |
| 6 | 템플릿 항목(`format-*`)은 데이터에서 빼고 `data/_template.js`(주석)나 이 보고서로 옮김 | 목록과 홈 화면에 "Format Project"가 더 이상 노출되지 않음 |

### 진행 전에 정해야 할 것

1. **데이터에 아직 없는 상세 페이지** (`2024-matlabthermal`, `2026-residualrl`, `2025-assistance`, `2026-medguard` 프로젝트, 그리고 `2024-dc-ksas-gbsat`, `2025-dc-kroc-ert`, `2026-dj-jksas-gbsat` 논문): 일단 제목만 넣은 `visible: false` 항목으로 만들지, 내용을 알려주실지
2. **템플릿 보관 위치**: 데이터 배열 밖의 주석 파일로 둘지, 이 보고서만으로 충분한지
3. **`contact.js`/`courses.js`/`media.js`/`patents.js`/`work_experience.js`**: 이번 범위에서 제외하고 그대로 둘지 (현재 어디서도 불러오지 않아 동작에는 영향 없음)
