/**
 * CEGS Enterprise & Recruiter Data Store
 * Authentic data for Consulting, Staffing, Payroll, Tech & BPO Services
 */

const CEGS_DATA = {
  company: {
    name: "CEGS",
    tagline: "The Right Opportunity is Waiting for You",
    subtagline: "Connecting ambitious professionals to their dream careers and empowering enterprises with world-class talent, compliant payroll, web development, and certified training.",
    experienceYears: "10+",
    stats: [
      { label: "Successful Placements", value: "18,500+", subtext: "Across Tech & Non-Tech" },
      { label: "Turnaround Time", value: "48 Hours", subtext: "Average first shortlist" },
      { label: "Enterprise Clients", value: "320+", subtext: "Global MNCs & Scaleups" },
      { label: "Candidate Retention", value: "96.8%", subtext: "Past 12-month tenure" }
    ],
    contacts: {
      phone: "+91 80 4123 7890",
      email: "connect@cegs.in",
      careersEmail: "careers@cegs.in",
      salesEmail: "business@cegs.in",
      headquarters: "CEGS Towers, 4th Block, Koramangala, Bengaluru, Karnataka 560034, India",
      branches: [
        { city: "Bengaluru (HQ)", address: "Koramangala 4th Block, Bengaluru, 560034" },
        { city: "Pune", address: "Magarpatta Cybercity, Hadapsar, Pune, 411013" },
        { city: "Hyderabad", address: "HITEC City, Madhapur, Hyderabad, 500081" }
      ],
      socials: {
        linkedin: "https://www.linkedin.com/company/cegs",
        twitter: "https://x.com/cegs_global",
        instagram: "https://instagram.com/cegs_global",
        facebook: "https://facebook.com/cegsconsulting"
      }
    }
  },

  services: [
    {
      id: "hr-consulting",
      title: "HR Consulting",
      shortDescription: "Strategic organizational structuring, HR policy frameworks, talent retention blueprints, and compliance audits for growing teams.",
      icon: "users-gear",
      badge: "Strategic Advisory",
      featured: true,
      color: "teal",
      highlights: [
        "Organization Design & Workforce Planning",
        "Compensation & Benefits Benchmarking (C&B)",
        "Performance Management Frameworks (OKRs/KPIs)",
        "Labor Law & Statutory HR Compliance Audits",
        "Employee Retention & Culture Transformation"
      ],
      fullContent: {
        overview: "Our HR Consulting practice empowers C-suite leaders and HR heads with agile, compliant, and data-driven workforce strategies. We don't just draft policies; we design workplace ecosystems that attract, motivate, and retain top-tier talent.",
        deliverables: [
          { title: "Compensation Architecture", desc: "Granular salary banding based on industry percentiles to keep you competitive." },
          { title: "Statutory & Labor Compliance", desc: "Complete risk audit protecting your enterprise from regulatory non-compliance." },
          { title: "Performance Engineering", desc: "Transition from vague annual reviews to transparent continuous feedback systems." }
        ],
        metrics: "40% increase in candidate acceptance rate across advised clients"
      }
    },
    {
      id: "staffing-solutions",
      title: "Staffing Solutions",
      shortDescription: "End-to-end recruitment lifecycle from niche IT talent to executive leadership and rapid volume hiring.",
      icon: "user-check",
      badge: "Core Expertise",
      featured: true,
      color: "blue",
      highlights: [
        "Executive Search & Leadership Hiring (CXO, VP)",
        "Permanent IT & Tech Engineering Placement",
        "Contract Staffing & Staff Augmentation",
        "Campus & Mass Volume Hiring Drives",
        "Pre-Vetted Technical Assessment Pipeline"
      ],
      fullContent: {
        overview: "CEGS Staffing Solutions bridges the talent gap with precision and speed. Utilizing our proprietary sourcing engine and deep recruiter talent network, we deliver curated candidate profiles within 48 to 72 hours.",
        deliverables: [
          { title: "48-Hour Shortlists", desc: "Rigorous 3-tier technical screening before CVs ever reach your inbox." },
          { title: "Contract-to-Hire Models", desc: "Flexible staffing that gives you bandwidth without long-term overhead liabilities." },
          { title: "CXO Headhunting", desc: "Discreet, confidential search for transformative leadership talent." }
        ],
        metrics: "92% interview-to-offer ratio through pre-qualified pipelines"
      }
    },
    {
      id: "payroll-management",
      title: "Payroll Management",
      shortDescription: "Zero-error payroll processing, automated statutory compliance (PF, ESIC, TDS, PT), and seamless tax filing.",
      icon: "calculator",
      badge: "100% Compliant",
      featured: true,
      color: "teal",
      highlights: [
        "End-to-End Monthly Payroll Execution",
        "Statutory Filings (PF, ESIC, Professional Tax, TDS)",
        "Automated Employee Self-Service (ESS) Portal",
        "Form 16 Generation & Tax Computations",
        "Multi-State Compliance & Labor Inspections Defense"
      ],
      fullContent: {
        overview: "Eliminate payroll headaches and statutory liability. CEGS ensures accurate, on-time salary disbursements, automated tax calculations, and zero-penalty regulatory filings so your finance team can focus on growth.",
        deliverables: [
          { title: "Zero Penalty Guarantee", desc: "Rigorous calendar-tracked statutory remittance and filing." },
          { title: "Digital Payslips & Portals", desc: "Self-service reimbursement claims, tax proofs, and instant payslip downloads." },
          { title: "Custom ERP & HRMS Sync", desc: "Direct integrations with modern accounting and ERP platforms." }
        ],
        metrics: "99.99% payroll accuracy with 100% on-time disbursement record"
      }
    },
    {
      id: "it-services",
      title: "IT Services",
      shortDescription: "Enterprise web development, iOS/Android mobile apps, custom AI/ML integrations, UI/UX design, and organic SEO services.",
      icon: "code",
      badge: "Modern Tech",
      featured: true,
      color: "blue",
      highlights: [
        "Web Development (React, Next.js, Node, Python, Cloud)",
        "App Development (iOS, Android, Flutter & React Native)",
        "AI / ML Development & Intelligent Automation",
        "E-commerce Development (Shopify, WooCommerce, Custom)",
        "UI/UX Design & Human-Centered Prototyping",
        "Comprehensive Search Engine Optimization (SEO)"
      ],
      fullContent: {
        overview: "CEGS IT Services delivers enterprise-grade software engineering, mobile ecosystems, and intelligent digital experiences. From rapid MVP deployments to full-scale cloud migrations and AI automations, we build high-performance products engineered for scale.",
        deliverables: [
          { title: "Enterprise Web & SaaS Platforms", desc: "Clean architecture, robust API microservices, and rock-solid cloud infrastructure." },
          { title: "Cross-Platform Mobile Apps", desc: "Native-grade iOS & Android applications with flawless user experience and speed." },
          { title: "AI/ML & Intelligent Systems", desc: "Custom LLM automations, predictive models, and smart operational pipelines." }
        ],
        metrics: "Over 45+ enterprise digital products & applications deployed globally"
      }
    },
    {
      id: "bpo-inside-sales",
      title: "BPO / KPO & Inside Sales",
      shortDescription: "High-velocity outbound sales development, customer success operations, technical support, and data intelligence.",
      icon: "headset",
      badge: "Revenue Engine",
      featured: true,
      color: "orange",
      highlights: [
        "Dedicated Inside Sales & SDR Pipeline Engines",
        "Inbound & Outbound Customer Support (Voice / Chat / Email)",
        "Data Enrichment, Research & KPO Services",
        "Lead Qualification & Appointment Setting (B2B/B2C)",
        "24/7 Multi-Shift Global Support Teams"
      ],
      fullContent: {
        overview: "Accelerate your revenue engine and customer delight with CEGS managed operations. Our trained BPO & Inside Sales professionals act as seamless extensions of your internal team, driving qualified leads and delivering world-class customer experiences.",
        deliverables: [
          { title: "Trained SDR Squads", desc: "Cold outreach, email sequencing, LinkedIn prospecting, and discovery call bookings." },
          { title: "Omnichannel Support", desc: "Round-the-clock ticket resolution with CSAT scores consistently above 94%." },
          { title: "Performance-Tied SLAs", desc: "Transparent metrics with weekly pipeline reviews and call recording quality audits." }
        ],
        metrics: "Over $18M+ qualified sales pipeline generated for B2B partners"
      }
    },
    {
      id: "training-courses",
      title: "Training & Career Courses",
      shortDescription: "Industry-aligned corporate upskilling, technical engineering bootcamps, sales mastery, and executive leadership coaching.",
      icon: "graduation-cap",
      badge: "Certified Programs",
      featured: true,
      color: "teal",
      highlights: [
        "Corporate Workforce Upskilling & Tech Bootcamps",
        "Inside Sales & BPO Communication Excellence",
        "Statutory HR & Payroll Compliance Masterclasses",
        "Executive Leadership & Management Enablement",
        "Job-Ready Practical Projects & Certifications"
      ],
      fullContent: {
        overview: "Empower your team and accelerate professional growth with CEGS training programs. Designed and delivered by seasoned industry practitioners, our courses bridge the skill gap through hands-on project work, interactive workshops, and recognized certifications.",
        deliverables: [
          { title: "Custom Enterprise Cohorts", desc: "Tailored upskilling roadmaps built specifically for your internal tech stack and organizational KPIs." },
          { title: "Hands-On Practical Labs", desc: "Real-world scenario simulations, live coding sessions, and production-grade casework." },
          { title: "Industry Certifications", desc: "Verified credentials, skill assessments, and direct placement pipeline support." }
        ],
        metrics: "Over 8,500+ professionals trained with 94% CSAT completion rating"
      }
    }
  ],

  intentOptions: [
    {
      id: "hire-talent",
      title: "We are a company looking to hire candidates",
      description: "Get pre-vetted top 5% talent in 48 hours across Tech, Non-Tech, Sales, and Leadership roles.",
      badge: "For Employers & Founders",
      themeClass: "intent-teal",
      targetHash: "#hire-talent",
      actionText: "Request Talent Profile"
    },
    {
      id: "find-jobs",
      title: "I'm individual looking for job vacancies",
      description: "Discover curated job openings at top MNCs, unicorn startups, and high-growth firms with fast feedback.",
      badge: "For Job Seekers & Professionals",
      themeClass: "intent-orange",
      targetHash: "#careers",
      actionText: "Explore Live Jobs"
    },
    {
      id: "corporate-services",
      title: "We are consultants looking for corporate clients",
      description: "Partner with CEGS for HR consulting, payroll compliance, tech solutions, and BPO co-sourcing.",
      badge: "For B2B Partners & Consultancies",
      themeClass: "intent-slate",
      targetHash: "#services",
      actionText: "Explore Partnership"
    }
  ],

  liveJobs: [
    {
      id: "CEGS-JOB-101",
      title: "Senior Full Stack Engineer (React / Node.js)",
      department: "Technology",
      type: "Full-Time",
      location: "Bengaluru (Hybrid)",
      experience: "4 - 7 Years",
      salary: "₹18,00,000 - ₹28,00,000 LPA",
      posted: "2 days ago",
      tags: ["React", "Node.js", "PostgreSQL", "AWS"],
      description: "We are seeking an experienced Full Stack Developer for a leading Fintech unicorn client. You will architect high-concurrency microservices, design responsive interfaces, and optimize API throughput.",
      requirements: [
        "4+ years of production experience in React, TypeScript, and Node.js",
        "Solid grasp of relational databases (PostgreSQL/MySQL) and caching (Redis)",
        "Experience in Docker, AWS CI/CD pipelines, and microservices architecture",
        "Strong problem-solving and communication skills"
      ]
    },
    {
      id: "CEGS-JOB-102",
      title: "Corporate HR Business Partner (HRBP)",
      department: "Human Resources",
      type: "Full-Time",
      location: "Bengaluru (On-site)",
      experience: "5 - 8 Years",
      salary: "₹12,00,000 - ₹18,00,000 LPA",
      posted: "1 day ago",
      tags: ["HR Strategy", "Talent Management", "Labor Compliance", "Org Development"],
      description: "Looking for a proactive HRBP to partner with business leadership, drive employee engagement, execute talent acquisition strategies, and oversee performance cycles.",
      requirements: [
        "MBA in Human Resources with 5+ years in IT/Services sector",
        "Hands-on experience in talent management, grievances, and workforce analytics",
        "Strong understanding of Indian labor statutory laws and retention strategies"
      ]
    },
    {
      id: "CEGS-JOB-103",
      title: "Enterprise Inside Sales Specialist (US/EMEA Shift)",
      department: "Sales & BPO",
      type: "Full-Time",
      location: "Bengaluru / Remote",
      experience: "2 - 5 Years",
      salary: "₹7,00,000 - ₹12,00,000 LPA + Uncapped Incentives",
      posted: "Just now",
      tags: ["B2B SaaS", "Outbound Prospecting", "HubSpot", "Cold Calling"],
      description: "Drive outbound revenue pipelines for international B2B SaaS clients. You will conduct discovery calls, qualify prospects, and book high-value meetings for account executives.",
      requirements: [
        "Proven track record in US/UK outbound cold calling and LinkedIn outreach",
        "Exceptional verbal and written English communication",
        "Familiarity with CRM tools (Salesforce/HubSpot) and sales sequencing"
      ]
    },
    {
      id: "CEGS-JOB-104",
      title: "Payroll & Statutory Compliance Specialist",
      department: "Payroll & Finance",
      type: "Full-Time",
      location: "Pune / Hybrid",
      experience: "3 - 6 Years",
      salary: "₹6,50,000 - ₹10,00,000 LPA",
      posted: "3 days ago",
      tags: ["Payroll Operations", "PF & ESIC", "TDS / Form 16", "Excel Advanced"],
      description: "Manage end-to-end payroll processing for 1000+ employee headcount across multiple entities. Handle PF, ESIC, PT challans, tax deduction computations, and audit prep.",
      requirements: [
        "Strong expertise in Indian payroll software and statutory portals",
        "Accurate computation of overtime, leaves, bonuses, and full & final settlements",
        "Degree in Commerce/Finance or related certification"
      ]
    },
    {
      id: "CEGS-JOB-105",
      title: "Technical Recruiter (IT Talent Sourcing)",
      department: "Staffing",
      type: "Full-Time",
      location: "Bengaluru (Hybrid)",
      experience: "2 - 4 Years",
      salary: "₹5,00,000 - ₹8,50,000 LPA + Placement Bonus",
      posted: "Today",
      tags: ["Tech Recruitment", "Boolean Search", "LinkedIn Recruiter", "Candidate Experience"],
      description: "Join the internal CEGS sourcing squad! Identify, engage, and screen top software developers, DevOps engineers, and product managers for our marquee clients.",
      requirements: [
        "2+ years experience in IT recruitment agency or fast-paced startup",
        "Mastery of boolean search, GitHub/LinkedIn talent mapping",
        "High energy and excellent relationship-building skills"
      ]
    },
    {
      id: "CEGS-JOB-106",
      title: "UI/UX Product Designer",
      department: "Technology",
      type: "Full-Time",
      location: "Remote / Hybrid",
      experience: "3 - 5 Years",
      salary: "₹10,00,000 - ₹16,00,000 LPA",
      posted: "4 days ago",
      tags: ["Figma", "Design Systems", "User Research", "Prototyping"],
      description: "Design intuitive enterprise dashboards, mobile interfaces, and web platforms for our digital engineering studio and client partners.",
      requirements: [
        "Strong portfolio demonstrating web/SaaS UI workflows and design systems",
        "Deep proficiency in Figma, auto-layout, and interactive prototyping",
        "Ability to translate complex business workflows into clean, human UI"
      ]
    }
  ],

  testimonials: [
    {
      quote: "CEGS transformed our engineering hiring. We needed 8 senior React and Cloud engineers within 3 weeks for our product launch. They delivered pre-screened talent in 48 hours, and 7 of them are now key tech leads in our company.",
      author: "Vikramaditya Rao",
      role: "VP of Engineering, NeoTech Financials",
      avatar: "VR",
      rating: 5
    },
    {
      quote: "Switching our 600+ employee payroll and statutory compliance to CEGS eliminated every single error we used to face. Their team is prompt, highly professional, and our audits are now 100% painless.",
      author: "Ananya Deshmukh",
      role: "Head of People & Operations, CloudScale Global",
      avatar: "AD",
      rating: 5
    },
    {
      quote: "The Inside Sales squad CEGS assembled for our North American market generated over $3.2M in qualified pipeline in Q3 alone. Their training standards and work ethic are world-class.",
      author: "David Vance",
      role: "Managing Director, Apex Software Partners",
      avatar: "DV",
      rating: 5
    }
  ],

  faqs: [
    {
      q: "How fast can CEGS deploy candidates or teams?",
      a: "For lateral and individual contributor roles, we present your first batch of vetted resumes within 48 to 72 hours. For specialized teams or BPO squads, rollout typically takes 7 to 14 business days depending on headcount."
    },
    {
      q: "What hiring models do you offer for enterprises?",
      a: "We provide complete flexibility: Permanent Placement (contingency or retained), Contract Staff Augmentation (monthly billing), Contract-to-Hire, Executive Search for C-suite, and Managed Project Teams."
    },
    {
      q: "How does CEGS ensure 100% statutory payroll compliance?",
      a: "Our dedicated payroll specialists maintain strict compliance with all central and state labor regulations (PF, ESIC, Professional Tax, Labor Welfare Fund, and TDS). We generate automated audit-ready reports and guarantee zero compliance penalties."
    },
    {
      q: "Can candidates apply directly for open positions?",
      a: "Yes! Candidates can browse our live Careers portal, filter by expertise and location, and submit their resume with a 1-click application. Our recruiters review every profile and respond within 24 business hours."
    },
    {
      q: "What makes CEGS different from standard consultancies?",
      a: "We combine high-touch human recruitment expertise with proprietary talent assessment screening, comprehensive digital technology delivery, and integrated payroll support under one single trusted umbrella."
    }
  ]
};
