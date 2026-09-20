const caseStudyPage = document.querySelector(
  ".case-study-page--readme, .case-study-page--traficar"
);

if (caseStudyPage) {
  const heroItems = document.querySelectorAll(
    ".case-study-hero__content, .case-study-hero__mockup"
  );
  const introItems = document.querySelectorAll(
    ".case-study-introduction article"
  );
  const revealItems = document.querySelectorAll(
    ".case-study-image, " +
    ".readme-process__timeline, " +
    ".readme-phase__header > *, " +
    ".readme-subsection"
  );

  caseStudyPage.classList.add("scrolly-ready");
  heroItems.forEach((item) => item.classList.add("hero-reveal"));
  introItems.forEach((item) => item.classList.add("intro-reveal"));
  revealItems.forEach((item) => item.classList.add("scrolly-reveal"));

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -12%", threshold: 0.12 }
    );

    revealItems.forEach((item) => observer.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add("is-visible"));
  }
}

const projectCards = document.querySelectorAll(".project-card");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

projectCards.forEach((card) => {
  if (reduceMotion) {
    return;
  }

  const mockup = card.querySelector(".project-card__mockup");
  const background = card.querySelector(".project-card__background");

  if (!mockup || !background) {
    return;
  }

  card.addEventListener("pointermove", (event) => {
    if (event.pointerType === "touch") {
      return;
    }

    const bounds = card.getBoundingClientRect();
    const x = ((event.clientX - bounds.left) / bounds.width - 0.5) * 2;
    const y = ((event.clientY - bounds.top) / bounds.height - 0.5) * 2;

    mockup.style.setProperty("--card-mockup-x", `${x * 8}px`);
    mockup.style.setProperty("--card-mockup-y", `${y * 6}px`);
  });

  card.addEventListener("pointerleave", () => {
    mockup.style.setProperty("--card-mockup-x", "0px");
    mockup.style.setProperty("--card-mockup-y", "0px");
  });
});
