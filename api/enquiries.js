// Vercel Serverless Function - CEGS Client Enquiries API
let enquiriesStore = [
  {
    id: "1",
    company_name: "Apex Global Technologies",
    contact_person: "Priya Menon",
    email: "priya.menon@apexglobal.io",
    phone: "+91 80 4910 2200",
    business_location: "Bengaluru (Koramangala)",
    partnership_type: "Client hiring partnership",
    partnership_requirement: "Looking to hire 12 Senior Full Stack and DevOps engineers in Q3.",
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
      count: enquiriesStore.length,
      data: enquiriesStore
    });
  }

  if (req.method === 'POST') {
    let body = req.body || {};
    if (typeof body === 'string') {
      try { body = JSON.parse(body); } catch (e) {}
    }

    const newEnquiry = {
      id: String(Date.now()),
      company_name: body.company_name || body.company || body.companyName || 'Enterprise Partner',
      contact_person: body.contact_person || body.name || body.contactPerson || 'Contact Person',
      email: body.email || '',
      phone: body.phone || '',
      company_website: body.company_website || body.companyWebsite || '',
      business_location: body.business_location || body.location || body.businessLocation || '',
      partnership_type: body.partnership_type || body.partnershipType || 'Recruitment partnership',
      geographic_coverage: body.geographic_coverage || body.geographicCoverage || '',
      industries_roles: body.industries_roles || body.industry || '',
      company_introduction: body.company_introduction || body.companyIntroduction || '',
      existing_network: body.existing_network || body.existingNetwork || '',
      partnership_requirement: body.partnership_requirement || body.role || body.partnershipRequirement || '',
      additional_message: body.additional_message || body.message || '',
      status: 'New',
      created_at: new Date().toISOString()
    };

    enquiriesStore.unshift(newEnquiry);

    return res.status(201).json({
      status: 'success',
      message: 'Partnership enquiry submitted successfully! Our enterprise advisory team will connect within 2 hours.',
      data: newEnquiry
    });
  }

  return res.status(200).json({ status: 'success', data: enquiriesStore });
};
