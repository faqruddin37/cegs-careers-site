<?php
/**
 * CEGS Admin Dashboard - Manage Job Postings (CRUD - Read)
 */

require_once __DIR__ . '/../db.php';
require_once __DIR__ . '/auth.php';

requireAdminAuth();

$pdo = getDBConnection();
$jobs = [];
$totalJobs = 0;
$search = isset($_GET['search']) ? trim($_GET['search']) : '';
$msg = isset($_GET['msg']) ? trim($_GET['msg']) : '';

if ($pdo) {
    try {
        if (!empty($search)) {
            $stmt = $pdo->prepare("SELECT * FROM jobs WHERE company_name LIKE :s OR job_role LIKE :s OR location LIKE :s OR qualification LIKE :s ORDER BY posted_date DESC");
            $stmt->execute([':s' => "%{$search}%"]);
            $jobs = $stmt->fetchAll(PDO::FETCH_ASSOC);
        } else {
            $stmt = $pdo->query("SELECT * FROM jobs ORDER BY posted_date DESC");
            $jobs = $stmt->fetchAll(PDO::FETCH_ASSOC);
        }
        $totalJobs = count($jobs);
    } catch (PDOException $e) {
        $error = "Error fetching jobs: " . $e->getMessage();
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Admin Dashboard | Manage Jobs — CEGS</title>
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
        <span class="admin-brand-badge">Jobs Manager</span>
      </div>
    </a>

    <div class="admin-nav-links">
      <div class="admin-nav-user">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
        <span><?php echo escapeHtml($_SESSION['cegs_admin_name'] ?? 'Admin'); ?></span>
      </div>
      <a href="../index.html#careers" target="_blank" class="btn btn-outline btn-sm">
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

    <!-- Page Header & Action -->
    <div class="admin-page-header">
      <div>
        <h1 class="admin-page-title">Job Postings Management</h1>
        <p class="admin-page-desc">Create, view, update, and manage career opportunities displayed on the public website.</p>
      </div>
      <a href="add-job.php" class="btn btn-primary">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
        <span>Post New Job</span>
      </a>
    </div>

    <!-- Alert Notifications -->
    <?php if ($msg === 'created'): ?>
      <div class="alert alert-success">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
        <span>Job posting created successfully and is now live on the public careers portal!</span>
      </div>
    <?php elseif ($msg === 'updated'): ?>
      <div class="alert alert-success">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
        <span>Job posting updated successfully!</span>
      </div>
    <?php elseif ($msg === 'deleted'): ?>
      <div class="alert alert-success">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
        <span>Job posting removed from database.</span>
      </div>
    <?php endif; ?>

    <!-- Stat Summary Cards -->
    <div class="admin-stats-grid">
      <div class="stat-card">
        <div class="stat-info">
          <h4>Total Active Postings</h4>
          <div class="stat-number"><?php echo $totalJobs; ?></div>
        </div>
        <div class="stat-icon teal">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-info">
          <h4>Database Status</h4>
          <div style="font-size: 1.15rem; font-weight: 800; color: #0bb379; margin-top: 0.25rem;">
            <?php echo $pdo ? 'Connected (MySQL)' : 'Disconnected'; ?>
          </div>
        </div>
        <div class="stat-icon green">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-info">
          <h4>API Sync Feed</h4>
          <div style="font-size: 1.15rem; font-weight: 800; color: #0d5e72; margin-top: 0.25rem;">Active REST Endpoint</div>
        </div>
        <div class="stat-icon orange">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>
        </div>
      </div>
    </div>

    <!-- Jobs Table Card -->
    <div class="admin-card">
      <div class="admin-card-header">
        <div class="admin-card-title">All Published Vacancies (<?php echo $totalJobs; ?>)</div>
        
        <form method="GET" action="index.php" class="admin-search-bar">
          <svg class="admin-search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          <input type="text" name="search" class="admin-search-input" placeholder="Search by role, company, location..." value="<?php echo escapeHtml($search); ?>" />
          <?php if (!empty($search)): ?>
            <a href="index.php" style="font-size: 0.75rem; color: #64748b; font-weight: 700; text-decoration: none;">Clear</a>
          <?php endif; ?>
        </form>
      </div>

      <div class="table-responsive">
        <table class="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Job Role & Company</th>
              <th>Location</th>
              <th>Salary Range</th>
              <th>Qualification</th>
              <th>Cab Facility</th>
              <th>Posted Date</th>
              <th style="text-align: right;">Actions</th>
            </tr>
          </thead>
          <tbody>
            <?php if (empty($jobs)): ?>
              <tr>
                <td colspan="8" style="text-align: center; padding: 3rem 1rem; color: #64748b;">
                  <div style="font-size: 2rem; margin-bottom: 0.5rem;">📋</div>
                  <h4 style="color: #0f1c2d; margin-bottom: 0.25rem;">No job postings found</h4>
                  <p style="font-size: 0.85rem; margin-bottom: 1rem;">Start by adding your first recruitment opening.</p>
                  <a href="add-job.php" class="btn btn-primary btn-sm">Add First Job</a>
                </td>
              </tr>
            <?php else: ?>
              <?php foreach ($jobs as $job): ?>
                <tr>
                  <td><span class="badge badge-gray">#<?php echo escapeHtml($job['id']); ?></span></td>
                  <td>
                    <div class="job-role-cell"><?php echo escapeHtml($job['job_role']); ?></div>
                    <div class="job-company-cell"><?php echo escapeHtml($job['company_name']); ?></div>
                  </td>
                  <td>
                    <span style="display: flex; align-items: center; gap: 0.3rem;">
                      📍 <?php echo escapeHtml($job['location']); ?>
                    </span>
                  </td>
                  <td>
                    <span class="badge badge-green"><?php echo escapeHtml($job['salary']); ?></span>
                  </td>
                  <td><?php echo escapeHtml($job['qualification']); ?></td>
                  <td>
                    <?php if (!empty($job['cab_facility']) && strtolower(trim($job['cab_facility'])) !== 'no'): ?>
                      <span class="badge badge-teal">🚗 <?php echo escapeHtml($job['cab_facility']); ?></span>
                    <?php else: ?>
                      <span class="badge badge-gray">No</span>
                    <?php endif; ?>
                  </td>
                  <td style="color: #64748b; font-size: 0.8rem;">
                    <?php echo formatRelativeDate($job['posted_date']); ?>
                  </td>
                  <td style="text-align: right;">
                    <div class="action-buttons" style="justify-content: flex-end;">
                      <a href="edit-job.php?id=<?php echo $job['id']; ?>" class="btn btn-outline btn-sm" title="Edit Job">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
                        <span>Edit</span>
                      </a>
                      <a href="delete-job.php?id=<?php echo $job['id']; ?>" class="btn btn-danger btn-sm" onclick="return confirm('Are you sure you want to delete this job posting for &quot;<?php echo addslashes($job['job_role']); ?>&quot;?');" title="Delete Job">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                        <span>Delete</span>
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
