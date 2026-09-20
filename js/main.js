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
