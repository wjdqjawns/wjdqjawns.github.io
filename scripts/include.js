async function loadComponent(targetId, filePath) {
  const target = document.getElementById(targetId);
  if (!target) return;

  try {
    const response = await fetch(filePath);
    if (!response.ok) {
      throw new Error(`Failed to fetch ${filePath}: ${response.status}`);
    }

    const html = await response.text();
    target.innerHTML = html;

    bindDataLinks(target);
    markActiveNav(target);
  } catch (error) {
    console.error(error);
  }
}

function resolvePath(path) {
  const current = window.location.pathname.replace(/\\/g, "/");

  if (current.includes("/pages_detail/projects/personal/")) return `../../../../${path}`;
  if (current.includes("/pages_detail/projects/team/")) return `../../../../${path}`;
  if (current.includes("/pages_detail/publications/domestic/")) return `../../../../${path}`;
  if (current.includes("/pages_detail/publications/international/")) return `../../../../${path}`;
  if (current.includes("/pages/")) return `../${path}`;

  return path;
}

function bindDataLinks(scope = document) {
  const links = scope.querySelectorAll("[data-link]");
  links.forEach((link) => {
    const path = link.getAttribute("data-link");
    if (path) {
      link.setAttribute("href", resolvePath(path));
    }
  });
}

function markActiveNav(scope = document) {
  const current = window.location.pathname.replace(/\\/g, "/");

  const navLinks = scope.querySelectorAll(".topbar-nav a");
  navLinks.forEach((link) => {
    const dataLink = link.getAttribute("data-link");
    if (!dataLink) return;

    const isHome = dataLink === "index.html" && (
      current.endsWith("/index.html") ||
      current.endsWith("/") ||
      current === ""
    );

    const isMatch =
      current.endsWith(dataLink) ||
      current.includes(`/${dataLink}`);

    if (isHome || isMatch) {
      link.classList.add("active");
    }
  });
}

function loadFooter() {
  fetch(resolvePath("components/footer.html"))
    .then(response => {
      if (!response.ok) {
        throw new Error(`Failed to fetch footer: ${response.status}`);
      }
      return response.text();
    })
    .then(data => {
      const footer = document.getElementById("footer");
      if (footer) {
        footer.innerHTML = data;
      }
    })
    .catch(error => {
      console.error(error);
    });
}

document.addEventListener("DOMContentLoaded", () => {
  const current = window.location.pathname.replace(/\\/g, "/");
  let barPath = "components/bar.html";

  if (current.includes("/pages_detail/projects/personal/")) {
    barPath = "../../../../components/bar.html";
  } else if (current.includes("/pages_detail/projects/team/")) {
    barPath = "../../../../components/bar.html";
  } else if (current.includes("/pages_detail/publications/domestic/")) {
    barPath = "../../../../components/bar.html";
  } else if (current.includes("/pages_detail/publications/international/")) {
    barPath = "../../../../components/bar.html";
  } else if (current.includes("/pages/")) {
    barPath = "../components/bar.html";
  }

  loadComponent("topbar", barPath);
  bindDataLinks(document);
  loadFooter();
});