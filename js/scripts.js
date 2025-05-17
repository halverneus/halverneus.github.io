document.addEventListener("DOMContentLoaded", () => {
  // Function to show a specific section
  const showSection = (sectionId) => {
    // Default to home if sectionId is invalid
    if (!document.getElementById(sectionId)) {
      sectionId = "home";
    }

    // Hide all sections with fade out
    document.querySelectorAll("section").forEach((section) => {
      section.style.display = "none";
      section.classList.remove("fade-enter-active");
    });

    // Show only the target section
    const targetSection = document.getElementById(sectionId);
    targetSection.style.display = "block";

    // Add animation class
    targetSection.classList.remove("fade-enter-active");
    targetSection.classList.add("fade-enter");
    setTimeout(() => targetSection.classList.add("fade-enter-active"), 100);

    // Update active link
    document.querySelectorAll("nav a").forEach((navLink) => {
      navLink.classList.remove("active");
    });
    document
      .querySelector(`nav a[data-section="${sectionId}"]`)
      ?.classList.add("active");
  };

  // Function to scroll to a portfolio section
  const scrollToPortfolioSection = (targetId) => {
    // Make sure portfolio section is visible first
    if (
      !document.getElementById("portfolio").style.display ||
      document.getElementById("portfolio").style.display === "none"
    ) {
      showSection("portfolio");
    }

    // Scroll to the target element
    const targetElement = document.getElementById(targetId);
    if (targetElement) {
      setTimeout(() => {
        try {
          // Get the height of the sticky header and nav
          const headerHeight =
            document.getElementById("main-header").offsetHeight || 80;
          const portfolioNavHeight =
            document.querySelector(".portfolio-nav").offsetHeight || 60;

          // Calculate the total offset for scrolling
          const scrollOffset = headerHeight + portfolioNavHeight + 20; // extra padding

          // Get the target element's position and adjust for the offset
          const targetPosition =
            targetElement.getBoundingClientRect().top +
            window.scrollY -
            scrollOffset;

          // Scroll to the adjusted position
          window.scrollTo({
            top: targetPosition,
            behavior: "smooth",
          });
        } catch (error) {
          // Fallback if there are any errors with the calculation
          targetElement.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
      }, 300); // Increased delay to ensure the portfolio section is visible
    }
  };

  // Initialize all sections with fade effect
  document.querySelectorAll("section").forEach((section) => {
    section.classList.add("fade-enter");
    // Hide all sections initially (we'll show the correct one after)
    section.style.display = "none";
  });

  // Check for hash in URL or default to home
  const initialSection = window.location.hash
    ? window.location.hash.substring(1)
    : "home";
  showSection(initialSection);

  // Add fade-enter-active class to the visible section
  setTimeout(() => {
    document.getElementById(initialSection)?.classList.add("fade-enter-active");
  }, 100);

  // Add click event listeners to navigation links
  document.querySelectorAll("nav a").forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const targetId = link.getAttribute("data-section");

      // Don't do anything if clicking the already active section
      if (link.classList.contains("active")) {
        return;
      }

      // Update URL hash without triggering scroll
      history.pushState(null, null, `#${targetId}`);

      // Show the target section
      showSection(targetId);
    });
  });

  // Add click event listeners to portfolio navigation links
  document.querySelectorAll(".portfolio-link").forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const targetId = link.getAttribute("data-target");

      // Ensure we're on the portfolio section first
      if (
        !document.getElementById("portfolio").style.display ||
        document.getElementById("portfolio").style.display === "none"
      ) {
        // Update URL hash
        history.pushState(null, null, "#portfolio");
      }

      // Scroll to the target within portfolio
      scrollToPortfolioSection(targetId);
    });
  });

  // Listen for hash changes in URL (for browser back/forward buttons)
  window.addEventListener("hashchange", () => {
    const sectionId = window.location.hash.substring(1) || "home";
    showSection(sectionId);
  });

  const header = document.getElementById("main-header");
  const shrinkOffset = 150;

  window.addEventListener("scroll", () => {
    if (window.scrollY > shrinkOffset) {
      header.classList.add("shrink");

      // Make the portfolio nav sticky when in portfolio section
      if (document.getElementById("portfolio").style.display === "block") {
        const portfolioNav = document.querySelector(".portfolio-nav");
        if (portfolioNav) {
          portfolioNav.style.position = "sticky";
          portfolioNav.style.top = `${header.offsetHeight}px`; // Dynamic header height
          portfolioNav.style.boxShadow = "0 4px 12px rgba(0,0,0,0.2)";
          portfolioNav.style.opacity = "1";
          // Highlight the current active portfolio section in the nav
          updateActivePortfolioLink();
        }
      }
    } else {
      header.classList.remove("shrink");

      // Reset portfolio nav
      const portfolioNav = document.querySelector(".portfolio-nav");
      if (portfolioNav) {
        portfolioNav.style.position = "relative";
        portfolioNav.style.top = "0";
        portfolioNav.style.boxShadow = "none";
      }
    }
  });

  // Function to reset portfolio nav state when switching sections
  const resetPortfolioNav = () => {
    const portfolioNav = document.querySelector(".portfolio-nav");
    if (portfolioNav) {
      if (document.getElementById("portfolio").style.display !== "block") {
        portfolioNav.style.position = "relative";
        portfolioNav.style.top = "0";
        portfolioNav.style.boxShadow = "none";
      }
    }
  };

  // Extend showSection to reset the portfolio nav when changing sections
  const originalShowSection = showSection;
  window.showSection = (sectionId) => {
    originalShowSection(sectionId);
    resetPortfolioNav();

    // If URL hash contains a portfolio section, scroll to it after showing portfolio
    if (sectionId === "portfolio" && window.location.hash) {
      const hash = window.location.hash.substring(1);
      if (hash.startsWith("project") && document.getElementById(hash)) {
        setTimeout(() => {
          scrollToPortfolioSection(hash);
        }, 300);
      }
    }
  };

  // Handle direct linking to portfolio sections
  if (window.location.hash && window.location.hash.startsWith("#project")) {
    const hash = window.location.hash.substring(1);
    if (document.getElementById(hash)) {
      setTimeout(() => {
        showSection("portfolio");
        scrollToPortfolioSection(hash);
      }, 500);
    }
  }
  // Function to update which portfolio link is active based on scroll position
  const updateActivePortfolioLink = () => {
    if (document.getElementById("portfolio").style.display !== "block") return;

    const portfolioSections = ["project1", "project2", "project3", "project4"];
    const scrollPosition = window.scrollY;

    // Get header and nav heights for offset calculation
    const headerHeight =
      document.getElementById("main-header").offsetHeight || 80;
    const portfolioNavHeight =
      document.querySelector(".portfolio-nav").offsetHeight || 60;
    const scrollOffset = headerHeight + portfolioNavHeight + 100; // Add extra padding

    // Find which section is currently in view
    let currentSection = portfolioSections[0];

    for (const sectionId of portfolioSections) {
      const section = document.getElementById(sectionId);
      if (!section) continue;

      const sectionTop = section.getBoundingClientRect().top + window.scrollY;
      if (scrollPosition >= sectionTop - scrollOffset) {
        currentSection = sectionId;
      }
    }

    // Update active class on portfolio links
    document.querySelectorAll(".portfolio-link").forEach((link) => {
      if (link.getAttribute("data-target") === currentSection) {
        link.style.backgroundColor = "var(--primary)";
        link.style.color = "white";
      } else {
        link.style.backgroundColor = "transparent";
        link.style.color = "var(--text)";
      }
    });
  };

  // Add scroll event listener to update active portfolio link
  window.addEventListener("scroll", updateActivePortfolioLink);
});
