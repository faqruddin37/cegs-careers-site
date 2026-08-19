/**
 * CEGS Interactive Logic & User Flows
 * Matches authentic recruiter interactions and HRMS styling
 */

document.addEventListener('DOMContentLoaded', () => {
  initJobBoard();
  initIntentSelector();
  initFaqAccordion();
  initEmployerForm();
  initModals();
  initCostCalculator();
  initCalendarBooking();
  initAutoLeadPopups();
});

// Toast notification helper
function showToast(message, type = 'success') {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
    <span>${message}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

// 1. "What service do you require?" Intent Selector Logic (Reference Image Match)
function initIntentSelector() {
  const intentButtons = document.querySelectorAll('.intent-option-btn');
  intentButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const targetHash = btn.getAttribute('data-target');
      
      if (targetHash === '#hire-talent') {
        openCompanyHiringWizard();
      } else if (targetHash === '#careers') {
        openCandidateJobWizard();
      } else if (targetHash === '#services' || targetHash === '#consultants') {
        openConsultantClientWizard();
      }
    });
  });
}

// Global state for Company Hiring Wizard
let wizardState = {
  step: 1,
  totalSteps: 4,
  location: "Bangalore",
  industry: "IT",
  companyName: "",
  email: "",
  headcount: "Only 1",
  contactName: "",
  mobileNumber: "",
  whatsappUpdates: true
};

const WIZARD_LOCATIONS = ["Bangalore", "Pune", "Hyderabad", "Mumbai", "Delhi-NCR", "Chennai", "Remote"];

const WIZARD_INDUSTRIES = [
  "IT",
  "Mechanical engineer",
  "BPO & Call Centre",
  "Finance/Accounting",
  "Sales & Marketing",
  "Human Resources / Operations"
];

const WIZARD_HEADCOUNTS = [
  "Only 1",
  "2 - 10",
  "11 - 20",
  "21 - 50",
  "51 - 100",
  "More than 100"
];

window.openCompanyHiringWizard = function(step = 1) {
  wizardState.step = step;
  renderWizardModal();
};

window.wizardGoBack = function() {
  if (wizardState.step > 1) {
    wizardState.step--;
    renderWizardModal();
  } else {
    closeModal();
  }
};

window.wizardSelectLocation = function(loc) {
  wizardState.location = loc;
  renderWizardModal();
};

window.wizardSelectIndustry = function(ind) {
  wizardState.industry = ind;
  const btns = document.querySelectorAll('.wizard-choice-btn');
  btns.forEach(b => {
    if (b.getAttribute('data-val') === ind) {
      b.classList.add('selected');
    } else {
      b.classList.remove('selected');
    }
  });
};

window.wizardSelectHeadcount = function(hc) {
  wizardState.headcount = hc;
  const btns = document.querySelectorAll('.wizard-choice-btn');
  btns.forEach(b => {
    if (b.getAttribute('data-val') === hc) {
      b.classList.add('selected');
    } else {
      b.classList.remove('selected');
    }
  });
};

window.clearError = function(input) {
  input.classList.remove('has-error');
  const errorMsg = input.parentElement.querySelector('.wizard-error-msg');
  if (errorMsg) errorMsg.classList.remove('visible');
};

window.handleWizardFinalSubmit = function(e) {
  e.preventDefault();
  const nameInput = document.getElementById('wizardNameInput');
  const phoneInput = document.getElementById('wizardPhoneInput');

  let hasError = false;
  if (!nameInput || !nameInput.value.trim()) {
    if (nameInput) {
      nameInput.classList.add('has-error');
      const err = document.getElementById('nameErrorMsg');
      if (err) err.classList.add('visible');
    }
    hasError = true;
  }

  if (!phoneInput || !phoneInput.value.trim() || phoneInput.value.trim().length < 8) {
    if (phoneInput) {
      phoneInput.classList.add('has-error');
      const err = document.getElementById('phoneErrorMsg');
      if (err) err.classList.add('visible');
    }
    hasError = true;
  }

  if (hasError) return;

  wizardState.contactName = nameInput.value.trim();
  wizardState.mobileNumber = phoneInput.value.trim();

  closeModal();
  showToast(`Requirement submitted! Verified placement consultancies in ${wizardState.location} will connect with ${wizardState.contactName} within 2 hours.`);
};

window.wizardNextStep = function() {
  // Capture current step inputs
  if (wizardState.step === 2) {
    const input = document.getElementById('wizardCompanyInput');
    if (input) {
      const val = input.value.trim();
      if (!val) {
        input.focus();
        input.style.borderColor = '#ef4444';
        return;
      }
      wizardState.companyName = val;
    }
  } else if (wizardState.step === 3) {
    const input = document.getElementById('wizardEmailInput');
    if (input) {
      const val = input.value.trim();
      if (!val || !val.includes('@')) {
        input.focus();
        input.style.borderColor = '#ef4444';
        return;
      }
      wizardState.email = val;
    }
  }

  if (wizardState.step <= wizardState.totalSteps) {
    wizardState.step++;
    renderWizardModal();
  }
};

