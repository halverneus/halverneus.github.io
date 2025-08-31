document.addEventListener("DOMContentLoaded", () => {
  // Particle system for background
  const createParticles = () => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    canvas.style.position = "fixed";
    canvas.style.top = "0";
    canvas.style.left = "0";
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.style.pointerEvents = "none";
    canvas.style.zIndex = "1";
    canvas.style.opacity = "0.6";
    document.body.appendChild(canvas);

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const particles = [];
    const particleCount = 50;

    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
        this.size = Math.random() * 2 + 1;
        this.opacity = Math.random() * 0.5 + 0.2;
        this.hue = Math.random() * 60 + 300; // Purple to red range
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
        if (this.y < 0 || this.y > canvas.height) this.vy *= -1;

        // Add subtle pulsing
        this.opacity += Math.sin(Date.now() * 0.001 + this.x * 0.01) * 0.01;
      }

      draw() {
        ctx.save();
        ctx.globalAlpha = this.opacity;
        ctx.fillStyle = `hsl(${this.hue}, 70%, 60%)`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }

    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((particle) => {
        particle.update();
        particle.draw();
      });

      // Draw connections between nearby particles
      particles.forEach((particle1, i) => {
        particles.slice(i + 1).forEach((particle2) => {
          const dx = particle1.x - particle2.x;
          const dy = particle1.y - particle2.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 100) {
            ctx.save();
            ctx.globalAlpha = (1 - distance / 100) * 0.2;
            ctx.strokeStyle = `hsl(${(particle1.hue + particle2.hue) / 2}, 70%, 60%)`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(particle1.x, particle1.y);
            ctx.lineTo(particle2.x, particle2.y);
            ctx.stroke();
            ctx.restore();
          }
        });
      });

      requestAnimationFrame(animate);
    };
    animate();
  };

  // Initialize particles
  createParticles();

  // Enhanced audio visualizer
  const createAudioVisualizer = (audioElement) => {
    if (!audioElement || audioElement.dataset.visualized) return;
    audioElement.dataset.visualized = "true";

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    canvas.style.position = "absolute";
    canvas.style.top = "0";
    canvas.style.left = "0";
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.style.pointerEvents = "none";
    canvas.style.borderRadius = "15px";
    canvas.style.opacity = "0.8";

    const container = audioElement.parentElement;
    container.style.position = "relative";
    container.appendChild(canvas);

    const resizeCanvas = () => {
      canvas.width = container.offsetWidth;
      canvas.height = container.offsetHeight;
    };
    resizeCanvas();

    let audioContext, analyser, dataArray;

    const initAudio = () => {
      if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const source = audioContext.createMediaElementSource(audioElement);
        analyser = audioContext.createAnalyser();
        analyser.fftSize = 256;
        source.connect(analyser);
        analyser.connect(audioContext.destination);
        dataArray = new Uint8Array(analyser.frequencyBinCount);
      }
    };

    const drawVisualizer = () => {
      if (!analyser) return;

      analyser.getByteFrequencyData(dataArray);

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const barWidth = (canvas.width / dataArray.length) * 2.5;
      let x = 0;

      for (let i = 0; i < dataArray.length; i++) {
        const barHeight = (dataArray[i] / 255) * canvas.height * 0.8;

        const hue = (i / dataArray.length) * 360;
        const gradient = ctx.createLinearGradient(
          0,
          canvas.height - barHeight,
          0,
          canvas.height,
        );
        gradient.addColorStop(0, `hsla(${hue}, 70%, 60%, 0.8)`);
        gradient.addColorStop(1, `hsla(${hue}, 70%, 40%, 0.4)`);

        ctx.fillStyle = gradient;
        ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);

        x += barWidth + 1;
      }

      if (!audioElement.paused) {
        requestAnimationFrame(drawVisualizer);
      }
    };

    audioElement.addEventListener("play", () => {
      initAudio();
      if (audioContext.state === "suspended") {
        audioContext.resume();
      }
      drawVisualizer();
    });

    audioElement.addEventListener("pause", () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    });

    window.addEventListener("resize", resizeCanvas);
  };

  // Apply visualizers to all audio elements
  document.querySelectorAll("audio").forEach(createAudioVisualizer);

  // Glitch text effect for headings
  const addGlitchEffect = () => {
    document.querySelectorAll("h1, h2").forEach((heading) => {
      heading.classList.add("glitch-text");
      heading.setAttribute("data-text", heading.textContent);
    });
  };
  addGlitchEffect();

  // Parallax scrolling effect
  const parallaxElements = document.querySelectorAll(".portfolio-item");
  const handleParallax = () => {
    const scrolled = window.pageYOffset;
    const rate = scrolled * -0.5;

    parallaxElements.forEach((el, index) => {
      const yPos = -(scrolled / (index + 1)) * 0.1;
      el.style.transform = `translateY(${yPos}px)`;
    });
  };

  // Intersection Observer for scroll animations
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = "1";
        entry.target.style.transform = "translateY(0)";

        // Stagger animation for portfolio items
        if (entry.target.classList.contains("portfolio-item")) {
          const items = entry.target.querySelectorAll(
            "h2, p, audio, video, .project-meta",
          );
          items.forEach((item, index) => {
            setTimeout(() => {
              item.style.opacity = "1";
              item.style.transform = "translateY(0)";
            }, index * 100);
          });
        }
      }
    });
  }, observerOptions);

  // Observe elements for animations
  document
    .querySelectorAll(".portfolio-item, h1, .portfolio-intro")
    .forEach((el) => {
      el.style.opacity = "0";
      el.style.transform = "translateY(30px)";
      el.style.transition = "all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)";
      observer.observe(el);
    });

  // Mouse trail effect
  const createMouseTrail = () => {
    const trail = [];
    const trailLength = 20;

    document.addEventListener("mousemove", (e) => {
      trail.push({
        x: e.clientX,
        y: e.clientY,
        opacity: 1,
      });

      if (trail.length > trailLength) {
        trail.shift();
      }

      updateTrail();
    });

    const updateTrail = () => {
      const existingTrails = document.querySelectorAll(".mouse-trail");
      existingTrails.forEach((el) => el.remove());

      trail.forEach((point, index) => {
        const trailElement = document.createElement("div");
        trailElement.className = "mouse-trail";
        trailElement.style.cssText = `
          position: fixed;
          left: ${point.x}px;
          top: ${point.y}px;
          width: ${Math.max(2, 8 - index * 0.3)}px;
          height: ${Math.max(2, 8 - index * 0.3)}px;
          background: radial-gradient(circle, rgba(255, 61, 61, ${point.opacity * 0.8}) 0%, transparent 70%);
          border-radius: 50%;
          pointer-events: none;
          z-index: 9999;
          transform: translate(-50%, -50%);
          transition: opacity 0.3s ease;
        `;
        document.body.appendChild(trailElement);

        point.opacity *= 0.95;

        setTimeout(() => {
          if (trailElement.parentNode) {
            trailElement.remove();
          }
        }, 100);
      });
    };
  };

  // Initialize mouse trail on desktop only
  if (window.innerWidth > 768) {
    createMouseTrail();
  }

  // Enhanced section navigation with smooth transitions
  const showSection = (sectionId) => {
    if (!document.getElementById(sectionId)) {
      sectionId = "home";
    }

    // Add transition class to all sections
    document.querySelectorAll("section").forEach((section) => {
      section.style.opacity = "0";
      section.style.transform = "translateY(30px)";
      setTimeout(() => {
        section.style.display = "none";
      }, 300);
    });

    // Show target section with animation
    setTimeout(() => {
      const targetSection = document.getElementById(sectionId);
      targetSection.style.display = "block";

      setTimeout(() => {
        targetSection.style.opacity = "1";
        targetSection.style.transform = "translateY(0)";

        // Re-observe elements for intersection animations
        targetSection
          .querySelectorAll(".portfolio-item, h1, .portfolio-intro")
          .forEach((el) => {
            observer.observe(el);
          });
      }, 50);
    }, 300);

    // Update active navigation
    document.querySelectorAll("nav a").forEach((navLink) => {
      navLink.classList.remove("active");
    });
    document
      .querySelector(`nav a[data-section="${sectionId}"]`)
      ?.classList.add("active");
  };

  // Enhanced portfolio section scrolling
  const scrollToPortfolioSection = (targetId) => {
    if (
      !document.getElementById("portfolio").style.display ||
      document.getElementById("portfolio").style.display === "none"
    ) {
      showSection("portfolio");
    }

    const targetElement = document.getElementById(targetId);
    if (targetElement) {
      setTimeout(() => {
        const headerHeight =
          document.getElementById("main-header").offsetHeight || 80;
        const portfolioNavHeight =
          document.querySelector(".portfolio-nav").offsetHeight || 60;
        const scrollOffset = headerHeight + portfolioNavHeight + 20;
        const targetPosition =
          targetElement.getBoundingClientRect().top +
          window.scrollY -
          scrollOffset;

        window.scrollTo({
          top: targetPosition,
          behavior: "smooth",
        });

        // Add highlight effect
        targetElement.style.transform = "scale(1.02)";
        targetElement.style.boxShadow = "0 20px 60px rgba(255, 61, 61, 0.3)";

        setTimeout(() => {
          targetElement.style.transform = "";
          targetElement.style.boxShadow = "";
        }, 1000);
      }, 400);
    }
  };

  // Initialize sections with transitions
  document.querySelectorAll("section").forEach((section) => {
    section.style.transition = "all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)";
    section.style.display = "none";
  });

  // Show initial section
  const initialSection = window.location.hash
    ? window.location.hash.substring(1)
    : "home";
  showSection(initialSection);

  // Navigation event listeners
  document.querySelectorAll("nav a").forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const targetId = link.getAttribute("data-section");

      if (link.classList.contains("active")) return;

      history.pushState(null, null, `#${targetId}`);
      showSection(targetId);
    });
  });

  // Portfolio navigation
  document.querySelectorAll(".portfolio-link").forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const targetId = link.getAttribute("data-target");

      if (
        !document.getElementById("portfolio").style.display ||
        document.getElementById("portfolio").style.display === "none"
      ) {
        history.pushState(null, null, "#portfolio");
      }

      scrollToPortfolioSection(targetId);
    });
  });

  // Hash change listener
  window.addEventListener("hashchange", () => {
    const sectionId = window.location.hash.substring(1) || "home";
    showSection(sectionId);
  });

  // Enhanced header scroll animation
  const header = document.getElementById("main-header");
  const initialHeaderHeight = parseInt(
    getComputedStyle(document.documentElement).getPropertyValue(
      "--header-initial-height",
    ),
  );
  const finalHeaderHeight = parseInt(
    getComputedStyle(document.documentElement).getPropertyValue(
      "--header-final-height",
    ),
  );
  const shrinkOffset = 20;
  const transitionRange = 130;

  document.querySelector("main").style.paddingTop =
    `${initialHeaderHeight + 20}px`;

  const updateMainPadding = (headerHeight) => {
    document.querySelector("main").style.paddingTop = `${headerHeight + 20}px`;
  };

  let ticking = false;
  const updateHeader = () => {
    const scrollY = window.scrollY;
    const isMobile = window.innerWidth <= 768;

    // On mobile, ensure clean state by removing any desktop classes/styles
    if (isMobile) {
      header.classList.remove("shrink");
      const nav = document.querySelector("header nav");
      const img = document.querySelector("header img");
      if (nav && nav.style.cssText) {
        nav.style.cssText = "";
      }
      if (img && img.style.cssText) {
        img.style.cssText = "";
      }
    }

    if (scrollY <= shrinkOffset) {
      if (!isMobile) {
        header.classList.remove("shrink");
      }
      header.style.height = `${initialHeaderHeight}px`;
      updateMainPadding(initialHeaderHeight);

      // Only apply desktop styles if not on mobile
      if (!isMobile) {
        document.querySelector("header img").style.cssText = `
          left: calc(50% - 120px);
          top: 50px;
          width: 240px;
          transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        `;
        document.querySelector("header nav").style.cssText = `
          top: 280px;
          left: 50%;
          transform: translateX(-50%);
          transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        `;
      }
    } else if (scrollY >= shrinkOffset + transitionRange) {
      if (!isMobile) {
        header.classList.add("shrink");
      }
      header.style.height = `${finalHeaderHeight}px`;
      updateMainPadding(finalHeaderHeight);

      // Only apply desktop styles if not on mobile
      if (!isMobile) {
        document.querySelector("header img").style.cssText = `
          left: 20px;
          top: 10px;
          width: 50px;
          transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        `;
        document.querySelector("header nav").style.cssText = `
          top: 10px;
          left: 100%;
          transform: translateX(-110%);
          transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        `;
      }
    } else {
      const scrollProgress = (scrollY - shrinkOffset) / transitionRange;
      const currentHeight =
        initialHeaderHeight -
        scrollProgress * (initialHeaderHeight - finalHeaderHeight);
      header.style.height = `${currentHeight}px`;
      updateMainPadding(currentHeight);

      // Only apply desktop styles if not on mobile
      if (!isMobile) {
        // Smooth interpolation for header elements
        const logoLeftStart = 50;
        const logoLeftEnd = 20;
        const logoTopStart = 50;
        const logoTopEnd = 10;
        const logoWidthStart = 240;
        const logoWidthEnd = 50;

        const logoLeft =
          scrollProgress <= 0.5
            ? `calc(${(1 - scrollProgress * 2) * logoLeftStart}% - ${(1 - scrollProgress * 2) * 120}px)`
            : `${logoLeftEnd + (0.5 - Math.min(0.5, scrollProgress - 0.5)) * (logoLeftStart * 2)}px`;
        const logoTop =
          logoTopStart - scrollProgress * (logoTopStart - logoTopEnd);
        const logoWidth =
          logoWidthStart - scrollProgress * (logoWidthStart - logoWidthEnd);

        document.querySelector("header img").style.cssText = `
          left: ${logoLeft};
          top: ${logoTop}px;
          width: ${logoWidth}px;
          transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        `;

        const navTopStart = 280;
        const navTopEnd = 10;
        const navTop = navTopStart - scrollProgress * (navTopStart - navTopEnd);

        if (scrollProgress > 0.6) {
          const navTransitionProgress = (scrollProgress - 0.6) / 0.4;
          const navLeftStart = 50;
          const navLeftEnd = 100;
          const navLeft =
            navLeftStart + navTransitionProgress * (navLeftEnd - navLeftStart);

          document.querySelector("header nav").style.cssText = `
            top: ${navTop}px;
            left: ${navLeft}%;
            transform: translateX(-${50 + navTransitionProgress * 60}%);
            transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          `;
        } else {
          document.querySelector("header nav").style.cssText = `
            top: ${navTop}px;
            left: 50%;
            transform: translateX(-50%);
            transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          `;
        }
      }

      if (!isMobile) {
        if (scrollProgress > 0.8) {
          header.classList.add("shrink");
        } else {
          header.classList.remove("shrink");
        }
      }
    }

    // Update portfolio nav if in portfolio section
    if (document.getElementById("portfolio").style.display === "block") {
      const portfolioNav = document.querySelector(".portfolio-nav");
      if (portfolioNav) {
        portfolioNav.style.position = "sticky";
        portfolioNav.style.top = `${header.offsetHeight}px`;
        updateActivePortfolioLink();
      }
    }

    ticking = false;
  };

  window.addEventListener("scroll", () => {
    if (!ticking) {
      requestAnimationFrame(updateHeader);
      handleParallax();
      ticking = true;
    }
  });

  // Portfolio link highlighting
  const updateActivePortfolioLink = () => {
    if (document.getElementById("portfolio").style.display !== "block") return;

    const portfolioSections = [
      "project1",
      "project2",
      "project3",
      "project4",
      "project5",
      "project6",
    ];
    const scrollPosition = window.scrollY;
    const headerHeight =
      document.getElementById("main-header").offsetHeight || 80;
    const portfolioNavHeight =
      document.querySelector(".portfolio-nav").offsetHeight || 60;
    const scrollOffset = headerHeight + portfolioNavHeight + 100;

    let currentSection = portfolioSections[0];

    for (const sectionId of portfolioSections) {
      const section = document.getElementById(sectionId);
      if (!section) continue;

      const sectionTop = section.getBoundingClientRect().top + window.scrollY;
      if (scrollPosition >= sectionTop - scrollOffset) {
        currentSection = sectionId;
      }
    }

    document.querySelectorAll(".portfolio-link").forEach((link) => {
      if (link.getAttribute("data-target") === currentSection) {
        link.style.background = "var(--gradient-primary)";
        link.style.color = "white";
        link.style.transform = "translateY(-2px) scale(1.05)";
        link.style.boxShadow = "0 8px 25px var(--primary-glow)";
      } else {
        link.style.background = "var(--glass)";
        link.style.color = "var(--text)";
        link.style.transform = "";
        link.style.boxShadow = "";
      }
    });
  };

  // Handle direct portfolio links
  if (window.location.hash && window.location.hash.startsWith("#project")) {
    const hash = window.location.hash.substring(1);
    if (document.getElementById(hash)) {
      setTimeout(() => {
        showSection("portfolio");
        scrollToPortfolioSection(hash);
      }, 500);
    }
  }

  // Ensure only one media plays at a time
  const mediaElements = document.querySelectorAll("audio, video");
  mediaElements.forEach((media) => {
    media.addEventListener("play", function () {
      mediaElements.forEach((otherMedia) => {
        if (otherMedia !== media && !otherMedia.paused) {
          otherMedia.pause();
        }
      });
    });
  });

  // Add loading animation
  document.body.classList.add("loading");
  window.addEventListener("load", () => {
    setTimeout(() => {
      document.body.classList.remove("loading");
    }, 500);
  });

  // Mobile menu functionality
  const mobileMenuToggle = document.querySelector(".mobile-menu-toggle");
  const nav = document.querySelector("nav");
  let menuOpen = false;

  if (mobileMenuToggle) {
    mobileMenuToggle.addEventListener("click", () => {
      menuOpen = !menuOpen;
      mobileMenuToggle.classList.toggle("active");
      nav.classList.toggle("active");

      // Prevent body scroll when menu is open
      if (menuOpen) {
        document.body.style.overflow = "hidden";
      } else {
        document.body.style.overflow = "";
      }
    });

    // Close menu when clicking a nav link
    document.querySelectorAll("nav a").forEach((link) => {
      link.addEventListener("click", () => {
        menuOpen = false;
        mobileMenuToggle.classList.remove("active");
        nav.classList.remove("active");
        document.body.style.overflow = "";
      });
    });

    // Close menu when clicking outside
    document.addEventListener("click", (e) => {
      if (
        menuOpen &&
        !nav.contains(e.target) &&
        !mobileMenuToggle.contains(e.target)
      ) {
        menuOpen = false;
        mobileMenuToggle.classList.remove("active");
        nav.classList.remove("active");
        document.body.style.overflow = "";
      }
    });

    // Close menu when scrolling (common mobile UX pattern)
    let scrollTimeout;
    window.addEventListener("scroll", () => {
      if (menuOpen && window.innerWidth <= 768) {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
          menuOpen = false;
          mobileMenuToggle.classList.remove("active");
          nav.classList.remove("active");
          document.body.style.overflow = "";
        }, 100);
      }
    });
  }

  // Performance optimization: debounce resize events
  let resizeTimeout;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      const isMobile = window.innerWidth <= 768;
      const nav = document.querySelector("header nav");
      const img = document.querySelector("header img");

      if (isMobile) {
        // Reset to mobile styles - remove any inline styles that might interfere
        nav.style.cssText = "";
        img.style.cssText = "";

        // Close mobile menu if it's open and ensure proper mobile state
        if (menuOpen) {
          menuOpen = false;
          if (mobileMenuToggle) {
            mobileMenuToggle.classList.remove("active");
            nav.classList.remove("active");
            document.body.style.overflow = "";
          }
        }
      } else {
        // Reset mobile menu state when switching to desktop
        if (mobileMenuToggle) {
          menuOpen = false;
          mobileMenuToggle.classList.remove("active");
          nav.classList.remove("active");
          document.body.style.overflow = "";
        }
      }

      // Recalculate dimensions and update animations
      updateHeader();
    }, 100);
  });
});

