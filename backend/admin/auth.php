<?php
/**
 * CEGS Admin - Authentication & Session Protection Helper
 */

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

function requireAdminAuth() {
    if (!isset($_SESSION['cegs_admin_logged_in']) || $_SESSION['cegs_admin_logged_in'] !== true) {
        header('Location: login.php');
        exit;
    }
}

function isLoggedIn() {
    return isset($_SESSION['cegs_admin_logged_in']) && $_SESSION['cegs_admin_logged_in'] === true;
}
?>
