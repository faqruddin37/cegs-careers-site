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
      
      if (targetHash === '#hire-talent' || targetHash === '#contact') {
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

window.fetchLiveDbJobs = function() {
  const tryFetch = (url) => {
    const sep = url.includes('?') ? '&' : '?';
    return fetch(url + sep + 't=' + Date.now()).then(res => {
      if (!res.ok) throw new Error('API unavailable');
      return res.json();
    });
  };

  tryFetch('/api/jobs')
    .catch(() => tryFetch('api/jobs'))
    .catch(() => tryFetch('backend/api/jobs.php'))
    .then(data => {
      if (data && data.status === 'success' && Array.isArray(data.data) && data.data.length > 0) {
        CEGS_DATA.liveJobs = data.data.map(item => {
          const roleTitle = item.title || item.job_role || 'Job Vacancy';
          const compName = item.company || item.company_name || 'CEGS Client';
          const addNotes = item.additional_notes || item.additionalNotes || item.description || '';

          // Detect department & badge theme
          const text = `${roleTitle} ${compName} ${addNotes}`.toLowerCase();
          let dept = item.department || "Staffing & Careers";
          let badgeColor = item.badgeColor || "teal";

          if (/tech|software|developer|engineer|it|web|cloud|data|frontend|backend|full stack|react|node/i.test(text)) {
            dept = "Technology";
            badgeColor = "blue";
          } else if (/hr|staffing|talent|human resources|recruitment|recruiter|hrbp/i.test(text)) {
            dept = "Human Resources";
            badgeColor = "teal";
          } else if (/bpo|sales|support|customer|voice|telecaller|representative|executive|inside sales/i.test(text)) {
            dept = "Inside Sales & BPO";
            badgeColor = "orange";
          } else if (/payroll|finance|account|compliance|tax|statutory/i.test(text)) {
            dept = "Payroll & Finance";
            badgeColor = "green";
          }

          const qual = item.qualification || item.experience || '';
          const lang = item.language_required || item.languageRequired || '';
          const shift = item.shift_details || item.shiftDetails || item.type || 'Normal Shift';
          const cab = (item.cab_facility || item.cabFacility || '').trim();

          const tags = item.tags && Array.isArray(item.tags) ? item.tags : [
            qual ? `🎓 ${qual}` : null,
            lang ? `🗣️ ${lang}` : null,
            shift ? `⏰ ${shift}` : null,
            cab && !/^no$|^none$/i.test(cab) ? `🚗 Cab: ${cab}` : null
          ].filter(Boolean);

          let salaryFormatted = item.salary || '';
          if (salaryFormatted && !salaryFormatted.includes('₹') && !salaryFormatted.toLowerCase().includes('lpa')) {
            salaryFormatted = `₹${salaryFormatted}`;
          }

          const reqs = item.requirements && Array.isArray(item.requirements) ? item.requirements : [
            `Educational Qualification: ${qual || 'Any Graduate'}`,
            `Language Fluency: ${lang || 'English, Hindi'}`,
            `Shift Schedule: ${shift || 'Day Shift'}`,
            cab && !/^no$|^none$/i.test(cab) ? `Transport Facility: ${cab}` : null,
            item.location ? `Work Location: ${item.location}` : null,
            `Offered Compensation: ${salaryFormatted}`
          ].filter(Boolean);

          return {
            id: String(item.id),
            title: roleTitle,
            company: compName,
            department: dept,
            badgeColor: badgeColor,
            type: shift || "Full-Time",
            location: item.location || 'Bangalore',
            experience: qual,
            salary: salaryFormatted,
            posted: item.posted || formatRelativeDateStr(item.posted_date),
            tags: tags,
            description: addNotes || `Exciting opportunity at ${compName} for ${roleTitle}.`,
            requirements: reqs,
            cabFacility: cab,
            languageRequired: lang,
            qualification: qual,
            shiftDetails: shift,
            additionalNotes: addNotes
          };
        });

        // Save to localStorage for instant offline/Vercel sync
        try {
          localStorage.setItem('cegs_live_jobs', JSON.stringify(CEGS_DATA.liveJobs));
        } catch (e) {}

        renderJobs();
      } else {
        loadFromLocalStorageFallback();
      }
    })
    .catch(() => {
      loadFromLocalStorageFallback();
    });
};

function loadFromLocalStorageFallback() {
  try {
    const saved = localStorage.getItem('cegs_live_jobs');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        CEGS_DATA.liveJobs = parsed;
      }
    }
  } catch (e) {}
  renderJobs();
}

