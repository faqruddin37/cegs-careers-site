<?php
/**
 * CEGS Admin - Candidate Application Details & Recruiter Review
 */

require_once __DIR__ . '/../db.php';
require_once __DIR__ . '/auth.php';

requireAdminAuth();

$pdo = getDBConnection();
$candidateId = isset($_GET['id']) ? (int)$_GET['id'] : 0;
$msg = isset($_GET['msg']) ? trim($_GET['msg']) : '';
$error = '';

if (!$pdo || $candidateId <= 0) {
    header('Location: candidates.php');
    exit;
}

// Handle Form Submission: Status Update & Recruiter Notes
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $newStatus = trim($_POST['status'] ?? '');
    $recruiterNotes = trim($_POST['recruiter_notes'] ?? '');

    $allowedStatuses = ['New', 'Shortlisted', 'Interview', 'Selected', 'Rejected'];
    if (!in_array($newStatus, $allowedStatuses, true)) {
        $error = 'Invalid status selected.';
    } else {
        try {
            $stmt = $pdo->prepare("UPDATE candidate_applications SET status = :status, recruiter_notes = :notes WHERE id = :id");
            $stmt->execute([
                ':status' => $newStatus,
                ':notes'  => $recruiterNotes ?: null,
                ':id'     => $candidateId
            ]);
            header('Location: candidate-view.php?id=' . $candidateId . '&msg=saved');
            exit;
        } catch (PDOException $e) {
            $error = 'Failed to update candidate: ' . $e->getMessage();
        }
    }
}

