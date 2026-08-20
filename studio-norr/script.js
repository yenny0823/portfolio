const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ============================================
   Compass needle: rotates gently with scroll depth
   ============================================ */
function initCompass() {
  const needle = document.getElementById("compassNeedle");
  if (!needle || reduceMotion) return;

  function update() {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const progress = max > 0 ? window.scrollY / max : 0;
    const degrees = progress * 34 - 17; // gentle swing, never a full spin
    needle.style.transform = `rotate(${degrees}deg)`;
  }
  window.addEventListener("scroll", update, { passive: true });
  update();
}

/* ============================================
   Scroll reveal, staggered within each group
   ============================================ */
function initReveal() {
  const groups = [
    document.querySelectorAll(".service-grid .reveal"),
    document.querySelectorAll(".case-list .reveal"),
    document.querySelectorAll(".steps .reveal"),
  ];
  groups.forEach((group) => {
    group.forEach((el, i) => el.style.setProperty("--i", i));
  });

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
   Case visual tilt-on-hover (desktop only)
   ============================================ */
function initTilt() {
  if (reduceMotion || window.matchMedia("(pointer: coarse)").matches) return;
  document.querySelectorAll("[data-tilt]").forEach((el) => {
    const maxTilt = 6;
    el.addEventListener("mousemove", (e) => {
      const rect = el.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      el.style.transform = `perspective(600px) rotateY(${x * maxTilt}deg) rotateX(${-y * maxTilt}deg) scale(1.02)`;
    });
    el.addEventListener("mouseleave", () => {
      el.style.transform = "perspective(600px) rotateY(0) rotateX(0) scale(1)";
    });
  });
}

/* ============================================
   Count-up stats when scrolled into view
   ============================================ */
function initStatCounters() {
  const stats = document.querySelectorAll(".stat");
  if (!stats.length) return;

  function animateStat(el) {
    const target = parseFloat(el.dataset.value);
    const suffix = el.dataset.suffix || "";
    const prefix = el.dataset.prefix || "";
    if (reduceMotion) {
      el.textContent = `${prefix}${target}${suffix}`;
      return;
    }
    const duration = 900;
    const start = performance.now();
    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = Math.round(target * eased);
      el.textContent = `${prefix}${value}${suffix}`;
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  if (!("IntersectionObserver" in window)) {
    stats.forEach(animateStat);
    return;
  }
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateStat(entry.target);
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.6 }
  );
  stats.forEach((el) => io.observe(el));
}

/* ============================================
   Testimonial carousel
   ============================================ */
function initCarousel() {
  const track = document.getElementById("quoteTrack");
  const dotsWrap = document.getElementById("quoteDots");
  if (!track || !dotsWrap) return;

  const quotes = Array.from(track.querySelectorAll(".quote"));
  let index = 0;
  let timer = null;

  quotes.forEach((_, i) => {
    const dot = document.createElement("button");
    dot.setAttribute("role", "tab");
    dot.setAttribute("aria-label", `Show testimonial ${i + 1}`);
    if (i === 0) dot.classList.add("is-active");
    dot.addEventListener("click", () => goTo(i, true));
    dotsWrap.appendChild(dot);
  });
  const dots = Array.from(dotsWrap.children);

  function goTo(i, userInitiated) {
    quotes[index].classList.remove("is-active");
    dots[index].classList.remove("is-active");
    index = i;
    quotes[index].classList.add("is-active");
    dots[index].classList.add("is-active");
    if (userInitiated) restart();
  }

  function next() { goTo((index + 1) % quotes.length, false); }

  function start() {
    if (reduceMotion || quotes.length < 2) return;
    timer = setInterval(next, 6000);
  }
  function restart() {
    clearInterval(timer);
    start();
  }

  const carousel = document.getElementById("quoteCarousel");
  carousel.addEventListener("mouseenter", () => clearInterval(timer));
  carousel.addEventListener("mouseleave", start);

  start();
}

/* ============================================
   Back to top
   ============================================ */
function initToTop() {
  const btn = document.getElementById("toTop");
  if (!btn) return;
  window.addEventListener(
    "scroll",
    () => {
      btn.classList.toggle("is-visible", window.scrollY > 600);
    },
    { passive: true }
  );
  btn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  initCompass();
  initReveal();
  initTilt();
  initStatCounters();
  initCarousel();
  initToTop();
  document.getElementById("year").textContent = new Date().getFullYear();
});
