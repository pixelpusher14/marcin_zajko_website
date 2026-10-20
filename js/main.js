const caseStudyPage = document.querySelector(
  ".case-study-page--readme, .case-study-page--traficar"
);

document.querySelectorAll(".site-header").forEach((header) => {
  const toggle = header.querySelector(".site-navigation-toggle");
  const navigation = header.querySelector(".site-navigation");

  if (!toggle || !navigation) {
    return;
  }

  const setNavigationState = (isOpen) => {
    toggle.setAttribute("aria-expanded", String(isOpen));
    toggle.setAttribute(
      "aria-label",
      isOpen ? "Close navigation" : "Open navigation"
    );
    header.classList.toggle("is-menu-open", isOpen);
    if (isOpen) {
      header.classList.remove("is-scroll-hidden");
      header.classList.add("is-scroll-visible");
    }
    document.body.classList.toggle("mobile-navigation-open", isOpen);
  };

  header.classList.add("mobile-navigation-ready");

  let previousScrollY = window.scrollY;
  let scrollFrame = null;
  const projectHero = document.querySelector(".case-study-hero");

  const updateScrollNavigation = () => {
    scrollFrame = null;

    if (header.classList.contains("is-menu-open")) {
      previousScrollY = window.scrollY;
      return;
    }

    const currentScrollY = window.scrollY;
    const scrollDelta = currentScrollY - previousScrollY;

    if (currentScrollY <= 8) {
      header.classList.remove(
        "is-scroll-hidden",
        "is-scroll-nav",
        "is-scroll-hero"
      );
      header.classList.add("is-scroll-visible");
      previousScrollY = currentScrollY;
    } else if (Math.abs(scrollDelta) >= 8) {
      header.classList.add("is-scroll-nav");

      if (projectHero) {
        const heroBottom = projectHero.offsetTop + projectHero.offsetHeight;
        const transparentThreshold = Math.min(heroBottom, 360);
        header.classList.toggle(
          "is-scroll-hero",
          currentScrollY < transparentThreshold
        );
      }

      if (scrollDelta > 0) {
        header.classList.add("is-scroll-hidden");
        header.classList.remove("is-scroll-visible");
      } else {
        header.classList.add("is-scroll-visible");
        header.classList.remove("is-scroll-hidden");
      }
      previousScrollY = currentScrollY;
    }
  };

  window.addEventListener(
    "scroll",
    () => {
      if (scrollFrame === null) {
        scrollFrame = requestAnimationFrame(updateScrollNavigation);
      }
    },
    { passive: true }
  );

  toggle.addEventListener("click", () => {
    setNavigationState(toggle.getAttribute("aria-expanded") !== "true");
  });

  header.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => setNavigationState(false));
  });

  document.addEventListener("keydown", (event) => {
    if (!header.classList.contains("is-menu-open")) {
      return;
    }

    if (event.key === "Escape") {
      setNavigationState(false);
      toggle.focus();
      return;
    }

    if (event.key === "Tab") {
      const focusableItems = Array.from(
        header.querySelectorAll("a, button:not([disabled])")
      );
      const firstItem = focusableItems[0];
      const lastItem = focusableItems[focusableItems.length - 1];

      if (event.shiftKey && document.activeElement === firstItem) {
        event.preventDefault();
        lastItem.focus();
      } else if (!event.shiftKey && document.activeElement === lastItem) {
        event.preventDefault();
        firstItem.focus();
      }
    }
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 560 && header.classList.contains("is-menu-open")) {
      setNavigationState(false);
    }
  });
});

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

document.querySelectorAll(".tag-list__more button").forEach((button) => {
  const controlledBadges = button.getAttribute("aria-controls").split(" ");
  const hiddenCount = controlledBadges.length;

  button.addEventListener("click", () => {
    const isExpanded = button.getAttribute("aria-expanded") === "true";

    controlledBadges.forEach((id) => {
      const badge = document.getElementById(id);

      if (badge) {
        badge.hidden = isExpanded;
      }
    });

    button.setAttribute("aria-expanded", String(!isExpanded));
    button.textContent = isExpanded ? `+${hiddenCount} more` : "show less";
  });
});

const experienceButtons = document.querySelectorAll(
  ".experience-item__summary"
);

const experienceAnimations = new WeakMap();

const stopExperienceAnimation = (panel) => {
  const animation = experienceAnimations.get(panel);

  if (!animation) {
    return;
  }

  cancelAnimationFrame(animation.frame);
  clearTimeout(animation.timeout);
  panel.removeEventListener("transitionend", animation.onEnd);
  experienceAnimations.delete(panel);
};

