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
  const initialHeaderHeight = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--header-initial-height'));
  const finalHeaderHeight = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--header-final-height'));
  const shrinkOffset = 20; // Start transition even earlier
  const transitionRange = 130; // Range over which the transition happens
  
  // Initialize main padding on load
  document.querySelector('main').style.paddingTop = `${initialHeaderHeight + 20}px`;

  // Add function to update main content padding based on header height
  const updateMainPadding = (headerHeight) => {
    document.querySelector('main').style.paddingTop = `${headerHeight + 20}px`;
  };
  
  window.addEventListener("scroll", () => {
    // Calculate header height based on scroll position for smooth transition
    if (window.scrollY <= shrinkOffset) {
      // Fully expanded header
      header.classList.remove("shrink");
      header.style.height = `${initialHeaderHeight}px`;
      updateMainPadding(initialHeaderHeight);
      
      // Position elements for large header
      document.querySelector('header img').style.left = 'calc(50% - 120px)';
      document.querySelector('header img').style.top = '50px';
      document.querySelector('header img').style.width = '240px';
      document.querySelector('header nav').style.top = '280px';
      document.querySelector('header nav').style.left = '50%';
      document.querySelector('header nav').style.transform = 'translateX(-50%)';
    } else if (window.scrollY >= shrinkOffset + transitionRange) {
      // Fully collapsed header
      header.classList.add("shrink");
      header.style.height = `${finalHeaderHeight}px`;
      updateMainPadding(finalHeaderHeight);
      
      // Position elements for small header
      document.querySelector('header img').style.left = '20px';
      document.querySelector('header img').style.top = '10px';
      document.querySelector('header img').style.width = '50px';
      document.querySelector('header nav').style.top = '10px';
      document.querySelector('header nav').style.left = '100%';
      document.querySelector('header nav').style.transform = 'translateX(-110%)';
    } else {
      // Calculate intermediate height during transition
      const scrollProgress = (window.scrollY - shrinkOffset) / transitionRange;
      const currentHeight = initialHeaderHeight - scrollProgress * (initialHeaderHeight - finalHeaderHeight);
      header.style.height = `${currentHeight}px`;
      updateMainPadding(currentHeight);
      
      // Calculate intermediate positions for elements
      const logoLeftStart = 50; // percentage minus 120px
      const logoLeftEnd = 20; // pixels
      const logoTopStart = 50; // pixels
      const logoTopEnd = 10; // pixels
      const logoWidthStart = 240; // pixels
      const logoWidthEnd = 50; // pixels
      
      // Interpolate logo position and size
      const logoLeft = scrollProgress <= 0.5 ? 
        `calc(${(1 - scrollProgress * 2) * logoLeftStart}% - ${(1 - scrollProgress * 2) * 120}px)` : 
        `${logoLeftEnd + (0.5 - Math.min(0.5, scrollProgress - 0.5)) * (logoLeftStart * 2)}px`;
      const logoTop = logoTopStart - scrollProgress * (logoTopStart - logoTopEnd);
      const logoWidth = logoWidthStart - scrollProgress * (logoWidthStart - logoWidthEnd);
      
      document.querySelector('header img').style.left = logoLeft;
      document.querySelector('header img').style.top = `${logoTop}px`;
      document.querySelector('header img').style.width = `${logoWidth}px`;
      
      // Interpolate nav position
      const navTopStart = 280; // pixels
      const navTopEnd = 10; // pixels
      const navTop = navTopStart - scrollProgress * (navTopStart - navTopEnd);
      
      document.querySelector('header nav').style.top = `${navTop}px`;
      
      if (scrollProgress > 0.6) {
        // Start moving nav to the right side
        const navTransitionProgress = (scrollProgress - 0.6) / 0.4; // 0 to 1 during last 40% of scroll
        const navLeftStart = 50; // percent
        const navLeftEnd = 100; // percent
        const navLeft = navLeftStart + navTransitionProgress * (navLeftEnd - navLeftStart);
        
        document.querySelector('header nav').style.left = `${navLeft}%`;
        document.querySelector('header nav').style.transform = `translateX(-${50 + navTransitionProgress * 60}%)`;
      } else {
        document.querySelector('header nav').style.left = '50%';
        document.querySelector('header nav').style.transform = 'translateX(-50%)';
      }
      
      // Add or remove class based on progress
      if (scrollProgress > 0.8) {
        header.classList.add("shrink");
      } else {
        header.classList.remove("shrink");
      }
    }

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
    } else {
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
