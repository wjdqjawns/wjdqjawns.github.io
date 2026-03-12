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

function renderProjectLists() {
  if (typeof projects === 'undefined') return;

  const personal = document.getElementById('project-list-personal');
  const team = document.getElementById('project-list-team');
  const selected = document.getElementById('selected-projects');

  if (personal) {
    projects.filter(p => p.category === 'personal').forEach(p => personal.appendChild(createProjectCard(p)));
  }

  if (team) {
    projects.filter(p => p.category === 'team').forEach(p => team.appendChild(createProjectCard(p)));
  }

  if (selected) {
    projects.slice(0, 3).forEach(p => selected.appendChild(createProjectCard(p, true)));
  }
}

document.addEventListener('DOMContentLoaded', renderProjectLists);