function renderWizardModal() {
  const step = wizardState.step;
  const progressPercent = Math.min((step / wizardState.totalSteps) * 100, 100);

  let bodyContent = '';

  if (step === 1) {
    bodyContent = `
      <h2 class="wizard-heading">Which industry you are hiring candidates for?</h2>
      <div class="wizard-options-list">
        ${WIZARD_INDUSTRIES.map(ind => `
          <button type="button" class="wizard-choice-btn ${wizardState.industry === ind ? 'selected' : ''}" data-val="${ind}" onclick="wizardSelectIndustry('${ind}')">
            <span>${ind}</span>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"></polyline></svg>
          </button>
        `).join('')}
      </div>
      <button type="button" class="wizard-next-action-btn" onclick="wizardNextStep()">Next</button>
    `;
  } else if (step === 2) {
    bodyContent = `
      <h2 class="wizard-heading">What is your company name?</h2>
      <form onsubmit="event.preventDefault(); wizardNextStep();">
        <input type="text" id="wizardCompanyInput" class="wizard-input-field" placeholder="Enter Company name *" value="${wizardState.companyName}" autofocus required />
        <button type="submit" class="wizard-next-action-btn">Next</button>
      </form>
    `;
  } else if (step === 3) {
    bodyContent = `
      <h2 class="wizard-heading">Please enter your company E-mail Id</h2>
      <form onsubmit="event.preventDefault(); wizardNextStep();">
        <input type="email" id="wizardEmailInput" class="wizard-input-field" placeholder="Enter Company email ID? *" value="${wizardState.email}" autofocus required />
        <button type="submit" class="wizard-next-action-btn">Next</button>
      </form>
    `;
  } else if (step === 4) {
    bodyContent = `
      <h2 class="wizard-heading">How many candidates are you looking to hire?</h2>
      <div class="wizard-options-list">
        ${WIZARD_HEADCOUNTS.map(hc => `
          <button type="button" class="wizard-choice-btn ${wizardState.headcount === hc ? 'selected' : ''}" data-val="${hc}" onclick="wizardSelectHeadcount('${hc}')">
            <span>${hc}</span>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"></polyline></svg>
          </button>
        `).join('')}
      </div>
      <button type="button" class="wizard-next-action-btn" onclick="wizardNextStep()">Next</button>
    `;
  } else if (step >= 5) {
    // Step 5: Final Contact / Quotes Form
    bodyContent = `
      <h2 class="wizard-heading" style="font-size: 1.25rem; line-height: 1.35; margin-bottom: 1.15rem;">Fill this form and Get Quotes from Corporate Placement Consultancies in ${wizardState.location}</h2>
      
      <form id="wizardFinalForm" onsubmit="handleWizardFinalSubmit(event)">
        <div class="wizard-input-wrap-relative">
          <label class="wizard-floating-label">Enter your name *</label>
          <input type="text" id="wizardNameInput" placeholder=" " value="${wizardState.contactName || ''}" required oninput="clearError(this)" />
          <span class="wizard-field-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
          </span>
          <div id="nameErrorMsg" class="wizard-error-msg">Name is required</div>
        </div>

        <div class="wizard-input-wrap-relative" style="margin-top: 1.15rem;">
          <input type="tel" id="wizardPhoneInput" placeholder="Enter mobile number *" value="${wizardState.mobileNumber || ''}" required oninput="clearError(this)" />
          <span class="wizard-field-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
          </span>
          <div id="phoneErrorMsg" class="wizard-error-msg">Valid mobile number is required</div>
        </div>

        <div class="wizard-privacy-note">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
          <span>Your number is secure as per our privacy policy</span>
        </div>

        <label class="wizard-checkbox-wrap">
          <input type="checkbox" id="wizardWhatsappCheck" checked />
          <span>Receive updates on <span style="color:#25d366; font-weight:700;">💬 WhatsApp / RCS</span></span>
        </label>

        <div class="wizard-trust-strip">
          <div class="wizard-trust-item">
            <span class="wizard-trust-icon" style="color: #0bb379;">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"></circle><path d="M8 14s1.5 2 4 2 4-2 4-2"></path><line x1="9" y1="9" x2="9.01" y2="9"></line><line x1="15" y1="9" x2="15.01" y2="9"></line></svg>
            </span>
            <strong>1 Lac+</strong>
            <span>Happy Users</span>
          </div>
          <div class="wizard-trust-item">
            <span class="wizard-trust-icon" style="color: #0bb379;">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path><polyline points="9 12 11 14 15 10"></polyline></svg>
            </span>
            <strong>100%</strong>
            <span>Verified Experts</span>
          </div>
          <div class="wizard-trust-item">
            <span class="wizard-trust-icon" style="color: #10b981;">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
            </span>
            <strong>4.8 <span style="color:#f59e0b;">★</span></strong>
            <span>from 1.2 L+ users</span>
          </div>
        </div>

        <button type="submit" class="wizard-next-action-btn" style="margin-top: 1rem;">Submit</button>
      </form>
    `;
  }

  const html = `
    <div class="wizard-modal-box">
      <!-- Top Nav Bar -->
      <div class="wizard-nav-top">
        <button type="button" class="wizard-back-btn ${step === 1 ? 'disabled' : ''}" onclick="wizardGoBack()" aria-label="Go Back">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
        </button>

        <!-- Location Dropdown Pill -->
        <div class="wizard-location-pill">
          <svg class="pin-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
          <span>${wizardState.location}</span>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"></polyline></svg>
          <select class="wizard-location-select" onchange="wizardSelectLocation(this.value)">
            ${WIZARD_LOCATIONS.map(l => `<option value="${l}" ${l === wizardState.location ? 'selected' : ''}>${l}</option>`).join('')}
          </select>
        </div>

        <button type="button" class="wizard-close-btn" onclick="closeModal()" aria-label="Close">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>
      </div>

      ${step <= 4 ? `
        <!-- Progress Line & Step Number -->
        <div class="wizard-progress-track">
          <div class="wizard-progress-bar-bg">
            <div class="wizard-progress-bar-fill" style="width: ${progressPercent}%;"></div>
          </div>
          <span class="wizard-step-indicator">Step ${step} of ${wizardState.totalSteps}</span>
        </div>
      ` : ''}

      <!-- Step Content -->
      <div class="wizard-step-body">
        ${bodyContent}
      </div>
    </div>
  `;

  openModal(html);
}

// ==========================================================================
// Candidate / Individual Job Seeker Wizard (Reference Images 1-5 Match)
// ==========================================================================
let candidateWizardState = {
  step: 1,
  totalSteps: 2,
  location: "Bangalore",
  industry: "IT",
  experience: "Fresher",
  contactName: "",
  mobileNumber: "",
  whatsappUpdates: true
};

const CANDIDATE_INDUSTRIES = [
  "IT",
  "Mechanical engineer",
  "BPO & Call Centre",
  "Finance/Accounting",
  "Banking",
  "Sales & Marketing",
  "Human Resources"
];

const CANDIDATE_EXPERIENCES = [
  "Fresher",
  "0 - 1",
  "2 - 3",
  "4 - 5",
  "Above 5"
];

