const projects = [
  { // project format
    id: "format-project",
    page: "/pages_detail/projects/personal/project-format.html",

    title: "Format Project",
    member: "Beomjun Chung",
    organization: "Test",
    year: "2026", 

    selected: true,
    category: "personal",
    region: "sdfsdf",
    
    keywords: ["STM32", "FreeRTOS", "USB CDC", "CAN"],
    summary: "Structured relay architecture for USB, UART, and CAN with task-based routing and packet parsing.",

    thumbnail: "/assets/projects/personal/format-project/fig/fig1.png",
    assets: {
      fig: [
        "/assets/projects/personal/format-project/fig/fig1.png",
        "/assets/projects/personal/format-project/fig/fig2.png",
        "/assets/projects/personal/format-project/fig/fig3.png"
      ],
      fig_caption: [
        "Figure 01. Concept or architecture figure.",
        "Figure 02. Main implementation or result figure.",
        "Figure 03. Experimental result."
      ],

      paper: "/assets/projects/personal/format-project/documents/20260317_project_paper.pdf",
      poster: "/assets/projects/personal/format-project/documents/20260317_project_poster.pdf",
      slide: "/assets/projects/personal/format-project/documents/20260317_project_presentation.pdf",
      code: "https://github.com/wjdqjawns/f1tenth_rl_personal_2026",
    },

    demo: {
      type: "youtube",
      url: "https://www.youtube.com/watch?v=bEWrhnyPSZs"
    },

    citation: `@misc{chung2026formatproject,
  author       = {Beomjun Chung},
  title        = {Format Project},
  year         = {2026},
  howpublished = {Personal portfolio project},
  note         = {GitHub repository and project detail page}
}`
  },

  {
    id: "format-multi-fig-project",
    page: "/pages_detail/projects/personal/project-multi-format.html",

    title: "Format Project Multi",
    member: "Beomjun Chung",
    organization: "Test",
    year: "2026",

    selected: true,
    category: "team",
    region: "sdfsdf",
    
    keywords: ["STM32", "FreeRTOS", "USB CDC", "CAN"],
    summary: "Structured relay architecture for USB, UART, and CAN with task-based routing and packet parsing.",

    thumbnail: "/assets/projects/personal/format-project/fig/fig1.png",
    assets: {
      // figures
      fig: [
        "/assets/projects/personal/format-project/fig/fig1.png",
        "/assets/projects/personal/format-project/fig/fig2.png",
        "/assets/projects/personal/format-project/fig/fig3.png"
      ],
      fig_caption: [
        "Figure 01. Concept or architecture figure.",
        "Figure 02. Main implementation or result figure.",
        "Figure 03. Experimental result."
      ],

      paper: "/assets/projects/personal/format-project/documents/20260317_project_paper.pdf",
      poster: "/assets/projects/personal/format-project/documents/20260317_project_poster.pdf",
      slide: "/assets/projects/personal/format-project/documents/20260317_project_presentation.pdf",
      code: "https://github.com/wjdqjawns/f1tenth_rl_personal_2026",
    },

    demo: {
      type: "youtube",
      url: "https://www.youtube.com/watch?v=bEWrhnyPSZs"
    },

    citation: `@misc{chung2026formatproject,
  author       = {Beomjun Chung},
  title        = {Format Project},
  year         = {2026},
  howpublished = {Personal portfolio project},
  note         = {GitHub repository and project detail page}
}`
  },
];