<?php
/**
 * CEGS REST API - Candidate Applications Endpoint
 * Handles public candidate applications, resume uploads, and admin management
 */

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once __DIR__ . '/../db.php';
require_once __DIR__ . '/../admin/auth.php';
require_once __DIR__ . '/../mail.php';

$pdo = getDBConnection();

if (!$pdo) {
    http_response_code(503);
    echo json_encode([
        'status' => 'error',
        'message' => 'Database connection failed. Please check MySQL settings in db.php.',
        'data' => null
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

$method = $_SERVER['REQUEST_METHOD'];
$action = $_POST['action'] ?? $_GET['action'] ?? '';

// ============================================================================
// 1. POST - Candidate Application Submission (Public) OR Admin Actions
// ============================================================================
if ($method === 'POST' && empty($action)) {
    // Collect and sanitize inputs
    $fullName    = trim($_POST['full_name'] ?? $_POST['name'] ?? '');
    $email       = trim($_POST['email'] ?? '');
    $phone       = trim($_POST['phone'] ?? '');
    $jobId       = !empty($_POST['job_id']) ? (int)$_POST['job_id'] : null;
    $jobTitle    = trim($_POST['job_title'] ?? $_POST['applied_for'] ?? '');
    $experience  = trim($_POST['experience'] ?? '');
    $currentCtc  = trim($_POST['current_ctc'] ?? '');
    $expectedCtc = trim($_POST['expected_ctc'] ?? '');
    $linkedinUrl = trim($_POST['linkedin_url'] ?? $_POST['linkedin'] ?? '');
    $location    = trim($_POST['location'] ?? '');
    $skills      = trim($_POST['skills'] ?? '');
    $coverMsg    = trim($_POST['cover_message'] ?? $_POST['message'] ?? '');

    // Server-side validation
    $errors = [];
    if (empty($fullName)) {
        $errors[] = 'Full Name is required.';
    }
    if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $errors[] = 'A valid email address is required.';
    }
    if (empty($phone) || strlen(preg_replace('/[^0-9]/', '', $phone)) < 7) {
        $errors[] = 'A valid contact phone number is required.';
    }

    if (!empty($errors)) {
        http_response_code(422);
        echo json_encode([
            'status' => 'error',
            'message' => implode(' ', $errors),
            'errors' => $errors
        ], JSON_UNESCAPED_UNICODE);
        exit;
    }

    // Auto-fetch job_title from DB if job_id provided and job_title is empty
    if ($jobId && empty($jobTitle)) {
        try {
            $stmt = $pdo->prepare("SELECT job_role, company_name FROM jobs WHERE id = :id LIMIT 1");
            $stmt->execute([':id' => $jobId]);
            $jobInfo = $stmt->fetch(PDO::FETCH_ASSOC);
            if ($jobInfo) {
                $jobTitle = $jobInfo['job_role'] . ' (' . $jobInfo['company_name'] . ')';
            }
        } catch (PDOException $e) {
            // Non-critical, continue
        }
    }

    if (empty($jobTitle)) {
        $jobTitle = 'General Application';
    }

    // Resume Upload Processing
    $savedResumeFilename = null;
    $savedResumePath = null;
    $uploadedFileFullPath = null;

    if (isset($_FILES['resume']) && $_FILES['resume']['error'] !== UPLOAD_ERR_NO_FILE) {
        $file = $_FILES['resume'];

        if ($file['error'] !== UPLOAD_ERR_OK) {
            http_response_code(400);
            echo json_encode([
                'status' => 'error',
                'message' => 'Failed to upload resume file. Error code: ' . $file['error']
            ]);
            exit;
        }

        // Max 5 MB
        $maxSizeBytes = 5 * 1024 * 1024;
        if ($file['size'] > $maxSizeBytes) {
            http_response_code(400);
            echo json_encode([
                'status' => 'error',
                'message' => 'Resume file is too large. Maximum allowed size is 5MB.'
            ]);
            exit;
        }

        // Extension validation
        $origName = basename($file['name']);
        $ext = strtolower(pathinfo($origName, PATHINFO_EXTENSION));
        $allowedExtensions = ['pdf', 'doc', 'docx'];

        if (!in_array($ext, $allowedExtensions, true)) {
            http_response_code(400);
            echo json_encode([
                'status' => 'error',
                'message' => 'Invalid resume file type. Allowed formats: PDF, DOC, DOCX.'
            ]);
            exit;
        }

        // MIME Type validation
        $finfo = finfo_open(FILEINFO_MIME_TYPE);
        $mimeType = finfo_file($finfo, $file['tmp_name']);
        finfo_close($finfo);

        $allowedMimes = [
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'application/vnd.ms-word',
            'application/octet-stream' // checked together with extension whitelist
        ];

        if (!in_array($mimeType, $allowedMimes, true)) {
            http_response_code(400);
            echo json_encode([
                'status' => 'error',
                'message' => 'Invalid resume file format.'
            ]);
            exit;
        }

        // Destination Directory
        $uploadDir = realpath(__DIR__ . '/../../uploads/resumes');
        if (!$uploadDir) {
            $uploadDir = __DIR__ . '/../../uploads/resumes';
            if (!is_dir($uploadDir)) {
                mkdir($uploadDir, 0755, true);
            }
            $uploadDir = realpath($uploadDir);
        }

        if (!$uploadDir || !is_writable($uploadDir)) {
            http_response_code(500);
            echo json_encode([
                'status' => 'error',
                'message' => 'Server upload directory is not writable.'
            ]);
            exit;
        }

        // Safe unique file name
        $safeName = 'candidate_' . time() . '_' . bin2hex(random_bytes(6)) . '.' . $ext;
        $destination = $uploadDir . DIRECTORY_SEPARATOR . $safeName;

        if (!move_uploaded_file($file['tmp_name'], $destination)) {
            http_response_code(500);
            echo json_encode([
                'status' => 'error',
                'message' => 'Failed to save uploaded resume file.'
            ]);
            exit;
        }

        $uploadedFileFullPath = $destination;
        $savedResumeFilename = $origName;
        $savedResumePath = 'uploads/resumes/' . $safeName;
    }

    // Insert Record into Database with Rollback Safety
    try {
        $sql = "INSERT INTO candidate_applications (
                    full_name, email, phone, job_id, job_title, experience,
                    current_ctc, expected_ctc, linkedin_url, location, skills,
                    cover_message, resume_filename, resume_path, status, created_at
                ) VALUES (
                    :full_name, :email, :phone, :job_id, :job_title, :experience,
                    :current_ctc, :expected_ctc, :linkedin_url, :location, :skills,
                    :cover_message, :resume_filename, :resume_path, 'New', NOW()
                )";

        $stmt = $pdo->prepare($sql);
        $stmt->execute([
            ':full_name'        => $fullName,
            ':email'            => $email,
            ':phone'            => $phone,
            ':job_id'           => $jobId,
            ':job_title'        => $jobTitle,
            ':experience'       => $experience ?: null,
            ':current_ctc'      => $currentCtc ?: null,
            ':expected_ctc'     => $expectedCtc ?: null,
            ':linkedin_url'     => $linkedinUrl ?: null,
            ':location'         => $location ?: null,
            ':skills'           => $skills ?: null,
            ':cover_message'    => $coverMsg ?: null,
            ':resume_filename'  => $savedResumeFilename,
            ':resume_path'      => $savedResumePath
        ]);

        $newCandidateId = (int)$pdo->lastInsertId();

        // Dispatch non-blocking email notification
        sendCandidateNotification([
            'id'              => $newCandidateId,
            'full_name'       => $fullName,
            'email'           => $email,
            'phone'           => $phone,
            'job_title'       => $jobTitle,
            'experience'      => $experience,
            'current_ctc'     => $currentCtc,
            'expected_ctc'    => $expectedCtc,
            'location'        => $location,
            'linkedin_url'    => $linkedinUrl,
            'cover_message'   => $coverMsg,
            'resume_filename' => $savedResumeFilename
        ]);

        http_response_code(201);
        echo json_encode([
            'status' => 'success',
            'message' => 'Candidate application submitted successfully! Our recruitment team will review your profile.',
            'data' => [
                'id' => $newCandidateId,
                'full_name' => $fullName,
                'email' => $email,
                'job_title' => $jobTitle
            ]
        ], JSON_UNESCAPED_UNICODE);
        exit;

    } catch (PDOException $e) {
        // Rollback: Remove the uploaded file if database insert failed
        if ($uploadedFileFullPath && file_exists($uploadedFileFullPath)) {
            @unlink($uploadedFileFullPath);
        }

        http_response_code(500);
        echo json_encode([
            'status' => 'error',
            'message' => 'Database error saving application. Please try again later.'
        ]);
        exit;
    }
}

// ============================================================================
// 2. ADMIN AUTHENTICATED ENDPOINTS (GET, UPDATE, DELETE)
// ============================================================================

// Check admin authentication for all subsequent operations
if (!isLoggedIn()) {
    http_response_code(401);
    echo json_encode([
        'status' => 'error',
        'message' => 'Unauthorized. Admin login required to access candidates management.'
    ]);
    exit;
}

// ----------------------------------------------------------------------------
// GET: List Candidates or Single Candidate
// ----------------------------------------------------------------------------
if ($method === 'GET') {
    $id = isset($_GET['id']) ? (int)$_GET['id'] : 0;

    if ($id > 0) {
        // Single candidate
        try {
            $stmt = $pdo->prepare("SELECT * FROM candidate_applications WHERE id = :id LIMIT 1");
            $stmt->execute([':id' => $id]);
            $candidate = $stmt->fetch(PDO::FETCH_ASSOC);

            if (!$candidate) {
                http_response_code(404);
                echo json_encode(['status' => 'error', 'message' => 'Candidate not found.']);
                exit;
            }

            echo json_encode([
                'status' => 'success',
                'data' => $candidate
            ], JSON_UNESCAPED_UNICODE);
            exit;
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(['status' => 'error', 'message' => 'Failed to fetch candidate.']);
            exit;
        }
    } else {
        // List candidates with filters
        $search = isset($_GET['search']) ? trim($_GET['search']) : '';
        $status = isset($_GET['status']) ? trim($_GET['status']) : '';
        $jobId  = isset($_GET['job_id']) ? (int)$_GET['job_id'] : 0;

        $query = "SELECT * FROM candidate_applications WHERE 1=1";
        $params = [];

        if (!empty($search)) {
            $query .= " AND (full_name LIKE :search OR email LIKE :search OR phone LIKE :search OR job_title LIKE :search OR skills LIKE :search)";
            $params[':search'] = "%{$search}%";
        }

        if (!empty($status)) {
            $query .= " AND status = :status";
            $params[':status'] = $status;
        }

        if ($jobId > 0) {
            $query .= " AND job_id = :job_id";
            $params[':job_id'] = $jobId;
        }

        $query .= " ORDER BY created_at DESC";

        try {
            $stmt = $pdo->prepare($query);
            $stmt->execute($params);
            $candidates = $stmt->fetchAll(PDO::FETCH_ASSOC);

            echo json_encode([
                'status' => 'success',
                'count' => count($candidates),
                'data' => $candidates
            ], JSON_UNESCAPED_UNICODE);
            exit;
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(['status' => 'error', 'message' => 'Failed to fetch candidates list.']);
            exit;
        }
    }
}

// ----------------------------------------------------------------------------
// UPDATE: Status and Recruiter Notes
// ----------------------------------------------------------------------------
if ($method === 'PUT' || ($method === 'POST' && $action === 'update')) {
    $rawInput = json_decode(file_get_contents('php://input'), true) ?? [];
    $data = array_merge($_POST, $rawInput);

    $id = isset($data['id']) ? (int)$data['id'] : 0;
    if ($id <= 0) {
        http_response_code(400);
        echo json_encode(['status' => 'error', 'message' => 'Invalid candidate ID.']);
        exit;
    }

    $allowedStatuses = ['New', 'Shortlisted', 'Interview', 'Selected', 'Rejected'];
    $newStatus = isset($data['status']) ? trim($data['status']) : null;
    $recruiterNotes = isset($data['recruiter_notes']) ? trim($data['recruiter_notes']) : null;

    if ($newStatus !== null && !in_array($newStatus, $allowedStatuses, true)) {
        http_response_code(400);
        echo json_encode(['status' => 'error', 'message' => 'Invalid status value. Allowed: ' . implode(', ', $allowedStatuses)]);
        exit;
    }

    try {
        $updateFields = [];
        $params = [':id' => $id];

        if ($newStatus !== null) {
            $updateFields[] = "status = :status";
            $params[':status'] = $newStatus;
        }

        if ($recruiterNotes !== null) {
            $updateFields[] = "recruiter_notes = :recruiter_notes";
            $params[':recruiter_notes'] = $recruiterNotes;
        }

        if (empty($updateFields)) {
            echo json_encode(['status' => 'success', 'message' => 'No changes requested.']);
            exit;
        }

        $sql = "UPDATE candidate_applications SET " . implode(', ', $updateFields) . " WHERE id = :id";
        $stmt = $pdo->prepare($sql);
        $stmt->execute($params);

        echo json_encode([
            'status' => 'success',
            'message' => 'Candidate application updated successfully.'
        ]);
        exit;
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['status' => 'error', 'message' => 'Failed to update candidate record.']);
        exit;
    }
}

