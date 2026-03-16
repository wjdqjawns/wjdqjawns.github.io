function normalizePath(path) {
  if (!path) return "";
  return path.replace(/\/+/g, "/").replace(/\/$/, "");
}

function getPublicationById(publicationId) {
  if (typeof publications === "undefined") return null;
  return publications.find(publication => publication.id === publicationId) || null;
}

function getPublicationByCurrentPath() {
  if (typeof publications === "undefined") return null;

  const currentPath = normalizePath(window.location.pathname);

  return publications.find(publication => {
    const pubPath = normalizePath(publication.page);
    return pubPath === currentPath;
  }) || null;
}

function renderPublicationDetail(publication) {
  if (!publication) {
    console.error("Publication not found");
    return;
  }

  document.title = publication.title || "Publication Detail";

  const eyebrowEl = document.getElementById("publication-eyebrow");
  const titleEl = document.getElementById("publication-title");
  const summaryEl = document.getElementById("publication-summary");
  const yearEl = document.getElementById("publication-year");
  const authorEl = document.getElementById("publication-author");
  const venueEl = document.getElementById("publication-venue");
  const typeEl = document.getElementById("publication-type");
  const keywordTextEl = document.getElementById("publication-keyword-text");
  const linksEl = document.getElementById("publication-links");

  if (eyebrowEl) {
    eyebrowEl.textContent = `PUBLICATION · ${publication.category || ""} · ${publication.type || ""}`;
  }

  if (titleEl) titleEl.textContent = publication.title || "";
  if (summaryEl) summaryEl.textContent = publication.summary || "";
  if (yearEl) yearEl.textContent = publication.year || "";
  if (authorEl) authorEl.textContent = publication.authors || "";
  if (venueEl) venueEl.textContent = publication.venue || "";
  if (typeEl) typeEl.textContent = publication.type || "";
  if (keywordTextEl) keywordTextEl.textContent = (publication.keywords || []).join(", ");

  if (linksEl) {
    linksEl.innerHTML = [
      createLinkChip("Paper", publication.assets?.paper),
      createLinkChip("Poster", publication.assets?.poster),
      createLinkChip("Slides", publication.assets?.slide),
      createLinkChip("Code", publication.assets?.code),
      createLinkChip("Demo", publication.demo?.url || null),
      createCitationButton()
    ].join("");

    const citationBtn = linksEl.querySelector(".citation-open");
    if (citationBtn) {
      citationBtn.addEventListener("click", () => {
        openCitationModal(publication.title, publication.citation || "");
      });
    }
  }

  setImage("publication-thumbnail", publication.thumbnail, `${publication.title} thumbnail`);
  renderDemo(publication.demo, "publication-demo", "demo-section");
}

function renderPublicationDetailById(publicationId) {
  const publication = getPublicationById(publicationId);

  if (!publication) {
    console.error("Publication not found:", publicationId);
    return;
  }

  renderPublicationDetail(publication);
}

function renderPublicationDetailFromCurrentPage() {
  const publication = getPublicationByCurrentPath();

  if (!publication) {
    console.error("Publication not found for current path:", window.location.pathname);
    return;
  }

  renderPublicationDetail(publication);
}

function renderPublicationFigureGroupsById(publicationId) {
  const publication = getPublicationById(publicationId);
  if (!publication) return;

  renderPublicationFigureGroups(publication);
}

function renderPublicationFigureGroupsFromCurrentPage() {
  const publication = getPublicationByCurrentPath();
  if (!publication) return;

  renderPublicationFigureGroups(publication);
}

function renderPublicationFigureGroups(publication) {
  const figures = publication.assets?.fig || [];
  const captions = publication.assets?.fig_caption || [];
  const groups = document.querySelectorAll(".figure-group");

  groups.forEach(group => {
    const raw = group.dataset.figIndices || "";
    const indices = raw
      .split(",")
      .map(v => Number(v.trim()))
      .filter(v => Number.isInteger(v) && v >= 0 && v < figures.length);

    if (indices.length === 0) {
      group.style.display = "none";
      return;
    }

    if (indices.length === 1) {
      const idx = indices[0];
      group.innerHTML = `
        <figure class="figure-block">
          <img src="${figures[idx]}" alt="${publication.title} figure ${idx + 1}" class="detail-image" />
          <figcaption class="figure-caption">
            ${captions[idx] || `Figure ${String(idx + 1).padStart(2, "0")}.`}
          </figcaption>
        </figure>
      `;
      return;
    }

    group.innerHTML = `
      <div class="figure-slider">
        <button type="button" class="figure-nav prev">‹</button>

        <figure class="figure-block slider-figure">
          <img class="detail-image figure-slider-main" alt="Publication figure" />
          <figcaption class="figure-caption figure-slider-caption"></figcaption>
        </figure>

        <button type="button" class="figure-nav next">›</button>
      </div>

      <div class="figure-thumbs"></div>
    `;

    const mainImage = group.querySelector(".figure-slider-main");
    const mainCaption = group.querySelector(".figure-slider-caption");
    const prevBtn = group.querySelector(".figure-nav.prev");
    const nextBtn = group.querySelector(".figure-nav.next");
    const thumbWrap = group.querySelector(".figure-thumbs");

    let current = 0;

    function update(index) {
      current = index;
      const figIndex = indices[index];

      mainImage.src = figures[figIndex];
      mainImage.alt = `${publication.title} figure ${figIndex + 1}`;
      mainCaption.textContent =
        captions[figIndex] || `Figure ${String(figIndex + 1).padStart(2, "0")}.`;

      thumbWrap.querySelectorAll(".figure-thumb").forEach((btn, i) => {
        btn.classList.toggle("active", i === index);
      });
    }

    thumbWrap.innerHTML = indices.map((figIndex, i) => `
      <button type="button" class="figure-thumb" data-local-index="${i}">
        <img src="${figures[figIndex]}" alt="Thumbnail ${figIndex + 1}" />
      </button>
    `).join("");

    thumbWrap.querySelectorAll(".figure-thumb").forEach(btn => {
      btn.addEventListener("click", () => {
        update(Number(btn.dataset.localIndex));
      });
    });

    prevBtn.addEventListener("click", () => {
      update((current - 1 + indices.length) % indices.length);
    });

    nextBtn.addEventListener("click", () => {
      update((current + 1) % indices.length);
    });

    update(0);
  });
}