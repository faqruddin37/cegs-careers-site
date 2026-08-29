<?php
/**
 * CEGS Admin - Client Enquiry Details & Commercial Notes
 */

require_once __DIR__ . '/../db.php';
require_once __DIR__ . '/auth.php';

requireAdminAuth();

$pdo = getDBConnection();
$enquiryId = isset($_GET['id']) ? (int)$_GET['id'] : 0;
$msg = isset($_GET['msg']) ? trim($_GET['msg']) : '';
$error = '';

if (!$pdo || $enquiryId <= 0) {
    header('Location: enquiries.php');
    exit;
}

// Handle Status & Notes Update
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $newStatus = trim($_POST['status'] ?? '');
    $recruiterNotes = trim($_POST['recruiter_notes'] ?? '');

    $allowedStatuses = ['New', 'Contacted', 'In Discussion', 'Converted', 'Closed'];
    if (!in_array($newStatus, $allowedStatuses, true)) {
        $error = 'Invalid status selected.';
    } else {
        try {
            $stmt = $pdo->prepare("UPDATE client_enquiries SET status = :status, recruiter_notes = :notes WHERE id = :id");
            $stmt->execute([
                ':status' => $newStatus,
                ':notes'  => $recruiterNotes ?: null,
                ':id'     => $enquiryId
            ]);
            header('Location: enquiry-view.php?id=' . $enquiryId . '&msg=saved');
            exit;
        } catch (PDOException $e) {
            $error = 'Failed to update enquiry: ' . $e->getMessage();
        }
    }
}