const animateExperiencePanel = (button, shouldOpen) => {
  const panel = document.getElementById(button.getAttribute("aria-controls"));

  if (!panel || (!shouldOpen && panel.hidden)) {
    return;
  }

  stopExperienceAnimation(panel);

  const wasHidden = panel.hidden;
  panel.hidden = false;

  const startHeight = wasHidden ? 0 : panel.getBoundingClientRect().height;
  panel.style.height = `${startHeight}px`;
  panel.offsetHeight;

  button.setAttribute("aria-expanded", String(shouldOpen));

  const targetHeight = shouldOpen ? panel.scrollHeight : 0;
  const animation = {};

  const finish = (event) => {
    if (event && event.propertyName !== "height") {
      return;
    }

    if (experienceAnimations.get(panel) !== animation) {
      return;
    }

    stopExperienceAnimation(panel);

    if (!shouldOpen) {
      panel.hidden = true;
    }

    panel.style.removeProperty("height");
  };

  animation.onEnd = finish;
  animation.frame = requestAnimationFrame(() => {
    panel.style.height = `${targetHeight}px`;
  });
  animation.timeout = setTimeout(finish, 340);

  experienceAnimations.set(panel, animation);
  panel.addEventListener("transitionend", finish);
};

const closeExperiencePanel = (button) => {
  animateExperiencePanel(button, false);
};

const openExperiencePanel = (button) => {
  animateExperiencePanel(button, true);
};

experienceButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const isExpanded = button.getAttribute("aria-expanded") === "true";

    experienceButtons.forEach((otherButton) => {
      if (otherButton !== button) {
        closeExperiencePanel(otherButton);
      }
    });

    if (isExpanded) {
      closeExperiencePanel(button);
    } else {
      openExperiencePanel(button);
    }
  });
});

const resumeNavigationLinks = document.querySelectorAll(
  ".resume-navigation__link"
);
const resumeNavigation = document.querySelector(".resume-navigation");
const resumeSections = document.querySelectorAll(".resume-section[id]");

if (resumeNavigation && resumeNavigationLinks.length && resumeSections.length) {
  const setActiveResumeSection = (sectionId) => {
    resumeNavigationLinks.forEach((link) => {
      const isActive = link.getAttribute("href") === `#${sectionId}`;

      link.classList.toggle("is-active", isActive);

      if (isActive) {
        link.setAttribute("aria-current", "location");
      } else {
        link.removeAttribute("aria-current");
      }
    });
  };

  let resumeNavigationFrame = null;

  const updateActiveResumeSection = () => {
    resumeNavigationFrame = null;
    let activeSection = resumeSections[0];

    resumeSections.forEach((section, index) => {
      const matchingLink = resumeNavigationLinks[index];

      if (
        matchingLink &&
        section.getBoundingClientRect().top <=
          matchingLink.getBoundingClientRect().top + 1
      ) {
        activeSection = section;
      }
    });

    setActiveResumeSection(activeSection.id);
  };

  const scheduleResumeNavigationUpdate = () => {
    if (resumeNavigationFrame === null) {
      resumeNavigationFrame = requestAnimationFrame(updateActiveResumeSection);
    }
  };

  resumeNavigationLinks.forEach((link, index) => {
    link.addEventListener("click", (event) => {
      const target = document.querySelector(link.getAttribute("href"));

      if (!target) {
        return;
      }

      event.preventDefault();

      const navigationStyles = getComputedStyle(resumeNavigation);
      const targetDocumentTop =
        window.scrollY + target.getBoundingClientRect().top;
      const isScrollingUp = targetDocumentTop < window.scrollY;
      const navigationTopProperty = isScrollingUp
        ? "--resume-navigation-top-with-header"
        : "--resume-navigation-top";
      const navigationTop =
        Number.parseFloat(
          navigationStyles.getPropertyValue(navigationTopProperty)
        ) || 0;
      const linkOffset = link.offsetTop;
      const targetScrollTop = Math.max(
        0,
        targetDocumentTop - navigationTop - linkOffset
      );

      window.scrollTo({ top: targetScrollTop, behavior: "smooth" });
    });
  });

  window.addEventListener("scroll", scheduleResumeNavigationUpdate, {
    passive: true,
  });
  window.addEventListener("resize", scheduleResumeNavigationUpdate);
  resumeNavigation.addEventListener("transitionend", (event) => {
    if (event.propertyName === "top") {
      scheduleResumeNavigationUpdate();
    }
  });
  updateActiveResumeSection();
}
