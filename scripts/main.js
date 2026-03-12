document.addEventListener('DOMContentLoaded', () => {
  const currentPath = window.location.pathname;
  setTimeout(() => {
    document.querySelectorAll('.sidebar-nav a').forEach((link) => {
      const href = link.getAttribute('href');
      if (!href) return;
      if (currentPath.endsWith(href.replace(/^\.\//, '')) || currentPath.endsWith(href.replace(/^\.\.\//, ''))) {
        link.classList.add('active');
      }
      if ((href.includes('index.html') || href.endsWith('/')) && /\/$/.test(currentPath)) {
        link.classList.add('active');
      }
    });
  }, 50);
});
