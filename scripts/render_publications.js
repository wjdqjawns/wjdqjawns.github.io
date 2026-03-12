// // function createPublicationCard(publication, isHome = false) {
// //   const article = document.createElement('article');
// //   article.className = 'entry-card';

// //   const detailHref = isHome ? publication.homeDetail : publication.detail;
// //   const periodText = publication.period || publication.year || '';
// //   const tags = publication.tags || [];

// //   article.innerHTML = `
// //     <div class="entry-main">
// //       <div class="entry-headline">
// //         <h3><a class="text-link strong" href="${detailHref}">${publication.title}</a></h3>
// //         <p class="meta">${publication.category} · ${periodText}</p>
// //       </div>
// //       <p>${publication.summary}</p>
// //       <div class="tag-row">
// //         ${tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
// //       </div>
// //       <div class="link-row">
// //         <a class="chip" href="${detailHref}">Details</a>
// //         <a class="chip" href="${publication.paper || '#'}">Paper</a>
// //         <a class="chip" href="${publication.poster || '#'}">Poster</a>
// //         <a class="chip" href="${publication.presentation || '#'}">Presentation</a>
// //       </div>
// //     </div>
// //   `;

// //   return article;
// // }

// // function getPublicationCategoryFromUrl() {
// //   const params = new URLSearchParams(window.location.search);
// //   return params.get('category');
// // }

// // function renderPublicationCards(container, items, isHome = false) {
// //   if (!container) return;

// //   container.innerHTML = '';
// //   items.forEach(publication => {
// //     container.appendChild(createPublicationCard(publication, isHome));
// //   });
// // }

// // function renderPublicationPage() {
// //   if (typeof publications === 'undefined') return;

// //   const container = document.getElementById('publications-container');
// //   if (!container) return;

// //   const category = getPublicationCategoryFromUrl();
// //   let filteredPublications = publications;

// //   const titleEl = document.getElementById('publications-title');
// //   const descEl = document.getElementById('publications-description');

// //   if (category === 'international') {
// //     filteredPublications = publications.filter(pub => pub.category === 'international');
// //     if (titleEl) titleEl.textContent = 'International Publications';
// //     if (descEl) descEl.textContent = 'International publications and related materials.';
// //   } else if (category === 'domestic') {
// //     filteredPublications = publications.filter(pub => pub.category === 'domestic');
// //     if (titleEl) titleEl.textContent = 'Domestic Publications';
// //     if (descEl) descEl.textContent = 'Domestic publications and related materials.';
// //   } else {
// //     if (titleEl) titleEl.textContent = 'Publications';
// //     if (descEl) descEl.textContent = 'Domestic and international publications with dedicated detail pages.';
// //   }

// //   renderPublicationCards(container, filteredPublications, false);
// // }

// // function renderSelectedPublications() {
// //   if (typeof publications === 'undefined') return;

// //   const selectedContainer = document.getElementById('selected-publications');
// //   if (!selectedContainer) return;

// //   const selectedPublications = publications.filter(pub => pub.selected);
// //   renderPublicationCards(selectedContainer, selectedPublications, true);
// // }

// // document.addEventListener('DOMContentLoaded', () => {
// //   renderPublicationPage();
// //   renderSelectedPublications();
// // });

// function createPublicationCard(publication, isHome = false) {
//   const article = document.createElement('article');
//   article.className = 'entry-card';

//   const detailHref = isHome ? (publication.homeDetail || publication.detail) : publication.detail;
//   const paperHref = isHome ? (publication.homePaper || publication.paper || '#') : (publication.paper || '#');
//   const posterHref = isHome ? (publication.homePoster || publication.poster || '#') : (publication.poster || '#');
//   const presentationHref = isHome ? (publication.homePresentation || publication.presentation || '#') : (publication.presentation || '#');

//   article.innerHTML = `
//     <div class="entry-main">
//       <div class="entry-headline">
//         <h3><a class="text-link strong" href="${detailHref}">${publication.title}</a></h3>
//         ${publication.authors ? `<p class="meta">${publication.authors}</p>` : ''}
//         ${publication.venue ? `<p class="meta">${publication.venue}</p>` : ''}
//         <p class="meta">${publication.category} · ${publication.type} · ${publication.year || ''}</p>
//       </div>
//       <p>${publication.summary || ''}</p>
//       <div class="link-row">
//         <a class="chip" href="${detailHref}">Details</a>
//         <a class="chip" href="${paperHref}">Paper</a>
//         <a class="chip" href="${posterHref}">Poster</a>
//         <a class="chip" href="${publication.code || '#'}">Code</a>
//         <a class="chip" href="${publication.demo || '#'}">Demo</a>
//       </div>
//     </div>
//   `;

