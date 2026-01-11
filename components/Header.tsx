"use client";
import { useState, useEffect, useRef } from "react";
import { FiMenu, FiX } from "react-icons/fi";
import Image from 'next/image';

// Custom hook untuk mengelola mobile menu
const useMobileMenu = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const [scrollPosition, setScrollPosition] = useState(0);
  
  const openMenu = () => {
    // Simpan posisi scroll saat ini
    setScrollPosition(window.pageYOffset);
    setIsMenuOpen(true);
    document.body.classList.add("overflow-hidden");
    
    // Lock scroll position
    document.body.style.top = `-${window.pageYOffset}px`;
    document.body.style.position = 'fixed';
    document.body.style.width = '100%';
  };
  
  const closeMenu = () => {
    setIsMenuOpen(false);
    document.body.classList.remove("overflow-hidden");
    
    // Restore scroll position
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.width = '';
    window.scrollTo(0, scrollPosition);
    
    // Reset hamburger button state
    const hamburgerBtn = document.getElementById('humberger');
    if (hamburgerBtn) {
      hamburgerBtn.setAttribute('aria-expanded', 'false');
    }
  };
  
  const toggleMenu = () => {
    if (isMenuOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  };
  
  const handleMenuLinkClick = (href: string) => {
    closeMenu();
    
    // Delay untuk memastikan menu tertutup sebelum scroll
    setTimeout(() => {
      if (href.startsWith('#')) {
        const element = document.querySelector(href);
        if (element) {
          const headerHeight = 80; // Sesuaikan dengan tinggi header
          const elementPosition = element.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerHeight;
          
          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      } else {
        window.location.href = href;
      }
    }, 300);
  };
  
  return {
    isMenuOpen,
    openMenu,
    closeMenu,
    toggleMenu,
    handleMenuLinkClick,
    menuRef
  };
};

export default function Header() {
  const { 
    isMenuOpen, 
    toggleMenu, 
    closeMenu, 
    handleMenuLinkClick,
    menuRef
  } = useMobileMenu();

  // Handle scroll untuk header
  useEffect(() => {
    const handleScroll = () => {
      const header = document.querySelector("header");
      if (header) {
        if (window.scrollY > 50) {
          header.classList.remove("header-top");
          header.classList.add("header-scrolled");
        } else {
          header.classList.remove("header-scrolled");
          header.classList.add("header-top");
        }
      }
    };

    // Inisialisasi state header
    handleScroll();
    window.addEventListener("scroll", handleScroll);

    // Cleanup
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Navigation items dengan href yang sesuai
  const navItems = [
    { name: "Home", href: "#home" },
    { name: "About", href: "#about" },
    { name: "Divisi", href: "#services" },
    { name: "Benefit & Kerjasama", href: "#skills" },
    { name: "Kegiatan", href: "#project" },
    { name: "Kontak", href: "#contact" },
  ];

  // Handle escape key untuk menutup menu
  useEffect(() => {
    const handleEscapeKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isMenuOpen) {
        closeMenu();
      }
    };

    document.addEventListener('keydown', handleEscapeKey);
    
    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [isMenuOpen, closeMenu]);

  return (
    <header className="fixed top-0 left-0 w-full z-50 transition-all duration-300 header-top bg-gray-900/90 backdrop-blur-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <div className="logo-container transition-all duration-300 shrink-0">
            <a 
              href="#home" 
              onClick={(e) => {
                e.preventDefault();
                handleMenuLinkClick("#home");
              }}
              className="focus:outline-none focus:ring-2 focus:ring-primary rounded"
            >
              <Image
                src="/assets/alkhawarizmi.webp"
                alt="Logo RS Alkhawarizmi"
                width={160}
                height={48}
                className="w-auto h-auto max-h-12"
                priority
              />
            </a>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:block grow mx-8" aria-label="Main navigation">
            <ul className="flex justify-center space-x-8">
              {navItems.map((item) => (
                <li key={item.name} className="group">
                  <a
                    href={item.href}
                    onClick={(e) => {
                      e.preventDefault();
                      handleMenuLinkClick(item.href);
                    }}
                    className="text-gray-300 hover:text-white font-medium py-2 relative transition duration-300 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-gray-900 rounded px-2"
                    aria-label={`Navigate to ${item.name}`}
                  >
                    {item.name}
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300"></span>
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Mobile Menu Button */}
          <div className="shrink-0 lg:hidden">
            <button
              id="humberger"
              onClick={toggleMenu}
              className="p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary z-[100] transition duration-300 hover:bg-gray-800"
              aria-label="Toggle menu"
              aria-expanded={isMenuOpen}
              aria-controls="nav-menu"
            >
              {isMenuOpen ? (
                <FiX className="w-6 h-6 text-white" />
              ) : (
                <FiMenu className="w-6 h-6 text-white" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Overlay */}
      <div
        id="overlay"
        className={`overlay fixed inset-0 bg-black/70 z-[90] transition-opacity duration-300 lg:hidden ${
          isMenuOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={closeMenu}
        aria-hidden={!isMenuOpen}
        style={{ 
          top: isMenuOpen ? `${window.pageYOffset}px` : '0',
          height: isMenuOpen ? `calc(100vh + ${window.pageYOffset}px)` : '100vh'
        }}
      ></div>

      {/* Mobile Navigation Menu */}
      <nav
        id="nav-menu"
        ref={menuRef}
        className={`lg:hidden fixed right-0 h-full w-3/4 max-w-sm bg-gray-900 z-[100] shadow-2xl transition-transform duration-300 ease-in-out transform ${
          isMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
        aria-label="Mobile navigation"
        aria-hidden={!isMenuOpen}
        style={{ 
          top: isMenuOpen ? `${window.pageYOffset}px` : '0',
          height: isMenuOpen ? `calc(100vh - ${window.pageYOffset}px)` : '100vh'
        }}
      >
        <div className="container mx-auto px-4 py-8 h-full overflow-y-auto">
          <div className="flex justify-end mb-8">
            <button
              id="close-menu"
              onClick={closeMenu}
              className="text-white text-2xl p-2 hover:bg-gray-800 rounded-lg transition duration-300 focus:outline-none focus:ring-2 focus:ring-primary"
              aria-label="Close menu"
            >
              <FiX className="w-6 h-6" />
            </button>
          </div>

          <ul className="space-y-4">
            {navItems.map((item) => (
              <li key={item.name}>
                <a
                  href={item.href}
                  onClick={(e) => {
                    e.preventDefault();
                    handleMenuLinkClick(item.href);
                  }}
                  className="block py-3 px-4 rounded-lg text-white hover:bg-gray-800 transition duration-300 text-lg font-medium border-l-4 border-transparent hover:border-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-gray-900"
                  aria-label={`Navigate to ${item.name}`}
                >
                  {item.name}
                </a>
              </li>
            ))}

            {/* Social Media Links in Mobile Menu */}
            <li className="pt-8 mt-8 border-t border-gray-800">
              <div className="px-4">
                <p className="text-gray-400 text-sm mb-4">Follow Us</p>
                <div className="flex space-x-4">
                  <a
                    href="https://github.com/Al-Khawarizmi-UPNYK"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-300 hover:text-white p-2 hover:bg-gray-800 rounded-lg transition duration-300 focus:outline-none focus:ring-2 focus:ring-primary"
                    aria-label="Visit our GitHub"
                  >
                    <svg
                      className="w-6 h-6"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                    </svg>
                  </a>
                  <a
                    href="https://www.instagram.com/alkhawarizmiifupnyk"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-300 hover:text-white p-2 hover:bg-gray-800 rounded-lg transition duration-300 focus:outline-none focus:ring-2 focus:ring-primary"
                    aria-label="Visit our Instagram"
                  >
                    <svg
                      className="w-6 h-6"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                    </svg>
                  </a>
                  <a
                    href="https://www.linkedin.com/company/kkmi-al-khawarizmi-upnyk/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-300 hover:text-white p-2 hover:bg-gray-800 rounded-lg transition duration-300 focus:outline-none focus:ring-2 focus:ring-primary"
                    aria-label="Visit our LinkedIn"
                  >
                    <svg
                      className="w-6 h-6"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                    </svg>
                  </a>
                </div>
              </div>
            </li>
          </ul>

          {/* Call to Action Button */}
          <div className="absolute bottom-8 left-0 right-0 px-4">
            <a
              href="#contact"
              onClick={(e) => {
                e.preventDefault();
                handleMenuLinkClick("#contact");
              }}
              className="block w-full bg-primary hover:bg-primary-dark text-white text-center font-medium py-3 px-6 rounded-lg shadow hover:shadow-md transition duration-300 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-gray-900"
              aria-label="Join now by contacting us"
            >
              Join Now
            </a>
          </div>
        </div>
      </nav>
    </header>
  );
}