window.openCandidateJobWizard = function(step = 1) {
  candidateWizardState.step = step;
  renderCandidateWizardModal();
};

window.candidateWizardGoBack = function() {
  if (candidateWizardState.step > 1) {
    candidateWizardState.step--;
    renderCandidateWizardModal();
  } else {
    closeModal();
  }
};

window.candidateWizardSelectLocation = function(loc) {
  candidateWizardState.location = loc;
  renderCandidateWizardModal();
};

window.candidateWizardSelectIndustry = function(ind) {
  candidateWizardState.industry = ind;
  const btns = document.querySelectorAll('.wizard-choice-btn');
  btns.forEach(b => {
    if (b.getAttribute('data-val') === ind) {
      b.classList.add('selected');
    } else {
      b.classList.remove('selected');
    }
  });
};

window.candidateWizardSelectExperience = function(exp) {
  candidateWizardState.experience = exp;
  const btns = document.querySelectorAll('.wizard-choice-btn');
  btns.forEach(b => {
    if (b.getAttribute('data-val') === exp) {
      b.classList.add('selected');
    } else {
      b.classList.remove('selected');
    }
  });
};

window.candidateWizardNextStep = function() {
  if (candidateWizardState.step <= candidateWizardState.totalSteps) {
    candidateWizardState.step++;
    renderCandidateWizardModal();
  }
};

window.handleCandidateFinalSubmit = function(e) {
  e.preventDefault();
  const nameInput = document.getElementById('candidateNameInput');
  const phoneInput = document.getElementById('candidatePhoneInput');

  let hasError = false;
  if (!nameInput || !nameInput.value.trim()) {
    if (nameInput) {
      nameInput.classList.add('has-error');
      const err = document.getElementById('candidateNameErrorMsg');
      if (err) err.classList.add('visible');
    }
    hasError = true;
  }

  if (!phoneInput || !phoneInput.value.trim() || phoneInput.value.trim().length < 8) {
    if (phoneInput) {
      phoneInput.classList.add('has-error');
      const err = document.getElementById('candidatePhoneErrorMsg');
      if (err) err.classList.add('visible');
    }
    hasError = true;
  }

  if (hasError) return;

  candidateWizardState.contactName = nameInput.value.trim();
  candidateWizardState.mobileNumber = phoneInput.value.trim();

  closeModal();
  showToast(`Profile registered successfully! Top placement consultancies in ${candidateWizardState.location} for ${candidateWizardState.industry} (${candidateWizardState.experience}) will connect with ${candidateWizardState.contactName} shortly.`);
};

function renderCandidateWizardModal() {
  const step = candidateWizardState.step;
  const progressPercent = Math.min((step / candidateWizardState.totalSteps) * 100, 100);

  let bodyContent = '';

  if (step === 1) {
    bodyContent = `
      <h2 class="wizard-heading">Which industry you are looking for job?</h2>
      <div class="wizard-options-list">
        ${CANDIDATE_INDUSTRIES.map(ind => `
          <button type="button" class="wizard-choice-btn ${candidateWizardState.industry === ind ? 'selected' : ''}" data-val="${ind}" onclick="candidateWizardSelectIndustry('${ind}')">
            <span>${ind}</span>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"></polyline></svg>
          </button>
        `).join('')}
      </div>
      <button type="button" class="wizard-next-action-btn" onclick="candidateWizardNextStep()">Next</button>
    `;
  } else if (step === 2) {
    bodyContent = `
      <h2 class="wizard-heading">How many years of experience do you have?</h2>
      <div class="wizard-options-list">
        ${CANDIDATE_EXPERIENCES.map(exp => `
          <button type="button" class="wizard-choice-btn ${candidateWizardState.experience === exp ? 'selected' : ''}" data-val="${exp}" onclick="candidateWizardSelectExperience('${exp}')">
            <span>${exp}</span>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"></polyline></svg>
          </button>
        `).join('')}
      </div>
      <button type="button" class="wizard-next-action-btn" onclick="candidateWizardNextStep()">Next</button>
    `;
  } else if (step >= 3) {
    // Step 3: Final Contact & Quotes Form
    bodyContent = `
      <h2 class="wizard-heading" style="font-size: 1.25rem; line-height: 1.35; margin-bottom: 1.15rem;">Fill this form and Get Quotes from Corporate Placement Consultancies in ${candidateWizardState.location}</h2>
      
      <form id="candidateFinalForm" onsubmit="handleCandidateFinalSubmit(event)">
        <div class="wizard-input-wrap-relative">
          <label class="wizard-floating-label">Enter your name *</label>
          <input type="text" id="candidateNameInput" placeholder=" " value="${candidateWizardState.contactName || ''}" required oninput="clearError(this)" />
          <span class="wizard-field-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
          </span>
          <div id="candidateNameErrorMsg" class="wizard-error-msg">Name is required</div>
        </div>

        <div class="wizard-input-wrap-relative" style="margin-top: 1.15rem;">
          <input type="tel" id="candidatePhoneInput" placeholder="Enter mobile number *" value="${candidateWizardState.mobileNumber || ''}" required oninput="clearError(this)" />
          <span class="wizard-field-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
          </span>
          <div id="candidatePhoneErrorMsg" class="wizard-error-msg">Valid mobile number is required</div>
        </div>

        <div class="wizard-privacy-note">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
          <span>Your number is secure as per our privacy policy</span>
        </div>

        <label class="wizard-checkbox-wrap">
          <input type="checkbox" id="candidateWhatsappCheck" checked />
          <span>Receive updates on <span style="color:#25d366; font-weight:700;">💬 WhatsApp / RCS</span></span>
        </label>

        <div class="wizard-trust-strip">
          <div class="wizard-trust-item">
            <span class="wizard-trust-icon" style="color: #0bb379;">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"></circle><path d="M8 14s1.5 2 4 2 4-2 4-2"></path><line x1="9" y1="9" x2="9.01" y2="9"></line><line x1="15" y1="9" x2="15.01" y2="9"></line></svg>
            </span>
            <strong>1 Lac+</strong>
            <span>Happy Users</span>
          </div>
          <div class="wizard-trust-item">
            <span class="wizard-trust-icon" style="color: #0bb379;">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path><polyline points="9 12 11 14 15 10"></polyline></svg>
            </span>
            <strong>100%</strong>
            <span>Verified Experts</span>
          </div>
          <div class="wizard-trust-item">
            <span class="wizard-trust-icon" style="color: #10b981;">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
            </span>
            <strong>4.8 <span style="color:#f59e0b;">★</span></strong>
            <span>from 1.2 L+ users</span>
          </div>
        </div>

        <button type="submit" class="wizard-next-action-btn" style="margin-top: 1rem;">Submit</button>
      </form>
    `;
  }

  const html = `
    <div class="wizard-modal-box">
      <!-- Top Nav Bar -->
      <div class="wizard-nav-top">
        <button type="button" class="wizard-back-btn ${step === 1 ? 'disabled' : ''}" onclick="candidateWizardGoBack()" aria-label="Go Back">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
        </button>

        <!-- Location Dropdown Pill -->
        <div class="wizard-location-pill">
          <svg class="pin-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
          <span>${candidateWizardState.location}</span>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"></polyline></svg>
          <select class="wizard-location-select" onchange="candidateWizardSelectLocation(this.value)">
            ${WIZARD_LOCATIONS.map(l => `<option value="${l}" ${l === candidateWizardState.location ? 'selected' : ''}>${l}</option>`).join('')}
          </select>
        </div>

        <button type="button" class="wizard-close-btn" onclick="closeModal()" aria-label="Close">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>
      </div>

      ${step <= 2 ? `
        <!-- Progress Line & Step Number -->
        <div class="wizard-progress-track">
          <div class="wizard-progress-bar-bg">
            <div class="wizard-progress-bar-fill" style="width: ${progressPercent}%;"></div>
          </div>
          <span class="wizard-step-indicator">Step ${step} of ${candidateWizardState.totalSteps}</span>
        </div>
      ` : ''}

      <!-- Step Content -->
      <div class="wizard-step-body">
        ${bodyContent}
      </div>
    </div>
  `;

  openModal(html);
}

