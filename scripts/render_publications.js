function createPublicationCard(pub, isHome = false) {
  const article = document.createElement('article');
  article.className = 'entry-card';

  const detailHref = isHome ? pub.homeDetail : pub.detail;
  const paperHref = isHome ? pub.homePaper : pub.paper;
  const posterHref = isHome ? pub.homePoster : pub.poster;

  article.innerHTML = `
    <div class="entry-main">
      <div class="entry-headline">
        <h3><a class="text-link strong" href="${detailHref}">${pub.title}</a></h3>
        <p class="meta">${pub.authors}</p>
        <p class="meta">${pub.venue} · ${pub.year}</p>
      </div>
      <p>${pub.summary}</p>
      <div class="link-row">
        <a class="chip" href="${detailHref}">Details</a>
        <a class="chip" href="${paperHref}">Paper</a>
        <a class="chip" href="${pub.code}">Code</a>
        <a class="chip" href="${posterHref}">Poster</a>
        <a class="chip" href="${pub.demo}">Demo</a>
      </div>
    </div>
  `;

  return article;
}

function renderPublicationLists() {
  if (typeof publications === 'undefined') return;

  const map = {
    'international-conference': document.getElementById('pub-intl-conf'),
    'international-journal': document.getElementById('pub-intl-journal'),
    'domestic-conference': document.getElementById('pub-domestic-conf'),
    'domestic-journal': document.getElementById('pub-domestic-journal'),
  };

  publications.forEach(pub => {
    const key = `${pub.scope}-${pub.type}`;
    const target = map[key];
    if (target) target.appendChild(createPublicationCard(pub));
  });

  const selected = document.getElementById('selected-publications');
  if (selected) {
    publications.slice(0, 3).forEach(pub => selected.appendChild(createPublicationCard(pub, true)));
  }
}

document.addEventListener('DOMContentLoaded', renderPublicationLists);
