<?php
/**
 * CEGS Recruitment Portal - Database Configuration & Helper Functions
 */

// Database Credentials (Update with your MySQL credentials)
define('DB_HOST', 'localhost');
define('DB_PORT', '3306');
define('DB_NAME', 'cegs_db');
define('DB_USER', 'root');
define('DB_PASS', '');

function getDBConnection() {
    static $pdo = null;
    if ($pdo === null) {
        try {
            $dsn = "mysql:host=" . DB_HOST . ";port=" . DB_PORT . ";dbname=" . DB_NAME . ";charset=utf8mb4";
            $options = [
                PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES   => false,
            ];
            $pdo = new PDO($dsn, DB_USER, DB_PASS, $options);
        } catch (PDOException $e) {
            // For API or CLI fallback
            return null;
        }
    }
    return $pdo;
}

// Helper: Sanitize Output
function escapeHtml($str) {
    return htmlspecialchars((string)$str, ENT_QUOTES, 'UTF-8');
}

// Helper: Relative Time Formatter
function formatRelativeDate($timestamp) {
    if (!$timestamp) return 'Recently';
    $time = strtotime($timestamp);
    $diff = time() - $time;
    
    if ($diff < 60) return 'Just now';
    if ($diff < 3600) return floor($diff / 60) . ' mins ago';
    if ($diff < 86400) return floor($diff / 3600) . ' hrs ago';
    if ($diff < 604800) return floor($diff / 86400) . ' days ago';
    return date('M d, Y', $time);
}
?>
