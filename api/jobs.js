// Vercel Serverless Function - CEGS Live Jobs API
let jobsStore = [
  {
    id: "8",
    title: "intranational process",
    company: "codevate",
    department: "Inside Sales & BPO",
    badgeColor: "orange",
    type: "Normal Shift",
    location: "bangalore (hsr latout)",
    experience: "puc & above",
    salary: "₹19500",
    posted: "Just now",
    tags: ["🎓 puc & above", "🗣️ enghish, hindi", "⏰ Normal Shift"],
    description: "sdfghjkl.",
    requirements: [
      "Educational Qualification: puc & above",
      "Language Fluency: enghish, hindi",
      "Shift Schedule: Normal Shift",
      "Work Location: bangalore (hsr latout)",
      "Offered Compensation: ₹19500"
    ],
    cabFacility: null,
    languageRequired: "enghish, hindi",
    qualification: "puc & above",
    shiftDetails: "Normal Shift",
    additionalNotes: "sdfghjkl."
  },
  {
    id: "7",
    title: "Customer Support",
    company: "AITRUIST",
    department: "Inside Sales & BPO",
    badgeColor: "orange",
    type: "Normal Shift",
    location: "bangalore (HSR Layout)",
    experience: "puc & above",
    salary: "₹25000 - 30000",
    posted: "3 days ago",
    tags: ["🎓 puc & above", "🗣️ Hindi & english", "⏰ normal shift", "🚗 Cab: two way"],
    description: "Exciting opportunity at AITRUIST for Customer Support. Requires puc & above with Hindi & english fluency.",
    requirements: [
      "Educational Qualification: puc & above",
      "Language Fluency: Hindi & english",
      "Shift Schedule: normal shift",
      "Transport Facility: Two-way Cab Provided",
      "Work Location: bangalore (HSR Layout)",
      "Offered Compensation: ₹25000 - 30000"
    ],
    cabFacility: "two way",
    languageRequired: "Hindi & english",
    qualification: "puc & above",
    shiftDetails: "normal shift",
    additionalNotes: "Exciting opportunity at AITRUIST for Customer Support."
  },
  {
    id: "6",
    title: "dfgbhnm,",
    company: "sdfghjk",
    department: "Inside Sales & BPO",
    badgeColor: "teal",
    type: "sdfghjk",
    location: "dfghjk",
    experience: "sdfghnjm,",
    salary: "₹19000",
    posted: "3 days ago",
    tags: ["🎓 sdfghnjm,", "🗣️ dfghjk", "⏰ sdfghjk", "🚗 Cab: dfghjk,"],
    description: "lhgfdxcvdretrdfyligkhvn m",
    requirements: [
      "Educational Qualification: sdfghnjm,",
      "Language Fluency: dfghjk",
      "Shift Schedule: sdfghjk",
      "Transport Facility: dfghjk,",
      "Work Location: dfghjk",
      "Offered Compensation: ₹19000"
    ],
    cabFacility: "dfghjk,",
    languageRequired: "dfghjk",
    qualification: "sdfghnjm,",
    shiftDetails: "sdfghjk",
    additionalNotes: "lhgfdxcvdretrdfyligkhvn m"
  },
  {
    id: "5",
    title: "Customer Support",
    company: "ISON XPERIENCE",
    department: "Inside Sales & BPO",
    badgeColor: "orange",
    type: "Normal Shift",
    location: "Bangalore (Silk Board)",
    experience: "puc & above",
    salary: "₹19000",
    posted: "3 days ago",
    tags: ["🎓 puc & above", "🗣️ English and hindi", "⏰ Normal Shift"],
    description: "dfghjk",
    requirements: [
      "Educational Qualification: puc & above",
      "Language Fluency: English and hindi",
      "Shift Schedule: Normal Shift",
      "Work Location: Bangalore (Silk Board)",
      "Offered Compensation: ₹19000"
    ],
    cabFacility: "no",
    languageRequired: "English and hindi",
    qualification: "puc & above",
    shiftDetails: "Normal Shift",
    additionalNotes: "dfghjk"
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
      count: jobsStore.length,
      data: jobsStore
    });
  }

  if (req.method === 'POST') {
    const newJob = req.body;
    if (newJob && newJob.title) {
      if (!newJob.id) newJob.id = 'JOB-' + Date.now();
      jobsStore.unshift(newJob);
      return res.status(200).json({
        status: 'success',
        message: 'Job added successfully',
        data: jobsStore
      });
    }
  }

  if (req.method === 'PUT') {
    const updatedJob = req.body;
    if (updatedJob && updatedJob.id) {
      const idx = jobsStore.findIndex(j => String(j.id) === String(updatedJob.id));
      if (idx !== -1) {
        jobsStore[idx] = updatedJob;
      } else {
        jobsStore.unshift(updatedJob);
      }
      return res.status(200).json({
        status: 'success',
        message: 'Job updated successfully',
        data: jobsStore
      });
    }
  }

  if (req.method === 'DELETE') {
    const id = req.query.id || (req.body && req.body.id);
    if (id) {
      jobsStore = jobsStore.filter(j => String(j.id) !== String(id));
      return res.status(200).json({
        status: 'success',
        message: 'Job deleted successfully',
        data: jobsStore
      });
    }
  }

  return res.status(200).json({ status: 'success', data: jobsStore });
};