function formatRelativeDateStr(timestamp) {
  if (!timestamp) return 'Recently';
  // Handle MySQL datetime "YYYY-MM-DD HH:MM:SS"
  const t = timestamp.replace(/-/g, '/');
  const diff = Date.now() - new Date(t).getTime();
  if (isNaN(diff) || diff < 0) return 'Just now';
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return mins <= 1 ? 'Just now' : `${mins} mins ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return hrs === 1 ? '1 hour ago' : `${hrs} hours ago`;
  const days = Math.floor(hrs / 24);
  return days === 1 ? '1 day ago' : `${days} days ago`;
}

function initJobBoard() {
  const jobsGrid = document.getElementById('jobsGrid');
  if (!jobsGrid) return;

  window.fetchLiveDbJobs();
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
    let matchesCategory = (currentJobCategory === 'all');
    if (!matchesCategory) {
      const cat = currentJobCategory.toLowerCase();
      const textToSearch = `${job.department || ''} ${job.title || ''} ${job.company || ''} ${(job.tags || []).join(' ')}`.toLowerCase();
      if (cat === 'tech') {
        matchesCategory = /tech|software|developer|engineer|it|web|cloud|data|frontend|backend|full stack/i.test(textToSearch);
      } else if (cat === 'hr') {
        matchesCategory = /hr|staffing|talent|human resources|recruitment|recruiter/i.test(textToSearch);
      } else if (cat === 'bpo') {
        matchesCategory = /bpo|sales|support|customer|voice|telecaller|representative|executive/i.test(textToSearch);
      } else if (cat === 'payroll') {
        matchesCategory = /payroll|finance|account|compliance|tax/i.test(textToSearch);
      } else {
        matchesCategory = textToSearch.includes(cat);
      }
    }
    
    const matchesSearch = !currentSearchQuery || 
      `${job.title} ${job.company} ${job.location} ${job.experience} ${job.description} ${(job.tags || []).join(' ')}`.toLowerCase().includes(currentSearchQuery);

    return matchesCategory && matchesSearch;
  });

  if (filtered.length === 0) {
    jobsGrid.innerHTML = `
      <div style="grid-column: span 2; text-align: center; padding: 3.5rem 1.5rem; background: #ffffff; border-radius: 18px; border: 1.5px dashed var(--border-light);">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" stroke-width="1.5" style="margin-bottom: 1rem;"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
        <h4 style="color: #0f1c2d; margin-bottom: 0.5rem; font-size: 1.25rem;">No matching openings found</h4>
        <p style="color: #64748b; font-size: 0.95rem; margin-bottom: 1.25rem;">Try adjusting your keywords or category filter, or drop your general resume below.</p>
        <button class="btn btn-primary btn-sm" onclick="openGeneralApplyModal()">Drop Your Resume</button>
      </div>
    `;
    return;
  }

  jobsGrid.innerHTML = filtered.map(job => `
    <div class="job-card">
      <div>
        <div class="job-meta-top">
          <span class="badge badge-${job.badgeColor || 'teal'}">${job.department}</span>
          <span style="font-size: 0.75rem; color: #94a3b8; font-weight: 600;">Posted ${job.posted}</span>
        </div>
        
        <h3 class="job-title">${job.title}</h3>
        
        <div style="font-size: 0.85rem; font-weight: 700; color: var(--color-primary); margin-bottom: 0.6rem; display: flex; align-items: center; gap: 0.4rem;">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 21h18"></path><path d="M5 21V7l8-4v18"></path><path d="M19 21V11l-6-3"></path><path d="M9 9v.01"></path><path d="M9 12v.01"></path><path d="M9 15v.01"></path><path d="M9 18v.01"></path></svg>
          <span>${job.company || 'CEGS Partner Client'}</span>
        </div>

        <div class="job-details-strip">
          <span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
            ${job.location}
          </span>
          <span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 10v6M2 10l10-5 10 5-10 5z"></path><path d="M6 12v5c3 3 9 3 12 0v-5"></path></svg>
            ${job.experience}
          </span>
        </div>

        <p style="font-size: 0.875rem; color: #64748b; margin-bottom: 1rem; line-height: 1.5;">${job.description.length > 120 ? job.description.substring(0, 120) + '...' : job.description}</p>
        
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
  const job = CEGS_DATA.liveJobs.find(j => String(j.id) === String(jobId));
  if (!job) return;

  const reqs = Array.isArray(job.requirements) && job.requirements.length > 0 
    ? job.requirements 
    : [
        `Educational Qualification: ${job.qualification || job.experience || 'Graduate'}`,
        `Language Fluency: ${job.languageRequired || 'English, Hindi'}`,
        `Shift Schedule: ${job.shiftDetails || job.type || 'Standard'}`,
        job.cabFacility && !/^no$|^none$/i.test(job.cabFacility) ? `Cab & Transport: ${job.cabFacility}` : null,
        `Work Location: ${job.location}`,
        `Offered Compensation: ${job.salary}`
      ].filter(Boolean);

  const cabHtml = (job.cabFacility && !/^no$|^none$/i.test(job.cabFacility))
    ? `<span>🚗 <strong>Cab:</strong> ${job.cabFacility}</span>`
    : '';

  const content = `
    <div style="margin-bottom: 1.5rem;">
      <div style="display: flex; align-items: center; justify-content: space-between; gap: 0.5rem; margin-bottom: 0.75rem; flex-wrap: wrap;">
        <div style="display: flex; gap: 0.5rem; align-items: center;">
          <span class="badge badge-${job.badgeColor || 'teal'}">${job.department}</span>
          <span class="badge badge-gray">${job.type || 'Full-Time'}</span>
        </div>
        <span style="font-size: 0.8rem; color: #64748b; font-weight: 600;">⏱️ Posted ${job.posted}</span>
      </div>
      
      <h2 style="font-size: 1.65rem; color: #0f1c2d; margin-bottom: 0.35rem; font-weight: 800; line-height: 1.25;">${job.title}</h2>
      
      <div style="font-size: 0.95rem; font-weight: 700; color: var(--color-primary); margin-bottom: 1.25rem; display: flex; align-items: center; gap: 0.4rem;">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 21h18"></path><path d="M5 21V7l8-4v18"></path><path d="M19 21V11l-6-3"></path><path d="M9 9v.01"></path><path d="M9 12v.01"></path><path d="M9 15v.01"></path><path d="M9 18v.01"></path></svg>
        <span>${job.company || 'CEGS Partner Client'}</span>
      </div>

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem 1rem; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 1rem 1.25rem; font-size: 0.85rem; margin-bottom: 1.25rem;">
        <span>📍 <strong>Location:</strong> ${job.location}</span>
        <span>💰 <strong>Salary:</strong> ${job.salary}</span>
        <span>🎓 <strong>Qualification:</strong> ${job.qualification || job.experience}</span>
        <span>⏰ <strong>Shift:</strong> ${job.shiftDetails || job.type}</span>
        ${job.languageRequired ? `<span>🗣️ <strong>Language:</strong> ${job.languageRequired}</span>` : ''}
        ${cabHtml}
      </div>
    </div>
    
    <div style="margin-bottom: 1.5rem;">
      <h4 style="margin-bottom: 0.5rem; color: #0f1c2d; font-weight: 800;">Role Overview</h4>
      <p style="font-size: 0.925rem; color: #475569; line-height: 1.6;">${job.description}</p>
    </div>

    <div style="margin-bottom: 1.75rem;">
      <h4 style="margin-bottom: 0.75rem; color: #0f1c2d; font-weight: 800;">Key Requirements & Highlights</h4>
      <ul style="list-style: none; display: flex; flex-direction: column; gap: 0.5rem; padding: 0;">
        ${reqs.map(req => `
          <li style="display: flex; gap: 0.6rem; font-size: 0.9rem; color: #334155; align-items: flex-start;">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0bb379" stroke-width="2.5" style="flex-shrink: 0; margin-top: 2px;"><polyline points="20 6 9 17 4 12"></polyline></svg>
            <span>${req}</span>
          </li>
        `).join('')}
      </ul>
    </div>

    <div style="display: flex; gap: 1rem; justify-content: flex-end; padding-top: 1.25rem; border-top: 1px solid #e2e8f0;">
      <button class="btn btn-outline" onclick="closeModal()">Close</button>
      <button class="btn btn-primary" onclick="openJobApplyModal('${job.id}')">
        <span>Proceed to Apply</span>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
      </button>
    </div>
  `;

  openModal(content);
};

