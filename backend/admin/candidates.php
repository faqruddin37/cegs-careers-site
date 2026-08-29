<?php
/**
 * CEGS Admin - Candidate Applications Management
 */

require_once __DIR__ . '/../db.php';
require_once __DIR__ . '/auth.php';

requireAdminAuth();

$pdo = getDBConnection();
$candidates = [];
$totalCandidates = 0;
$newCount = 0;
$shortlistedCount = 0;
$selectedCount = 0;

$search = isset($_GET['search']) ? trim($_GET['search']) : '';
$statusFilter = isset($_GET['status']) ? trim($_GET['status']) : '';
$msg = isset($_GET['msg']) ? trim($_GET['msg']) : '';

if ($pdo) {
    try {
        // Overall metrics
        $totalCandidates = (int)$pdo->query("SELECT COUNT(*) FROM candidate_applications")->fetchColumn();
        $newCount = (int)$pdo->query("SELECT COUNT(*) FROM candidate_applications WHERE status = 'New'")->fetchColumn();
        $shortlistedCount = (int)$pdo->query("SELECT COUNT(*) FROM candidate_applications WHERE status IN ('Shortlisted', 'Interview')")->fetchColumn();
        $selectedCount = (int)$pdo->query("SELECT COUNT(*) FROM candidate_applications WHERE status = 'Selected'")->fetchColumn();

        // Main Query
        $query = "SELECT * FROM candidate_applications WHERE 1=1";
        $params = [];

        if (!empty($search)) {
            $query .= " AND (full_name LIKE :s OR email LIKE :s OR phone LIKE :s OR job_title LIKE :s OR location LIKE :s OR skills LIKE :s)";
            $params[':s'] = "%{$search}%";
        }

        if (!empty($statusFilter)) {
            $query .= " AND status = :status";
            $params[':status'] = $statusFilter;
        }

        $query .= " ORDER BY created_at DESC";

        $stmt = $pdo->prepare($query);
        $stmt->execute($params);
        $candidates = $stmt->fetchAll(PDO::FETCH_ASSOC);

    } catch (PDOException $e) {
        $error = "Error fetching candidate applications: " . $e->getMessage();
    }
}

