<?php
/**
 * CEGS Admin - Create New Job Posting (CRUD - Create)
 */

require_once __DIR__ . '/../db.php';
require_once __DIR__ . '/auth.php';

requireAdminAuth();

$error = '';
$formData = [
    'company_name'      => '',
    'job_role'          => '',
    'salary'            => '',
    'qualification'     => '',
    'language_required' => '',
    'shift_details'     => '',
    'location'          => '',
    'cab_facility'      => '',
    'additional_notes'  => ''
];

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $formData['company_name']      = trim($_POST['company_name'] ?? '');
    $formData['job_role']          = trim($_POST['job_role'] ?? '');
    $formData['salary']            = trim($_POST['salary'] ?? '');
    $formData['qualification']     = trim($_POST['qualification'] ?? '');
    $formData['language_required'] = trim($_POST['language_required'] ?? '');
    $formData['shift_details']     = trim($_POST['shift_details'] ?? '');
    $formData['location']          = trim($_POST['location'] ?? '');
    $formData['cab_facility']      = trim($_POST['cab_facility'] ?? '');
    $formData['additional_notes']  = trim($_POST['additional_notes'] ?? '');

    // Validation
    if (empty($formData['company_name']) || empty($formData['job_role']) || empty($formData['salary']) || 
        empty($formData['qualification']) || empty($formData['language_required']) || 
        empty($formData['shift_details']) || empty($formData['location'])) {
        $error = 'Please fill in all required fields marked with *';
    } else {
        $pdo = getDBConnection();
        if (!$pdo) {
            $error = 'Database connection failed. Please check db.php configuration.';
        } else {
            try {
                $sql = "INSERT INTO jobs (company_name, job_role, salary, qualification, language_required, shift_details, location, cab_facility, additional_notes, posted_date)
                        VALUES (:company_name, :job_role, :salary, :qualification, :language_required, :shift_details, :location, :cab_facility, :additional_notes, NOW())";
                
                $stmt = $pdo->prepare($sql);
                $stmt->execute([
                    ':company_name'      => $formData['company_name'],
                    ':job_role'          => $formData['job_role'],
                    ':salary'            => $formData['salary'],
                    ':qualification'     => $formData['qualification'],
                    ':language_required' => $formData['language_required'],
                    ':shift_details'     => $formData['shift_details'],
                    ':location'          => $formData['location'],
                    ':cab_facility'      => $formData['cab_facility'] ?: null,
                    ':additional_notes'  => $formData['additional_notes'] ?: null
                ]);

                header('Location: index.php?msg=created');
                exit;
            } catch (PDOException $e) {
                $error = 'Failed to create job posting: ' . $e->getMessage();
            }
        }
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Post New Job | CEGS Admin</title>
  <link rel="stylesheet" href="admin.css">
  <link rel="icon" type="image/svg+xml" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%230d5e72'><rect width='24' height='24' rx='6' fill='%230d5e72'/><path d='M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2' fill='white'/></svg>">
</head>
<body>

  <!-- Top Navigation Header -->
  <header class="admin-navbar">
    <a href="index.php" class="admin-brand">
      <div class="admin-brand-icon">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><polyline points="16 11 18 13 22 9"></polyline></svg>
      </div>
      <div>
        <span class="admin-brand-title">CEGS Admin</span>
        <span class="admin-brand-badge">Create Job</span>
      </div>
    </a>

    <div class="admin-nav-links">
      <a href="index.php" class="btn btn-outline btn-sm">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
        <span>Back to Dashboard</span>
      </a>
      <a href="logout.php" class="btn btn-danger btn-sm">Sign Out</a>
    </div>
  </header>

  <!-- Main Content Form -->
  <main class="admin-container">
    <div class="admin-card form-card">
      <div style="margin-bottom: 2rem;">
        <span class="badge badge-teal" style="margin-bottom: 0.5rem;">Job Posting Builder</span>
        <h1 style="font-size: 1.6rem; font-weight: 800; color: #0f1c2d;">Create New Recruitment Vacancy</h1>
        <p style="color: #64748b; font-size: 0.9rem;">Fill in the role details below to immediately publish this position to the public Careers portal.</p>
      </div>

      <?php if (!empty($error)): ?>
        <div class="alert alert-danger">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
          <span><?php echo escapeHtml($error); ?></span>
        </div>
      <?php endif; ?>

      <form method="POST" action="add-job.php">
        <div class="form-grid">
          
          <!-- Company Name -->
          <div class="form-group">
            <label class="form-label" for="company_name">Company Name <span class="required">*</span></label>
            <input type="text" id="company_name" name="company_name" class="form-control" placeholder="e.g. Acme Global Technologies" value="<?php echo escapeHtml($formData['company_name']); ?>" required />
          </div>

          <!-- Job Role -->
          <div class="form-group">
            <label class="form-label" for="job_role">Job Role / Designation <span class="required">*</span></label>
            <input type="text" id="job_role" name="job_role" class="form-control" placeholder="e.g. Senior Full Stack Engineer" value="<?php echo escapeHtml($formData['job_role']); ?>" required />
          </div>

          <!-- Salary -->
          <div class="form-group">
            <label class="form-label" for="salary">Salary Range / CTC <span class="required">*</span></label>
            <input type="text" id="salary" name="salary" class="form-control" placeholder="e.g. ₹8,00,000 - ₹14,00,000 LPA" value="<?php echo escapeHtml($formData['salary']); ?>" required />
          </div>

          <!-- Location -->
          <div class="form-group">
            <label class="form-label" for="location">Location <span class="required">*</span></label>
            <input type="text" id="location" name="location" class="form-control" placeholder="e.g. Bengaluru (Koramangala / Hybrid)" value="<?php echo escapeHtml($formData['location']); ?>" required />
          </div>

          <!-- Qualification -->
          <div class="form-group">
            <label class="form-label" for="qualification">Educational Qualification <span class="required">*</span></label>
            <input type="text" id="qualification" name="qualification" class="form-control" placeholder="e.g. B.Tech / B.E / MCA / Any Graduate" value="<?php echo escapeHtml($formData['qualification']); ?>" required />
          </div>

          <!-- Language Required -->
          <div class="form-group">
            <label class="form-label" for="language_required">Language Required <span class="required">*</span></label>
            <input type="text" id="language_required" name="language_required" class="form-control" placeholder="e.g. English, Hindi, Kannada" value="<?php echo escapeHtml($formData['language_required']); ?>" required />
          </div>

          <!-- Shift Details -->
          <div class="form-group">
            <label class="form-label" for="shift_details">Shift Details <span class="required">*</span></label>
            <input type="text" id="shift_details" name="shift_details" class="form-control" placeholder="e.g. Day Shift (9:30 AM - 6:30 PM) / US Shift" value="<?php echo escapeHtml($formData['shift_details']); ?>" required />
          </div>

          <!-- Cab Facility -->
          <div class="form-group">
            <label class="form-label" for="cab_facility">Cab Facility <small style="color: #64748b; font-weight: normal;">(Optional - e.g. Yes / Two-way / No)</small></label>
            <input type="text" id="cab_facility" name="cab_facility" class="form-control" placeholder="e.g. Two-way Free Cab / Night Pick & Drop / No" value="<?php echo escapeHtml($formData['cab_facility']); ?>" />
          </div>

          <!-- Additional Notes -->
          <div class="form-group full-width">
            <label class="form-label" for="additional_notes">Additional Notes & Candidate Overview <small style="color: #64748b; font-weight: normal;">(Optional)</small></label>
            <textarea id="additional_notes" name="additional_notes" class="form-control" placeholder="Provide extra role requirements, interview process details, notice period preferences, or key tech skills..."><?php echo escapeHtml($formData['additional_notes']); ?></textarea>
          </div>

        </div>

        <div class="form-actions">
          <a href="index.php" class="btn btn-outline">Cancel</a>
          <button type="submit" class="btn btn-primary">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
            <span>Publish Job Posting</span>
          </button>
        </div>
      </form>
    </div>
  </main>

</body>
</html>
