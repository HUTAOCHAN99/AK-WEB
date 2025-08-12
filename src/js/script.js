document.addEventListener("DOMContentLoaded", function() {
  // ========== DOM Elements ==========
  const header = document.querySelector("header");
  const logoContainer = document.querySelector(".logo-container");
  const backTop = document.getElementById("backtop");
  const backTopLink = document.querySelector("#backtop a");
  const humberger = document.querySelector("#humberger");
  const navMenu = document.querySelector("#nav-menu");
  const overlay = document.querySelector("#overlay");
  const closeMenuBtn = document.querySelector("#close-menu");
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

  // ========== Mobile Menu - Sidebar ==========
  function toggleMobileMenu() {
    humberger.classList.toggle("humberger-active");
    navMenu.classList.toggle("active");
    overlay.classList.toggle("active");
    document.body.classList.toggle("no-scroll");
  }

  function closeMobileMenu() {
    humberger.classList.remove("humberger-active");
    navMenu.classList.remove("active");
    overlay.classList.remove("active");
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
      closeMobileMenu();
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

    // Close menu button
    if (closeMenuBtn) {
      closeMenuBtn.addEventListener("click", closeMobileMenu);
    }

    // Overlay click to close menu
    if (overlay) {
      overlay.addEventListener("click", closeMobileMenu);
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

// ========== timeline ==========
document.addEventListener('DOMContentLoaded', function() {
  // Timeline data
  const timelineData = [
    {
      title: "Organization Founded",
      date: "January 2020",
      description: "Our organization was officially established with 10 founding members.",
      tags: ["Milestone"]
    },
    {
      title: "First Major Event",
      date: "March 2021",
      description: "Hosted our first community conference with over 200 participants.",
      tags: ["Event"]
    },
    {
      title: "Expansion",
      date: "August 2022",
      description: "Opened two new regional chapters and grew to 100+ active members.",
      tags: ["Growth", "Team"]
    },
    // Additional hidden items
    {
      title: "First Charity Event",
      date: "November 2022",
      description: "Organized our first charity event raising $10,000 for local community.",
      tags: ["Event", "Charity"]
    },
    {
      title: "Website Launch",
      date: "February 2023",
      description: "Launched our official website to reach wider audience.",
      tags: ["Milestone"]
    }
  ];

  const timelineContainer = document.getElementById('timeline-container');
  
  // Clear existing content
  timelineContainer.innerHTML = '';

  // Create header
  const header = document.createElement('div');
  header.className = 'timeline-header';
  header.innerHTML = `
    <h2>Our Journey Timeline</h2>
    <p>Key milestones and events that shaped our organization's growth</p>
  `;
  timelineContainer.appendChild(header);

  // Create visible items (first 3)
  timelineData.slice(0, 3).forEach(item => {
    createTimelineItem(item);
  });

  // Create "Show More" button
  const showMoreBtn = document.createElement('button');
  showMoreBtn.className = 'show-more-btn';
  showMoreBtn.textContent = 'Show More';
  showMoreBtn.addEventListener('click', function() {
    // Show remaining items
    timelineData.slice(3).forEach(item => {
      createTimelineItem(item);
    });
    // Remove the button
    showMoreBtn.remove();
  });
  timelineContainer.appendChild(showMoreBtn);

  function createTimelineItem(item) {
    const timelineItem = document.createElement('div');
    timelineItem.className = 'timeline-item';
    
    const title = document.createElement('h3');
    title.textContent = item.title;
    
    const date = document.createElement('div');
    date.className = 'timeline-date';
    date.textContent = item.date;
    
    const description = document.createElement('p');
    description.className = 'timeline-description';
    description.textContent = item.description;
    
    const tagsContainer = document.createElement('div');
    item.tags.forEach(tag => {
      const tagElement = document.createElement('span');
      tagElement.className = 'timeline-tag';
      tagElement.textContent = tag;
      tagsContainer.appendChild(tagElement);
    });
    
    // Add divider except for first item
    if (timelineContainer.children.length > 1) {
      const divider = document.createElement('div');
      divider.className = 'timeline-divider';
      timelineContainer.appendChild(divider);
    }
    
    timelineItem.appendChild(title);
    timelineItem.appendChild(date);
    timelineItem.appendChild(description);
    timelineItem.appendChild(tagsContainer);
    
    timelineContainer.appendChild(timelineItem);
  }
});