function getCandidateStatusBadge($status) {
    switch ($status) {
        case 'New':
            return '<span class="badge badge-teal"><span style="display:inline-block;width:6px;height:6px;border-radius:50%;background:#0d5e72;margin-right:4px;"></span>New</span>';
        case 'Shortlisted':
            return '<span class="badge badge-blue">Shortlisted</span>';
        case 'Interview':
            return '<span class="badge badge-orange">Interview</span>';
        case 'Selected':
            return '<span class="badge badge-green">✓ Selected</span>';
        case 'Rejected':
            return '<span class="badge badge-red">Rejected</span>';
        default:
            return '<span class="badge badge-gray">' . escapeHtml($status) . '</span>';
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Candidate Applications | CEGS Admin</title>
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
        <span class="admin-brand-badge">Applications</span>
      </div>
    </a>

    <div class="admin-nav-links">
      <div class="admin-nav-user">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
        <span><?php echo escapeHtml($_SESSION['cegs_admin_name'] ?? 'Admin'); ?></span>
      </div>
      <a href="../../index.html#careers" target="_blank" class="btn btn-outline btn-sm">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
        <span>View Live Careers</span>
      </a>
      <a href="logout.php" class="btn btn-danger btn-sm">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
        <span>Sign Out</span>
      </a>
    </div>
  </header>

  <!-- Main Container -->
  <main class="admin-container">

    <!-- Primary Sub-Navigation Bar -->
    <nav class="admin-subnav">
      <a href="index.php" class="admin-subnav-link">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>
        <span>Jobs Management</span>
      </a>
      <a href="candidates.php" class="admin-subnav-link active">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
        <span>Candidate Applications</span>
        <?php if ($newCount > 0): ?>
          <span style="background:#0d5e72;color:#fff;border-radius:999px;font-size:0.7rem;padding:0.1rem 0.5rem;"><?php echo $newCount; ?></span>
        <?php endif; ?>
      </a>
      <a href="enquiries.php" class="admin-subnav-link">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
        <span>Client Enquiries</span>
      </a>
    </nav>

    <!-- Page Header -->
    <div class="admin-page-header">
      <div>
        <h1 class="admin-page-title">Candidate Applications</h1>
        <p class="admin-page-desc">Review submitted candidate resumes, manage screening stages, and update internal recruiter notes.</p>
      </div>
    </div>

    <!-- Alert Notifications -->
    <?php if ($msg === 'updated'): ?>
      <div class="alert alert-success">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
        <span>Candidate status & notes updated successfully!</span>
      </div>
    <?php elseif ($msg === 'deleted'): ?>
      <div class="alert alert-success">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
        <span>Candidate application and associated resume deleted.</span>
      </div>
    <?php endif; ?>

    <!-- Stat Summary Cards -->
    <div class="admin-stats-grid">
      <div class="stat-card">
        <div class="stat-info">
          <h4>Total Candidates</h4>
          <div class="stat-number"><?php echo $totalCandidates; ?></div>
        </div>
        <div class="stat-icon teal">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle></svg>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-info">
          <h4>New Submissions</h4>
          <div class="stat-number" style="color: #0d5e72;"><?php echo $newCount; ?></div>
        </div>
        <div class="stat-icon teal">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 14 14"></polyline></svg>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-info">
          <h4>In Pipeline / Interview</h4>
          <div class="stat-number" style="color: #f56a00;"><?php echo $shortlistedCount; ?></div>
        </div>
        <div class="stat-icon orange">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-info">
          <h4>Selected / Placed</h4>
          <div class="stat-number" style="color: #0bb379;"><?php echo $selectedCount; ?></div>
        </div>
        <div class="stat-icon green">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
        </div>
      </div>
    </div>

    <!-- Candidate List Table Card -->
    <div class="admin-card">
      <div class="admin-card-header">
        <div>
          <div class="admin-card-title">Applications (<?php echo count($candidates); ?>)</div>
        </div>

        <div class="admin-filter-bar">
          <!-- Status Pills -->
          <a href="candidates.php<?php echo !empty($search) ? '?search=' . urlencode($search) : ''; ?>" class="admin-filter-pill <?php echo empty($statusFilter) ? 'active' : ''; ?>">All</a>
          <a href="candidates.php?status=New<?php echo !empty($search) ? '&search=' . urlencode($search) : ''; ?>" class="admin-filter-pill <?php echo $statusFilter === 'New' ? 'active' : ''; ?>">New</a>
          <a href="candidates.php?status=Shortlisted<?php echo !empty($search) ? '&search=' . urlencode($search) : ''; ?>" class="admin-filter-pill <?php echo $statusFilter === 'Shortlisted' ? 'active' : ''; ?>">Shortlisted</a>
          <a href="candidates.php?status=Interview<?php echo !empty($search) ? '&search=' . urlencode($search) : ''; ?>" class="admin-filter-pill <?php echo $statusFilter === 'Interview' ? 'active' : ''; ?>">Interview</a>
          <a href="candidates.php?status=Selected<?php echo !empty($search) ? '&search=' . urlencode($search) : ''; ?>" class="admin-filter-pill <?php echo $statusFilter === 'Selected' ? 'active' : ''; ?>">Selected</a>
          <a href="candidates.php?status=Rejected<?php echo !empty($search) ? '&search=' . urlencode($search) : ''; ?>" class="admin-filter-pill <?php echo $statusFilter === 'Rejected' ? 'active' : ''; ?>">Rejected</a>

          <!-- Search Form -->
          <form method="GET" action="candidates.php" class="admin-search-bar" style="margin-left: auto;">
            <?php if (!empty($statusFilter)): ?>
              <input type="hidden" name="status" value="<?php echo escapeHtml($statusFilter); ?>" />
            <?php endif; ?>
            <svg class="admin-search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            <input type="text" name="search" class="admin-search-input" placeholder="Search candidate name, email, role..." value="<?php echo escapeHtml($search); ?>" />
            <?php if (!empty($search)): ?>
              <a href="candidates.php<?php echo !empty($statusFilter) ? '?status=' . urlencode($statusFilter) : ''; ?>" style="font-size: 0.75rem; color: #64748b; font-weight: 700; text-decoration: none;">Clear</a>
            <?php endif; ?>
          </form>
        </div>
      </div>

      <div class="table-responsive">
        <table class="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Candidate Name</th>
              <th>Contact Details</th>
              <th>Applied Role</th>
              <th>Experience & CTC</th>
              <th>Resume</th>
              <th>Status</th>
              <th>Applied Date</th>
              <th style="text-align: right;">Actions</th>
            </tr>
          </thead>
          <tbody>
            <?php if (empty($candidates)): ?>
              <tr>
                <td colspan="9" style="text-align: center; padding: 3rem 1rem; color: #64748b;">
                  <div style="font-size: 2rem; margin-bottom: 0.5rem;">👥</div>
                  <h4 style="color: #0f1c2d; margin-bottom: 0.25rem;">No candidate applications found</h4>
                  <p style="font-size: 0.85rem;">New applications submitted through the careers portal will appear here.</p>
                </td>
              </tr>
            <?php else: ?>
              <?php foreach ($candidates as $cand): ?>
                <tr>
                  <td><span class="badge badge-gray">#<?php echo escapeHtml($cand['id']); ?></span></td>
                  <td>
                    <div class="job-role-cell"><?php echo escapeHtml($cand['full_name']); ?></div>
                    <?php if (!empty($cand['location'])): ?>
                      <div class="job-company-cell">📍 <?php echo escapeHtml($cand['location']); ?></div>
                    <?php endif; ?>
                  </td>
                  <td>
                    <div style="font-size: 0.85rem; font-weight: 600; color: #0f1c2d;"><?php echo escapeHtml($cand['email']); ?></div>
                    <div style="font-size: 0.8rem; color: #64748b;"><?php echo escapeHtml($cand['phone']); ?></div>
                  </td>
                  <td>
                    <div style="font-weight: 700; color: #0d5e72; font-size: 0.875rem;">
                      <?php echo escapeHtml($cand['job_title'] ?: 'General Application'); ?>
                    </div>
                  </td>
                  <td>
                    <div style="font-size: 0.85rem; font-weight: 600;"><?php echo escapeHtml($cand['experience'] ?: 'N/A'); ?></div>
                    <?php if (!empty($cand['expected_ctc']) || !empty($cand['current_ctc'])): ?>
                      <div style="font-size: 0.75rem; color: #64748b;">
                        <?php echo escapeHtml($cand['expected_ctc'] ? 'Exp: ' . $cand['expected_ctc'] : 'Curr: ' . $cand['current_ctc']); ?>
                      </div>
                    <?php endif; ?>
                  </td>
                  <td>
                    <?php if (!empty($cand['resume_path'])): ?>
                      <a href="view-resume.php?id=<?php echo $cand['id']; ?>" target="_blank" class="btn btn-outline btn-sm" style="padding: 0.25rem 0.6rem; font-size: 0.75rem;" title="View Resume">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                        <span>PDF / Doc</span>
                      </a>
                    <?php else: ?>
                      <span class="badge badge-gray">No File</span>
                    <?php endif; ?>
                  </td>
                  <td>
                    <?php echo getCandidateStatusBadge($cand['status']); ?>
                  </td>
                  <td style="color: #64748b; font-size: 0.8rem;">
                    <?php echo formatRelativeDate($cand['created_at']); ?>
                  </td>
                  <td style="text-align: right;">
                    <div class="action-buttons" style="justify-content: flex-end;">
                      <a href="candidate-view.php?id=<?php echo $cand['id']; ?>" class="btn btn-primary btn-sm" title="View Details & Notes">
                        <span>Review</span>
                      </a>
                      <a href="delete-candidate.php?id=<?php echo $cand['id']; ?>" class="btn btn-danger btn-sm" onclick="return confirm('Are you sure you want to delete application for <?php echo addslashes($cand['full_name']); ?>?');" title="Delete Application">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                      </a>
                    </div>
                  </td>
                </tr>
              <?php endforeach; ?>
            <?php endif; ?>
          </tbody>
        </table>
      </div>
    </div>

  </main>

</body>
</html>