// ==========================================================================
// Consultant / Corporate Client Matchmaking Wizard (Reference Match)
// ==========================================================================
let consultantWizardState = {
  step: 1,
  totalSteps: 4,
  location: "Bangalore",
  industry: "IT",
  companyName: "",
  email: "",
  headcount: "Only 1",
  contactName: "",
  mobileNumber: "",
  whatsappUpdates: true
};

window.openConsultantClientWizard = function(step = 1) {
  consultantWizardState.step = step;
  renderConsultantWizardModal();
};

window.consultantWizardGoBack = function() {
  if (consultantWizardState.step > 1) {
    consultantWizardState.step--;
    renderConsultantWizardModal();
  } else {
    closeModal();
  }
};

window.consultantWizardSelectLocation = function(loc) {
  consultantWizardState.location = loc;
  renderConsultantWizardModal();
};

window.consultantWizardSelectIndustry = function(ind) {
  consultantWizardState.industry = ind;
  const btns = document.querySelectorAll('.wizard-choice-btn');
  btns.forEach(b => {
    if (b.getAttribute('data-val') === ind) {
      b.classList.add('selected');
    } else {
      b.classList.remove('selected');
    }
  });
};

window.consultantWizardSelectHeadcount = function(hc) {
  consultantWizardState.headcount = hc;
  const btns = document.querySelectorAll('.wizard-choice-btn');
  btns.forEach(b => {
    if (b.getAttribute('data-val') === hc) {
      b.classList.add('selected');
    } else {
      b.classList.remove('selected');
    }
  });
};

window.consultantWizardNextStep = function() {
  if (consultantWizardState.step === 2) {
    const input = document.getElementById('consultantCompanyInput');
    if (input) {
      const val = input.value.trim();
      if (!val) {
        input.focus();
        input.style.borderColor = '#ef4444';
        return;
      }
      consultantWizardState.companyName = val;
    }
  } else if (consultantWizardState.step === 3) {
    const input = document.getElementById('consultantEmailInput');
    if (input) {
      const val = input.value.trim();
      if (!val || !val.includes('@')) {
        input.focus();
        input.style.borderColor = '#ef4444';
        return;
      }
      consultantWizardState.email = val;
    }
  }

  if (consultantWizardState.step <= consultantWizardState.totalSteps) {
    consultantWizardState.step++;
    renderConsultantWizardModal();
  }
};

window.handleConsultantFinalSubmit = function(e) {
  e.preventDefault();
  const nameInput = document.getElementById('consultantNameInput');
  const phoneInput = document.getElementById('consultantPhoneInput');

  let hasError = false;
  if (!nameInput || !nameInput.value.trim()) {
    if (nameInput) {
      nameInput.classList.add('has-error');
      const err = document.getElementById('consultantNameErrorMsg');
      if (err) err.classList.add('visible');
    }
    hasError = true;
  }

  if (!phoneInput || !phoneInput.value.trim() || phoneInput.value.trim().length < 8) {
    if (phoneInput) {
      phoneInput.classList.add('has-error');
      const err = document.getElementById('consultantPhoneErrorMsg');
      if (err) err.classList.add('visible');
    }
    hasError = true;
  }

  if (hasError) return;

  consultantWizardState.contactName = nameInput.value.trim();
  consultantWizardState.mobileNumber = phoneInput.value.trim();

  closeModal();
  showToast(`Requisition received! Corporate client matchmaking team in ${consultantWizardState.location} for ${consultantWizardState.industry} will connect with ${consultantWizardState.contactName} shortly.`);
};

