function createProjectCard(project)
{
  const article = document.createElement("article");
  article.className = "entry-card";

  const pageHref = project.page || "#";
  const codeHref = project.assets?.code || null;
  const paperHref = project.assets?.paper || null;
  const posterHref = project.assets?.poster || null;
  const slideHref = project.assets?.slide || null;
  const demoHref = project.demo?.url || null;
  const keywordText = (project.keywords || []).join(", ");

  const metaParts = [
    project.year,
    project.category,
  ].filter(Boolean);

  article.innerHTML = `
    <div class="entry-main">
      <div class="entry-headline">
        <h3>
          <a class="text-link strong" href="${pageHref}">${project.title || ""}</a>
        </h3>
        ${metaParts.length ? `<p class="meta">${metaParts.join(" · ")}</p>` : ""}
      </div>

      <p>${project.summary || ""}</p>

      <p class="keyword-line">
        <strong>Keywords:</strong> ${keywordText || "—"}
      </p>

      <div class="link-row">
        ${createLinkChip("Paper", paperHref)}
        ${createLinkChip("Poster", posterHref)}
        ${createLinkChip("Slides", slideHref)}
        ${createLinkChip("Code", codeHref)}
        ${createLinkChip("Demo", demoHref)}
        ${createCitationButton()}
      </div>
    </div>
  `;

  const citationBtn = article.querySelector(".citation-open");
  if (citationBtn)
  {
    citationBtn.addEventListener("click", () => {
      openCitationModal(project.title, project.citation || "");
    });
  }

  return article;
}

function getProjectCategoryFromUrl()
{
  const params = new URLSearchParams(window.location.search);
  return params.get("category");
}

function createProjectScopeBlock(scopeTitle, items)
{
  if (!items || items.length === 0) return null;

  const wrapper = document.createElement("section");
  wrapper.className = "prj-scope-block";

  const heading = document.createElement("h2");
  heading.className = "prj-scope-heading";
  heading.textContent = scopeTitle;
  wrapper.appendChild(heading);

  const list = document.createElement("div");
  list.className = "stack-list";

  items.forEach(project => {
    list.appendChild(createProjectCard(project));
  });

  wrapper.appendChild(list);
  return wrapper;
}

function renderProjectPage()
{
  if (typeof projects === "undefined")
  {
    console.error("projects is not defined");
    return;
  }

  const container = document.getElementById("projects-container");
  if (!container) return;

  const category = getProjectCategoryFromUrl();
  const titleEl = document.getElementById("projects-title");
  const descEl = document.getElementById("projects-description");
  
  container.innerHTML = "";

  if (category === "personal")
  {
    const filtered = projects.filter(prj => prj.category === "personal");
    
    if (titleEl) titleEl.textContent = "Personal Projects";
    if (descEl) descEl.textContent = "Personal projects with dedicated detail pages.";
    filtered.forEach(prj => container.appendChild(createProjectCard(prj)));
    return;
  }
  else if (category === "team")
  {
    const filtered = projects.filter(project => project.category === "team");
    
    if (titleEl) titleEl.textContent = "Team Projects";
    if (descEl) descEl.textContent = "Team projects with dedicated detail pages.";
    filtered.forEach(prj => container.appendChild(createProjectCard(prj)));
    return;
  }
  
  if (titleEl) titleEl.textContent = "Projects";
  if (descEl) descEl.textContent = "Personal and team projects with dedicated detail pages.";

  const personalPrjs = projects.filter(prj => prj.category === "personal");
  const teamPrjs = projects.filter(prj => prj.category === "team");

  const personalBlock = createProjectScopeBlock("Personal", personalPrjs);
  const teamBlock = createProjectScopeBlock("Team", teamPrjs);

  if (personalBlock) container.appendChild(personalBlock);
  if (teamBlock) container.appendChild(teamBlock);
}

function renderSelectedProjects()
{
  if (typeof projects === "undefined")
  {
    return;
  }

  const selectedContainer = document.getElementById("selected-projects");
  if (!selectedContainer)
  {
    return;
  }

  selectedContainer.innerHTML = "";

  const selectedProjects = projects.filter(prj => prj.selected);
  selectedProjects.forEach(prj => {selectedContainer.appendChild(createProjectCard(prj));});
}

document.addEventListener("DOMContentLoaded", () => {
  renderProjectPage();
  renderSelectedProjects();
});