// Particle system for background
const createParticles = () => {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  canvas.style.position = "fixed";
  canvas.style.top = "0";
  canvas.style.left = "0";
  canvas.style.width = "100%";
  canvas.style.height = "100%";
  canvas.style.pointerEvents = "none";
  canvas.style.zIndex = "1";
  canvas.style.opacity = "0.6";
  document.body.appendChild(canvas);

  const resizeCanvas = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  };
  resizeCanvas();
  window.addEventListener("resize", resizeCanvas);

  const particles = [];
  const particleCount = window.innerWidth > 768 ? 50 : 20; // Reduce particles on mobile

  class Particle {
    constructor() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.vx = (Math.random() - 0.5) * 0.5;
      this.vy = (Math.random() - 0.5) * 0.5;
      this.size = Math.random() * 2 + 1;
      this.opacity = Math.random() * 0.5 + 0.2;
      this.hue = Math.random() * 60 + 300; // Purple to red range
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
      if (this.y < 0 || this.y > canvas.height) this.vy *= -1;

      // Add subtle pulsing
      this.opacity += Math.sin(Date.now() * 0.001 + this.x * 0.01) * 0.01;
    }

    draw() {
      ctx.save();
      ctx.globalAlpha = this.opacity;
      ctx.fillStyle = `hsl(${this.hue}, 70%, 60%)`;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  const animate = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach((particle) => {
      particle.update();
      particle.draw();
    });

    // Draw connections between nearby particles (skip on mobile for performance)
    if (window.innerWidth > 768) {
      particles.forEach((particle1, i) => {
        particles.slice(i + 1).forEach((particle2) => {
          const dx = particle1.x - particle2.x;
          const dy = particle1.y - particle2.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 100) {
            ctx.save();
            ctx.globalAlpha = (1 - distance / 100) * 0.2;
            ctx.strokeStyle = `hsl(${(particle1.hue + particle2.hue) / 2}, 70%, 60%)`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(particle1.x, particle1.y);
            ctx.lineTo(particle2.x, particle2.y);
            ctx.stroke();
            ctx.restore();
          }
        });
      });
    }

    requestAnimationFrame(animate);
  };
  animate();
};
