<?php
/**
 * CEGS Admin - Delete Client Enquiry Handler
 */

require_once __DIR__ . '/../db.php';
require_once __DIR__ . '/auth.php';

requireAdminAuth();

$pdo = getDBConnection();
$enquiryId = isset($_GET['id']) ? (int)$_GET['id'] : 0;

if ($pdo && $enquiryId > 0) {
    try {
        $delStmt = $pdo->prepare("DELETE FROM client_enquiries WHERE id = :id");
        $delStmt->execute([':id' => $enquiryId]);

        header('Location: enquiries.php?msg=deleted');
        exit;
    } catch (PDOException $e) {
        die('Error deleting client enquiry: ' . htmlspecialchars($e->getMessage()));
    }
}

header('Location: enquiries.php');
exit;
?>