// ----------------------------------------------------------------------------
// DELETE: Delete Candidate and associated Resume
// ----------------------------------------------------------------------------
if ($method === 'DELETE' || ($method === 'POST' && $action === 'delete')) {
    $rawInput = json_decode(file_get_contents('php://input'), true) ?? [];
    $data = array_merge($_GET, $_POST, $rawInput);

    $id = isset($data['id']) ? (int)$data['id'] : 0;
    if ($id <= 0) {
        http_response_code(400);
        echo json_encode(['status' => 'error', 'message' => 'Invalid candidate ID.']);
        exit;
    }

    try {
        // Fetch resume path first
        $stmt = $pdo->prepare("SELECT resume_path FROM candidate_applications WHERE id = :id LIMIT 1");
        $stmt->execute([':id' => $id]);
        $candidate = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$candidate) {
            http_response_code(404);
            echo json_encode(['status' => 'error', 'message' => 'Candidate not found.']);
            exit;
        }

        // Delete DB record
        $delStmt = $pdo->prepare("DELETE FROM candidate_applications WHERE id = :id");
        $delStmt->execute([':id' => $id]);

        // Safely unlink resume file
        if (!empty($candidate['resume_path'])) {
            $baseDir = realpath(__DIR__ . '/../../');
            $fullFilePath = realpath($baseDir . DIRECTORY_SEPARATOR . $candidate['resume_path']);
            $uploadBaseDir = realpath(__DIR__ . '/../../uploads/resumes');

            // Prevent path traversal outside uploads/resumes
            if ($fullFilePath && $uploadBaseDir && strpos($fullFilePath, $uploadBaseDir) === 0 && file_exists($fullFilePath)) {
                @unlink($fullFilePath);
            }
        }

        echo json_encode([
            'status' => 'success',
            'message' => 'Candidate application and resume file deleted successfully.'
        ]);
        exit;
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['status' => 'error', 'message' => 'Failed to delete candidate record.']);
        exit;
    }
}

http_response_code(405);
echo json_encode(['status' => 'error', 'message' => 'Method Not Allowed']);
?>
