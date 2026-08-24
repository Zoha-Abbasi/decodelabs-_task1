

document.addEventListener('DOMContentLoaded', () => {
  
  setupMobileMenu();
  setupStickyNavbar();
  setupActiveNavigationHighlight();
  setupScrollReveal();
  setupStatisticsCounters();
  setupAppPreviewTabs();
  setupFaqAccordion();
  setupDarkMode();
  setupTiltEffect();
});


function setupMobileMenu() {
  const mobileToggle = document.getElementById('mobile-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (!mobileToggle || !navMenu) return;

  
  mobileToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    const isExpanded = mobileToggle.getAttribute('aria-expanded') === 'true';
    mobileToggle.setAttribute('aria-expanded', !isExpanded);
    navMenu.classList.toggle('open');
  });

  
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      mobileToggle.setAttribute('aria-expanded', 'false');
      navMenu.classList.remove('open');
    });
  });

  
  document.addEventListener('click', (e) => {
    const isClickInside = navMenu.contains(e.target) || mobileToggle.contains(e.target);
    if (!isClickInside && navMenu.classList.contains('open')) {
      mobileToggle.setAttribute('aria-expanded', 'false');
      navMenu.classList.remove('open');
    }
  });

  
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navMenu.classList.contains('open')) {
      mobileToggle.setAttribute('aria-expanded', 'false');
      navMenu.classList.remove('open');
      mobileToggle.focus();
    }
  });
}


function setupStickyNavbar() {
  const navbar = document.getElementById('navbar');
  const backToTop = document.getElementById('back-to-top');

  if (!navbar) return;

  const handleScroll = () => {
    const scrollY = window.scrollY;

    
    if (scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    
    if (backToTop) {
      if (scrollY > 500) {
        backToTop.classList.add('visible');
      } else {
        backToTop.classList.remove('visible');
      }
    }
  };

  
  handleScroll();
  window.addEventListener('scroll', handleScroll, { passive: true });

  
  if (backToTop) {
    backToTop.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }
}


function setupActiveNavigationHighlight() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  if (sections.length === 0 || navLinks.length === 0) return;

  const activeNavObserverOptions = {
    root: null,
    rootMargin: '-40% 0px -40% 0px', 
    threshold: 0
  };

  const activeNavObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }, activeNavObserverOptions);

  sections.forEach(section => activeNavObserver.observe(section));
}


function setupScrollReveal() {
  const revealElements = document.querySelectorAll('.scroll-reveal');

  if (revealElements.length === 0) return;

  const revealObserverOptions = {
    root: null,
    rootMargin: '0px 0px -80px 0px', 
    threshold: 0.1
  };

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        revealObserver.unobserve(entry.target); 
      }
    });
  }, revealObserverOptions);

  revealElements.forEach(element => revealObserver.observe(element));
}


function setupStatisticsCounters() {
  const counterElements = document.querySelectorAll('.stat-number');

  if (counterElements.length === 0) return;

  const counterObserverOptions = {
    root: null,
    rootMargin: '0px 0px -50px 0px',
    threshold: 0.5
  };

  const counterObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const counter = entry.target;
        const targetValue = parseFloat(counter.getAttribute('data-target'));
        const isDecimal = counter.getAttribute('data-decimal') === 'true';
        const duration = 2000; 
        const startTime = performance.now();

        const countUp = (currentTime) => {
          const elapsedTime = currentTime - startTime;
          const progress = Math.min(elapsedTime / duration, 1);

          
          const easedProgress = progress * (2 - progress);
          const currentValue = easedProgress * targetValue;

          if (isDecimal) {
            counter.textContent = currentValue.toFixed(1);
          } else {
            counter.textContent = Math.floor(currentValue);
          }

          if (progress < 1) {
            requestAnimationFrame(countUp);
          } else {
            
            counter.textContent = targetValue;
          }
        };

        requestAnimationFrame(countUp);
        observer.unobserve(counter); 
      }
    });
  }, counterObserverOptions);

  counterElements.forEach(counter => counterObserver.observe(counter));
}


