// Vercel Serverless Function - CEGS Candidate Applications & Registrations API
let candidatesStore = [
  {
    id: "CAND-1001",
    full_name: "Rahul Sharma",
    email: "rahul.sharma@example.com",
    phone: "+91 98765 43210",
    job_id: "1",
    job_title: "Senior Full Stack Software Engineer (NeoTech Global Solutions)",
    source: "Job Application",
    experience: "5.5 Years",
    current_ctc: "₹16 LPA",
    expected_ctc: "₹22 LPA",
    location: "Bengaluru (Koramangala)",
    skills: "React.js, Node.js, TypeScript, PostgreSQL, AWS, Docker",
    linkedin_url: "https://linkedin.com/in/rahulsharma-dev",
    cover_message: "Experienced Full Stack engineer with strong backend architecture expertise in Node.js and modern React frontends. Looking for senior engineering roles.",
    resume_filename: "Rahul_Sharma_Resume.pdf",
    resume_preview: "Rahul Sharma — Senior Full Stack Developer\n5.5 Years Experience in React.js, Node.js, TypeScript, PostgreSQL.\nKey Projects: Enterprise SaaS Platforms, Real-time APIs, Microservices.",
    status: "Shortlisted",
    recruiter_notes: "Strong technical background. Cleared initial screening. Technical round scheduled for Thursday 3:00 PM.",
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "CAND-1002",
    full_name: "Ananya Sen",
    email: "ananya.sen@example.com",
    phone: "+91 98451 22334",
    job_id: "2",
    job_title: "International Inside Sales Specialist (CloudScale International)",
    source: "Job Application",
    experience: "3.2 Years",
    current_ctc: "₹7.5 LPA",
    expected_ctc: "₹10 LPA",
    location: "Bengaluru (Electronic City)",
    skills: "B2B Outbound, SDR, Salesforce, US Shift Cold Calling, Lead Generation",
    linkedin_url: "https://linkedin.com/in/ananya-sen-sales",
    cover_message: "Proven track record in US outbound SDR calling and high pipeline generation. Consistent 120% quota achiever.",
    resume_filename: "Ananya_Sen_CV.pdf",
    resume_preview: "Ananya Sen — B2B Inside Sales Specialist\n3.2 Years in North America and EMEA outbound prospecting, Salesforce CRM, HubSpot.",
    status: "New",
    recruiter_notes: "Profile received via Careers portal. Good communication score.",
    created_at: new Date(Date.now() - 18 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "CAND-1003",
    full_name: "Vikramaditya Rao",
    email: "vikram.rao@example.com",
    phone: "+91 99001 54321",
    job_id: "3",
    job_title: "Payroll & Compliance Executive (Apex FinServe)",
    source: "Job Application",
    experience: "4 Years",
    current_ctc: "₹5.8 LPA",
    expected_ctc: "₹8 LPA",
    location: "Bengaluru (Indiranagar)",
    skills: "Indian Labor Law, PF, ESIC, Form 16, TDS, Zoho Payroll",
    linkedin_url: "https://linkedin.com/in/vikram-rao-payroll",
    cover_message: "Specialist in payroll compliance for 500+ employee workforces, statutory audits and labor governance.",
    resume_filename: "Vikram_Rao_Payroll.pdf",
    resume_preview: "Vikramaditya Rao — Payroll & Compliance Executive\n4 Years Experience. Managed end-to-end payroll processing and statutory filings.",
    status: "Interview",
    recruiter_notes: "Interview round 1 completed with positive feedback from HR Operations Lead.",
    created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "CAND-1004",
    full_name: "Pooja Venkatesh",
    email: "pooja.v@example.com",
    phone: "+91 98860 11223",
    job_id: null,
    job_title: "Candidate Registration — IT & Software",
    source: "Candidate Registration Wizard",
    experience: "2 - 5 Years",
    current_ctc: "₹6 LPA",
    expected_ctc: "₹9 LPA",
    location: "Bangalore",
    skills: "Java, Spring Boot, MySQL, REST APIs",
    linkedin_url: "",
    cover_message: "Registered via CEGS Candidate Wizard looking for backend software developer openings in Bangalore.",
    resume_filename: "Pooja_V_Profile.pdf",
    resume_preview: "Pooja Venkatesh — Java Backend Developer\nSkills: Core Java, Spring Boot, Hibernate, MySQL, Git.",
    status: "New",
    recruiter_notes: "",
    created_at: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString()
  }
];

module.exports = (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // GET: Fetch candidates with optional search / filter
  if (req.method === 'GET') {
    const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
    const search = (url.searchParams.get('search') || '').toLowerCase().trim();
    const status = url.searchParams.get('status') || '';
    const id = url.searchParams.get('id') || '';

    if (id) {
      const single = candidatesStore.find(c => String(c.id) === String(id));
      if (!single) {
        return res.status(404).json({ status: 'error', message: 'Candidate not found' });
      }
      return res.status(200).json({ status: 'success', data: single });
    }

    let filtered = candidatesStore;

    if (status && status !== 'All') {
      filtered = filtered.filter(c => String(c.status).toLowerCase() === status.toLowerCase());
    }

    if (search) {
      filtered = filtered.filter(c => 
        (c.full_name && c.full_name.toLowerCase().includes(search)) ||
        (c.email && c.email.toLowerCase().includes(search)) ||
        (c.phone && c.phone.toLowerCase().includes(search)) ||
        (c.job_title && c.job_title.toLowerCase().includes(search)) ||
        (c.skills && c.skills.toLowerCase().includes(search)) ||
        (c.location && c.location.toLowerCase().includes(search))
      );
    }

    return res.status(200).json({
      status: 'success',
      total: candidatesStore.length,
      count: filtered.length,
      data: filtered
    });
  }

  // POST: Create new candidate registration / application
  if (req.method === 'POST') {
    let body = req.body || {};
    if (typeof body === 'string') {
      try { body = JSON.parse(body); } catch (e) {}
    }

    const newCandidate = {
      id: body.id || `CAND-${Date.now()}`,
      full_name: body.full_name || body.name || body.contactName || 'Candidate',
      email: body.email || '',
      phone: body.phone || body.mobileNumber || '',
      job_id: body.job_id || null,
      job_title: body.job_title || body.applied_role || (body.industry ? `Candidate Registration — ${body.industry}` : 'General Candidate Application'),
      source: body.source || (body.industry ? 'Candidate Registration Wizard' : 'Job Application'),
      experience: body.experience || '',
      current_ctc: body.current_ctc || '',
      expected_ctc: body.expected_ctc || '',
      location: body.location || 'Bengaluru',
      skills: body.skills || '',
      linkedin_url: body.linkedin_url || '',
      cover_message: body.cover_message || body.message || '',
      resume_filename: body.resume_filename || (body.full_name ? `${body.full_name.replace(/\s+/g, '_')}_Resume.pdf` : 'Candidate_Resume.pdf'),
      resume_preview: body.resume_preview || body.resume_data || `Resume submitted for ${body.full_name || 'Candidate'}.\nExperience: ${body.experience || 'N/A'}\nSkills: ${body.skills || 'N/A'}`,
      resume_data: body.resume_data || '',
      status: body.status || 'New',
      recruiter_notes: body.recruiter_notes || '',
      created_at: body.created_at || new Date().toISOString()
    };

    candidatesStore.unshift(newCandidate);

    return res.status(201).json({
      status: 'success',
      message: 'Candidate application / registration submitted successfully!',
      data: newCandidate
    });
  }

  // PUT: Update candidate status and recruiter notes
  if (req.method === 'PUT') {
    let body = req.body || {};
    if (typeof body === 'string') {
      try { body = JSON.parse(body); } catch (e) {}
    }

    const id = body.id;
    if (!id) {
      return res.status(400).json({ status: 'error', message: 'Candidate ID is required for update' });
    }

    const idx = candidatesStore.findIndex(c => String(c.id) === String(id));
    if (idx === -1) {
      return res.status(404).json({ status: 'error', message: 'Candidate not found' });
    }

    candidatesStore[idx] = {
      ...candidatesStore[idx],
      ...body,
      updated_at: new Date().toISOString()
    };

    return res.status(200).json({
      status: 'success',
      message: 'Candidate details updated successfully',
      data: candidatesStore[idx]
    });
  }

  // DELETE: Remove candidate record
  if (req.method === 'DELETE') {
    const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
    const id = url.searchParams.get('id') || (req.body && req.body.id);

    if (!id) {
      return res.status(400).json({ status: 'error', message: 'Candidate ID is required for deletion' });
    }

    const initialLen = candidatesStore.length;
    candidatesStore = candidatesStore.filter(c => String(c.id) !== String(id));

    if (candidatesStore.length === initialLen) {
      return res.status(404).json({ status: 'error', message: 'Candidate not found' });
    }

    return res.status(200).json({
      status: 'success',
      message: 'Candidate application deleted successfully'
    });
  }

  return res.status(200).json({ status: 'success', data: candidatesStore });
};
