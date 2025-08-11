document.addEventListener("DOMContentLoaded", function() {
  // ========== DOM Elements ==========
  const header = document.querySelector("header");
  const logoContainer = document.querySelector(".logo-container");
  const backTop = document.getElementById("backtop");
  const backTopLink = document.querySelector("#backtop a");
  const humberger = document.querySelector("#humberger");
  const navMenu = document.querySelector("#nav-menu");
  const navLinks = document.querySelectorAll("#nav-menu a");
  const anchorLinks = document.querySelectorAll('a[href^="#"]');

  // ========== Initial Setup ==========
  function init() {
    // Set initial header state
    updateHeaderState();
    
    // Set initial back-to-top button state
    updateBackToTopButton();
    
    // Setup event listeners
    setupEventListeners();
    
    console.log("Website initialized successfully");
  }

  // ========== Header Effects ==========
  function updateHeaderState() {
    if (window.scrollY > 50) {
      header.classList.remove("header-top");
      header.classList.add("header-scrolled");
    } else {
      header.classList.add("header-top");
      header.classList.remove("header-scrolled");
    }
  }

  // ========== Back-to-Top Button ==========
  function updateBackToTopButton() {
    if (window.scrollY > 300) {
      backTop.classList.remove("opacity-0", "invisible");
      backTop.classList.add("opacity-100", "visible");
    } else {
      backTop.classList.remove("opacity-100", "visible");
      backTop.classList.add("opacity-0", "invisible");
    }
  }

  function scrollToTop(e) {
    if (e) e.preventDefault();
    
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  }

  // ========== Mobile Menu ==========
  function toggleMobileMenu() {
    humberger.classList.toggle("humberger-active");
    navMenu.classList.toggle("hidden");
    document.body.classList.toggle("no-scroll");
  }

  function closeMobileMenu() {
    humberger.classList.remove("humberger-active");
    navMenu.classList.add("hidden");
    document.body.classList.remove("no-scroll");
  }

  // ========== Smooth Scrolling ==========
  function smoothScroll(e) {
    e.preventDefault();
    const targetId = this.getAttribute("href");
    const target = document.querySelector(targetId);
    
    if (target) {
      const headerHeight = header.offsetHeight;
      const targetPosition = target.offsetTop - headerHeight;
      
      window.scrollTo({
        top: targetPosition,
        behavior: "smooth"
      });
      
      // Close mobile menu if open
      if (!navMenu.classList.contains("hidden")) {
        closeMobileMenu();
      }
    }
  }

  // ========== Event Listeners ==========
  function setupEventListeners() {
    // Window scroll events
    window.addEventListener("scroll", function() {
      updateHeaderState();
      updateBackToTopButton();
    });

    // Mobile menu toggle
    if (humberger) {
      humberger.addEventListener("click", toggleMobileMenu);
    }

    // Back to top button
    if (backTopLink) {
      backTopLink.addEventListener("click", scrollToTop);
    }

    // Close mobile menu when clicking nav links
    navLinks.forEach(link => {
      link.addEventListener("click", closeMobileMenu);
    });

    // Smooth scrolling for anchor links
    anchorLinks.forEach(link => {
      if (link !== backTopLink) { // Skip back-to-top link
        link.addEventListener("click", smoothScroll);
      }
    });
  }

  // ========== Initialize Everything ==========
  init();
});