function renderConsultantWizardModal() {
  const step = consultantWizardState.step;
  const progressPercent = Math.min((step / consultantWizardState.totalSteps) * 100, 100);

  let bodyContent = '';

  if (step === 1) {
    bodyContent = `
      <h2 class="wizard-heading">Which industry you are hiring candidates for?</h2>
      <div class="wizard-options-list">
        ${WIZARD_INDUSTRIES.map(ind => `
          <button type="button" class="wizard-choice-btn ${consultantWizardState.industry === ind ? 'selected' : ''}" data-val="${ind}" onclick="consultantWizardSelectIndustry('${ind}')">
            <span>${ind}</span>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"></polyline></svg>
          </button>
        `).join('')}
      </div>
      <button type="button" class="wizard-next-action-btn" onclick="consultantWizardNextStep()">Next</button>
    `;
  } else if (step === 2) {
    bodyContent = `
      <h2 class="wizard-heading">What is your company name?</h2>
      <form onsubmit="event.preventDefault(); consultantWizardNextStep();">
        <input type="text" id="consultantCompanyInput" class="wizard-input-field" placeholder="Enter Company name *" value="${consultantWizardState.companyName}" autofocus required />
        <button type="submit" class="wizard-next-action-btn">Next</button>
      </form>
    `;
  } else if (step === 3) {
    bodyContent = `
      <h2 class="wizard-heading">Please enter your company E-mail Id</h2>
      <form onsubmit="event.preventDefault(); consultantWizardNextStep();">
        <input type="email" id="consultantEmailInput" class="wizard-input-field" placeholder="Enter Company email ID? *" value="${consultantWizardState.email}" autofocus required />
        <button type="submit" class="wizard-next-action-btn">Next</button>
      </form>
    `;
  } else if (step === 4) {
    bodyContent = `
      <h2 class="wizard-heading">How many candidates are you looking to hire?</h2>
      <div class="wizard-options-list">
        ${WIZARD_HEADCOUNTS.map(hc => `
          <button type="button" class="wizard-choice-btn ${consultantWizardState.headcount === hc ? 'selected' : ''}" data-val="${hc}" onclick="consultantWizardSelectHeadcount('${hc}')">
            <span>${hc}</span>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"></polyline></svg>
          </button>
        `).join('')}
      </div>
      <button type="button" class="wizard-next-action-btn" onclick="consultantWizardNextStep()">Next</button>
    `;
  } else if (step >= 5) {
    // Step 5: Final Contact & Quotes Form
    bodyContent = `
      <h2 class="wizard-heading" style="font-size: 1.25rem; line-height: 1.35; margin-bottom: 1.15rem;">Fill this form and Get Quotes from Corporate Placement Consultancies in ${consultantWizardState.location}</h2>
      
      <form id="consultantFinalForm" onsubmit="handleConsultantFinalSubmit(event)">
        <div class="wizard-input-wrap-relative">
          <label class="wizard-floating-label">Enter your name *</label>
          <input type="text" id="consultantNameInput" placeholder=" " value="${consultantWizardState.contactName || ''}" required oninput="clearError(this)" />
          <span class="wizard-field-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
          </span>
          <div id="consultantNameErrorMsg" class="wizard-error-msg">Name is required</div>
        </div>

        <div class="wizard-input-wrap-relative" style="margin-top: 1.15rem;">
          <input type="tel" id="consultantPhoneInput" placeholder="Enter mobile number *" value="${consultantWizardState.mobileNumber || ''}" required oninput="clearError(this)" />
          <span class="wizard-field-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
          </span>
          <div id="consultantPhoneErrorMsg" class="wizard-error-msg">Valid mobile number is required</div>
        </div>

        <div class="wizard-privacy-note">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
          <span>Your number is secure as per our privacy policy</span>
        </div>

        <label class="wizard-checkbox-wrap">
          <input type="checkbox" id="consultantWhatsappCheck" checked />
          <span>Receive updates on <span style="color:#25d366; font-weight:700;">💬 WhatsApp / RCS</span></span>
        </label>

        <div class="wizard-trust-strip">
          <div class="wizard-trust-item">
            <span class="wizard-trust-icon" style="color: #0bb379;">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"></circle><path d="M8 14s1.5 2 4 2 4-2 4-2"></path><line x1="9" y1="9" x2="9.01" y2="9"></line><line x1="15" y1="9" x2="15.01" y2="9"></line></svg>
            </span>
            <strong>1 Lac+</strong>
            <span>Happy Users</span>
          </div>
          <div class="wizard-trust-item">
            <span class="wizard-trust-icon" style="color: #0bb379;">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path><polyline points="9 12 11 14 15 10"></polyline></svg>
            </span>
            <strong>100%</strong>
            <span>Verified Experts</span>
          </div>
          <div class="wizard-trust-item">
            <span class="wizard-trust-icon" style="color: #10b981;">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
            </span>
            <strong>4.8 <span style="color:#f59e0b;">★</span></strong>
            <span>from 1.2 L+ users</span>
          </div>
        </div>

        <button type="submit" class="wizard-next-action-btn" style="margin-top: 1rem;">Submit</button>
      </form>
    `;
  }

  const html = `
    <div class="wizard-modal-box">
      <!-- Top Nav Bar -->
      <div class="wizard-nav-top">
        <button type="button" class="wizard-back-btn ${step === 1 ? 'disabled' : ''}" onclick="consultantWizardGoBack()" aria-label="Go Back">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
        </button>

        <!-- Location Dropdown Pill -->
        <div class="wizard-location-pill">
          <svg class="pin-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
          <span>${consultantWizardState.location}</span>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"></polyline></svg>
          <select class="wizard-location-select" onchange="consultantWizardSelectLocation(this.value)">
            ${WIZARD_LOCATIONS.map(l => `<option value="${l}" ${l === consultantWizardState.location ? 'selected' : ''}>${l}</option>`).join('')}
          </select>
        </div>

        <button type="button" class="wizard-close-btn" onclick="closeModal()" aria-label="Close">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>
      </div>

      ${step <= 4 ? `
        <!-- Progress Line & Step Number -->
        <div class="wizard-progress-track">
          <div class="wizard-progress-bar-bg">
            <div class="wizard-progress-bar-fill" style="width: ${progressPercent}%;"></div>
          </div>
          <span class="wizard-step-indicator">Step ${step} of ${consultantWizardState.totalSteps}</span>
        </div>
      ` : ''}

      <!-- Step Content -->
      <div class="wizard-step-body">
        ${bodyContent}
      </div>
    </div>
  `;

  openModal(html);
}

