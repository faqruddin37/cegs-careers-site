// Vercel Serverless Function - CEGS Candidate Applications API
let candidatesStore = [
  {
    id: "1",
    full_name: "Rahul Sharma",
    email: "rahul.sharma@example.com",
    phone: "+91 98765 43210",
    job_title: "Senior Full Stack Software Engineer (NeoTech Global Solutions)",
    experience: "5.5 Years",
    current_ctc: "16 LPA",
    expected_ctc: "22 LPA",
    location: "Bengaluru",
    skills: "React.js, Node.js, TypeScript, PostgreSQL, AWS",
    status: "Shortlisted",
    created_at: new Date().toISOString()
  },
  {
    id: "2",
    full_name: "Ananya Sen",
    email: "ananya.sen@example.com",
    phone: "+91 98451 22334",
    job_title: "International Inside Sales Specialist (CloudScale International)",
    experience: "3 Years",
    current_ctc: "7 LPA",
    expected_ctc: "10 LPA",
    location: "Bengaluru",
    skills: "B2B Cold Calling, SDR, Salesforce, US Outbound",
    status: "New",
    created_at: new Date().toISOString()
  }
];

module.exports = (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'GET') {
    return res.status(200).json({
      status: 'success',
      count: candidatesStore.length,
      data: candidatesStore
    });
  }

  if (req.method === 'POST') {
    let body = req.body || {};
    if (typeof body === 'string') {
      try { body = JSON.parse(body); } catch (e) {}
    }

    const newCandidate = {
      id: String(Date.now()),
      full_name: body.full_name || body.name || 'Candidate',
      email: body.email || '',
      phone: body.phone || '',
      job_id: body.job_id || null,
      job_title: body.job_title || 'General Candidate Application',
      experience: body.experience || '',
      current_ctc: body.current_ctc || '',
      expected_ctc: body.expected_ctc || '',
      location: body.location || '',
      skills: body.skills || '',
      linkedin_url: body.linkedin_url || '',
      cover_message: body.cover_message || '',
      status: 'New',
      created_at: new Date().toISOString()
    };

    candidatesStore.unshift(newCandidate);

    return res.status(201).json({
      status: 'success',
      message: 'Application submitted successfully! Our recruitment specialist will get back within 24 hours.',
      data: newCandidate
    });
  }

  return res.status(200).json({ status: 'success', data: candidatesStore });
};
