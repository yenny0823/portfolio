/* ============================================
   EDIT THIS: your projects
   Add, remove, or edit entries. Each becomes a
   card in the "Work" section automatically.
   - liveUrl: link to the deployed site (or "" to hide the button)
   - codeUrl: link to the GitHub repo
   - thumbHue: a hex color used to tint the placeholder thumbnail
     (swap card__thumb for a real screenshot any time — see README)
   ============================================ */
const PROJECTS = [
  {
    title: "EnglishWithChevy",
    url: "englishwithchevy.com",
    description: "Built independently for a US-based client, with accessibility features designed around real usage: dark mode, adjustable text sizing, and a dyslexia-friendly font option.",
    tags: ["HTML/CSS", "JavaScript", "Accessibility"],
    liveUrl: "https://englishwithchevy.com",
    codeUrl: "",
    thumbHue: "#c9d6cd"
  },
  /* Sample placeholder projects below — replace with your own,
     or delete if you only want to show EnglishWithChevy for now. */
  {
    title: "Studio Norr — Agency Site",
    url: "studionorr.com",
    description: "Marketing site and case-study system for a design agency, built with a custom CMS-driven layout.",
    tags: ["Figma", "React", "Sanity CMS"],
    liveUrl: "#",
    codeUrl: "https://github.com/yourusername/studio-norr",
    thumbHue: "#dcd6cf"
  },
  {
    title: "Fielddata — Dashboard",
    url: "fielddata.app",
    description: "Data dashboard for field researchers, with offline-first sync and accessible chart components.",
    tags: ["TypeScript", "D3.js", "Node.js"],
    liveUrl: "#",
    codeUrl: "https://github.com/yourusername/fielddata",
    thumbHue: "#d9d2c3"
  },
  {
    title: "Loam — E-commerce",
    url: "shoploam.com",
    description: "Headless storefront for a ceramics studio: product configurator, cart, and checkout flow.",
    tags: ["Next.js", "Stripe", "Design system"],
    liveUrl: "#",
    codeUrl: "https://github.com/yourusername/loam-store",
    thumbHue: "#cfd6de"
  },
  {
    title: "Quietwork — Landing Page",
    url: "quietwork.io",
    description: "Product landing page for a focus-timer app, with a hand-built scroll-triggered demo animation.",
    tags: ["HTML/CSS", "JavaScript", "GSAP"],
    liveUrl: "#",
    codeUrl: "https://github.com/yourusername/quietwork",
    thumbHue: "#e0d6ce"
  }
];

/* ============================================
   Render project cards
   ============================================ */
function renderProjects() {
  const grid = document.getElementById("projectGrid");
  grid.innerHTML = PROJECTS.map((p) => `
    <article class="card browser-frame reveal">
      <div class="browser-frame__bar">
        <span class="dot"></span><span class="dot"></span><span class="dot"></span>
        <span class="browser-frame__url">${p.url}</span>
      </div>
      <div class="card__thumb" style="background-color:${p.thumbHue}"></div>
      <div class="card__body">
        <h3 class="card__title">${p.title}</h3>
        <p class="card__desc">${p.description}</p>
        <ul class="tag-list">
          ${p.tags.map((t) => `<li>${t}</li>`).join("")}
        </ul>
        <div class="card__links">
          ${p.liveUrl ? `<a href="${p.liveUrl}" target="_blank" rel="noopener">Live →</a>` : ""}
          ${p.codeUrl ? `<a href="${p.codeUrl}" target="_blank" rel="noopener">Code →</a>` : ""}
        </div>
      </div>
    </article>
  `).join("");
}

/* ============================================
   Typed line in the hero
   ============================================ */
function typeLine() {
  const el = document.getElementById("typed");
  const text = "$ role --set developer --focus accessibility";
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (reduceMotion) {
    el.textContent = text;
    return;
  }

  let i = 0;
  function step() {
    el.textContent = text.slice(0, i);
    i++;
    if (i <= text.length) {
      setTimeout(step, 32);
    }
  }
  step();
}

/* ============================================
   Scroll reveal
   ============================================ */
function initReveal() {
  const items = document.querySelectorAll(".reveal");
  if (!("IntersectionObserver" in window)) {
    items.forEach((el) => el.classList.add("is-visible"));
    return;
  }
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );
  items.forEach((el) => io.observe(el));
}

/* ============================================
   Init
   ============================================ */
document.addEventListener("DOMContentLoaded", () => {
  renderProjects();
  typeLine();
  initReveal();
  document.getElementById("year").textContent = new Date().getFullYear();
});
