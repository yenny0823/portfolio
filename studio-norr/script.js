/* ============================================
   Compass needle: rotates gently with scroll depth,
   settling back to true north at the top of the page.
   ============================================ */
function initCompass() {
  const needle = document.getElementById("compassNeedle");
  if (!needle) return;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduceMotion) return;

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

document.addEventListener("DOMContentLoaded", () => {
  initCompass();
  initReveal();
  document.getElementById("year").textContent = new Date().getFullYear();
});
