<?php
/**
 * CEGS Admin - Secure Login Portal
 */

require_once __DIR__ . '/../db.php';
require_once __DIR__ . '/auth.php';

if (isLoggedIn()) {
    header('Location: index.php');
    exit;
}

$error = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $username = isset($_POST['username']) ? trim($_POST['username']) : '';
    $password = isset($_POST['password']) ? trim($_POST['password']) : '';

    if (empty($username) || empty($password)) {
        $error = 'Please enter both username and password.';
    } else {
        $pdo = getDBConnection();
        if (!$pdo) {
            $error = 'Cannot connect to MySQL database. Please verify db.php settings.';
        } else {
            try {
                $stmt = $pdo->prepare("SELECT * FROM admins WHERE username = :username LIMIT 1");
                $stmt->execute([':username' => $username]);
                $admin = $stmt->fetch(PDO::FETCH_ASSOC);

                if ($admin && password_verify($password, $admin['password'])) {
                    $_SESSION['cegs_admin_logged_in'] = true;
                    $_SESSION['cegs_admin_id'] = $admin['id'];
                    $_SESSION['cegs_admin_username'] = $admin['username'];
                    $_SESSION['cegs_admin_name'] = $admin['name'];
                    
                    header('Location: index.php');
                    exit;
                } else {
                    $error = 'Invalid credentials. Please try again.';
                }
            } catch (PDOException $e) {
                $error = 'Authentication error: ' . $e->getMessage();
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
  <title>Admin Login | CEGS Recruitment Portal</title>
  <link rel="stylesheet" href="admin.css">
  <link rel="icon" type="image/svg+xml" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%230d5e72'><rect width='24' height='24' rx='6' fill='%230d5e72'/><path d='M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2' fill='white'/></svg>">
</head>
<body>

  <div class="login-wrapper">
    <div class="login-card">
      <div class="login-brand-icon">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><polyline points="16 11 18 13 22 9"></polyline></svg>
      </div>
      <h1 class="login-title">CEGS Admin Portal</h1>
      <p class="login-subtitle">Sign in to manage live recruitment job postings</p>

      <?php if (!empty($error)): ?>
        <div class="alert alert-danger">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
          <span><?php echo escapeHtml($error); ?></span>
        </div>
      <?php endif; ?>

      <form class="login-form" method="POST" action="login.php">
        <div class="form-group">
          <label class="form-label" for="username">Admin Username</label>
          <input type="text" id="username" name="username" class="form-control" placeholder="e.g. admin" required autofocus autocomplete="username" />
        </div>

        <div class="form-group">
          <label class="form-label" for="password">Password</label>
          <input type="password" id="password" name="password" class="form-control" placeholder="••••••••••••" required autocomplete="current-password" />
        </div>

        <button type="submit" class="btn btn-primary" style="width: 100%; margin-top: 0.5rem; padding: 0.85rem;">
          <span>Sign In to Dashboard</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
        </button>

        <div style="margin-top: 1.5rem; text-align: center; font-size: 0.8rem; color: #64748b; border-top: 1px solid #e2e8f0; padding-top: 1.25rem;">
          <p>Default credentials: <strong>admin</strong> / <strong>adminpassword123</strong></p>
          <a href="../index.html" style="color: #0d5e72; font-weight: 700; text-decoration: none; display: inline-block; margin-top: 0.5rem;">&larr; Back to Public Website</a>
        </div>
      </form>
    </div>
  </div>

</body>
</html>