// 2. Dynamic Live Job Board with Search & Filter
let currentJobCategory = 'all';
let currentSearchQuery = '';

function initJobBoard() {
  const jobsGrid = document.getElementById('jobsGrid');
  if (!jobsGrid) return;

  renderJobs();

  // Search input
  const searchInput = document.getElementById('jobSearchInput');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      currentSearchQuery = e.target.value.toLowerCase().trim();
      renderJobs();
    });
  }

  // Category filter pills
  const catPills = document.querySelectorAll('.cat-pill');
  catPills.forEach(pill => {
    pill.addEventListener('click', () => {
      catPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      currentJobCategory = pill.getAttribute('data-category');
      renderJobs();
    });
  });
}

function renderJobs() {
  const jobsGrid = document.getElementById('jobsGrid');
  if (!jobsGrid) return;

  const filtered = CEGS_DATA.liveJobs.filter(job => {
    const matchesCategory = (currentJobCategory === 'all') || 
      (job.department.toLowerCase().includes(currentJobCategory.toLowerCase()));
    
    const matchesSearch = !currentSearchQuery || 
      job.title.toLowerCase().includes(currentSearchQuery) ||
      job.description.toLowerCase().includes(currentSearchQuery) ||
      job.tags.some(t => t.toLowerCase().includes(currentSearchQuery));

    return matchesCategory && matchesSearch;
  });

  if (filtered.length === 0) {
    jobsGrid.innerHTML = `
      <div style="grid-column: span 2; text-align: center; padding: 3rem; background: #ffffff; border-radius: 16px;">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" stroke-width="1.5" style="margin-bottom: 1rem;"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
        <h4 style="color: #0f1c2d; margin-bottom: 0.5rem;">No matching openings found</h4>
        <p style="color: #64748b; font-size: 0.95rem; margin-bottom: 1.25rem;">Try adjusting your keywords or department filter, or drop your general resume below.</p>
        <button class="btn btn-primary btn-sm" onclick="openGeneralApplyModal()">Drop Your Resume</button>
      </div>
    `;
    return;
  }

  jobsGrid.innerHTML = filtered.map(job => `
    <div class="job-card">
      <div>
        <div class="job-meta-top">
          <span class="badge badge-teal">${job.department}</span>
          <span style="font-size: 0.75rem; color: #94a3b8; font-weight: 500;">Posted ${job.posted}</span>
        </div>
        <h3 class="job-title">${job.title}</h3>
        <div class="job-details-strip">
          <span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
            ${job.location}
          </span>
          <span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>
            ${job.experience}
          </span>
        </div>
        <p style="font-size: 0.875rem; color: #64748b; margin-bottom: 1rem; line-height: 1.5;">${job.description.substring(0, 110)}...</p>
        <div class="job-tags">
          ${job.tags.map(t => `<span class="tech-tag">${t}</span>`).join('')}
        </div>
      </div>
      <div class="job-footer">
        <div class="job-salary">${job.salary}</div>
        <div style="display: flex; gap: 0.5rem;">
          <button class="btn btn-outline btn-sm" onclick="openJobDetailsModal('${job.id}')">View Details</button>
          <button class="btn btn-primary btn-sm" onclick="openJobApplyModal('${job.id}')">Apply Now</button>
        </div>
      </div>
    </div>
  `).join('');
}

// 3. Modals Management
function initModals() {
  const overlay = document.getElementById('modalOverlay');
  if (!overlay) return;

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) {
      closeModal();
    }
  });

  const closeBtns = document.querySelectorAll('.modal-close-btn');
  closeBtns.forEach(btn => {
    btn.addEventListener('click', closeModal);
  });
}

// State for automated lead popups
let autoCandidatePromptShown = false;
let autoWhatsAppPromptShown = false;

function initAutoLeadPopups() {
  // 1. Auto-open General Candidate Application Form after 5 seconds of opening the website
  setTimeout(() => {
    const overlay = document.getElementById('modalOverlay');
    const isModalOpen = overlay && overlay.classList.contains('active');
    if (!autoCandidatePromptShown && !isModalOpen) {
      autoCandidatePromptShown = true;
      openJobApplyModal(null);
    }
  }, 5000);
}

function triggerWhatsAppPromptAfterDelay() {
  if (!autoWhatsAppPromptShown) {
    autoWhatsAppPromptShown = true;
    setTimeout(() => {
      toggleWhatsAppChat(true);
    }, 5000);
  }
}

function openModal(htmlContent) {
  const overlay = document.getElementById('modalOverlay');
  const body = document.getElementById('modalBody');
  if (!overlay || !body) return;

  body.innerHTML = htmlContent;
  overlay.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  const overlay = document.getElementById('modalOverlay');
  if (overlay) {
    overlay.classList.remove('active');
    document.body.style.overflow = 'auto';
  }

  // After user closes the form, trigger WhatsApp appearance after 5 seconds
  triggerWhatsAppPromptAfterDelay();
}

// Multi-Channel Contact Widget & WhatsApp Chat Controller
window.toggleFloatingWidget = function() {
  const launcher = document.getElementById('widgetLauncherBtn');
  const speedDial = document.getElementById('widgetSpeedDial');
  const chatBox = document.getElementById('whatsappChatBox');

  if (chatBox && chatBox.classList.contains('open')) {
    chatBox.classList.remove('open');
    if (launcher) launcher.classList.remove('active');
    return;
  }

  if (speedDial) {
    const isActive = speedDial.classList.contains('active');
    if (isActive) {
      speedDial.classList.remove('active');
      if (launcher) launcher.classList.remove('active');
    } else {
      speedDial.classList.add('active');
      if (launcher) launcher.classList.add('active');
    }
  }
};

window.toggleWhatsAppChat = function(openState) {
  const chatBox = document.getElementById('whatsappChatBox');
  const speedDial = document.getElementById('widgetSpeedDial');
  const launcher = document.getElementById('widgetLauncherBtn');

  if (!chatBox) return;

  if (openState) {
    if (speedDial) speedDial.classList.remove('active');
    chatBox.classList.add('open');
    if (launcher) launcher.classList.add('active');
    const input = document.getElementById('waWidgetInput');
    if (input) setTimeout(() => input.focus(), 300);
  } else {
    chatBox.classList.remove('open');
    if (launcher) launcher.classList.remove('active');
  }
};