// Fetch Candidate Data
try {
    $stmt = $pdo->prepare("SELECT * FROM candidate_applications WHERE id = :id LIMIT 1");
    $stmt->execute([':id' => $candidateId]);
    $cand = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$cand) {
        header('Location: candidates.php');
        exit;
    }
} catch (PDOException $e) {
    die('Error fetching candidate: ' . htmlspecialchars($e->getMessage()));
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Candidate: <?php echo escapeHtml($cand['full_name']); ?> | CEGS Admin</title>
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
        <span class="admin-brand-badge">Candidate Profile</span>
      </div>
    </a>

    <div class="admin-nav-links">
      <a href="candidates.php" class="btn btn-outline btn-sm">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
        <span>Back to Candidates</span>
      </a>
      <a href="logout.php" class="btn btn-danger btn-sm">Sign Out</a>
    </div>
  </header>

  <!-- Main Container -->
  <main class="admin-container">

    <!-- Page Header -->
    <div class="admin-page-header">
      <div>
        <div style="display: flex; align-items: center; gap: 0.75rem; margin-bottom: 0.25rem;">
          <h1 class="admin-page-title"><?php echo escapeHtml($cand['full_name']); ?></h1>
          <span class="badge badge-teal">#<?php echo $cand['id']; ?></span>
        </div>
        <p class="admin-page-desc">Applied for <strong style="color:#0d5e72;"><?php echo escapeHtml($cand['job_title'] ?: 'General Candidate Application'); ?></strong> • Submitted <?php echo formatRelativeDate($cand['created_at']); ?> (<?php echo date('M d, Y H:i', strtotime($cand['created_at'])); ?>)</p>
      </div>

      <div style="display: flex; gap: 0.5rem;">
        <?php if (!empty($cand['resume_path'])): ?>
          <a href="view-resume.php?id=<?php echo $cand['id']; ?>" target="_blank" class="btn btn-outline">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
            <span>View Resume</span>
          </a>
          <a href="view-resume.php?id=<?php echo $cand['id']; ?>&download=1" class="btn btn-outline">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
            <span>Download</span>
          </a>
        <?php endif; ?>
        <a href="delete-candidate.php?id=<?php echo $cand['id']; ?>" class="btn btn-danger" onclick="return confirm('Are you sure you want to permanently delete this application?');">
          <span>Delete</span>
        </a>
      </div>
    </div>

    <!-- Alert Notifications -->
    <?php if ($msg === 'saved'): ?>
      <div class="alert alert-success">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
        <span>Candidate status and internal recruiter notes saved successfully.</span>
      </div>
    <?php endif; ?>

    <?php if (!empty($error)): ?>
      <div class="alert alert-danger">
        <span><?php echo escapeHtml($error); ?></span>
      </div>
    <?php endif; ?>

    <!-- Two-Column Layout -->
    <div class="detail-grid">

      <!-- LEFT COLUMN: Candidate Profile Details -->
      <div>
        <div class="detail-box-card">
          <div class="detail-section-title">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
            <span>Candidate Information</span>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.25rem;">
            <div class="detail-field-group">
              <div class="detail-field-label">Full Name</div>
              <div class="detail-field-value"><?php echo escapeHtml($cand['full_name']); ?></div>
            </div>

            <div class="detail-field-group">
              <div class="detail-field-label">Applied Role</div>
              <div class="detail-field-value" style="color: #0d5e72; font-weight: 700;">
                <?php echo escapeHtml($cand['job_title'] ?: 'General Application'); ?>
              </div>
            </div>

            <div class="detail-field-group">
              <div class="detail-field-label">Email Address</div>
              <div class="detail-field-value">
                <a href="mailto:<?php echo escapeHtml($cand['email']); ?>" style="color: #0d5e72; text-decoration: none; font-weight: 700;">
                  <?php echo escapeHtml($cand['email']); ?>
                </a>
              </div>
            </div>

            <div class="detail-field-group">
              <div class="detail-field-label">Contact Phone</div>
              <div class="detail-field-value">
                <a href="tel:<?php echo escapeHtml($cand['phone']); ?>" style="color: #0d5e72; text-decoration: none; font-weight: 700;">
                  <?php echo escapeHtml($cand['phone']); ?>
                </a>
              </div>
            </div>

            <div class="detail-field-group">
              <div class="detail-field-label">Current Location</div>
              <div class="detail-field-value"><?php echo escapeHtml($cand['location'] ?: 'Not provided'); ?></div>
            </div>

            <div class="detail-field-group">
              <div class="detail-field-label">Total Experience</div>
              <div class="detail-field-value"><?php echo escapeHtml($cand['experience'] ?: 'Not specified'); ?></div>
            </div>

            <div class="detail-field-group">
              <div class="detail-field-label">Current CTC</div>
              <div class="detail-field-value"><?php echo escapeHtml($cand['current_ctc'] ?: 'Not specified'); ?></div>
            </div>

            <div class="detail-field-group">
              <div class="detail-field-label">Expected CTC</div>
              <div class="detail-field-value" style="color: #0bb379; font-weight: 700;">
                <?php echo escapeHtml($cand['expected_ctc'] ?: 'Not specified'); ?>
              </div>
            </div>

            <?php if (!empty($cand['linkedin_url'])): ?>
              <div class="detail-field-group" style="grid-column: 1 / -1;">
                <div class="detail-field-label">LinkedIn Profile</div>
                <div class="detail-field-value">
                  <a href="<?php echo escapeHtml($cand['linkedin_url']); ?>" target="_blank" rel="noopener noreferrer" style="color: #0369a1; text-decoration: underline; font-weight: 700; word-break: break-all;">
                    <?php echo escapeHtml($cand['linkedin_url']); ?> ↗
                  </a>
                </div>
              </div>
            <?php endif; ?>
          </div>

          <?php if (!empty($cand['skills'])): ?>
            <div class="detail-field-group" style="margin-top: 1rem; border-top: 1px solid var(--border-color); padding-top: 1rem;">
              <div class="detail-field-label">Key Skills & Competencies</div>
              <div class="detail-field-value"><?php echo nl2br(escapeHtml($cand['skills'])); ?></div>
            </div>
          <?php endif; ?>

          <?php if (!empty($cand['cover_message'])): ?>
            <div class="detail-field-group" style="margin-top: 1rem; border-top: 1px solid var(--border-color); padding-top: 1rem;">
              <div class="detail-field-label">Cover Note / Candidate Message</div>
              <div class="detail-field-value" style="background: #f8fafc; padding: 1rem; border-radius: 8px; border: 1px solid #e2e8f0; font-size: 0.9rem; color: #334155; line-height: 1.6;">
                <?php echo nl2br(escapeHtml($cand['cover_message'])); ?>
              </div>
            </div>
          <?php endif; ?>
        </div>

        <!-- Resume File Card -->
        <div class="detail-box-card">
          <div class="detail-section-title">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
            <span>Attached Resume / CV</span>
          </div>

          <?php if (!empty($cand['resume_path'])): ?>
            <div style="display: flex; align-items: center; justify-content: space-between; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 1.25rem; flex-wrap: wrap; gap: 1rem;">
              <div style="display: flex; align-items: center; gap: 0.75rem;">
                <div style="width: 44px; height: 44px; border-radius: 10px; background: rgba(13, 94, 114, 0.1); color: #0d5e72; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 0.8rem;">
                  📄
                </div>
                <div>
                  <div style="font-weight: 700; color: #0f1c2d; font-size: 0.95rem;">
                    <?php echo escapeHtml($cand['resume_filename'] ?: basename($cand['resume_path'])); ?>
                  </div>
                  <div style="font-size: 0.75rem; color: #64748b;">
                    Server Path: <?php echo escapeHtml($cand['resume_path']); ?>
                  </div>
                </div>
              </div>

              <div style="display: flex; gap: 0.5rem;">
                <a href="view-resume.php?id=<?php echo $cand['id']; ?>" target="_blank" class="btn btn-primary btn-sm">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                  <span>Open Resume</span>
                </a>
                <a href="view-resume.php?id=<?php echo $cand['id']; ?>&download=1" class="btn btn-outline btn-sm">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                  <span>Download</span>
                </a>
              </div>
            </div>
          <?php else: ?>
            <div style="padding: 1.5rem; background: #f8fafc; border-radius: 8px; color: #64748b; font-size: 0.9rem; text-align: center;">
              No resume document attached to this application.
            </div>
          <?php endif; ?>
        </div>
      </div>

      <!-- RIGHT COLUMN: Status Update & Recruiter Notes -->
      <div>
        <div class="detail-box-card" style="position: sticky; top: 90px;">
          <div class="detail-section-title">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
            <span>Recruiter Review</span>
          </div>

          <form method="POST" action="candidate-view.php?id=<?php echo $cand['id']; ?>">
            
            <div class="form-group" style="margin-bottom: 1.25rem;">
              <label class="form-label" for="candStatus">Application Status</label>
              <select name="status" id="candStatus" class="form-control" style="font-weight: 700;">
                <option value="New" <?php echo $cand['status'] === 'New' ? 'selected' : ''; ?>>New Application</option>
                <option value="Shortlisted" <?php echo $cand['status'] === 'Shortlisted' ? 'selected' : ''; ?>>Shortlisted for Screening</option>
                <option value="Interview" <?php echo $cand['status'] === 'Interview' ? 'selected' : ''; ?>>Interview Scheduled</option>
                <option value="Selected" <?php echo $cand['status'] === 'Selected' ? 'selected' : ''; ?>>Selected / Offer Sent</option>
                <option value="Rejected" <?php echo $cand['status'] === 'Rejected' ? 'selected' : ''; ?>>Rejected / Archival</option>
              </select>
            </div>

            <div class="form-group" style="margin-bottom: 1.5rem;">
              <label class="form-label" for="candNotes">
                Internal Recruiter Notes
                <span style="font-size: 0.75rem; color: #64748b; font-weight: normal;">(Private - Not visible to candidate)</span>
              </label>
              <textarea name="recruiter_notes" id="candNotes" class="form-control" style="min-height: 140px;" placeholder="Add internal notes, interview feedback, salary discussion, notice period..."><?php echo escapeHtml($cand['recruiter_notes'] ?? ''); ?></textarea>
            </div>

            <button type="submit" class="btn btn-primary" style="width: 100%;">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
              <span>Save Recruiter Changes</span>
            </button>

          </form>

          <div style="margin-top: 1.5rem; padding-top: 1.25rem; border-top: 1px solid var(--border-color); font-size: 0.8rem; color: #64748b;">
            <div><strong>Created:</strong> <?php echo date('M d, Y H:i', strtotime($cand['created_at'])); ?></div>
            <?php if (!empty($cand['updated_at'])): ?>
              <div style="margin-top: 0.2rem;"><strong>Last Modified:</strong> <?php echo date('M d, Y H:i', strtotime($cand['updated_at'])); ?></div>
            <?php endif; ?>
          </div>
        </div>
      </div>

    </div>

  </main>

</body>
</html>
