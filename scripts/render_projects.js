// function createProjectCard(project, isHome = false) {
//   const article = document.createElement('article');
//   article.className = 'entry-card';

//   const detailHref = isHome ? project.homeDetail : project.detail;

//   article.innerHTML = `
//     <div class="entry-main">
//       <div class="entry-headline">
//         <h3><a class="text-link strong" href="${detailHref}">${project.title}</a></h3>
//         <p class="meta">${project.category} · ${project.period}</p>
//       </div>
//       <p>${project.summary}</p>
//       <div class="tag-row">
//         ${project.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
//       </div>
//       <div class="link-row">
//         <a class="chip" href="${detailHref}">Details</a>
//         <a class="chip" href="${project.code}">Code</a>
//         <a class="chip" href="${project.demo}">Demo</a>
//         <a class="chip" href="${project.report}">Report</a>
//       </div>
//     </div>
//   `;

//   return article;
// }

// function renderProjectLists() {
//   if (typeof projects === 'undefined') return;

//   const personal = document.getElementById('project-list-personal');
//   const team = document.getElementById('project-list-team');
//   const selected = document.getElementById('selected-projects');

//   if (personal) {
//     projects.filter(p => p.category === 'personal').forEach(p => personal.appendChild(createProjectCard(p)));
//   }

//   if (team) {
//     projects.filter(p => p.category === 'team').forEach(p => team.appendChild(createProjectCard(p)));
//   }

//   if (selected) {
//     projects.slice(0, 3).forEach(p => selected.appendChild(createProjectCard(p, true)));
//   }
// }

// function getCategoryFromUrl() {
//   const params = new URLSearchParams(window.location.search);
//   return params.get("category");
// }

// function renderProjectPage() {
//   const category = getCategoryFromUrl();

//   let filteredProjects = projects;

//   if (category === "personal" || category === "team") {
//     filteredProjects = projects.filter(project => project.category === category);
//   }

//   renderProjects("projects-container", filteredProjects);
// }

// document.addEventListener('DOMContentLoaded', renderProjectLists);
// renderProjectPage();

function createProjectCard(project, isHome = false) {
  const article = document.createElement('article');
  article.className = 'entry-card';

  const detailHref = isHome ? project.homeDetail : project.detail;

  article.innerHTML = `
    <div class="entry-main">
      <div class="entry-headline">
        <h3><a class="text-link strong" href="${detailHref}">${project.title}</a></h3>
        <p class="meta">${project.category} · ${project.period}</p>
      </div>
      <p>${project.summary}</p>
      <div class="tag-row">
        ${project.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
      </div>
      <div class="link-row">
        <a class="chip" href="${detailHref}">Details</a>
        <a class="chip" href="${project.code}">Code</a>
        <a class="chip" href="${project.demo}">Demo</a>
        <a class="chip" href="${project.report}">Report</a>
      </div>
    </div>
  `;

  return article;
}

function getProjectCategoryFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get('category');
}

function renderProjectCards(container, items, isHome = false) {
  if (!container) return;

  container.innerHTML = '';
  items.forEach(project => {
    container.appendChild(createProjectCard(project, isHome));
  });
}

function renderProjectPage() {
  if (typeof projects === 'undefined') return;

  const container = document.getElementById('projects-container');
  if (!container) return;

  const category = getProjectCategoryFromUrl();
  let filteredProjects = projects;

  const titleEl = document.getElementById('projects-title');
  const descEl = document.getElementById('projects-description');

  if (category === 'personal') {
    filteredProjects = projects.filter(project => project.category === 'personal');
    if (titleEl) titleEl.textContent = 'Personal Projects';
    if (descEl) descEl.textContent = 'Personal projects with dedicated detail pages.';
  } else if (category === 'team') {
    filteredProjects = projects.filter(project => project.category === 'team');
    if (titleEl) titleEl.textContent = 'Team Projects';
    if (descEl) descEl.textContent = 'Team projects with dedicated detail pages.';
  } else {
    if (titleEl) titleEl.textContent = 'Projects';
    if (descEl) descEl.textContent = 'Personal and team projects with dedicated detail pages.';
  }

  renderProjectCards(container, filteredProjects, false);
}

function renderSelectedProjects() {
  if (typeof projects === 'undefined') return;

  const selectedContainer = document.getElementById('selected-projects');
  if (!selectedContainer) return;

  const selectedProjects = projects.filter(project => project.selected);
  renderProjectCards(selectedContainer, selectedProjects, true);
}

document.addEventListener('DOMContentLoaded', () => {
  renderProjectPage();
  renderSelectedProjects();
});