window.handleWhatsAppSend = function(e) {
  e.preventDefault();
  const input = document.getElementById('waWidgetInput');
  const msg = input ? input.value.trim() : '';
  const phone = '919886470404';

  const defaultMsg = "Hi CEGS Team, I would like to inquire about career vacancies and recruitment services.";
  const finalMsg = msg || defaultMsg;
  const encoded = encodeURIComponent(finalMsg);
  
  window.open(`https://wa.me/${phone}?text=${encoded}`, '_blank');
  
  if (input) input.value = '';
  toggleWhatsAppChat(false);
};

// Job Details Modal
window.openJobDetailsModal = function(jobId) {
  const job = CEGS_DATA.liveJobs.find(j => j.id === jobId);
  if (!job) return;

  const content = `
    <div style="margin-bottom: 1.5rem;">
      <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem;">
        <span class="badge badge-teal">${job.department}</span>
        <span class="badge badge-blue">${job.type}</span>
      </div>
      <h2 style="font-size: 1.6rem; color: #0f1c2d; margin-bottom: 0.5rem;">${job.title}</h2>
      <div style="display: flex; gap: 1.25rem; font-size: 0.85rem; color: #64748b;">
        <span>📍 ${job.location}</span>
        <span>💼 ${job.experience}</span>
        <span>💰 ${job.salary}</span>
      </div>
    </div>
    
    <div style="margin-bottom: 1.5rem;">
      <h4 style="margin-bottom: 0.5rem; color: #0f1c2d;">Role Overview</h4>
      <p style="font-size: 0.95rem; color: #475569; line-height: 1.6;">${job.description}</p>
    </div>

    <div style="margin-bottom: 1.75rem;">
      <h4 style="margin-bottom: 0.75rem; color: #0f1c2d;">Key Requirements & Qualifications</h4>
      <ul style="list-style: none; display: flex; flex-direction: column; gap: 0.5rem;">
        ${job.requirements.map(req => `
          <li style="display: flex; gap: 0.5rem; font-size: 0.9rem; color: #334155;">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0bb379" stroke-width="2.5" style="flex-shrink: 0; margin-top: 2px;"><polyline points="20 6 9 17 4 12"></polyline></svg>
            <span>${req}</span>
          </li>
        `).join('')}
      </ul>
    </div>

    <div style="display: flex; gap: 1rem; justify-content: flex-end; padding-top: 1.25rem; border-top: 1px solid #e2e8f0;">
      <button class="btn btn-outline" onclick="closeModal()">Close</button>
      <button class="btn btn-primary" onclick="openJobApplyModal('${job.id}')">Proceed to Apply</button>
    </div>
  `;

  openModal(content);
};

// Job Apply Modal
window.openJobApplyModal = function(jobId) {
  const job = CEGS_DATA.liveJobs.find(j => j.id === jobId);
  const title = job ? job.title : "General Candidate Application";

  const content = `
    <div style="margin-bottom: 1.5rem;">
      <span class="badge badge-orange" style="margin-bottom: 0.5rem;">Direct Recruiter Review</span>
      <h2 style="font-size: 1.5rem; color: #0f1c2d;">Apply for: ${title}</h2>
      <p style="font-size: 0.875rem; color: #64748b;">Fill in your details below. Our recruitment specialist will get back within 24 hours.</p>
    </div>

    <form id="jobApplicationForm" onsubmit="handleJobApplicationSubmit(event)">
      <div style="display: flex; flex-direction: column; gap: 1rem;">
        <div>
          <label class="form-label">Full Name *</label>
          <input type="text" class="form-control" placeholder="e.g. Rahul Sharma" required />
        </div>
        
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
          <div>
            <label class="form-label">Email Address *</label>
            <input type="email" class="form-control" placeholder="rahul@example.com" required />
          </div>
          <div>
            <label class="form-label">Phone Number *</label>
            <input type="tel" class="form-control" placeholder="+91 98765 43210" required />
          </div>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
          <div>
            <label class="form-label">Total Experience *</label>
            <input type="text" class="form-control" placeholder="e.g. 4.5 Years" required />
          </div>
          <div>
            <label class="form-label">Current / Expected CTC *</label>
            <input type="text" class="form-control" placeholder="e.g. 14 LPA / 18 LPA" required />
          </div>
        </div>

        <div>
          <label class="form-label">LinkedIn Profile URL</label>
          <input type="url" class="form-control" placeholder="https://linkedin.com/in/username" />
        </div>

        <div>
          <label class="form-label">Upload Resume / CV (PDF or DOCX)</label>
          <div style="border: 2px dashed #cbd5e1; border-radius: 12px; padding: 1.5rem; text-align: center; background: #f8fafc; cursor: pointer;" onclick="document.getElementById('resumeFileInput').click()">
            <input type="file" id="resumeFileInput" style="display: none;" accept=".pdf,.doc,.docx" onchange="updateFileNameDisplay(this)" />
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#0d5e72" stroke-width="1.5" style="margin-bottom: 0.5rem;"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
            <p id="resumeFileLabel" style="font-size: 0.85rem; font-weight: 600; color: #0d5e72;">Click or drag resume file here (Max 5MB)</p>
          </div>
        </div>

        <button type="submit" class="btn btn-primary" style="margin-top: 0.5rem; width: 100%;">Submit Job Application</button>
      </div>
    </form>
  `;

  openModal(content);
};

window.openGeneralApplyModal = function() {
  openJobApplyModal(null);
};

window.updateFileNameDisplay = function(input) {
  const label = document.getElementById('resumeFileLabel');
  if (input.files && input.files[0]) {
    label.innerText = `Selected: ${input.files[0].name}`;
    label.style.color = '#0bb379';
  }
};

window.handleJobApplicationSubmit = function(e) {
  e.preventDefault();
  closeModal();
  showToast("Application submitted successfully! Our talent team will reach out within 24h.");
};

