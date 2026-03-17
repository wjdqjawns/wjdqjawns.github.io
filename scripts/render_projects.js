function createProjectCard(project) {
  const article = document.createElement("article");
  article.className = "entry-card";

  const pageHref = project.page;
  const codeHref = project.assets?.code || null;
  const paperHref = project.assets?.paper || null;
  const posterHref = project.assets?.poster || null;
  const slideHref = project.assets?.slide || null;
  const demoHref = project.demo?.url || null;
  const keywordText = (project.keywords || []).join(", ");

  const metaParts = [
    project.year,
    project.category,
    project.region
  ]

  article.innerHTML = `
    <div class="entry-main">
      <div class="entry-headline">
        <h3>
          <a class="text-link strong" href="${pageHref}">${project.title}</a>
        </h3>
        ${metaParts.length ? `<p class="meta">${metaParts.join(" · ")}</p>` : ""}
      </div>

      <p>${project.summary || ""}</p>

      <p class="keyword-line">
        <strong>Keywords:</strong> ${keywordText || "—"}
      </p>

      <div class="link-row">
        ${createLinkChip("Code", codeHref)}
        ${createLinkChip("Paper", paperHref)}
        ${createLinkChip("Poster", posterHref)}
        ${createLinkChip("Slides", slideHref)}
        ${createLinkChip("Demo", demoHref)}
        ${createCitationButton()}
      </div>
    </div>
  `;

  const citationBtn = article.querySelector(".citation-open");
  if (citationBtn) {
    citationBtn.addEventListener("click", () => {
      openCitationModal(project.title, project.citation || "");
    });
  }

  return article;
}

function getProjectCategoryFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get("category");
}

function renderProjectCards(container, items) {
  if (!container) return;

  container.innerHTML = "";
  items.forEach(project => {
    container.appendChild(createProjectCard(project));
  });
}

function renderProjectPage() {
  if (typeof projects === "undefined") {
    console.error("projects is not defined");
    return;
  }

  const container = document.getElementById("projects-container");
  if (!container) return;

  const category = getProjectCategoryFromUrl();
  let filteredProjects = projects;

  const titleEl = document.getElementById("projects-title");
  const descEl = document.getElementById("projects-description");

  if (category === "personal") {
    filteredProjects = projects.filter(project => project.category === "personal");
    if (titleEl) titleEl.textContent = "Personal Projects";
    if (descEl) descEl.textContent = "Personal projects with dedicated detail pages.";
  } else if (category === "team") {
    filteredProjects = projects.filter(project => project.category === "team");
    if (titleEl) titleEl.textContent = "Team Projects";
    if (descEl) descEl.textContent = "Team projects with dedicated detail pages.";
  } else {
    if (titleEl) titleEl.textContent = "Projects";
    if (descEl) descEl.textContent = "Personal and team projects with dedicated detail pages.";
  }

  renderProjectCards(container, filteredProjects);
}

function renderSelectedProjects() {
  if (typeof projects === "undefined") return;

  const selectedContainer = document.getElementById("selected-projects");
  if (!selectedContainer) return;

  const selectedProjects = projects.filter(project => project.selected);
  renderProjectCards(selectedContainer, selectedProjects);
}

document.addEventListener("DOMContentLoaded", () => {
  renderProjectPage();
  renderSelectedProjects();
});