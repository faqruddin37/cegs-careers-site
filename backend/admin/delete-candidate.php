<?php
/**
 * CEGS Admin - Delete Candidate Application Handler
 */

require_once __DIR__ . '/../db.php';
require_once __DIR__ . '/auth.php';

requireAdminAuth();

$pdo = getDBConnection();
$candidateId = isset($_GET['id']) ? (int)$_GET['id'] : 0;

if ($pdo && $candidateId > 0) {
    try {
        // Fetch candidate resume path
        $stmt = $pdo->prepare("SELECT resume_path FROM candidate_applications WHERE id = :id LIMIT 1");
        $stmt->execute([':id' => $candidateId]);
        $candidate = $stmt->fetch(PDO::FETCH_ASSOC);

        // Delete from database
        $delStmt = $pdo->prepare("DELETE FROM candidate_applications WHERE id = :id");
        $delStmt->execute([':id' => $candidateId]);

        // Safely unlink resume file
        if ($candidate && !empty($candidate['resume_path'])) {
            $projectRoot = realpath(__DIR__ . '/../../');
            $fullFilePath = realpath($projectRoot . DIRECTORY_SEPARATOR . $candidate['resume_path']);
            $uploadBaseDir = realpath(__DIR__ . '/../../uploads/resumes');

            if ($fullFilePath && $uploadBaseDir && strpos($fullFilePath, $uploadBaseDir) === 0 && file_exists($fullFilePath)) {
                @unlink($fullFilePath);
            }
        }

        header('Location: candidates.php?msg=deleted');
        exit;
    } catch (PDOException $e) {
        die('Error deleting candidate application: ' . htmlspecialchars($e->getMessage()));
    }
}

header('Location: candidates.php');
exit;
?>