function setupAppPreviewTabs() {
  const tabs = document.querySelectorAll('.preview-tab');
  const screens = document.querySelectorAll('.preview-screen');

  if (tabs.length === 0 || screens.length === 0) return;

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const selectedScreen = tab.getAttribute('data-screen');

      
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      
      screens.forEach(screen => {
        if (screen.id === `screen-${selectedScreen}`) {
          screen.classList.add('active');
        } else {
          screen.classList.remove('active');
        }
      });
    });
  });
}


function setupFaqAccordion() {
  const triggers = document.querySelectorAll('.faq-trigger');

  if (triggers.length === 0) return;

  triggers.forEach(trigger => {
    trigger.addEventListener('click', () => {
      const currentItem = trigger.closest('.faq-item');
      const content = currentItem.querySelector('.faq-content');
      const isCurrentlyExpanded = trigger.getAttribute('aria-expanded') === 'true';

      
      document.querySelectorAll('.faq-item').forEach(item => {
        if (item !== currentItem && item.classList.contains('active')) {
          item.classList.remove('active');
          const otherTrigger = item.querySelector('.faq-trigger');
          const otherContent = item.querySelector('.faq-content');
          
          otherTrigger.setAttribute('aria-expanded', 'false');
          otherContent.setAttribute('aria-hidden', 'true');
          otherContent.style.maxHeight = null;
        }
      });

      
      if (isCurrentlyExpanded) {
        currentItem.classList.remove('active');
        trigger.setAttribute('aria-expanded', 'false');
        content.setAttribute('aria-hidden', 'true');
        content.style.maxHeight = null;
      } else {
        currentItem.classList.add('active');
        trigger.setAttribute('aria-expanded', 'true');
        content.setAttribute('aria-hidden', 'false');
        
        content.style.maxHeight = content.scrollHeight + 'px';
      }
    });
  });
}

/**
 * 8. Dark Mode Toggle
 */
function setupDarkMode() {
  const themeToggle = document.getElementById('theme-toggle');
  const sunIcon = themeToggle?.querySelector('.sun-icon');
  const moonIcon = themeToggle?.querySelector('.moon-icon');
  
  if (!themeToggle) return;

  // Check saved theme or system preference
  const savedTheme = localStorage.getItem('bloom_theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
    document.documentElement.setAttribute('data-theme', 'dark');
    if (sunIcon) sunIcon.style.display = 'none';
    if (moonIcon) moonIcon.style.display = 'block';
  }

  themeToggle.addEventListener('click', () => {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    
    if (isDark) {
      document.documentElement.removeAttribute('data-theme');
      localStorage.setItem('bloom_theme', 'light');
      if (sunIcon) sunIcon.style.display = 'block';
      if (moonIcon) moonIcon.style.display = 'none';
    } else {
      document.documentElement.setAttribute('data-theme', 'dark');
      localStorage.setItem('bloom_theme', 'dark');
      if (sunIcon) sunIcon.style.display = 'none';
      if (moonIcon) moonIcon.style.display = 'block';
    }
  });
}

/**
 * 9. 3D Tilt Hover Effect for Pricing and Feature Cards
 */
function setupTiltEffect() {
  const tiltElements = document.querySelectorAll('.pricing-card, .feature-card, .plant-card');
  
  tiltElements.forEach(element => {
    element.classList.add('tilt-effect');
    
    element.addEventListener('mousemove', (e) => {
      // Only apply on desktop
      if (window.innerWidth < 768) return;
      
      const rect = element.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotateX = ((y - centerY) / centerY) * -5; // Max 5 deg
      const rotateY = ((x - centerX) / centerX) * 5;  // Max 5 deg
      
      element.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    });
    
    element.addEventListener('mouseleave', () => {
      // Use standard scale for premium card if applicable
      if (element.classList.contains('premium') && window.innerWidth >= 768) {
        element.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1.05, 1.05, 1.05)';
      } else {
        element.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
      }
    });
  });
}

