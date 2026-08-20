<?php
/**
 * CEGS Admin - Delete Job Handler (CRUD - Delete)
 */

require_once __DIR__ . '/../db.php';
require_once __DIR__ . '/auth.php';

requireAdminAuth();

$pdo = getDBConnection();
$jobId = isset($_GET['id']) ? (int)$_GET['id'] : 0;

if ($pdo && $jobId > 0) {
    try {
        $stmt = $pdo->prepare("DELETE FROM jobs WHERE id = :id");
        $stmt->execute([':id' => $jobId]);
        header('Location: index.php?msg=deleted');
        exit;
    } catch (PDOException $e) {
        die('Error deleting job posting: ' . htmlspecialchars($e->getMessage()));
    }
}

header('Location: index.php');
exit;
?>
