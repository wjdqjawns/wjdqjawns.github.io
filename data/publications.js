const publications = [
  {
    id: "format-publication",
    title: "Format Publication",
    authors: "Beomjun Chung",
    venue: "TestConference",
    year: "2025",

    selected: true,
    category: "domestic", // domestic / international
    type: "conference", // conference / journal

    keywords: ["", ""],
    summary: "A compact publication landing page structure with direct links to paper, code, poster, and demo.",

    page: "./pages_detail/publications/international/satellite-rl-control.html",
    
    thumbnail: "",
    fig: [
      ""
    ],

    paper: "../assets/papers/international/sample-paper.pdf",
    poster: "./assets/papers/international/sample-paper.pdf",
    slide: "",

    code: "#",

    demo: {
      type: "local",
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
    title: "Wearable Monitoring for Chronic Disease Care",
    authors: "Beomjun Jung, Collaborator C",
    venue: "International Journal of Digital Health",
    year: "2025",
    selected: true,
    category: "international",
    type: "journal",
    summary: "Example journal entry with a concise summary and structured resource links.",
    detail: "../pages_detail/publications/international/wearable-monitoring.html",
    homeDetail: "./pages_detail/publications/international/wearable-monitoring.html",
    paper: "../assets/papers/international/sample-paper.pdf",
    homePaper: "./assets/papers/international/sample-paper.pdf",
    code: "#",
    poster: "#",
    homePoster: "#",
    demo: "#"
  },
  {
    title: "Embedded Telemetry Framework for CubeSat Testing",
    authors: "Beomjun Jung, Team GBSAT",
    venue: "Korean Conference on Aerospace Engineering",
    year: "2025",
    selected: true,
    category: "domestic",
    type: "conference",
    summary: "Domestic conference example entry for grouped publication rendering.",
    detail: "../pages_detail/publications/domestic/cubesat-telemetry.html",
    homeDetail: "./pages_detail/publications/domestic/cubesat-telemetry.html",
    paper: "../assets/papers/domestic/sample-paper.pdf",
    homePaper: "./assets/papers/domestic/sample-paper.pdf",
    code: "#",
    poster: "../assets/posters/sample-poster.pdf",
    homePoster: "./assets/posters/sample-poster.pdf",
    demo: "#"
  },
  {
    title: "TBA - international conference format",
    authors: "Beomjun Jung",
    venue: "TBA",
    year: "2026",
    selected: false,
    category: "international",
    type: "conference",
    summary: "TBA",
    detail: "../pages_detail/publications/domestic/embedded-control-testbeds.html",
    homeDetail: "./pages_detail/publications/domestic/embedded-control-testbeds.html",
    paper: "../assets/papers/domestic/sample-paper.pdf",
    homePaper: "./assets/papers/domestic/sample-paper.pdf",
    code: "#",
    poster: "#",
    homePoster: "#",
    demo: "#"
  }
];