// 4. Interactive Hiring & Turnaround Calculator
function initCostCalculator() {
  const headcountInput = document.getElementById('calcHeadcount');
  const roleTypeSelect = document.getElementById('calcRoleType');
  const daysOutput = document.getElementById('calcTurnaroundDays');
  const costSavingsOutput = document.getElementById('calcSavings');

  if (!headcountInput || !daysOutput) return;

  function updateCalc() {
    const count = parseInt(headcountInput.value) || 1;
    document.getElementById('calcHeadcountValue').innerText = `${count} ${count > 1 ? 'Roles' : 'Role'}`;
    
    // Estimate turnaround
    let days = count <= 3 ? '48 - 72 Hours' : count <= 10 ? '5 - 7 Days' : '10 - 14 Days';
    daysOutput.innerText = days;

    // Estimate savings vs agency average (in INR Lacs)
    let savings = Math.round(count * 1.85);
    costSavingsOutput.innerText = `₹${savings} Lacs+`;
  }

  headcountInput.addEventListener('input', updateCalc);
  if (roleTypeSelect) roleTypeSelect.addEventListener('change', updateCalc);
}

// 5. Booking Consultation Modal (Styled like reference HRMS Calendar)
window.openBookingModal = function() {
  const content = `
    <div style="margin-bottom: 1.25rem;">
      <span class="badge badge-teal" style="margin-bottom: 0.5rem;">Free 15-Min Discovery Session</span>
      <h2 style="font-size: 1.5rem; color: #0f1c2d;">Schedule Strategy Consultation</h2>
      <p style="font-size: 0.875rem; color: #64748b;">Discuss staffing requirements, payroll compliance, or tech engineering with our principal consultants.</p>
    </div>

    <form onsubmit="handleBookingSubmit(event)">
      <div style="display: flex; flex-direction: column; gap: 1rem;">
        <div>
          <label class="form-label">Select Preferred Date</label>
          <div style="display: grid; grid-template-columns: repeat(5, 1fr); gap: 0.5rem; margin-top: 0.25rem;">
            <button type="button" class="cal-slot active" onclick="selectCalDate(this)">
              <small style="display:block; color:#64748b;">Mon</small><strong>18 Aug</strong>
            </button>
            <button type="button" class="cal-slot" onclick="selectCalDate(this)">
              <small style="display:block; color:#64748b;">Tue</small><strong>19 Aug</strong>
            </button>
            <button type="button" class="cal-slot" onclick="selectCalDate(this)">
              <small style="display:block; color:#64748b;">Wed</small><strong>20 Aug</strong>
            </button>
            <button type="button" class="cal-slot" onclick="selectCalDate(this)">
              <small style="display:block; color:#64748b;">Thu</small><strong>21 Aug</strong>
            </button>
            <button type="button" class="cal-slot" onclick="selectCalDate(this)">
              <small style="display:block; color:#64748b;">Fri</small><strong>22 Aug</strong>
            </button>
          </div>
        </div>

        <div>
          <label class="form-label">Preferred Time Slot (IST)</label>
          <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.5rem; margin-top: 0.25rem;">
            <button type="button" class="time-slot active" onclick="selectTimeSlot(this)">11:00 AM</button>
            <button type="button" class="time-slot" onclick="selectTimeSlot(this)">02:30 PM</button>
            <button type="button" class="time-slot" onclick="selectTimeSlot(this)">04:00 PM</button>
          </div>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
          <div>
            <label class="form-label">Your Name *</label>
            <input type="text" class="form-control" placeholder="Full Name" required />
          </div>
          <div>
            <label class="form-label">Work Email *</label>
            <input type="email" class="form-control" placeholder="name@company.com" required />
          </div>
        </div>

        <div>
          <label class="form-label">Key Discussion Focus</label>
          <select class="form-control">
            <option>Immediate Staffing / IT Hiring</option>
            <option>Payroll Management & Compliance Audit</option>
            <option>Web Development & Software Engineering</option>
            <option>Inside Sales & BPO Squad Setup</option>
            <option>Comprehensive HR Advisory</option>
          </select>
        </div>

        <button type="submit" class="btn btn-gradient" style="margin-top: 0.5rem; width: 100%;">Confirm Consultation Booking</button>
      </div>
    </form>
  `;

  openModal(content);
};

window.selectCalDate = function(btn) {
  document.querySelectorAll('.cal-slot').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
};

window.selectTimeSlot = function(btn) {
  document.querySelectorAll('.time-slot').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
};

window.handleBookingSubmit = function(e) {
  e.preventDefault();
  closeModal();
  showToast("Discovery call confirmed! Calendar invite sent to your work email.");
};

function initCalendarBooking() {
  // Styles for the interactive modal calendar
  const style = document.createElement('style');
  style.innerHTML = `
    .cal-slot, .time-slot {
      background: #f8fafc;
      border: 1.5px solid #e2e8f0;
      border-radius: 10px;
      padding: 0.6rem 0.3rem;
      cursor: pointer;
      text-align: center;
      font-size: 0.85rem;
      transition: all 0.2s ease;
    }
    .cal-slot:hover, .time-slot:hover {
      border-color: #0d5e72;
      background: #ffffff;
    }
    .cal-slot.active, .time-slot.active {
      background: #0d5e72;
      color: #ffffff;
      border-color: #0d5e72;
    }
    .cal-slot.active small {
      color: rgba(255,255,255,0.8) !important;
    }
  `;
  document.head.appendChild(style);
}

// 6. Employer Talent Request Form Submission
function initEmployerForm() {
  const form = document.getElementById('employerTalentForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    form.reset();
    showToast("Talent requirement received! A senior CEGS recruiter will contact you within 2 hours.");
  });
}

// 7. FAQ Accordion (Resilient Event Delegation)
function initFaqAccordion() {
  document.addEventListener('click', (e) => {
    const questionBtn = e.target.closest('.faq-question');
    if (!questionBtn) return;
    
    if (typeof window.toggleFaq === 'function') {
      window.toggleFaq(questionBtn);
    }
  });
}
