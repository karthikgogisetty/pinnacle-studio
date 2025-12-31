// Exact JavaScript from Arch-Canvas behavior
const progressBar = document.querySelector('.progress-bar');
const navbar = document.querySelector('.navbar');
const hamburger = document.querySelector('.hamburger');
const mobileMenu = document.querySelector('.mobile-menu');
const closeBtn = document.querySelector('.close-btn');
const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

// Initialize scroll effects
function initializeScrollEffects() {
  // Progress bar
  window.addEventListener('scroll', updateProgressBar);
  
  // Navbar scroll effect
  window.addEventListener('scroll', updateNavbar);
}

function updateProgressBar() {
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  const scrollProgress = (scrollTop / scrollHeight) * 100;
  progressBar.style.width = scrollProgress + '%';
}

function updateNavbar() {
  if (window.scrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
}

// Mobile menu functionality
function initializeMobileMenu() {
  hamburger.addEventListener('click', openMobileMenu);
  closeBtn.addEventListener('click', closeMobileMenu);
  
  // Close menu when clicking on links
  mobileNavLinks.forEach(link => {
    link.addEventListener('click', closeMobileMenu);
  });
  
  // Close menu when clicking outside
  mobileMenu.addEventListener('click', (e) => {
    if (e.target === mobileMenu) {
      closeMobileMenu();
    }
  });
}

function openMobileMenu() {
  mobileMenu.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeMobileMenu() {
  mobileMenu.classList.remove('active');
  document.body.style.overflow = '';
}

// Smooth scrolling for navigation links
function initializeSmoothScrolling() {
  const navLinks = document.querySelectorAll('a[href^="#"]');
  navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      
      // Only handle smooth scroll if target exists
      if (targetId === '#') {
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      } else {
        const targetSection = document.querySelector(targetId);
        if (targetSection) {
          const offsetTop = targetSection.offsetTop - 80; // Account for fixed navbar
          window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
          });
        }
      }
    });
  });
}

// Intersection Observer for project animations
function initializeAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, observerOptions);
  
  // Observe project cards
  const animateElements = document.querySelectorAll('.animate-in');
  animateElements.forEach(el => observer.observe(el));
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  initializeScrollEffects();
  initializeMobileMenu();
  initializeSmoothScrolling();
  initializeAnimations();
  
  // Initial states
  updateProgressBar();
  updateNavbar();
});

// Keyboard navigation
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
    closeMobileMenu();
  }
});

// Performance optimization - Debounce scroll events
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Apply debounce to scroll handlers for better performance
const debouncedScrollHandler = debounce(() => {
  updateProgressBar();
  updateNavbar();
}, 16); // ~60fps

window.addEventListener('scroll', debouncedScrollHandler);