//   return article;
// }

// function getPublicationCategoryFromUrl() {
//   const params = new URLSearchParams(window.location.search);
//   return params.get('category');
// }

// function createPublicationGroup(title, items, isHome = false) {
//   if (!items || items.length === 0) return null;

//   const section = document.createElement('section');
//   section.className = 'section';

//   const heading = document.createElement('h2');
//   heading.textContent = title;
//   section.appendChild(heading);

//   const list = document.createElement('div');
//   list.className = 'stack-list';

//   items.forEach(item => {
//     list.appendChild(createPublicationCard(item, isHome));
//   });

//   section.appendChild(list);
//   return section;
// }

// function createScopeBlock(scopeTitle, items) {
//   if (!items || items.length === 0) return null;

//   const wrapper = document.createElement('section');
//   wrapper.className = 'section';

//   const scopeHeading = document.createElement('h2');
//   scopeHeading.textContent = scopeTitle;
//   wrapper.appendChild(scopeHeading);

//   const conferences = items.filter(pub => pub.type === 'conference');
//   const journals = items.filter(pub => pub.type === 'journal');

//   const conferenceGroup = createPublicationGroup('Conference', conferences);
//   const journalGroup = createPublicationGroup('Journal', journals);

//   if (conferenceGroup) wrapper.appendChild(conferenceGroup);
//   if (journalGroup) wrapper.appendChild(journalGroup);

//   return wrapper;
// }

// function renderPublicationPage() {
//   if (typeof publications === 'undefined') return;

//   const container = document.getElementById('publications-container');
//   if (!container) return;

//   const category = getPublicationCategoryFromUrl();

//   const titleEl = document.getElementById('publications-title');
//   const descEl = document.getElementById('publications-description');

//   container.innerHTML = '';

//   if (category === 'international') {
//     const internationalPubs = publications.filter(pub => pub.category === 'international');

//     if (titleEl) titleEl.textContent = 'International Publications';
//     if (descEl) descEl.textContent = 'International publications grouped by conference and journal.';

//     const block = createScopeBlock('International', internationalPubs);
//     if (block) container.appendChild(block);

//     return;
//   }

//   if (category === 'domestic') {
//     const domesticPubs = publications.filter(pub => pub.category === 'domestic');

//     if (titleEl) titleEl.textContent = 'Domestic Publications';
//     if (descEl) descEl.textContent = 'Domestic publications grouped by conference and journal.';

//     const block = createScopeBlock('Domestic', domesticPubs);
//     if (block) container.appendChild(block);

//     return;
//   }

//   if (titleEl) titleEl.textContent = 'Publications';
//   if (descEl) descEl.textContent = 'Domestic and international publications grouped by conference and journal.';

//   const internationalPubs = publications.filter(pub => pub.category === 'international');
//   const domesticPubs = publications.filter(pub => pub.category === 'domestic');

//   const internationalBlock = createScopeBlock('International', internationalPubs);
//   const domesticBlock = createScopeBlock('Domestic', domesticPubs);

//   if (internationalBlock) container.appendChild(internationalBlock);
//   if (domesticBlock) container.appendChild(domesticBlock);
// }

// function renderSelectedPublications() {
//   if (typeof publications === 'undefined') return;

//   const selectedContainer = document.getElementById('selected-publications');
//   if (!selectedContainer) return;

//   selectedContainer.innerHTML = '';

//   const selectedPublications = publications.filter(pub => pub.selected);
//   selectedPublications.forEach(pub => {
//     selectedContainer.appendChild(createPublicationCard(pub, true));
//   });
// }

// document.addEventListener('DOMContentLoaded', () => {
//   renderPublicationPage();
//   renderSelectedPublications();
// });


