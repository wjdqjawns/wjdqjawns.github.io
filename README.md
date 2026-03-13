# Personal Portfolio Website
This repository contains the source code for my personal portfolio website.

🔗 **Website:**  
https://wjdqjawns.github.io

The site presents my work in embedded systems, robotics, and satellite engineering, including projects, publications, and research activities.

# Overview
The website is a static site hosted on **GitHub Pages**.  
It is designed with a modular structure to separate:

- page layout
- reusable components
- project/publication data
- assets and documents

This structure makes it easy to add new projects, publications, and materials without modifying many files.

# Repository Structure
```
.
├── index.html # Landing page
├── README.md
├── .gitignore

├── assets/ # Static resources
│ ├── common # Shared images or icons
│ ├── projects # Project-related materials
│ │ ├── personal
│ │ │ ├── fig
│ │ │ ├── paper
│ │ │ ├── poster
│ │ │ └── presentation
│ │ └── team
│ │ ├── fig
│ │ ├── paper
│ │ ├── poster
│ │ └── presentation
│ │
│ ├── publications # Publication materials
│ │ ├── domestic
│ │ │ ├── fig
│ │ │ ├── paper
│ │ │ ├── poster
│ │ │ └── presentation
│ │ └── international
│ │ ├── fig
│ │ ├── paper
│ │ ├── poster
│ │ └── presentation
│ │
│ └── resume
│ └── resume.pdf

├── components/ # Reusable HTML components
│ ├── bar.html
│ └── footer.html

├── data/ # Data sources for rendering
│ ├── projects.js
│ └── publications.js

├── pages/ # Main pages
│ ├── about.html
│ ├── contact.html
│ ├── projects.html
│ └── publications.html

├── pages_detail/ # Detail pages
│ ├── projects
│ │ ├── personal
│ │ └── team
│ │
│ └── publications
│ ├── domestic
│ └── international

├── scripts/ # JavaScript logic
│ ├── include.js
│ ├── main.js
│ ├── render_projects.js
│ └── render_publications.js

└── styles/ # CSS styles
├── base.css
├── components.css
├── layout.css
└── pages.css
```

# Content Organization
## Projects
Projects are categorized as:

- **Personal Projects**
- **Team Projects**

Each project has a detail page and associated materials such as:

- figures
- papers
- posters
- presentations

Source code is hosted separately on **GitHub repositories** and linked from the project pages.

---
## Publications
Publications are categorized as:

- **Domestic**
- **International**

Each publication may include:

- paper (PDF)
- poster
- presentation
- figures

# Development
This is a **static website** and does not require a build system.

You can run it locally using a simple static server.

Example:

```bash
python -m http.server
or
npx serve
```
Then open:
http://localhost:8000

# License
This repository is intended for personal portfolio use.
Content such as papers, figures, and project materials may be subject to their respective licenses.