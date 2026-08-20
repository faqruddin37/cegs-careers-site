<?php
/**
 * CEGS Public Careers Portal - Dynamic PHP / MySQL Job Board
 * Matches 100% of CEGS theme, typography, navigation, and modal flows
 */

require_once __DIR__ . '/db.php';

$pdo = getDBConnection();
$jobs = [];
$search = isset($_GET['search']) ? trim($_GET['search']) : '';
$locationFilter = isset($_GET['location']) ? trim($_GET['location']) : '';

if ($pdo) {
    try {
        $query = "SELECT * FROM jobs WHERE 1=1";
        $params = [];

        if (!empty($search)) {
            $query .= " AND (job_role LIKE :s OR company_name LIKE :s OR qualification LIKE :s OR additional_notes LIKE :s)";
            $params[':s'] = "%{$search}%";
        }

        if (!empty($locationFilter)) {
            $query .= " AND location LIKE :loc";
            $params[':loc'] = "%{$locationFilter}%";
        }

        $query .= " ORDER BY posted_date DESC";

        $stmt = $pdo->prepare($query);
        $stmt->execute($params);
        $jobs = $stmt->fetchAll(PDO::FETCH_ASSOC);
    } catch (PDOException $e) {
        $jobs = [];
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Careers & Live Job Openings | CEGS Opportunity Hub</title>
  <meta name="description" content="Explore verified tech, enterprise, inside sales, and payroll job openings with direct recruiter review. Fast-track 48-hour interview turnaround.">

  <!-- Google Fonts: Plus Jakarta Sans -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">

  <!-- Main Website Stylesheet -->
  <link rel="stylesheet" href="css/main.css">
  <link rel="icon" type="image/svg+xml" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%230d5e72'><rect width='24' height='24' rx='6' fill='%230d5e72'/><path d='M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2' fill='white'/></svg>">

  <style>
    /* Custom Job Card Enhancements for Dynamic MySQL Fields */
    .php-jobs-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 1.75rem;
    }

    @media (max-width: 868px) {
      .php-jobs-grid {
        grid-template-columns: 1fr;
      }
    }

    .php-job-card {
      background: #ffffff;
      border: 1.5px solid var(--border-light);
      border-radius: var(--radius-lg);
      padding: 2rem;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      transition: all var(--transition-fast);
      box-shadow: 0 4px 16px rgba(15, 28, 45, 0.04);
      position: relative;
    }

    .php-job-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 16px 36px rgba(15, 28, 45, 0.09);
      border-color: var(--color-primary);
    }

    .php-job-header {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 1rem;
      margin-bottom: 1rem;
    }

    .php-company-badge {
      font-size: 0.85rem;
      font-weight: 800;
      color: var(--color-primary);
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .php-job-title {
      font-size: 1.35rem;
      font-weight: 800;
      color: var(--text-heading);
      margin: 0.25rem 0 0.75rem;
      line-height: 1.3;
    }

    .php-spec-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 0.75rem 1rem;
      background: #f8fafc;
      border-radius: var(--radius-md);
      padding: 1rem 1.25rem;
      margin-bottom: 1.25rem;
      font-size: 0.85rem;
      border: 1px solid #edf2f7;
    }

    .php-spec-item {
      display: flex;
      flex-direction: column;
      gap: 0.15rem;
    }

    .php-spec-label {
      font-size: 0.7rem;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      color: #64748b;
      font-weight: 700;
    }

    .php-spec-value {
      font-weight: 700;
      color: var(--text-heading);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .php-notes-box {
      font-size: 0.875rem;
      color: #475569;
      line-height: 1.6;
      margin-bottom: 1.25rem;
      background: #fcfdfe;
      padding: 0.75rem 1rem;
      border-left: 3px solid var(--color-primary);
      border-radius: 0 var(--radius-sm) var(--radius-sm) 0;
    }

    .php-job-footer {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding-top: 1.25rem;
      border-top: 1px solid var(--border-light);
      flex-wrap: wrap;
      gap: 1rem;
    }

    .php-salary-tag {
      font-size: 1.15rem;
      font-weight: 800;
      color: #0bb379;
    }
  </style>
</head>
<body>

  <!-- Sticky Main Navbar -->
  <header class="site-header scrolled">
    <div class="container header-container">
      <a href="index.html#home" class="brand-logo" aria-label="CEGS Homepage">
        <div class="logo-mark">
          <div class="logo-icon-svg">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
          </div>
          <div class="logo-text-group">
            <span class="logo-title">CEGS</span>
            <span class="logo-tagline">Consulting & Enterprise</span>
          </div>
        </div>
        <span class="portal-pill">CAREERS</span>
      </a>

      <nav class="main-nav">
        <ul class="nav-menu" id="navMenu">
          <li class="nav-item"><a href="index.html#home" class="nav-link">Home</a></li>
          <li class="nav-item"><a href="index.html#about" class="nav-link">About Us</a></li>
          <li class="nav-item"><a href="index.html#services" class="nav-link">Services</a></li>
          <li class="nav-item"><a href="careers.php" class="nav-link active">Careers & Jobs</a></li>
          <li class="nav-item"><a href="index.html#blog" class="nav-link">Blog & Insights</a></li>
          <li class="nav-item"><a href="index.html#contact" class="nav-link">Contact</a></li>
        </ul>
      </nav>

      <div class="header-actions">
        <a href="admin/index.php" class="btn btn-outline btn-sm">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
          <span>Admin Portal</span>
        </a>
        <button class="btn btn-primary btn-sm" onclick="openGeneralApplyModal()">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
          <span>1-Click Apply</span>
        </button>
      </div>
    </div>
  </header>

  <main>
    <!-- Dedicated Careers Hero Banner -->
    <div class="page-hero-banner">
      <div class="container">
        <div class="page-hero-breadcrumbs">
          <a href="index.html#home">Home</a>
          <span>/</span>
          <span>Careers & Live Job Openings</span>
        </div>
        <h1 class="page-hero-title">Live Enterprise Job Openings</h1>
        <p class="page-hero-desc">Discover verified career opportunities with top technology companies and enterprise clients. Every applicant receives direct recruiter feedback.</p>
      </div>
    </div>

    <!-- Job Board Filter & Grid Section -->
    <section class="careers-board-section" style="padding: 3.5rem 0 5rem;">
      <div class="container">
        
        <!-- Live Filter Bar -->
        <div class="board-filters" style="margin-bottom: 2.5rem;">
          <form method="GET" action="careers.php" class="search-bar" style="max-width: 100%;">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            <input type="text" name="search" placeholder="Search by job title, company, skills, or qualification..." value="<?php echo escapeHtml($search); ?>" style="flex: 1;" />
            <button type="submit" class="btn btn-primary btn-sm" style="margin-right: 4px;">Search Jobs</button>
            <?php if (!empty($search)): ?>
              <a href="careers.php" class="btn btn-outline btn-sm" style="margin-right: 4px;">Reset</a>
            <?php endif; ?>
          </form>
        </div>

        <!-- Dynamic PHP/MySQL Job Postings Grid -->
        <div class="php-jobs-grid">
          <?php if (empty($jobs)): ?>
            <div style="grid-column: 1 / -1; text-align: center; padding: 4rem 1.5rem; background: #ffffff; border-radius: 18px; border: 1.5px dashed var(--border-light);">
              <div style="font-size: 3rem; margin-bottom: 0.5rem;">🔍</div>
              <h3 style="color: var(--text-heading); margin-bottom: 0.5rem;">No matching job openings found</h3>
              <p style="color: var(--text-muted); font-size: 0.95rem; margin-bottom: 1.5rem;">Try refining your keywords or submit a general resume for upcoming priority roles.</p>
              <button class="btn btn-primary" onclick="openGeneralApplyModal()">Drop Your Resume</button>
            </div>
          <?php else: ?>
            <?php foreach ($jobs as $job): ?>
              <article class="php-job-card">
                <div>
                  <div class="php-job-header">
                    <div>
                      <span class="php-company-badge"><?php echo escapeHtml($job['company_name']); ?></span>
                      <h2 class="php-job-title"><?php echo escapeHtml($job['job_role']); ?></h2>
                    </div>
                    <span class="badge badge-teal">
                      ⏱️ <?php echo formatRelativeDate($job['posted_date']); ?>
                    </span>
                  </div>

                  <!-- Key Role Specifications Grid -->
                  <div class="php-spec-grid">
                    <div class="php-spec-item">
                      <span class="php-spec-label">Location</span>
                      <span class="php-spec-value">📍 <?php echo escapeHtml($job['location']); ?></span>
                    </div>

                    <div class="php-spec-item">
                      <span class="php-spec-label">Shift Details</span>
                      <span class="php-spec-value">⏰ <?php echo escapeHtml($job['shift_details']); ?></span>
                    </div>

                    <div class="php-spec-item">
                      <span class="php-spec-label">Qualification</span>
                      <span class="php-spec-value">🎓 <?php echo escapeHtml($job['qualification']); ?></span>
                    </div>

                    <div class="php-spec-item">
                      <span class="php-spec-label">Languages</span>
                      <span class="php-spec-value">🗣️ <?php echo escapeHtml($job['language_required']); ?></span>
                    </div>

                    <?php 
                      // Requirement: If cab_facility is empty or 'No', hide it gracefully
                      $cab = trim($job['cab_facility'] ?? '');
                      if (!empty($cab) && strtolower($cab) !== 'no' && strtolower($cab) !== 'none'): 
                    ?>
                      <div class="php-spec-item" style="grid-column: 1 / -1; border-top: 1px dashed #e2e8f0; padding-top: 0.5rem; margin-top: 0.25rem;">
                        <span class="php-spec-label">Cab & Transport Facility</span>
                        <span class="php-spec-value" style="color: var(--color-primary);">🚗 <?php echo escapeHtml($cab); ?></span>
                      </div>
                    <?php endif; ?>
                  </div>

                  <?php 
                    // Requirement: If additional_notes is empty, hide it gracefully
                    $notes = trim($job['additional_notes'] ?? '');
                    if (!empty($notes)): 
                  ?>
                    <div class="php-notes-box">
                      <strong style="color: var(--text-heading); display: block; margin-bottom: 0.2rem; font-size: 0.75rem; text-transform: uppercase;">Role Details:</strong>
                      <?php echo nl2br(escapeHtml($notes)); ?>
                    </div>
                  <?php endif; ?>

                </div>

                <div class="php-job-footer">
                  <div>
                    <span style="font-size: 0.75rem; color: #64748b; font-weight: 700; display: block; text-transform: uppercase;">Compensation:</span>
                    <span class="php-salary-tag"><?php echo escapeHtml($job['salary']); ?></span>
                  </div>

                  <div style="display: flex; gap: 0.6rem;">
                    <button type="button" class="btn btn-primary btn-sm" onclick="openJobApplyModal('<?php echo escapeHtml($job['job_role']); ?>')">
                      <span>Apply Now</span>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                    </button>
                  </div>
                </div>
              </article>
            <?php endforeach; ?>
          <?php endif; ?>
        </div>

      </div>
    </section>
  </main>

  <!-- Reusable Modal Container for 1-Click Candidate Application Form -->
  <div class="modal-overlay" id="modalOverlay">
    <div class="modal-container">
      <button class="modal-close-btn" aria-label="Close modal" onclick="closeModal()">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
      </button>
      <div id="modalBody"></div>
    </div>
  </div>

  <!-- Toast Notification Container -->
  <div class="toast-container"></div>

  <!-- Site Scripts for Interactive Modals -->
  <script src="js/data.js"></script>
  <script src="js/interactions.js"></script>

</body>
</html>
