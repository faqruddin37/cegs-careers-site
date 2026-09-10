// Vercel Serverless Function - CEGS Client Enquiries & Hiring Leads API
let enquiriesStore = [
  {
    id: "ENQ-2001",
    company_name: "Apex Global Technologies",
    contact_person: "Priya Menon",
    email: "priya.menon@apexglobal.io",
    phone: "+91 80 4910 2200",
    company_website: "https://apexglobal.io",
    business_location: "Bengaluru (Koramangala)",
    partnership_type: "Client Hiring Requirement",
    job_title: "Senior Full Stack & DevOps Engineers",
    number_of_openings: "12",
    experience_required: "5–8 Years",
    job_location: "Bangalore (Hybrid)",
    work_mode: "Hybrid",
    employment_type: "Full Time",
    required_skills: "React.js, Node.js, AWS, Kubernetes, Terraform",
    qualification: "B.Tech / BE",
    min_ctc: "₹18 LPA",
    max_ctc: "₹28 LPA",
    notice_period: "30 Days Max",
    preferred_shift: "General Day Shift",
    hiring_timeline: "Immediate (Next 30 Days)",
    interview_mode: "Online",
    interview_rounds: "3",
    additional_requirements: "Looking for top-tier engineers with high production experience. Need first shortlist batch in 72 hours.",
    status: "In Discussion",
    recruiter_notes: "Initial requirement discovery call completed. Recruiter assigned. 6 matching candidate profiles shared.",
    created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "ENQ-2002",
    company_name: "FinPulse Solutions India",
    contact_person: "Karthik Sundaram",
    email: "karthik.s@finpulse.com",
    phone: "+91 99400 88776",
    company_website: "https://finpulse.com",
    business_location: "Bengaluru (Indiranagar)",
    partnership_type: "Client Hiring Requirement",
    job_title: "Inside Sales SDR & B2B Leads Executives",
    number_of_openings: "8",
    experience_required: "1–3 Years",
    job_location: "Bangalore",
    work_mode: "On-site",
    employment_type: "Full Time",
    required_skills: "Inside Sales, B2B Cold Calling, CRM, Pipeline Management",
    qualification: "Any Graduate",
    min_ctc: "₹4.5 LPA",
    max_ctc: "₹7.5 LPA",
    notice_period: "Immediate to 15 Days",
    preferred_shift: "US Shift",
    hiring_timeline: "Within 2 Weeks",
    interview_mode: "Face to Face / Hybrid",
    interview_rounds: "2",
    additional_requirements: "Fluent US English accent and strong outbound persistence required. Free 2-way cab provided by company.",
    status: "New",
    recruiter_notes: "New inquiry from website hiring wizard. Needs discovery follow-up today.",
    created_at: new Date(Date.now() - 10 * 60 * 60 * 1000).toISOString()
  }
];

