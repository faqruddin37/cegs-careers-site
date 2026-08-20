<?php
/**
 * CEGS Admin - Edit / Update Job Posting (CRUD - Update)
 */

require_once __DIR__ . '/../db.php';
require_once __DIR__ . '/auth.php';

requireAdminAuth();

$pdo = getDBConnection();
$error = '';
$jobId = isset($_GET['id']) ? (int)$_GET['id'] : 0;

if (!$pdo || $jobId <= 0) {
    header('Location: index.php');
    exit;
}

// Fetch existing job
$stmt = $pdo->prepare("SELECT * FROM jobs WHERE id = :id LIMIT 1");
$stmt->execute([':id' => $jobId]);
$job = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$job) {
    header('Location: index.php');
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $company_name      = trim($_POST['company_name'] ?? '');
    $job_role          = trim($_POST['job_role'] ?? '');
    $salary            = trim($_POST['salary'] ?? '');
    $qualification     = trim($_POST['qualification'] ?? '');
    $language_required = trim($_POST['language_required'] ?? '');
    $shift_details     = trim($_POST['shift_details'] ?? '');
    $location          = trim($_POST['location'] ?? '');
    $cab_facility      = trim($_POST['cab_facility'] ?? '');
    $additional_notes  = trim($_POST['additional_notes'] ?? '');

    if (empty($company_name) || empty($job_role) || empty($salary) || 
        empty($qualification) || empty($language_required) || 
        empty($shift_details) || empty($location)) {
        $error = 'Please fill in all required fields marked with *';
    } else {
        try {
            $sql = "UPDATE jobs SET 
                    company_name = :company_name,
                    job_role = :job_role,
                    salary = :salary,
                    qualification = :qualification,
                    language_required = :language_required,
                    shift_details = :shift_details,
                    location = :location,
                    cab_facility = :cab_facility,
                    additional_notes = :additional_notes
                    WHERE id = :id";

            $updateStmt = $pdo->prepare($sql);
            $updateStmt->execute([
                ':company_name'      => $company_name,
                ':job_role'          => $job_role,
                ':salary'            => $salary,
                ':qualification'     => $qualification,
                ':language_required' => $language_required,
                ':shift_details'     => $shift_details,
                ':location'          => $location,
                ':cab_facility'      => $cab_facility ?: null,
                ':additional_notes'  => $additional_notes ?: null,
                ':id'                => $jobId
            ]);

            header('Location: index.php?msg=updated');
            exit;
        } catch (PDOException $e) {
            $error = 'Failed to update job: ' . $e->getMessage();
        }
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Edit Job #<?php echo $job['id']; ?> | CEGS Admin</title>
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
        <span class="admin-brand-badge">Edit Vacancy</span>
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

  <!-- Main Edit Form Container -->
  <main class="admin-container">
    <div class="admin-card form-card">
      <div style="margin-bottom: 2rem;">
        <span class="badge badge-teal" style="margin-bottom: 0.5rem;">Job ID #<?php echo $job['id']; ?></span>
        <h1 style="font-size: 1.6rem; font-weight: 800; color: #0f1c2d;">Edit Job Posting</h1>
        <p style="color: #64748b; font-size: 0.9rem;">Modify the role specifications below. Changes reflect in real time on the live Careers board.</p>
      </div>

      <?php if (!empty($error)): ?>
        <div class="alert alert-danger">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
          <span><?php echo escapeHtml($error); ?></span>
        </div>
      <?php endif; ?>

      <form method="POST" action="edit-job.php?id=<?php echo $job['id']; ?>">
        <div class="form-grid">
          
          <!-- Company Name -->
          <div class="form-group">
            <label class="form-label" for="company_name">Company Name <span class="required">*</span></label>
            <input type="text" id="company_name" name="company_name" class="form-control" value="<?php echo escapeHtml($job['company_name']); ?>" required />
          </div>

          <!-- Job Role -->
          <div class="form-group">
            <label class="form-label" for="job_role">Job Role / Designation <span class="required">*</span></label>
            <input type="text" id="job_role" name="job_role" class="form-control" value="<?php echo escapeHtml($job['job_role']); ?>" required />
          </div>

          <!-- Salary -->
          <div class="form-group">
            <label class="form-label" for="salary">Salary Range / CTC <span class="required">*</span></label>
            <input type="text" id="salary" name="salary" class="form-control" value="<?php echo escapeHtml($job['salary']); ?>" required />
          </div>

          <!-- Location -->
          <div class="form-group">
            <label class="form-label" for="location">Location <span class="required">*</span></label>
            <input type="text" id="location" name="location" class="form-control" value="<?php echo escapeHtml($job['location']); ?>" required />
          </div>

          <!-- Qualification -->
          <div class="form-group">
            <label class="form-label" for="qualification">Educational Qualification <span class="required">*</span></label>
            <input type="text" id="qualification" name="qualification" class="form-control" value="<?php echo escapeHtml($job['qualification']); ?>" required />
          </div>

          <!-- Language Required -->
          <div class="form-group">
            <label class="form-label" for="language_required">Language Required <span class="required">*</span></label>
            <input type="text" id="language_required" name="language_required" class="form-control" value="<?php echo escapeHtml($job['language_required']); ?>" required />
          </div>

          <!-- Shift Details -->
          <div class="form-group">
            <label class="form-label" for="shift_details">Shift Details <span class="required">*</span></label>
            <input type="text" id="shift_details" name="shift_details" class="form-control" value="<?php echo escapeHtml($job['shift_details']); ?>" required />
          </div>

          <!-- Cab Facility -->
          <div class="form-group">
            <label class="form-label" for="cab_facility">Cab Facility <small style="color: #64748b; font-weight: normal;">(Optional - e.g. Yes / Two-way / No)</small></label>
            <input type="text" id="cab_facility" name="cab_facility" class="form-control" value="<?php echo escapeHtml($job['cab_facility'] ?? ''); ?>" />
          </div>

          <!-- Additional Notes -->
          <div class="form-group full-width">
            <label class="form-label" for="additional_notes">Additional Notes & Candidate Overview <small style="color: #64748b; font-weight: normal;">(Optional)</small></label>
            <textarea id="additional_notes" name="additional_notes" class="form-control"><?php echo escapeHtml($job['additional_notes'] ?? ''); ?></textarea>
          </div>

        </div>

        <div class="form-actions">
          <a href="index.php" class="btn btn-outline">Cancel</a>
          <button type="submit" class="btn btn-primary">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
            <span>Save Changes</span>
          </button>
        </div>
      </form>
    </div>
  </main>

</body>
</html>