// Fetch Enquiry Data
try {
    $stmt = $pdo->prepare("SELECT * FROM client_enquiries WHERE id = :id LIMIT 1");
    $stmt->execute([':id' => $enquiryId]);
    $enq = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$enq) {
        header('Location: enquiries.php');
        exit;
    }
} catch (PDOException $e) {
    die('Error fetching enquiry: ' . htmlspecialchars($e->getMessage()));
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Enquiry: <?php echo escapeHtml($enq['company_name']); ?> | CEGS Admin</title>
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
        <span class="admin-brand-badge">Enquiry Details</span>
      </div>
    </a>

    <div class="admin-nav-links">
      <a href="enquiries.php" class="btn btn-outline btn-sm">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
        <span>Back to Enquiries</span>
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
          <h1 class="admin-page-title"><?php echo escapeHtml($enq['company_name']); ?></h1>
          <span class="badge badge-teal">#<?php echo $enq['id']; ?></span>
          <span class="badge badge-orange"><?php echo escapeHtml($enq['partnership_type'] ?: 'Hiring Requirement'); ?></span>
        </div>
        <p class="admin-page-desc">Contact Person: <strong><?php echo escapeHtml($enq['contact_person']); ?></strong> • Received <?php echo formatRelativeDate($enq['created_at']); ?> (<?php echo date('M d, Y H:i', strtotime($enq['created_at'])); ?>)</p>
      </div>

      <div style="display: flex; gap: 0.5rem;">
        <a href="delete-enquiry.php?id=<?php echo $enq['id']; ?>" class="btn btn-danger" onclick="return confirm('Are you sure you want to delete this enquiry?');">
          <span>Delete Enquiry</span>
        </a>
      </div>
    </div>

    <!-- Alert Notifications -->
    <?php if ($msg === 'saved'): ?>
      <div class="alert alert-success">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
        <span>Enquiry status & commercial notes saved successfully.</span>
      </div>
    <?php endif; ?>

    <?php if (!empty($error)): ?>
      <div class="alert alert-danger">
        <span><?php echo escapeHtml($error); ?></span>
      </div>
    <?php endif; ?>

    <!-- Two-Column Layout -->
    <div class="detail-grid">

      <!-- LEFT COLUMN: Enquiry Information -->
      <div>
        <!-- Company & Contact Box -->
        <div class="detail-box-card">
          <div class="detail-section-title">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 21h18"></path><path d="M9 8h1"></path><path d="M9 12h1"></path><path d="M9 16h1"></path><path d="M14 8h1"></path><path d="M14 12h1"></path><path d="M14 16h1"></path><path d="M5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16"></path></svg>
            <span>Company & Contact Details</span>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.25rem;">
            <div class="detail-field-group">
              <div class="detail-field-label">Company / Agency Name</div>
              <div class="detail-field-value" style="font-weight: 700; color: #0d5e72; font-size: 1.05rem;">
                <?php echo escapeHtml($enq['company_name']); ?>
              </div>
            </div>

            <div class="detail-field-group">
              <div class="detail-field-label">Contact Person Name</div>
              <div class="detail-field-value" style="font-weight: 700;">
                <?php echo escapeHtml($enq['contact_person']); ?>
              </div>
            </div>

            <div class="detail-field-group">
              <div class="detail-field-label">Official Email</div>
              <div class="detail-field-value">
                <a href="mailto:<?php echo escapeHtml($enq['email']); ?>" style="color: #0d5e72; font-weight: 700; text-decoration: none;">
                  <?php echo escapeHtml($enq['email']); ?>
                </a>
              </div>
            </div>

            <div class="detail-field-group">
              <div class="detail-field-label">Contact Phone Number</div>
              <div class="detail-field-value">
                <a href="tel:<?php echo escapeHtml($enq['phone']); ?>" style="color: #0d5e72; font-weight: 700; text-decoration: none;">
                  <?php echo escapeHtml($enq['phone']); ?>
                </a>
              </div>
            </div>

            <div class="detail-field-group">
              <div class="detail-field-label">Business Location</div>
              <div class="detail-field-value"><?php echo escapeHtml($enq['business_location'] ?: 'Not specified'); ?></div>
            </div>

            <div class="detail-field-group">
              <div class="detail-field-label">Company Website</div>
              <div class="detail-field-value">
                <?php if (!empty($enq['company_website'])): ?>
                  <a href="<?php echo escapeHtml($enq['company_website']); ?>" target="_blank" rel="noopener noreferrer" style="color: #0369a1; text-decoration: underline; font-weight: 700;">
                    <?php echo escapeHtml($enq['company_website']); ?> ↗
                  </a>
                <?php else: ?>
                  <span style="color: #64748b;">Not provided</span>
                <?php endif; ?>
              </div>
            </div>
          </div>
        </div>

        <!-- Partnership Scope Box -->
        <div class="detail-box-card">
          <div class="detail-section-title">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="8.5" cy="7" r="4"></circle><line x1="20" y1="8" x2="20" y2="14"></line><line x1="23" y1="11" x2="17" y2="11"></line></svg>
            <span>Partnership Scope & Requirements</span>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.25rem;">
            <div class="detail-field-group">
              <div class="detail-field-label">Partnership Type</div>
              <div class="detail-field-value" style="color: #0d5e72; font-weight: 700;">
                <?php echo escapeHtml($enq['partnership_type'] ?: 'Hiring Requirement'); ?>
              </div>
            </div>

            <div class="detail-field-group">
              <div class="detail-field-label">Geographic Coverage</div>
              <div class="detail-field-value"><?php echo escapeHtml($enq['geographic_coverage'] ?: 'Pan India'); ?></div>
            </div>

            <div class="detail-field-group" style="grid-column: 1 / -1;">
              <div class="detail-field-label">Industries & Roles Covered</div>
              <div class="detail-field-value"><?php echo escapeHtml($enq['industries_roles'] ?: 'Not specified'); ?></div>
            </div>
          </div>

          <?php if (!empty($enq['company_introduction'])): ?>
            <div class="detail-field-group" style="margin-top: 1rem; border-top: 1px solid var(--border-color); padding-top: 1rem;">
              <div class="detail-field-label">Company Introduction & Background</div>
              <div class="detail-field-value" style="background: #f8fafc; padding: 1rem; border-radius: 8px; border: 1px solid #e2e8f0; font-size: 0.9rem; line-height: 1.6;">
                <?php echo nl2br(escapeHtml($enq['company_introduction'])); ?>
              </div>
            </div>
          <?php endif; ?>

          <?php if (!empty($enq['existing_network'])): ?>
            <div class="detail-field-group" style="margin-top: 1rem; border-top: 1px solid var(--border-color); padding-top: 1rem;">
              <div class="detail-field-label">Existing Client / Talent Network Reach</div>
              <div class="detail-field-value" style="background: #f8fafc; padding: 1rem; border-radius: 8px; border: 1px solid #e2e8f0; font-size: 0.9rem; line-height: 1.6;">
                <?php echo nl2br(escapeHtml($enq['existing_network'])); ?>
              </div>
            </div>
          <?php endif; ?>

          <?php if (!empty($enq['partnership_requirement'])): ?>
            <div class="detail-field-group" style="margin-top: 1rem; border-top: 1px solid var(--border-color); padding-top: 1rem;">
              <div class="detail-field-label">Specific Requirement / Hiring Mandates</div>
              <div class="detail-field-value" style="background: #f0fdf4; border: 1px solid #bbf7d0; padding: 1.1rem; border-radius: 8px; font-size: 0.9rem; line-height: 1.6; color: #166534; font-weight: 600;">
                <?php echo nl2br(escapeHtml($enq['partnership_requirement'])); ?>
              </div>
            </div>
          <?php endif; ?>

          <?php if (!empty($enq['additional_message'])): ?>
            <div class="detail-field-group" style="margin-top: 1rem; border-top: 1px solid var(--border-color); padding-top: 1rem;">
              <div class="detail-field-label">Additional Message / Commercial Terms</div>
              <div class="detail-field-value" style="background: #f8fafc; padding: 1rem; border-radius: 8px; border: 1px solid #e2e8f0; font-size: 0.9rem; line-height: 1.6;">
                <?php echo nl2br(escapeHtml($enq['additional_message'])); ?>
              </div>
            </div>
          <?php endif; ?>
        </div>
      </div>

      <!-- RIGHT COLUMN: Status & Recruiter Notes -->
      <div>
        <div class="detail-box-card" style="position: sticky; top: 90px;">
          <div class="detail-section-title">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
            <span>Lead & Account Management</span>
          </div>

          <form method="POST" action="enquiry-view.php?id=<?php echo $enq['id']; ?>">
            
            <div class="form-group" style="margin-bottom: 1.25rem;">
              <label class="form-label" for="enqStatus">Enquiry Status</label>
              <select name="status" id="enqStatus" class="form-control" style="font-weight: 700;">
                <option value="New" <?php echo $enq['status'] === 'New' ? 'selected' : ''; ?>>New Inbound Lead</option>
                <option value="Contacted" <?php echo $enq['status'] === 'Contacted' ? 'selected' : ''; ?>>Contacted / Initial Call</option>
                <option value="In Discussion" <?php echo $enq['status'] === 'In Discussion' ? 'selected' : ''; ?>>In Discussion / Commercials</option>
                <option value="Converted" <?php echo $enq['status'] === 'Converted' ? 'selected' : ''; ?>>Converted / Agreement Signed</option>
                <option value="Closed" <?php echo $enq['status'] === 'Closed' ? 'selected' : ''; ?>>Closed / Archived</option>
              </select>
            </div>

            <div class="form-group" style="margin-bottom: 1.5rem;">
              <label class="form-label" for="enqNotes">
                Internal Account / Commercial Notes
                <span style="font-size: 0.75rem; color: #64748b; font-weight: normal;">(Private)</span>
              </label>
              <textarea name="recruiter_notes" id="enqNotes" class="form-control" style="min-height: 140px;" placeholder="Add commercial terms, fee %, contact follow-up details, client agreement status..."><?php echo escapeHtml($enq['recruiter_notes'] ?? ''); ?></textarea>
            </div>

            <button type="submit" class="btn btn-primary" style="width: 100%;">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
              <span>Save Changes</span>
            </button>

          </form>

          <div style="margin-top: 1.5rem; padding-top: 1.25rem; border-top: 1px solid var(--border-color); font-size: 0.8rem; color: #64748b;">
            <div><strong>Created:</strong> <?php echo date('M d, Y H:i', strtotime($enq['created_at'])); ?></div>
            <?php if (!empty($enq['updated_at'])): ?>
              <div style="margin-top: 0.2rem;"><strong>Last Modified:</strong> <?php echo date('M d, Y H:i', strtotime($enq['updated_at'])); ?></div>
            <?php endif; ?>
          </div>
        </div>
      </div>

    </div>

  </main>

</body>
</html>
