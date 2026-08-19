/**
 * CEGS Core Application & Navigation Controller
 * Handles smooth routing, sticky header, mobile drawer, and dynamic service detail views.
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initRouter();
  initStickyHeader();
  renderDynamicServices();
  renderTestimonials();
  renderFaqs();
});

// Navigation & Mobile Drawer
function initNavigation() {
  const mobileToggle = document.getElementById('mobileToggle');
  const navMenu = document.getElementById('navMenu');

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      navMenu.classList.toggle('open');
      const isOpen = navMenu.classList.contains('open');
      mobileToggle.innerHTML = isOpen ? 
        '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>' : 
        '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>';
    });

    // Close mobile menu when a link is clicked
    document.querySelectorAll('.nav-link, .dropdown-item a').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        if (mobileToggle) {
          mobileToggle.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>';
        }
      });
    });
  }
}

// Sticky Header effect
function initStickyHeader() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });
}

// Multi-Page Hash Router with Dedicated View Switching & Sub-Services
function initRouter() {
  const PAGE_TITLES = {
    'home': 'CEGS | The Right Opportunity is Waiting for You — Careers, Staffing & Training',
    'about': 'About Us | CEGS - Strategic Human Resources & Enterprise Excellence',
    'services': 'Our Services & Practice Areas | CEGS Enterprise',
    'service-it-services': 'IT Services & Digital Engineering | CEGS Enterprise',
    'service-seo': 'Search Engine Optimization (SEO) Services | CEGS Enterprise',
    'service-hr-consulting': 'Strategic HR Consulting & Policy Architecture | CEGS',
    'service-staffing': 'Enterprise Staffing & Talent Augmentation | CEGS',
    'service-payroll': 'Payroll Management & Statutory Compliance | CEGS',
    'service-bpo': 'BPO / KPO & Inside Sales Revenue Engines | CEGS',
    'service-training': 'Corporate Training & Career Bootcamps | CEGS',
    'careers': 'Careers & Live Job Openings | CEGS Opportunity Hub',
    'hire-talent': 'Hire Top Talent in 48h | CEGS Enterprise Recruitment',
    'contact': 'Contact CEGS | Corporate Headquarters Bengaluru'
  };

  const ROUTE_ALIASES = {
    'it-services': 'service-it-services',
    'web-development': 'service-it-services',
    'service-web-development': 'service-it-services',
    'seo': 'service-seo',
    'seo-services': 'service-seo',
    'hr-consulting': 'service-hr-consulting',
    'staffing': 'service-staffing',
    'staffing-solutions': 'service-staffing',
    'service-staffing-solutions': 'service-staffing',
    'payroll': 'service-payroll',
    'payroll-management': 'service-payroll',
    'service-payroll-management': 'service-payroll',
    'bpo': 'service-bpo',
    'bpo-inside-sales': 'service-bpo',
    'service-bpo-inside-sales': 'service-bpo',
    'training': 'service-training',
    'training-courses': 'service-training',
    'service-training-courses': 'service-training'
  };

  function handleRoute() {
    let rawHash = window.location.hash || '#home';
    let cleanRoute = rawHash.replace(/^#\/?/, '').trim();

    // Check aliases
    if (ROUTE_ALIASES[cleanRoute]) {
      cleanRoute = ROUTE_ALIASES[cleanRoute];
    }

    // List of valid top-level and service page views
    const validRoutes = [
      'home', 'about', 'services', 
      'service-it-services', 'service-seo', 
      'service-hr-consulting', 'service-staffing', 
      'service-payroll', 'service-bpo', 'service-training', 
      'careers', 'hire-talent', 'contact'
    ];

    if (!validRoutes.includes(cleanRoute)) {
      cleanRoute = 'home';
    }

    // 1. Hide all page views and show only target page
    const pageViews = document.querySelectorAll('.page-view');
    pageViews.forEach(pv => pv.classList.remove('active-page'));

    const targetPageView = document.getElementById(`page-${cleanRoute}`);
    if (targetPageView) {
      targetPageView.classList.add('active-page');
    } else {
      const homePage = document.getElementById('page-home');
      if (homePage) homePage.classList.add('active-page');
    }

    // 2. Update active navbar state
    document.querySelectorAll('.nav-link').forEach(link => {
      const href = link.getAttribute('href');
      const linkRoute = href ? href.replace(/^#\/?/, '') : '';
      if (linkRoute === cleanRoute || (cleanRoute.startsWith('service-') && linkRoute === 'services')) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });

    // 3. Update Browser Title
    document.title = PAGE_TITLES[cleanRoute] || PAGE_TITLES['home'];

    // 4. Scroll smoothly to top of the new page
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }

  window.addEventListener('hashchange', handleRoute);
  
  // Initial load execution
  handleRoute();
}

// Render dynamic Services grid with icons and direct route linking
function renderDynamicServices() {
  const servicesContainer = document.getElementById('servicesList');
  const homeServicesContainer = document.getElementById('homeServicesList');

  const iconMap = {
    'users-gear': '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>',
    'user-check': '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><polyline points="16 11 18 13 22 9"></polyline></svg>',
    'calculator': '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="4" y="2" width="16" height="20" rx="2"></rect><line x1="8" y1="6" x2="16" y2="6"></line><line x1="16" y1="14" x2="16" y2="18"></line><path d="M16 10h.01"></path><path d="M12 10h.01"></path><path d="M8 10h.01"></path><path d="M12 14h.01"></path><path d="M8 14h.01"></path><path d="M12 18h.01"></path><path d="M8 18h.01"></path></svg>',
    'code': '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>',
    'headset': '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 18v-6a9 9 0 0 1 18 0v6"></path><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"></path></svg>',
    'graduation-cap': '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 10v6M2 10l10-5 10 5-10 5z"></path><path d="M6 12v5c3 3 9 3 12 0v-5"></path></svg>'
  };

  const generateServiceCards = (services) => services.map(svc => `
    <div class="service-card" id="service-${svc.id}">
      <span class="service-badge badge-${svc.color}">${svc.badge}</span>
      <div>
        <div class="service-icon-wrap service-icon-${svc.color}">
          ${iconMap[svc.icon] || ''}
        </div>
        <h3>${svc.title}</h3>
        <p>${svc.shortDescription}</p>
        <ul class="service-features">
          ${svc.highlights.map(h => `
            <li>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
              <span>${h}</span>
            </li>
          `).join('')}
        </ul>
      </div>
      <div class="service-footer">
        <span style="font-size: 0.8rem; font-weight: 600; color: #0d5e72;">${svc.fullContent.metrics}</span>
        <a href="#service-${svc.id}" class="btn btn-outline btn-sm">Explore Service &rarr;</a>
      </div>
    </div>
  `).join('');

  if (servicesContainer) {
    servicesContainer.innerHTML = generateServiceCards(CEGS_DATA.services);
  }

  if (homeServicesContainer) {
    homeServicesContainer.innerHTML = generateServiceCards(CEGS_DATA.services.slice(0, 3));
  }
}

// Service Detail Modal View (for quick triggers if requested)
window.openServiceDetailModal = function(serviceId) {
  const svc = CEGS_DATA.services.find(s => s.id === serviceId);
  if (!svc) return;

  const content = `
    <div style="margin-bottom: 1.5rem;">
      <span class="badge badge-teal" style="margin-bottom: 0.5rem;">${svc.badge}</span>
      <h2 style="font-size: 1.75rem; color: #0f1c2d; margin-bottom: 0.5rem;">${svc.title}</h2>
      <p style="font-size: 1rem; color: #475569; line-height: 1.6;">${svc.fullContent.overview}</p>
    </div>

    <div style="margin-bottom: 1.5rem;">
      <h4 style="margin-bottom: 0.75rem; color: #0f1c2d;">Key Deliverables & Execution</h4>
      <div style="display: flex; flex-direction: column; gap: 0.85rem;">
        ${svc.fullContent.deliverables.map(d => `
          <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 1rem;">
            <h5 style="color: #0f1c2d; font-size: 0.95rem; margin-bottom: 0.25rem;">${d.title}</h5>
            <p style="color: #64748b; font-size: 0.85rem; margin: 0;">${d.desc}</p>
          </div>
        `).join('')}
      </div>
    </div>

    <div style="display: flex; gap: 1rem; justify-content: flex-end; padding-top: 1.25rem; border-top: 1px solid #e2e8f0;">
      <button class="btn btn-outline" onclick="closeModal()">Close</button>
      <button class="btn btn-primary" onclick="closeModal(); openBookingModal();">Book Discovery Call</button>
    </div>
  `;

  openModal(content);
};

// Render Testimonials
function renderTestimonials() {
  const container = document.getElementById('testimonialsGrid');
  if (!container) return;

  container.innerHTML = CEGS_DATA.testimonials.map(t => `
    <div class="testimonial-card">
      <div>
        <div class="quote-stars">
          ${'★'.repeat(t.rating)}
        </div>
        <p class="testimonial-quote">"${t.quote}"</p>
      </div>
      <div class="testimonial-author">
        <div class="author-avatar">${t.avatar}</div>
        <div class="author-info">
          <h5>${t.author}</h5>
          <p>${t.role}</p>
        </div>
      </div>
    </div>
  `).join('');
}

// Render FAQs
function renderFaqs() {
  const container = document.getElementById('faqList');
  if (!container) return;

  container.innerHTML = CEGS_DATA.faqs.map((f, index) => `
    <div class="faq-item ${index === 0 ? 'active' : ''}">
      <button class="faq-question">
        <span>${f.q}</span>
        <div class="faq-icon">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"></polyline></svg>
        </div>
      </button>
      <div class="faq-answer">
        <p>${f.a}</p>
      </div>
    </div>
  `).join('');
}
