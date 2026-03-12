(function () {
  // active nav for normal links
  const path = location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll("[data-nav]").forEach(a => {
    const href = a.getAttribute("href");
    if (!href) return;
    const normalized = href.split("/").pop();
    if (normalized === path) a.classList.add("active");
  });

  // year
  const y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();

  // Projects dropdown (sorted A-Z)
  const dd = document.getElementById("projects-dd");
  if (dd) {
    const menu = dd.querySelector(".dd-menu");
    const link = dd.querySelector(".nav-link");

    const projects = [
      { title: "EGSE Communication Relay", href: "/projects.html#egse" },
      { title: "Experiment Logging Template", href: "/projects.html#logging" },
      { title: "Wheel-Leg Robot System", href: "/projects.html#wheel-leg" },
    ];

    projects.sort((a, b) => a.title.localeCompare(b.title, undefined, { sensitivity: "base" }));

    if (menu) {
      menu.innerHTML =
        projects.map(p => `<a role="menuitem" href="${p.href}">${p.title}</a>`).join("") +
        `<div class="dd-sep"></div><a href="/projects.html">View all projects →</a>`;
    }

    // aria-expanded
    if (link) {
      dd.addEventListener("mouseenter", () => link.setAttribute("aria-expanded", "true"));
      dd.addEventListener("mouseleave", () => link.setAttribute("aria-expanded", "false"));
      dd.addEventListener("focusin", () => link.setAttribute("aria-expanded", "true"));
      dd.addEventListener("focusout", () => link.setAttribute("aria-expanded", "false"));
    }
  }
})();
