function getProjectById(projectId) {
  if (typeof projects === "undefined") return null;
  return projects.find(project => project.id === projectId) || null;
}

function renderProjectDetailById(projectId) {
  const project = getProjectById(projectId);

  if (!project) {
    console.error("Project not found:", projectId);
    return;
  }

  document.title = project.title || "Project Detail";

  const eyebrowEl = document.getElementById("project-eyebrow");
  const titleEl = document.getElementById("project-title");
  const memberEl = document.getElementById("project-member");
  const summaryEl = document.getElementById("project-summary");
  const yearEl = document.getElementById("project-year");
  const orgEl = document.getElementById("project-organization");
  const regionEl = document.getElementById("project-region");
  const keywordTextEl = document.getElementById("project-keyword-text");
  const linksEl = document.getElementById("project-links");

  if (eyebrowEl) eyebrowEl.textContent = `PROJECT · ${project.category || ""}`;
  if (titleEl) titleEl.textContent = project.title || "";
  if (memberEl) memberEl.textContent = project.member || "";
  if (summaryEl) summaryEl.textContent = project.summary || "";
  if (yearEl) yearEl.textContent = project.year || "";
  if (orgEl) orgEl.textContent = project.organization || "";
  if (regionEl) regionEl.textContent = project.region || "";
  if (keywordTextEl) keywordTextEl.textContent = (project.keywords || []).join(", ");

  if (linksEl) {
    linksEl.innerHTML = [
      createLinkChip("Code", project.assets?.code),
      createLinkChip("Paper", project.assets?.paper),
      createLinkChip("Poster", project.assets?.poster),
      createLinkChip("Slides", project.assets?.slide),
      createLinkChip("Demo", project.demo?.url || null),
      createCitationButton()
    ].join("");

    const citationBtn = linksEl.querySelector(".citation-open");
    if (citationBtn) {
      citationBtn.addEventListener("click", () => {
        openCitationModal(project.title, project.citation || "");
      });
    }
  }

  setImage("project-thumbnail", project.thumbnail, `${project.title} thumbnail`);
  renderDemo(project.demo, "project-demo", "demo-section");
}

function renderFigureGroups(projectId) {
  const project = getProjectById(projectId);
  if (!project) return;

  const figures = project.assets?.fig || [];
  const captions = project.assets?.fig_caption || [];
  const groups = document.querySelectorAll(".figure-group");

  groups.forEach((group, groupIndex) => {
    const raw = group.dataset.figIndices || "";
    const indices = raw
      .split(",")
      .map(v => Number(v.trim()))
      .filter(v => Number.isInteger(v) && v >= 0 && v < figures.length);

    if (indices.length === 0) {
      group.style.display = "none";
      return;
    }

    // single image
    if (indices.length === 1) {
      const idx = indices[0];
      group.innerHTML = `
        <figure class="figure-block">
          <img src="${figures[idx]}" alt="${project.title} figure ${idx + 1}" class="detail-image" />
          <figcaption class="figure-caption">
            ${captions[idx] || `Figure ${String(idx + 1).padStart(2, "0")}.`}
          </figcaption>
        </figure>
      `;
      return;
    }

    // slider
    group.innerHTML = `
      <div class="figure-slider">
        <button type="button" class="figure-nav prev">‹</button>

        <figure class="figure-block slider-figure">
          <img class="detail-image figure-slider-main" alt="Project figure" />
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
      mainImage.alt = `${project.title} figure ${figIndex + 1}`;
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