module.exports = (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // GET: Fetch client enquiries
  if (req.method === 'GET') {
    const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
    const search = (url.searchParams.get('search') || '').toLowerCase().trim();
    const status = url.searchParams.get('status') || '';
    const id = url.searchParams.get('id') || '';

    if (id) {
      const single = enquiriesStore.find(e => String(e.id) === String(id));
      if (!single) {
        return res.status(404).json({ status: 'error', message: 'Enquiry not found' });
      }
      return res.status(200).json({ status: 'success', data: single });
    }

    let filtered = enquiriesStore;

    if (status && status !== 'All') {
      filtered = filtered.filter(e => String(e.status).toLowerCase() === status.toLowerCase());
    }

    if (search) {
      filtered = filtered.filter(e =>
        (e.company_name && e.company_name.toLowerCase().includes(search)) ||
        (e.contact_person && e.contact_person.toLowerCase().includes(search)) ||
        (e.email && e.email.toLowerCase().includes(search)) ||
        (e.phone && e.phone.toLowerCase().includes(search)) ||
        (e.job_title && e.job_title.toLowerCase().includes(search)) ||
        (e.business_location && e.business_location.toLowerCase().includes(search))
      );
    }

    return res.status(200).json({
      status: 'success',
      total: enquiriesStore.length,
      count: filtered.length,
      data: filtered
    });
  }

  // POST: Create new client hiring requirement / partnership enquiry
  if (req.method === 'POST') {
    let body = req.body || {};
    if (typeof body === 'string') {
      try { body = JSON.parse(body); } catch (e) {}
    }

    const skills = Array.isArray(body.requiredSkills) ? body.requiredSkills.join(', ') : (body.required_skills || body.skills || '');

    const newEnquiry = {
      id: body.id || `ENQ-${Date.now()}`,
      company_name: body.company_name || body.companyName || body.company || 'Enterprise Partner',
      contact_person: body.contact_person || body.contactPerson || body.name || 'Hiring Manager',
      email: body.email || body.workEmail || '',
      phone: body.phone || body.mobileNumber || '',
      company_website: body.company_website || body.companyWebsite || '',
      business_location: body.business_location || body.jobLocation || body.location || 'Bengaluru',
      partnership_type: body.partnership_type || (body.jobTitle ? 'Client Hiring Requirement' : 'Recruitment Partnership'),
      job_title: body.job_title || body.jobTitle || 'Custom Recruitment Mandate',
      number_of_openings: String(body.number_of_openings || body.numberOfOpenings || body.headcount || '1'),
      experience_required: body.experience_required || body.experienceRequired || '',
      job_location: body.job_location || body.jobLocation || body.location || 'Bengaluru',
      work_mode: body.work_mode || body.workMode || 'On-site',
      employment_type: body.employment_type || body.employmentType || 'Full Time',
      required_skills: skills,
      qualification: body.qualification || 'Any Graduate',
      min_ctc: body.min_ctc || body.minCTC || '',
      max_ctc: body.max_ctc || body.maxCTC || '',
      notice_period: body.notice_period || body.noticePeriod || 'Immediate',
      preferred_shift: body.preferred_shift || body.preferredShift || 'Day Shift',
      languages: Array.isArray(body.languages) ? body.languages.join(', ') : (body.languages || 'English, Hindi'),
      candidate_requirements: body.candidate_requirements || body.candidateRequirements || '',
      hiring_timeline: body.hiring_timeline || body.hiringTimeline || 'Immediately',
      interview_mode: body.interview_mode || body.interviewMode || 'Online',
      interview_rounds: String(body.interview_rounds || body.interviewRounds || '2'),
      additional_requirements: body.additional_requirements || body.additionalRequirements || body.message || '',
      status: body.status || 'New',
      recruiter_notes: body.recruiter_notes || '',
      created_at: body.created_at || new Date().toISOString()
    };

    enquiriesStore.unshift(newEnquiry);

    return res.status(201).json({
      status: 'success',
      message: 'Client requirement submitted successfully! Our enterprise recruitment specialist will connect within 2 hours.',
      data: newEnquiry
    });
  }

  // PUT: Update client enquiry status & recruiter notes
  if (req.method === 'PUT') {
    let body = req.body || {};
    if (typeof body === 'string') {
      try { body = JSON.parse(body); } catch (e) {}
    }

    const id = body.id;
    if (!id) {
      return res.status(400).json({ status: 'error', message: 'Enquiry ID is required for update' });
    }

    const idx = enquiriesStore.findIndex(e => String(e.id) === String(id));
    if (idx === -1) {
      return res.status(404).json({ status: 'error', message: 'Enquiry not found' });
    }

    enquiriesStore[idx] = {
      ...enquiriesStore[idx],
      ...body,
      updated_at: new Date().toISOString()
    };

    return res.status(200).json({
      status: 'success',
      message: 'Client enquiry updated successfully',
      data: enquiriesStore[idx]
    });
  }

  // DELETE: Remove client enquiry
  if (req.method === 'DELETE') {
    const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
    const id = url.searchParams.get('id') || (req.body && req.body.id);

    if (!id) {
      return res.status(400).json({ status: 'error', message: 'Enquiry ID is required for deletion' });
    }

    const initialLen = enquiriesStore.length;
    enquiriesStore = enquiriesStore.filter(e => String(e.id) !== String(id));

    if (enquiriesStore.length === initialLen) {
      return res.status(404).json({ status: 'error', message: 'Enquiry not found' });
    }

    return res.status(200).json({
      status: 'success',
      message: 'Client enquiry deleted successfully'
    });
  }

  return res.status(200).json({ status: 'success', data: enquiriesStore });
};
