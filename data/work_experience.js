const work_experience = [
  { // project format
    id: "format-project",

    title: "Format Project",
    advisor: {name:"", afflation: false},
    periods: ["2026-01", "2026-12"], // [YYYY-MM (start), YYYY-MM (end time)]

    selected: true, // true / false
    visible: true,  // true(visible) / false(hidden)
    category: "personal", // undergraduate / graduate
    status: "completed", // completed / ongoing / planning
    
    keywords: ["STM32", "FreeRTOS", "USB CDC", "CAN"],
    summary: "Structured relay architecture for USB, UART, and CAN with task-based routing and packet parsing.",
    
    assets: {
      thumbnail: "/assets/projects/personal/format-project/fig/fig1.png",

      figure: [
        {fig: "/assets/projects/personal/format-project/fig/fig1.png", caption: "Figure 01. Concept or architecture figure."},
        {fig: "/assets/projects/personal/format-project/fig/fig2.png", caption: "Figure 02. Main implementation or result figure."},
        {fig: "/assets/projects/personal/format-project/fig/fig3.png", caption: "Figure 03. Experimental result."}
      ],

      docuements: {
        paper: "/assets/projects/personal/format-project/documents/20260317_project_paper.pdf",
        poster: "/assets/projects/personal/format-project/documents/20260317_project_poster.pdf",
        slide: "/assets/projects/personal/format-project/documents/20260317_project_presentation.pdf",
      },

      link: {
        code: "https://github.com/wjdqjawns/f1tenth_rl_personal_2026",
        website: "",
        demo: "https://www.youtube.com/watch?v=bEWrhnyPSZs",
      },
      
      citation: `@misc{chung2026formatproject,
  author       = {Beomjun Chung},
  title        = {Format Project},
  year         = {2026},
  howpublished = {Personal portfolio project},
  note         = {GitHub repository and project detail page}
}`
    },

    related: {
      publications: [],
      courses: [],
      projects: [],
      patents: [],
    },
  },

  { // project format - multi fig
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

  { // thermoviz
    id: "2026-thermoviz",
    page: "/pages_detail/projects/personal/2026-thermoviz.html",

    title: "TheromoViz",
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

  { // spacedyn
    id: "2026-spacedyn",
    page: "/pages_detail/projects/personal/2026-spacedyn.html",

    title: "SpaceDyn",
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
];