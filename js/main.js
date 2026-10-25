const caseStudyPage = document.querySelector(
  ".case-study-page--readme, .case-study-page--traficar"
);

const pageFrame = document.createElement("div");
const pageFrameContent = document.createElement("div");
const pageFrameItems = Array.from(
  document.querySelectorAll(
    "body > .site-header, body > main, body > .site-footer"
  )
);

if (pageFrameItems.length) {
  pageFrame.className = "page-frame";
  pageFrameContent.className = "page-frame__content";
  pageFrameItems[0].before(pageFrame);
  pageFrame.append(pageFrameContent);
  pageFrameItems.forEach((item) => pageFrameContent.append(item));
}

document.querySelectorAll(".site-header").forEach((header) => {
  const toggle = header.querySelector(".site-navigation-toggle");
  const navigation = header.querySelector(".site-navigation");

  if (!toggle || !navigation) {
    return;
  }

  const closeToggle = toggle.cloneNode(true);
  closeToggle.classList.add("mobile-navigation-close");
  closeToggle.setAttribute("aria-hidden", "true");
  pageFrame.before(closeToggle);

  const mobileNavigation = navigation.cloneNode(true);
  mobileNavigation.classList.add("mobile-navigation-panel");
  mobileNavigation.id = `${navigation.id}-mobile`;
  const mobileNavigationList = mobileNavigation.querySelector("ul");
  const homeItem = document.createElement("li");
  const homeLink = document.createElement("a");
  homeLink.href = header.querySelector(".site-logo").getAttribute("href");
  homeLink.textContent = "Home";
  homeItem.append(homeLink);
  mobileNavigationList.prepend(homeItem);
  closeToggle.setAttribute("aria-controls", mobileNavigation.id);
  pageFrame.before(mobileNavigation);

  let navigationCleanupTimer = null;
  let navigationIconTimer = null;
  let navigationScrollY = 0;
  let pendingNavigationTarget = null;

  const updateNavigationFrameTransform = () => {
    const scale = (window.innerWidth - 40) / window.innerWidth;

    document.documentElement.style.setProperty(
      "--mobile-navigation-scale",
      String(scale)
    );
    document.documentElement.style.setProperty(
      "--mobile-navigation-scroll-y",
      `${navigationScrollY}px`
    );
    document.documentElement.style.setProperty(
      "--mobile-navigation-content-offset",
      `${navigationScrollY * -1}px`
    );
    document.documentElement.style.setProperty(
      "--mobile-navigation-height",
      `${window.innerHeight}px`
    );
    document.documentElement.style.setProperty(
      "--mobile-navigation-header-height",
      `${header.offsetHeight}px`
    );
  };

  const finishNavigationClose = () => {
    if (
      document.body.classList.contains("mobile-navigation-open") ||
      !document.body.classList.contains("mobile-navigation-active")
    ) {
      return;
    }

    window.clearTimeout(navigationCleanupTimer);
    navigationCleanupTimer = null;
    header.classList.remove("is-menu-open");
    document.body.classList.remove(
      "mobile-navigation-active",
      "mobile-navigation-closing"
    );
    void pageFrame.offsetHeight;
    previousScrollY = navigationScrollY;
    const previousScrollBehavior =
      document.documentElement.style.scrollBehavior;
    document.documentElement.style.scrollBehavior = "auto";
    window.scrollTo(0, navigationScrollY);
    if (previousScrollBehavior) {
      document.documentElement.style.scrollBehavior = previousScrollBehavior;
    } else {
      document.documentElement.style.removeProperty("scroll-behavior");
    }

    if (pendingNavigationTarget) {
      const target = pendingNavigationTarget;
      pendingNavigationTarget = null;
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const setNavigationState = (isOpen) => {
    const wasOpen = toggle.getAttribute("aria-expanded") === "true";
    if (isOpen === wasOpen) {
      return;
    }

    window.clearTimeout(navigationIconTimer);
    navigationIconTimer = null;
    toggle.setAttribute("aria-expanded", String(isOpen));
    toggle.setAttribute(
      "aria-label",
      isOpen ? "Close navigation" : "Open navigation"
    );
    closeToggle.setAttribute(
      "aria-label",
      isOpen ? "Close navigation" : "Open navigation"
    );
    closeToggle.setAttribute("aria-hidden", String(!isOpen));
    if (isOpen) {
      window.clearTimeout(navigationCleanupTimer);
      navigationCleanupTimer = null;
      document.body.classList.remove("mobile-navigation-closing");
      navigationScrollY = window.scrollY;
      closeToggle.setAttribute("aria-expanded", "false");
      updateNavigationFrameTransform();
      header.classList.add("is-menu-open");
      header.classList.remove("is-scroll-hidden");
      header.classList.add("is-scroll-visible");
      document.body.classList.add(
        "mobile-navigation-active",
        "mobile-navigation-open"
      );
      navigationIconTimer = window.setTimeout(() => {
        if (document.body.classList.contains("mobile-navigation-open")) {
          closeToggle.setAttribute("aria-expanded", "true");
        }
      }, 300);
    } else {
      navigationIconTimer = window.setTimeout(() => {
        closeToggle.setAttribute("aria-expanded", "false");
      }, 300);
      document.body.classList.remove("mobile-navigation-open");
      document.body.classList.add("mobile-navigation-closing");
      window.clearTimeout(navigationCleanupTimer);
      navigationCleanupTimer = window.setTimeout(
        finishNavigationClose,
        620
      );
    }

    pageFrame.inert = isOpen;
  };

  pageFrame.addEventListener("transitionend", (event) => {
    if (
      event.target !== pageFrame ||
      event.propertyName !== "transform" ||
      document.body.classList.contains("mobile-navigation-open")
    ) {
      return;
    }

    finishNavigationClose();
  });

  pageFrame.addEventListener("transitioncancel", finishNavigationClose);

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

    if (currentScrollY <= 2) {
      header.classList.remove(
        "is-scroll-hidden",
        "is-scroll-nav",
        "is-scroll-hero"
      );
      header.classList.add("is-scroll-visible");
      previousScrollY = currentScrollY;
    } else if (Math.abs(scrollDelta) >= 2) {
      header.classList.add("is-scroll-nav");

      if (projectHero) {
        const heroBottom = projectHero.offsetTop + projectHero.offsetHeight;
        const transparentThreshold = Math.min(heroBottom, 90);
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

  closeToggle.addEventListener("click", () => {
    setNavigationState(false);
  });

  mobileNavigation.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", (event) => {
      const targetUrl = new URL(link.href, window.location.href);
      const isSamePageHash =
        targetUrl.origin === window.location.origin &&
        targetUrl.pathname === window.location.pathname &&
        targetUrl.search === window.location.search &&
        targetUrl.hash;

      if (isSamePageHash) {
        const target = document.querySelector(targetUrl.hash);
        if (target) {
          event.preventDefault();
          pendingNavigationTarget = target;
          window.history.pushState(null, "", targetUrl.hash);
        }
      }

      setNavigationState(false);
    });
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
      return;
    }
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 560 && header.classList.contains("is-menu-open")) {
      setNavigationState(false);
      finishNavigationClose();
    } else if (header.classList.contains("is-menu-open")) {
      updateNavigationFrameTransform();
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
      const targetScrollTop = index === 0
        ? 0
        : Math.max(0, targetDocumentTop - navigationTop - linkOffset);

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

const resumePage = document.querySelector(".resume-page");

if (resumePage) {
  const resumeRevealItems = document.querySelectorAll(
    ".resume-navigation, .resume-section, .resume-image, .contact"
  );

  resumePage.classList.add("resume-reveal-ready");
  resumeRevealItems.forEach((item) => item.classList.add("resume-reveal"));

  if ("IntersectionObserver" in window) {
    const resumeRevealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            resumeRevealObserver.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -8%", threshold: 0.1 }
    );

    requestAnimationFrame(() => {
      resumeRevealItems.forEach((item) => resumeRevealObserver.observe(item));
    });
  } else {
    resumeRevealItems.forEach((item) => item.classList.add("is-visible"));
  }
}