// Job Apply Modal
window.openJobApplyModal = function(jobId) {
  const job = CEGS_DATA.liveJobs.find(j => String(j.id) === String(jobId));
  const title = job ? `${job.title} (${job.company})` : "General Candidate Application";

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

// ==========================================================================
// 5. Client Hiring Requirement / Request Candidates Multi-Step Form
// ==========================================================================
window.clientReqData = {
  companyName: '',
  contactPerson: '',
  workEmail: '',
  phone: '',
  industry: '',
  companyWebsite: '',
  jobTitle: '',
  numberOfOpenings: '1',
  experienceRequired: '',
  jobLocation: '',
  workMode: 'On-site',
  employmentType: 'Full Time',
  requiredSkills: ['React', 'Node.js', 'JavaScript'],
  qualification: 'Any Graduate',
  minCTC: '',
  maxCTC: '',
  noticePeriod: 'Immediate',
  preferredShift: 'Day Shift',
  languages: ['English', 'Hindi'],
  candidateRequirements: '',
  hiringTimeline: 'Immediately',
  interviewMode: 'Online',
  interviewRounds: '2',
  additionalRequirements: '',
  jobDescriptionFileName: '',
  consent: true
};

window.reqCurrentStep = 1;

window.openBookingModal = function() {
  window.reqCurrentStep = 1;
  const content = `
    <div class="req-wizard-modal">
      <div class="req-wizard-header">
        <span class="badge badge-teal">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="8.5" cy="7" r="4"></circle><line x1="20" y1="8" x2="20" y2="14"></line><line x1="23" y1="11" x2="17" y2="11"></line></svg>
          Client Talent Intake
        </span>
        <h2>Request Recruitment Support</h2>
        <p>Tell us about your hiring requirements and our recruitment team will help you find the right candidates.</p>
      </div>

      <!-- Compact 4-Step Progress Indicator -->
      <div class="req-stepper-bar" id="reqStepperBar">
        <div class="req-step-item active" id="reqStepIndicator-1">
          <span class="req-step-num">1</span>
          <span class="req-step-text">Company</span>
        </div>
        <div class="req-step-item" id="reqStepIndicator-2">
          <span class="req-step-num">2</span>
          <span class="req-step-text">Position</span>
        </div>
        <div class="req-step-item" id="reqStepIndicator-3">
          <span class="req-step-num">3</span>
          <span class="req-step-text">Candidate</span>
        </div>
        <div class="req-step-item" id="reqStepIndicator-4">
          <span class="req-step-num">4</span>
          <span class="req-step-text">Timeline</span>
        </div>
      </div>

      <form id="clientRequirementForm" onsubmit="reqSubmitForm(event)" novalidate>
        
        <!-- STEP 1: COMPANY DETAILS -->
        <div class="req-step-container active" id="reqStepPanel-1">
          <div class="req-step-heading">About Your Company</div>
          <div class="req-form-grid">
            <div class="req-form-group" id="group-companyName">
              <label class="form-label">Company Name <span class="required-star">*</span></label>
              <input type="text" class="form-control" id="reqInput-companyName" placeholder="Enter company name" value="${window.clientReqData.companyName}" oninput="reqClearError('companyName')" />
              <div class="req-error-msg" id="err-companyName">Company name is required</div>
            </div>

            <div class="req-form-group" id="group-contactPerson">
              <label class="form-label">Contact Person Name <span class="required-star">*</span></label>
              <input type="text" class="form-control" id="reqInput-contactPerson" placeholder="Your full name" value="${window.clientReqData.contactPerson}" oninput="reqClearError('contactPerson')" />
              <div class="req-error-msg" id="err-contactPerson">Contact person name is required</div>
            </div>

            <div class="req-form-group" id="group-workEmail">
              <label class="form-label">Work Email <span class="required-star">*</span></label>
              <input type="email" class="form-control" id="reqInput-workEmail" placeholder="name@company.com" value="${window.clientReqData.workEmail}" oninput="reqClearError('workEmail')" />
              <div class="req-error-msg" id="err-workEmail">Please enter a valid work email address</div>
            </div>

            <div class="req-form-group" id="group-phone">
              <label class="form-label">Phone Number <span class="required-star">*</span></label>
              <input type="tel" class="form-control" id="reqInput-phone" placeholder="+91 XXXXX XXXXX" value="${window.clientReqData.phone}" oninput="reqClearError('phone')" />
              <div class="req-error-msg" id="err-phone">Please enter a valid contact phone number</div>
            </div>

            <div class="req-form-group" id="group-industry">
              <label class="form-label">Industry <span class="required-star">*</span></label>
              <select class="form-control" id="reqInput-industry" onchange="reqClearError('industry')">
                <option value="" disabled ${!window.clientReqData.industry ? 'selected' : ''}>Select Industry</option>
                <option value="IT & Software" ${window.clientReqData.industry === 'IT & Software' ? 'selected' : ''}>IT & Software</option>
                <option value="Banking & Financial Services" ${window.clientReqData.industry === 'Banking & Financial Services' ? 'selected' : ''}>Banking & Financial Services</option>
                <option value="BPO / Customer Support" ${window.clientReqData.industry === 'BPO / Customer Support' ? 'selected' : ''}>BPO / Customer Support</option>
                <option value="Healthcare" ${window.clientReqData.industry === 'Healthcare' ? 'selected' : ''}>Healthcare</option>
                <option value="Manufacturing" ${window.clientReqData.industry === 'Manufacturing' ? 'selected' : ''}>Manufacturing</option>
                <option value="Retail" ${window.clientReqData.industry === 'Retail' ? 'selected' : ''}>Retail</option>
                <option value="Education" ${window.clientReqData.industry === 'Education' ? 'selected' : ''}>Education</option>
                <option value="E-commerce" ${window.clientReqData.industry === 'E-commerce' ? 'selected' : ''}>E-commerce</option>
                <option value="Logistics" ${window.clientReqData.industry === 'Logistics' ? 'selected' : ''}>Logistics</option>
                <option value="Other" ${window.clientReqData.industry === 'Other' ? 'selected' : ''}>Other</option>
              </select>
              <div class="req-error-msg" id="err-industry">Please select your industry sector</div>
            </div>

            <div class="req-form-group" id="group-companyWebsite">
              <label class="form-label">Company Website</label>
              <input type="url" class="form-control" id="reqInput-companyWebsite" placeholder="https://company.com" value="${window.clientReqData.companyWebsite}" />
            </div>
          </div>
        </div>

        <!-- STEP 2: HIRING REQUIREMENT -->
        <div class="req-step-container" id="reqStepPanel-2">
          <div class="req-step-heading">Tell Us About The Role</div>
          <div class="req-form-grid">
            <div class="req-form-group" id="group-jobTitle">
              <label class="form-label">Position / Job Title <span class="required-star">*</span></label>
              <input type="text" class="form-control" id="reqInput-jobTitle" placeholder="e.g. Software Developer" value="${window.clientReqData.jobTitle}" oninput="reqClearError('jobTitle')" />
              <div class="req-error-msg" id="err-jobTitle">Position or job title is required</div>
            </div>

            <div class="req-form-group" id="group-numberOfOpenings">
              <label class="form-label">Number of Openings <span class="required-star">*</span></label>
              <input type="number" min="1" class="form-control" id="reqInput-numberOfOpenings" placeholder="e.g. 5" value="${window.clientReqData.numberOfOpenings}" oninput="reqClearError('numberOfOpenings')" />
              <div class="req-error-msg" id="err-numberOfOpenings">Please specify number of vacancies (min 1)</div>
            </div>

            <div class="req-form-group" id="group-experienceRequired">
              <label class="form-label">Experience Required <span class="required-star">*</span></label>
              <select class="form-control" id="reqInput-experienceRequired" onchange="reqClearError('experienceRequired')">
                <option value="" disabled ${!window.clientReqData.experienceRequired ? 'selected' : ''}>Select Experience Level</option>
                <option value="Fresher" ${window.clientReqData.experienceRequired === 'Fresher' ? 'selected' : ''}>Fresher</option>
                <option value="0–1 Years" ${window.clientReqData.experienceRequired === '0–1 Years' ? 'selected' : ''}>0–1 Years</option>
                <option value="1–3 Years" ${window.clientReqData.experienceRequired === '1–3 Years' ? 'selected' : ''}>1–3 Years</option>
                <option value="3–5 Years" ${window.clientReqData.experienceRequired === '3–5 Years' ? 'selected' : ''}>3–5 Years</option>
                <option value="5–8 Years" ${window.clientReqData.experienceRequired === '5–8 Years' ? 'selected' : ''}>5–8 Years</option>
                <option value="8+ Years" ${window.clientReqData.experienceRequired === '8+ Years' ? 'selected' : ''}>8+ Years</option>
              </select>
              <div class="req-error-msg" id="err-experienceRequired">Please select experience level</div>
            </div>

            <div class="req-form-group" id="group-jobLocation">
              <label class="form-label">Job Location <span class="required-star">*</span></label>
              <input type="text" class="form-control" id="reqInput-jobLocation" placeholder="e.g. Bangalore / Pan India" value="${window.clientReqData.jobLocation}" oninput="reqClearError('jobLocation')" />
              <div class="req-error-msg" id="err-jobLocation">Job location is required</div>
            </div>

            <!-- Work Mode Cards -->
            <div class="req-form-group full-width">
              <label class="form-label">Work Mode <span class="required-star">*</span></label>
              <div class="req-cards-grid">
                <div class="req-choice-card ${window.clientReqData.workMode === 'On-site' ? 'active' : ''}" onclick="reqSelectChoice(this, 'workMode', 'On-site')">
                  <span class="req-card-icon">🏢</span>
                  <span class="req-card-label">On-site</span>
                </div>
                <div class="req-choice-card ${window.clientReqData.workMode === 'Hybrid' ? 'active' : ''}" onclick="reqSelectChoice(this, 'workMode', 'Hybrid')">
                  <span class="req-card-icon">🔄</span>
                  <span class="req-card-label">Hybrid</span>
                </div>
                <div class="req-choice-card ${window.clientReqData.workMode === 'Remote' ? 'active' : ''}" onclick="reqSelectChoice(this, 'workMode', 'Remote')">
                  <span class="req-card-icon">🌐</span>
                  <span class="req-card-label">Remote</span>
                </div>
              </div>
            </div>

            <!-- Employment Type Cards -->
            <div class="req-form-group full-width">
              <label class="form-label">Employment Type <span class="required-star">*</span></label>
              <div class="req-pills-group">
                <div class="req-pill-item ${window.clientReqData.employmentType === 'Full Time' ? 'active' : ''}" onclick="reqSelectPillSingle(this, 'employmentType', 'Full Time')">Full Time</div>
                <div class="req-pill-item ${window.clientReqData.employmentType === 'Contract' ? 'active' : ''}" onclick="reqSelectPillSingle(this, 'employmentType', 'Contract')">Contract</div>
                <div class="req-pill-item ${window.clientReqData.employmentType === 'Internship' ? 'active' : ''}" onclick="reqSelectPillSingle(this, 'employmentType', 'Internship')">Internship</div>
                <div class="req-pill-item ${window.clientReqData.employmentType === 'Temporary' ? 'active' : ''}" onclick="reqSelectPillSingle(this, 'employmentType', 'Temporary')">Temporary</div>
              </div>
            </div>

            <!-- Required Skills Interactive Tags -->
            <div class="req-form-group full-width" id="group-requiredSkills">
              <label class="form-label">Required Skills <span class="required-star">*</span> <small class="req-helper-text">Type skill and press Enter or comma</small></label>
              <div class="req-tags-container" id="reqTagsBox" onclick="document.getElementById('reqTagInput').focus()">
                <div id="reqTagChips" style="display: flex; flex-wrap: wrap; gap: 0.4rem;"></div>
                <input type="text" class="req-tags-input" id="reqTagInput" placeholder="Add skill (e.g. React)..." onkeydown="reqHandleTagKey(event)" />
              </div>
              <div class="req-error-msg" id="err-requiredSkills">Please specify at least one skill or technology</div>
              
              <!-- Quick Suggested Skills -->
              <div class="req-suggested-tags">
                <span style="font-size: 0.75rem; color: #64748b; font-weight: 600; margin-right: 0.2rem;">Quick Add:</span>
                <span class="req-suggest-chip" onclick="reqAddTag('React.js')">+ React.js</span>
                <span class="req-suggest-chip" onclick="reqAddTag('Node.js')">+ Node.js</span>
                <span class="req-suggest-chip" onclick="reqAddTag('Python')">+ Python</span>
                <span class="req-suggest-chip" onclick="reqAddTag('Java')">+ Java</span>
                <span class="req-suggest-chip" onclick="reqAddTag('Inside Sales')">+ Inside Sales</span>
                <span class="req-suggest-chip" onclick="reqAddTag('Customer Support')">+ Customer Support</span>
                <span class="req-suggest-chip" onclick="reqAddTag('Payroll')">+ Payroll</span>
                <span class="req-suggest-chip" onclick="reqAddTag('SQL')">+ SQL</span>
              </div>
            </div>
          </div>
        </div>

        <!-- STEP 3: IDEAL CANDIDATE -->
        <div class="req-step-container" id="reqStepPanel-3">
          <div class="req-step-heading">What Kind of Candidate Do You Need?</div>
          <div class="req-form-grid">
            <div class="req-form-group">
              <label class="form-label">Required Qualification</label>
              <select class="form-control" id="reqInput-qualification">
                <option value="Any Graduate" ${window.clientReqData.qualification === 'Any Graduate' ? 'selected' : ''}>Any Graduate</option>
                <option value="BCA" ${window.clientReqData.qualification === 'BCA' ? 'selected' : ''}>BCA</option>
                <option value="B.Tech / BE" ${window.clientReqData.qualification === 'B.Tech / BE' ? 'selected' : ''}>B.Tech / BE</option>
                <option value="MBA" ${window.clientReqData.qualification === 'MBA' ? 'selected' : ''}>MBA</option>
                <option value="MCA" ${window.clientReqData.qualification === 'MCA' ? 'selected' : ''}>MCA</option>
                <option value="Diploma" ${window.clientReqData.qualification === 'Diploma' ? 'selected' : ''}>Diploma</option>
                <option value="Post Graduate" ${window.clientReqData.qualification === 'Post Graduate' ? 'selected' : ''}>Post Graduate</option>
                <option value="Other" ${window.clientReqData.qualification === 'Other' ? 'selected' : ''}>Other</option>
              </select>
            </div>

            <!-- Salary CTC Range -->
            <div class="req-form-group">
              <label class="form-label">Salary / CTC Range</label>
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem;">
                <input type="text" class="form-control" id="reqInput-minCTC" placeholder="Min CTC (e.g. 4 LPA)" value="${window.clientReqData.minCTC}" />
                <input type="text" class="form-control" id="reqInput-maxCTC" placeholder="Max CTC (e.g. 8 LPA)" value="${window.clientReqData.maxCTC}" />
              </div>
            </div>

            <!-- Notice Period -->
            <div class="req-form-group full-width">
              <label class="form-label">Notice Period Preference</label>
              <div class="req-pills-group">
                <div class="req-pill-item ${window.clientReqData.noticePeriod === 'Immediate' ? 'active' : ''}" onclick="reqSelectPillSingle(this, 'noticePeriod', 'Immediate')">Immediate</div>
                <div class="req-pill-item ${window.clientReqData.noticePeriod === '15 Days' ? 'active' : ''}" onclick="reqSelectPillSingle(this, 'noticePeriod', '15 Days')">15 Days</div>
                <div class="req-pill-item ${window.clientReqData.noticePeriod === '30 Days' ? 'active' : ''}" onclick="reqSelectPillSingle(this, 'noticePeriod', '30 Days')">30 Days</div>
                <div class="req-pill-item ${window.clientReqData.noticePeriod === '60 Days' ? 'active' : ''}" onclick="reqSelectPillSingle(this, 'noticePeriod', '60 Days')">60 Days</div>
                <div class="req-pill-item ${window.clientReqData.noticePeriod === '90 Days' ? 'active' : ''}" onclick="reqSelectPillSingle(this, 'noticePeriod', '90 Days')">90 Days</div>
                <div class="req-pill-item ${window.clientReqData.noticePeriod === 'Flexible' ? 'active' : ''}" onclick="reqSelectPillSingle(this, 'noticePeriod', 'Flexible')">Flexible</div>
              </div>
            </div>

            <!-- Preferred Shift -->
            <div class="req-form-group full-width">
              <label class="form-label">Preferred Shift</label>
              <div class="req-pills-group">
                <div class="req-pill-item ${window.clientReqData.preferredShift === 'Day Shift' ? 'active' : ''}" onclick="reqSelectPillSingle(this, 'preferredShift', 'Day Shift')">Day Shift</div>
                <div class="req-pill-item ${window.clientReqData.preferredShift === 'Night Shift' ? 'active' : ''}" onclick="reqSelectPillSingle(this, 'preferredShift', 'Night Shift')">Night Shift</div>
                <div class="req-pill-item ${window.clientReqData.preferredShift === 'Rotational' ? 'active' : ''}" onclick="reqSelectPillSingle(this, 'preferredShift', 'Rotational')">Rotational</div>
                <div class="req-pill-item ${window.clientReqData.preferredShift === 'Flexible' ? 'active' : ''}" onclick="reqSelectPillSingle(this, 'preferredShift', 'Flexible')">Flexible</div>
              </div>
            </div>

            <!-- Languages Required Multi-Select -->
            <div class="req-form-group full-width">
              <label class="form-label">Languages Required <small class="req-helper-text">Select all that apply</small></label>
              <div class="req-pills-group" id="reqLanguagesPills">
                <div class="req-pill-item ${window.clientReqData.languages.includes('English') ? 'active' : ''}" onclick="reqToggleMultiPill(this, 'languages', 'English')">English</div>
                <div class="req-pill-item ${window.clientReqData.languages.includes('Hindi') ? 'active' : ''}" onclick="reqToggleMultiPill(this, 'languages', 'Hindi')">Hindi</div>
                <div class="req-pill-item ${window.clientReqData.languages.includes('Kannada') ? 'active' : ''}" onclick="reqToggleMultiPill(this, 'languages', 'Kannada')">Kannada</div>
                <div class="req-pill-item ${window.clientReqData.languages.includes('Tamil') ? 'active' : ''}" onclick="reqToggleMultiPill(this, 'languages', 'Tamil')">Tamil</div>
                <div class="req-pill-item ${window.clientReqData.languages.includes('Telugu') ? 'active' : ''}" onclick="reqToggleMultiPill(this, 'languages', 'Telugu')">Telugu</div>
                <div class="req-pill-item ${window.clientReqData.languages.includes('Marathi') ? 'active' : ''}" onclick="reqToggleMultiPill(this, 'languages', 'Marathi')">Marathi</div>
                <div class="req-pill-item ${window.clientReqData.languages.includes('Other') ? 'active' : ''}" onclick="reqToggleMultiPill(this, 'languages', 'Other')">Other</div>
              </div>
            </div>

            <!-- Must-Have Skills / Requirements -->
            <div class="req-form-group full-width">
              <label class="form-label">Must-Have Skills / Candidate Requirements</label>
              <textarea class="form-control" id="reqInput-candidateRequirements" rows="3" placeholder="Tell us about the skills, experience, qualifications or other requirements the candidate must have...">${window.clientReqData.candidateRequirements}</textarea>
              <small class="req-helper-text">Example: Candidate should have good communication skills and minimum 2 years of experience in React.</small>
            </div>
          </div>
        </div>

        <!-- STEP 4: HIRING TIMELINE -->
        <div class="req-step-container" id="reqStepPanel-4">
          <div class="req-step-heading">Tell Us About Your Hiring Timeline</div>
          <div class="req-form-grid">
            
            <!-- How soon do you need candidates -->
            <div class="req-form-group full-width" id="group-hiringTimeline">
              <label class="form-label">How soon do you need candidates? <span class="required-star">*</span></label>
              <div class="req-cards-grid">
                <div class="req-choice-card ${window.clientReqData.hiringTimeline === 'Immediately' ? 'active' : ''}" onclick="reqSelectChoice(this, 'hiringTimeline', 'Immediately')">
                  <span class="req-card-icon">⚡</span>
                  <span class="req-card-label">Immediately</span>
                </div>
                <div class="req-choice-card ${window.clientReqData.hiringTimeline === 'Within 1 Week' ? 'active' : ''}" onclick="reqSelectChoice(this, 'hiringTimeline', 'Within 1 Week')">
                  <span class="req-card-icon">📅</span>
                  <span class="req-card-label">Within 1 Week</span>
                </div>
                <div class="req-choice-card ${window.clientReqData.hiringTimeline === 'Within 2 Weeks' ? 'active' : ''}" onclick="reqSelectChoice(this, 'hiringTimeline', 'Within 2 Weeks')">
                  <span class="req-card-icon">🗓️</span>
                  <span class="req-card-label">Within 2 Weeks</span>
                </div>
                <div class="req-choice-card ${window.clientReqData.hiringTimeline === 'Within 1 Month' ? 'active' : ''}" onclick="reqSelectChoice(this, 'hiringTimeline', 'Within 1 Month')">
                  <span class="req-card-icon">⏳</span>
                  <span class="req-card-label">Within 1 Month</span>
                </div>
                <div class="req-choice-card ${window.clientReqData.hiringTimeline === 'Flexible' ? 'active' : ''}" onclick="reqSelectChoice(this, 'hiringTimeline', 'Flexible')">
                  <span class="req-card-icon">🎯</span>
                  <span class="req-card-label">Flexible</span>
                </div>
              </div>
            </div>

            <!-- Interview Mode -->
            <div class="req-form-group">
              <label class="form-label">Preferred Interview Mode</label>
              <div class="req-pills-group">
                <div class="req-pill-item ${window.clientReqData.interviewMode === 'Online' ? 'active' : ''}" onclick="reqSelectPillSingle(this, 'interviewMode', 'Online')">💻 Online</div>
                <div class="req-pill-item ${window.clientReqData.interviewMode === 'Offline' ? 'active' : ''}" onclick="reqSelectPillSingle(this, 'interviewMode', 'Offline')">🏢 Offline</div>
                <div class="req-pill-item ${window.clientReqData.interviewMode === 'Both' ? 'active' : ''}" onclick="reqSelectPillSingle(this, 'interviewMode', 'Both')">🔄 Both</div>
              </div>
            </div>

            <!-- Interview Rounds -->
            <div class="req-form-group">
              <label class="form-label">Number of Interview Rounds</label>
              <input type="number" min="1" max="10" class="form-control" id="reqInput-interviewRounds" placeholder="e.g. 2" value="${window.clientReqData.interviewRounds || '2'}" />
            </div>

            <!-- Additional Hiring Requirements -->
            <div class="req-form-group full-width">
              <label class="form-label">Additional Hiring Requirements</label>
              <textarea class="form-control" id="reqInput-additionalRequirements" rows="2" placeholder="Share any additional information about the role, interview process or candidate expectations...">${window.clientReqData.additionalRequirements}</textarea>
            </div>

            <!-- Upload Job Description -->
            <div class="req-form-group full-width">
              <label class="form-label">Upload Job Description <small class="req-helper-text">Optional (PDF, DOC, DOCX - Max 5MB)</small></label>
              <div class="req-dropzone" onclick="document.getElementById('reqFileInput').click()">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="color: var(--color-primary); margin-bottom: 0.35rem;"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
                <div style="font-size: 0.85rem; font-weight: 700; color: #0f172a;">Click to browse or drop job description file</div>
                <div style="font-size: 0.75rem; color: #64748b;">Supports PDF, DOC, DOCX up to 5 MB</div>
                <input type="file" id="reqFileInput" class="req-dropzone-input" accept=".pdf,.doc,.docx" onchange="reqHandleFileUpload(this)" />
              </div>
              <div class="req-file-preview ${window.clientReqData.jobDescriptionFileName ? 'has-file' : ''}" id="reqFilePreview">
                <span style="font-size: 0.82rem; font-weight: 700; color: var(--color-primary);" id="reqFileNameText">
                  📄 ${window.clientReqData.jobDescriptionFileName || ''}
                </span>
                <button type="button" class="btn btn-sm" style="padding: 0.2rem 0.5rem; background: #ffffff; color: #ef4444; border: 1px solid #e2e8f0;" onclick="reqRemoveFile(event)">Remove</button>
              </div>
              <div class="req-error-msg" id="err-file">File size exceeds 5MB or invalid format</div>
            </div>

            <!-- Consent Checkbox -->
            <div class="req-form-group full-width consent-box" id="group-consent">
              <label class="checkbox-label">
                <input type="checkbox" id="reqConsentCheckbox" ${window.clientReqData.consent ? 'checked' : ''} onchange="reqClearError('consent')" />
                <span>I agree to be contacted by CEGS regarding this hiring requirement. <span class="required-star">*</span></span>
              </label>
              <div class="req-error-msg" id="err-consent">Please agree to be contacted regarding your requirement</div>
            </div>

          </div>
        </div>

        <!-- WIZARD FOOTER NAVIGATION -->
        <div class="req-wizard-footer">
          <button type="button" class="btn btn-outline" id="reqBackBtn" style="visibility: hidden;" onclick="reqNavigateStep(-1)">
            ← Back
          </button>
          
          <div style="display: flex; gap: 0.75rem;">
            <button type="button" class="btn btn-outline" onclick="closeModal()">Cancel</button>
            <button type="button" class="btn btn-primary" id="reqNextBtn" onclick="reqNavigateStep(1)">
              Continue →
            </button>
          </div>
        </div>

      </form>
    </div>
  `;

  openModal(content);
  reqRenderTagChips();
};

window.reqClearError = function(fieldId) {
  const grp = document.getElementById('group-' + fieldId);
  if (grp) grp.classList.remove('has-error');
  const input = document.getElementById('reqInput-' + fieldId);
  if (input) input.classList.remove('input-error');
};

window.reqShowError = function(fieldId) {
  const grp = document.getElementById('group-' + fieldId);
  if (grp) grp.classList.add('has-error');
  const input = document.getElementById('reqInput-' + fieldId);
  if (input) {
    input.classList.add('input-error');
    input.focus();
  }
};

window.reqValidateCurrentStep = function(step) {
  let isValid = true;

  if (step === 1) {
    const comp = (document.getElementById('reqInput-companyName')?.value || '').trim();
    const person = (document.getElementById('reqInput-contactPerson')?.value || '').trim();
    const email = (document.getElementById('reqInput-workEmail')?.value || '').trim();
    const phone = (document.getElementById('reqInput-phone')?.value || '').trim();
    const industry = document.getElementById('reqInput-industry')?.value || '';

    if (!comp) { reqShowError('companyName'); isValid = false; }
    if (!person) { reqShowError('contactPerson'); isValid = false; }
    if (!email || !/\S+@\S+\.\S+/.test(email)) { reqShowError('workEmail'); isValid = false; }
    if (!phone || phone.length < 7) { reqShowError('phone'); isValid = false; }
    if (!industry) { reqShowError('industry'); isValid = false; }

    if (isValid) {
      window.clientReqData.companyName = comp;
      window.clientReqData.contactPerson = person;
      window.clientReqData.workEmail = email;
      window.clientReqData.phone = phone;
      window.clientReqData.industry = industry;
      window.clientReqData.companyWebsite = document.getElementById('reqInput-companyWebsite')?.value || '';
    }
  } else if (step === 2) {
    const title = (document.getElementById('reqInput-jobTitle')?.value || '').trim();
    const openings = (document.getElementById('reqInput-numberOfOpenings')?.value || '').trim();
    const exp = document.getElementById('reqInput-experienceRequired')?.value || '';
    const loc = (document.getElementById('reqInput-jobLocation')?.value || '').trim();

    if (!title) { reqShowError('jobTitle'); isValid = false; }
    if (!openings || parseInt(openings) < 1) { reqShowError('numberOfOpenings'); isValid = false; }
    if (!exp) { reqShowError('experienceRequired'); isValid = false; }
    if (!loc) { reqShowError('jobLocation'); isValid = false; }
    if (!window.clientReqData.requiredSkills || window.clientReqData.requiredSkills.length === 0) {
      reqShowError('requiredSkills');
      isValid = false;
    }

    if (isValid) {
      window.clientReqData.jobTitle = title;
      window.clientReqData.numberOfOpenings = openings;
      window.clientReqData.experienceRequired = exp;
      window.clientReqData.jobLocation = loc;
    }
  } else if (step === 3) {
    window.clientReqData.qualification = document.getElementById('reqInput-qualification')?.value || 'Any Graduate';
    window.clientReqData.minCTC = document.getElementById('reqInput-minCTC')?.value || '';
    window.clientReqData.maxCTC = document.getElementById('reqInput-maxCTC')?.value || '';
    window.clientReqData.candidateRequirements = document.getElementById('reqInput-candidateRequirements')?.value || '';
  } else if (step === 4) {
    const consent = document.getElementById('reqConsentCheckbox')?.checked;
    if (!consent) {
      reqShowError('consent');
      isValid = false;
    } else {
      window.clientReqData.consent = true;
      window.clientReqData.interviewRounds = document.getElementById('reqInput-interviewRounds')?.value || '2';
      window.clientReqData.additionalRequirements = document.getElementById('reqInput-additionalRequirements')?.value || '';
    }
  }

  return isValid;
};

window.reqNavigateStep = function(delta) {
  if (delta > 0) {
    if (!reqValidateCurrentStep(window.reqCurrentStep)) return;
    if (window.reqCurrentStep === 4) {
      reqSubmitForm();
      return;
    }
  }

  const nextStep = window.reqCurrentStep + delta;
  if (nextStep < 1 || nextStep > 4) return;

  // Update panels
  document.querySelectorAll('.req-step-container').forEach(p => p.classList.remove('active'));
  const targetPanel = document.getElementById('reqStepPanel-' + nextStep);
  if (targetPanel) targetPanel.classList.add('active');

  // Update Stepper Bar Indicators
  for (let i = 1; i <= 4; i++) {
    const item = document.getElementById('reqStepIndicator-' + i);
    if (!item) continue;
    item.classList.remove('active', 'completed');
    if (i < nextStep) {
      item.classList.add('completed');
      item.querySelector('.req-step-num').innerHTML = '✓';
    } else if (i === nextStep) {
      item.classList.add('active');
      item.querySelector('.req-step-num').innerHTML = i.toString();
    } else {
      item.querySelector('.req-step-num').innerHTML = i.toString();
    }
  }

  window.reqCurrentStep = nextStep;

  // Update footer button labels
  const backBtn = document.getElementById('reqBackBtn');
  const nextBtn = document.getElementById('reqNextBtn');

  if (backBtn) {
    backBtn.style.visibility = (nextStep === 1) ? 'hidden' : 'visible';
  }

  if (nextBtn) {
    if (nextStep === 4) {
      nextBtn.innerHTML = 'Submit Hiring Requirement';
      nextBtn.className = 'btn btn-primary';
    } else {
      nextBtn.innerHTML = 'Continue →';
      nextBtn.className = 'btn btn-primary';
    }
  }
};

window.reqSelectChoice = function(el, field, value) {
  const container = el.parentElement;
  if (container) {
    container.querySelectorAll('.req-choice-card').forEach(c => c.classList.remove('active'));
  }
  el.classList.add('active');
  window.clientReqData[field] = value;
};

window.reqSelectPillSingle = function(el, field, value) {
  const container = el.parentElement;
  if (container) {
    container.querySelectorAll('.req-pill-item').forEach(p => p.classList.remove('active'));
  }
  el.classList.add('active');
  window.clientReqData[field] = value;
};

window.reqToggleMultiPill = function(el, field, value) {
  if (!Array.isArray(window.clientReqData[field])) {
    window.clientReqData[field] = [];
  }
  const idx = window.clientReqData[field].indexOf(value);
  if (idx > -1) {
    window.clientReqData[field].splice(idx, 1);
    el.classList.remove('active');
  } else {
    window.clientReqData[field].push(value);
    el.classList.add('active');
  }
};

window.reqRenderTagChips = function() {
  const container = document.getElementById('reqTagChips');
  if (!container) return;
  container.innerHTML = (window.clientReqData.requiredSkills || []).map(s => `
    <span class="req-tag-chip">
      ${s}
      <button type="button" onclick="reqRemoveTag('${s}')">×</button>
    </span>
  `).join('');
};

window.reqAddTag = function(skill) {
  const trimmed = skill.trim();
  if (!trimmed) return;
  if (!window.clientReqData.requiredSkills.includes(trimmed)) {
    window.clientReqData.requiredSkills.push(trimmed);
    reqRenderTagChips();
    reqClearError('requiredSkills');
  }
  const input = document.getElementById('reqTagInput');
  if (input) input.value = '';
};

window.reqRemoveTag = function(skill) {
  window.clientReqData.requiredSkills = window.clientReqData.requiredSkills.filter(s => s !== skill);
  reqRenderTagChips();
};

window.reqHandleTagKey = function(e) {
  if (e.key === 'Enter' || e.key === ',') {
    e.preventDefault();
    const val = e.target.value.replace(/,/g, '').trim();
    if (val) reqAddTag(val);
  }
};

window.reqHandleFileUpload = function(input) {
  const file = input.files[0];
  const err = document.getElementById('err-file');
  const preview = document.getElementById('reqFilePreview');
  const nameText = document.getElementById('reqFileNameText');

  if (!file) return;

  if (file.size > 5 * 1024 * 1024) {
    if (err) err.style.display = 'block';
    input.value = '';
    return;
  }

  if (err) err.style.display = 'none';
  window.clientReqData.jobDescriptionFileName = file.name;
  if (nameText) nameText.innerHTML = `📄 ${file.name} (${(file.size / (1024 * 1024)).toFixed(2)} MB)`;
  if (preview) preview.classList.add('has-file');
};

window.reqRemoveFile = function(e) {
  if (e) e.stopPropagation();
  window.clientReqData.jobDescriptionFileName = '';
  const input = document.getElementById('reqFileInput');
  if (input) input.value = '';
  const preview = document.getElementById('reqFilePreview');
  if (preview) preview.classList.remove('has-file');
};

window.reqSubmitForm = function(e) {
  if (e) e.preventDefault();
  if (!reqValidateCurrentStep(4)) return;

  // Render Success Screen inside Modal
  const modalContainer = document.querySelector('.modal-container');
  const modalBody = document.getElementById('modalBody');
  if (!modalBody) return;

  modalBody.innerHTML = `
    <div class="req-success-screen">
      <div class="req-success-icon-wrap">
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"></polyline></svg>
      </div>
      <h3>Requirement Submitted Successfully!</h3>
      <p>Thank you for sharing your hiring requirement. Our recruitment team will review your needs and contact you shortly.</p>

      <div class="req-summary-card">
        <div class="req-summary-item">
          <small>Company</small>
          <strong>${window.clientReqData.companyName || 'Enterprise Client'}</strong>
        </div>
        <div class="req-summary-item">
          <small>Position / Role</small>
          <strong>${window.clientReqData.jobTitle || 'Role Vacancy'}</strong>
        </div>
        <div class="req-summary-item">
          <small>Openings</small>
          <strong>${window.clientReqData.numberOfOpenings} Vacancies</strong>
        </div>
        <div class="req-summary-item">
          <small>Hiring Timeline</small>
          <strong>${window.clientReqData.hiringTimeline}</strong>
        </div>
      </div>

      <button type="button" class="btn btn-primary" style="padding: 0.85rem 2.5rem; font-weight: 700;" onclick="closeModal()">
        Done
      </button>
    </div>
  `;

  showToast("Hiring requirement received! Our senior recruiter will reach out shortly.");
};

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

// 7. FAQ Accordion initialization (handled directly via toggleFaq in app.js)
function initFaqAccordion() {
  // Handled cleanly via window.toggleFaq
}

// 8. Blog & Article Reader Modal
window.openBlogPostModal = function(blogId) {
  if (!CEGS_DATA.blogs) return;
  const blog = CEGS_DATA.blogs.find(b => b.id === blogId);
  if (!blog) return;

  const content = `
    <div class="blog-modal-article">
      <div class="blog-modal-header">
        <div style="display: flex; align-items: center; gap: 0.75rem; margin-bottom: 0.75rem;">
          <span class="badge badge-${blog.categoryColor || 'teal'}">${blog.category}</span>
          <span style="font-size: 0.8rem; font-weight: 700; color: #64748b;">
            ⏱️ ${blog.readTime}
          </span>
        </div>

        <h1 class="blog-modal-title">${blog.title}</h1>

        <div class="blog-modal-meta">
          <div class="author-chip">
            <div class="author-avatar-chip">${blog.authorAvatar}</div>
            <div class="author-details">
              <h5>${blog.author}</h5>
              <p>${blog.authorRole} • Published ${blog.date}</p>
            </div>
          </div>

          <button type="button" class="btn btn-outline btn-sm" onclick="copyBlogLink('${blog.title}')" title="Share this analysis">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line></svg>
            <span>Share Article</span>
          </button>
        </div>
      </div>

      <div class="blog-modal-content">
        ${blog.content}
      </div>

      <div style="margin-top: 2rem; display: flex; gap: 0.5rem; flex-wrap: wrap;">
        ${blog.tags.map(t => `<span class="blog-mini-tag" style="font-size: 0.8rem; padding: 0.3rem 0.75rem;">#${t}</span>`).join('')}
      </div>

      <div class="blog-modal-cta">
        <div>
          <h4 style="margin: 0 0 0.25rem; color: #0f1c2d; font-weight: 800;">Consult With Our Specialists</h4>
          <p style="margin: 0; font-size: 0.9rem; color: #64748b;">Apply these frameworks directly to your hiring pipeline or organizational structure.</p>
        </div>
        <div style="display: flex; gap: 0.75rem;">
          <button type="button" class="btn btn-primary btn-sm" onclick="closeModal(); openBookingModal();">Book Consultation</button>
          <button type="button" class="btn btn-outline btn-sm" onclick="closeModal()">Close</button>
        </div>
      </div>
    </div>
  `;

  openModal(content);
};

window.copyBlogLink = function(title) {
  const currentUrl = window.location.origin + window.location.pathname + '#blog';
  if (navigator.clipboard) {
    navigator.clipboard.writeText(currentUrl).then(() => {
      showToast(`Link copied to clipboard! Share "${title}" with your team.`);
    }).catch(() => {
      showToast(`Link copied: ${currentUrl}`);
    });
  } else {
    showToast(`Link copied: ${currentUrl}`);
  }
};
