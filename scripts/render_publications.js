function createPublicationCard(publication) {
  const article = document.createElement("article");
  article.className = "entry-card";

  const pageHref = publication.page || "#";
  const codeHref = publication.assets?.code || null;
  const paperHref = publication.assets?.paper || null;
  const posterHref = publication.assets?.poster || null;
  const slideHref = publication.assets?.slide || null;
  const demoHref = publication.demo?.url || null;
  const keywordText = (publication.keywords || []).join(", ");

  const metaParts = [
    publication.year,
    publication.venue
  ].filter(Boolean);

  article.innerHTML = `
    <div class="entry-main">
      <div class="entry-headline">
        <h3>
          <a class="text-link strong" href="${pageHref}">${publication.title || ""}</a>
        </h3>
        ${metaParts.length ? `<p class="meta">${metaParts.join(" · ")}</p>` : ""}
      </div>

      <p>${publication.summary || ""}</p>

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
  if (citationBtn) {
    citationBtn.addEventListener("click", () => {
      openCitationModal(publication.title, publication.citation || "");
    });
  }

  return article;
}

function getPublicationCategoryFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get("category");
}

function createPublicationTypeGroup(title, items) {
  if (!items || items.length === 0) return null;

  const section = document.createElement("section");
  section.className = "pub-type-group";

  const heading = document.createElement("h3");
  heading.className = "pub-type-heading";
  heading.textContent = title;
  section.appendChild(heading);

  const list = document.createElement("div");
  list.className = "stack-list";

  items.forEach(publication => {
    list.appendChild(createPublicationCard(publication));
  });

  section.appendChild(list);
  return section;
}

function renderPublicationTypeGroups(container, items) {
  if (!container) return;

  const conferences = items.filter(item => item.type === "conference");
  const journals = items.filter(item => item.type === "journal");

  const conferenceGroup = createPublicationTypeGroup("Conference", conferences);
  const journalGroup = createPublicationTypeGroup("Journal", journals);

  if (conferenceGroup) container.appendChild(conferenceGroup);
  if (journalGroup) container.appendChild(journalGroup);
}

function createPublicationScopeBlock(scopeTitle, items) {
  if (!items || items.length === 0) return null;

  const wrapper = document.createElement("section");
  wrapper.className = "pub-scope-block";

  const heading = document.createElement("h2");
  heading.className = "pub-scope-heading";
  heading.textContent = scopeTitle;
  wrapper.appendChild(heading);

  renderPublicationTypeGroups(wrapper, items);

  return wrapper;
}

function renderPublicationPage() {
  if (typeof publications === "undefined") {
    console.error("publications is not defined");
    return;
  }

  const container = document.getElementById("publications-container");
  if (!container) return;

  const category = getPublicationCategoryFromUrl();
  const titleEl = document.getElementById("publications-title");
  const descEl = document.getElementById("publications-description");

  container.innerHTML = "";

  if (category === "international") {
    const filtered = publications.filter(pub => pub.category === "international");

    if (titleEl) titleEl.textContent = "International Publications";
    if (descEl) {
      descEl.textContent = "International publications grouped by conference and journal.";
    }

    renderPublicationTypeGroups(container, filtered);
    return;
  }

  if (category === "domestic") {
    const filtered = publications.filter(pub => pub.category === "domestic");

    if (titleEl) titleEl.textContent = "Domestic Publications";
    if (descEl) {
      descEl.textContent = "Domestic publications grouped by conference and journal.";
    }

    renderPublicationTypeGroups(container, filtered);
    return;
  }

  if (titleEl) titleEl.textContent = "Publications";
  if (descEl) {
    descEl.textContent = "Domestic and international publications grouped by conference and journal.";
  }

  const internationalPubs = publications.filter(pub => pub.category === "international");
  const domesticPubs = publications.filter(pub => pub.category === "domestic");

  const internationalBlock = createPublicationScopeBlock("International", internationalPubs);
  const domesticBlock = createPublicationScopeBlock("Domestic", domesticPubs);

  if (internationalBlock) container.appendChild(internationalBlock);
  if (domesticBlock) container.appendChild(domesticBlock);
}

function renderSelectedPublications() {
  if (typeof publications === "undefined") return;

  const selectedContainer = document.getElementById("selected-publications");
  if (!selectedContainer) return;

  selectedContainer.innerHTML = "";

  const selectedPublications = publications.filter(pub => pub.selected);
  selectedPublications.forEach(pub => {
    selectedContainer.appendChild(createPublicationCard(pub));
  });
}

document.addEventListener("DOMContentLoaded", () => {
  renderPublicationPage();
  renderSelectedPublications();
});