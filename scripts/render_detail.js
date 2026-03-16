function createLinkChip(label, href) {
  if (!href) return "";
  return `<a class="chip" href="${href}" target="_blank" rel="noopener noreferrer">${label}</a>`;
}

function createCitationButton() {
  return `<button type="button" class="chip chip-button citation-open">Citation</button>`;
}

function getYoutubeEmbedUrl(url) {
  try {
    const parsed = new URL(url);

    if (parsed.hostname.includes("youtube.com")) {
      const videoId = parsed.searchParams.get("v");
      return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
    }

    if (parsed.hostname.includes("youtu.be")) {
      const videoId = parsed.pathname.replace("/", "");
      return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
    }
  } catch (error) {
    console.error("Invalid YouTube URL:", url);
  }

  return null;
}

function renderDemo(demo, containerId = "project-demo", sectionId = "demo-section") {
  const container = document.getElementById(containerId);
  const section = document.getElementById(sectionId);

  if (!container || !section) return;

  if (!demo || !demo.type || !demo.url) {
    section.style.display = "none";
    return;
  }

  if (demo.type === "youtube") {
    const embedUrl = getYoutubeEmbedUrl(demo.url);

    if (!embedUrl) {
      section.style.display = "none";
      return;
    }

    container.innerHTML = `
      <div class="video-wrapper">
        <iframe
          src="${embedUrl}"
          title="Project Demo"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowfullscreen>
        </iframe>
      </div>
    `;
    return;
  }

  if (demo.type === "local") {
    container.innerHTML = `
      <div class="video-wrapper">
        <video controls>
          <source src="${demo.url}" />
          Your browser does not support the video tag.
        </video>
      </div>
    `;
    return;
  }

  section.style.display = "none";
}

function setImage(id, src, altText = "") {
  const el = document.getElementById(id);
  if (!el) return;

  if (src) {
    el.src = src;
    el.alt = altText;
  } else {
    const figure = el.closest("figure");
    if (figure) {
      figure.style.display = "none";
    } else {
      el.style.display = "none";
    }
  }
}

function ensureCitationModal() {
  if (document.getElementById("citation-modal")) return;

  const modal = document.createElement("div");
  modal.id = "citation-modal";
  modal.className = "citation-modal hidden";
  modal.innerHTML = `
    <div class="citation-modal-backdrop"></div>
    <div class="citation-modal-dialog">
      <div class="citation-modal-header">
        <h3 id="citation-modal-title">Citation</h3>
        <button type="button" id="citation-modal-close" class="citation-modal-close">×</button>
      </div>
      <pre id="citation-modal-body" class="citation-modal-body"></pre>
    </div>
  `;

  document.body.appendChild(modal);

  modal.querySelector(".citation-modal-backdrop")
    .addEventListener("click", closeCitationModal);

  modal.querySelector("#citation-modal-close")
    .addEventListener("click", closeCitationModal);
}

function openCitationModal(title, citationText) {
  ensureCitationModal();

  const modal = document.getElementById("citation-modal");
  const titleEl = document.getElementById("citation-modal-title");
  const bodyEl = document.getElementById("citation-modal-body");

  if (titleEl) titleEl.textContent = `${title} · Citation`;
  if (bodyEl) bodyEl.textContent = citationText || "Citation is not available.";

  modal.classList.remove("hidden");
  document.body.classList.add("modal-open");
}

function closeCitationModal() {
  const modal = document.getElementById("citation-modal");
  if (!modal) return;

  modal.classList.add("hidden");
  document.body.classList.remove("modal-open");
}