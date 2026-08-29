<?php
/**
 * CEGS Admin - Secure Resume File Viewer & Downloader
 * Authenticated access only with path traversal protection
 */

require_once __DIR__ . '/../db.php';
require_once __DIR__ . '/auth.php';

requireAdminAuth();

$pdo = getDBConnection();
$id = isset($_GET['id']) ? (int)$_GET['id'] : 0;
$download = isset($_GET['download']) && $_GET['download'] === '1';

if (!$pdo || $id <= 0) {
    http_response_code(400);
    die('Invalid request.');
}

try {
    $stmt = $pdo->prepare("SELECT full_name, resume_filename, resume_path FROM candidate_applications WHERE id = :id LIMIT 1");
    $stmt->execute([':id' => $id]);
    $candidate = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$candidate || empty($candidate['resume_path'])) {
        http_response_code(404);
        die('Resume file not found for this candidate.');
    }

    $projectRoot = realpath(__DIR__ . '/../../');
    $resumeFullPath = realpath($projectRoot . DIRECTORY_SEPARATOR . $candidate['resume_path']);
    $allowedDir = realpath(__DIR__ . '/../../uploads/resumes');

    // Path traversal check
    if (!$resumeFullPath || !$allowedDir || strpos($resumeFullPath, $allowedDir) !== 0 || !file_exists($resumeFullPath)) {
        http_response_code(404);
        die('Resume file does not exist on disk.');
    }

    // Determine MIME type
    $finfo = finfo_open(FILEINFO_MIME_TYPE);
    $mimeType = finfo_file($finfo, $resumeFullPath);
    finfo_close($finfo);

    if (!$mimeType) {
        $ext = strtolower(pathinfo($resumeFullPath, PATHINFO_EXTENSION));
        if ($ext === 'pdf') $mimeType = 'application/pdf';
        elseif ($ext === 'docx') $mimeType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
        elseif ($ext === 'doc') $mimeType = 'application/msword';
        else $mimeType = 'application/octet-stream';
    }

    $downloadFilename = !empty($candidate['resume_filename']) ? $candidate['resume_filename'] : basename($resumeFullPath);
    // Sanitize filename for header
    $safeHeaderFilename = preg_replace('/[^a-zA-Z0-9_\.-]/', '_', $downloadFilename);

    $disposition = $download ? 'attachment' : 'inline';

    header('Content-Type: ' . $mimeType);
    header('Content-Disposition: ' . $disposition . '; filename="' . $safeHeaderFilename . '"');
    header('Content-Length: ' . filesize($resumeFullPath));
    header('Cache-Control: private, max-age=0, must-revalidate');
    header('Pragma: public');

    readfile($resumeFullPath);
    exit;

} catch (PDOException $e) {
    http_response_code(500);
    die('Database error: ' . htmlspecialchars($e->getMessage()));
}
?>