function createPublicationCard(publication, isHome = false) {
  const article = document.createElement('article');
  article.className = 'entry-card';

  const detailHref = isHome
    ? (publication.homeDetail || publication.detail || '#')
    : (publication.detail || '#');

  const paperHref = isHome
    ? (publication.homePaper || publication.paper || '#')
    : (publication.paper || '#');

  const posterHref = isHome
    ? (publication.homePoster || publication.poster || '#')
    : (publication.poster || '#');

  const metaLine = [
    publication.category,
    publication.type,
    publication.year
  ].filter(Boolean).join(' · ');

  article.innerHTML = `
    <div class="entry-main">
      <div class="entry-headline">
        <h3>
          <a class="text-link strong" href="${detailHref}">
            ${publication.title || ''}
          </a>
        </h3>
        ${publication.authors ? `<p class="meta">${publication.authors}</p>` : ''}
        ${publication.venue ? `<p class="meta">${publication.venue}</p>` : ''}
        ${metaLine ? `<p class="meta">${metaLine}</p>` : ''}
      </div>

      ${publication.summary ? `<p>${publication.summary}</p>` : ''}

      <div class="link-row">
        <a class="chip" href="${detailHref}">Details</a>
        <a class="chip" href="${paperHref}">Paper</a>
        <a class="chip" href="${posterHref}">Poster</a>
        <a class="chip" href="${publication.code || '#'}">Code</a>
        <a class="chip" href="${publication.demo || '#'}">Demo</a>
      </div>
    </div>
  `;

  return article;
}

function getPublicationCategoryFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get('category');
}

function createTypeGroup(title, items, isHome = false) {
  if (!items || items.length === 0) return null;

  const section = document.createElement('section');
  section.className = 'pub-type-group';

  const heading = document.createElement('h3');
  heading.className = 'pub-type-heading';
  heading.textContent = title;
  section.appendChild(heading);

  const list = document.createElement('div');
  list.className = 'stack-list';

  items.forEach(item => {
    list.appendChild(createPublicationCard(item, isHome));
  });

  section.appendChild(list);
  return section;
}

function renderTypeGroups(container, items, isHome = false) {
  if (!container || !items || items.length === 0) return;

  const conferences = items.filter(pub => pub.type === 'conference');
  const journals = items.filter(pub => pub.type === 'journal');

  const conferenceGroup = createTypeGroup('Conference', conferences, isHome);
  const journalGroup = createTypeGroup('Journal', journals, isHome);

  if (conferenceGroup) container.appendChild(conferenceGroup);
  if (journalGroup) container.appendChild(journalGroup);
}

function createScopeBlock(scopeTitle, items) {
  if (!items || items.length === 0) return null;

  const wrapper = document.createElement('section');
  wrapper.className = 'pub-scope-block';

  const scopeHeading = document.createElement('h2');
  scopeHeading.className = 'pub-scope-heading';
  scopeHeading.textContent = scopeTitle;
  wrapper.appendChild(scopeHeading);

  renderTypeGroups(wrapper, items, false);

  return wrapper;
}

function renderPublicationPage() {
  if (typeof publications === 'undefined') return;

  const container = document.getElementById('publications-container');
  if (!container) return;

  const category = getPublicationCategoryFromUrl();

  const titleEl = document.getElementById('publications-title');
  const descEl = document.getElementById('publications-description');

  container.innerHTML = '';

  if (category === 'international') {
    const internationalPubs = publications.filter(
      pub => pub.category === 'international'
    );

    if (titleEl) titleEl.textContent = 'International Publications';
    if (descEl) {
      descEl.textContent = 'International publications grouped by conference and journal.';
    }

    renderTypeGroups(container, internationalPubs, false);
    return;
  }

  if (category === 'domestic') {
    const domesticPubs = publications.filter(
      pub => pub.category === 'domestic'
    );

    if (titleEl) titleEl.textContent = 'Domestic Publications';
    if (descEl) {
      descEl.textContent = 'Domestic publications grouped by conference and journal.';
    }

    renderTypeGroups(container, domesticPubs, false);
    return;
  }

  if (titleEl) titleEl.textContent = 'Publications';
  if (descEl) {
    descEl.textContent = 'Domestic and international publications grouped by conference and journal.';
  }

  const internationalPubs = publications.filter(
    pub => pub.category === 'international'
  );
  const domesticPubs = publications.filter(
    pub => pub.category === 'domestic'
  );

  const internationalBlock = createScopeBlock('International', internationalPubs);
  const domesticBlock = createScopeBlock('Domestic', domesticPubs);

  if (internationalBlock) container.appendChild(internationalBlock);
  if (domesticBlock) container.appendChild(domesticBlock);
}

function renderSelectedPublications() {
  if (typeof publications === 'undefined') return;

  const selectedContainer = document.getElementById('selected-publications');
  if (!selectedContainer) return;

  selectedContainer.innerHTML = '';

  const selectedPublications = publications.filter(pub => pub.selected);

  selectedPublications.forEach(pub => {
    selectedContainer.appendChild(createPublicationCard(pub, true));
  });
}

document.addEventListener('DOMContentLoaded', () => {
  renderPublicationPage();
  renderSelectedPublications();
});