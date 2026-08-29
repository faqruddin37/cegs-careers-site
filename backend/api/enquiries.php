<?php
/**
 * CEGS REST API - Client Enquiries Endpoint
 * Handles recruitment partnership enquiries and admin management
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
$rawInput = json_decode(file_get_contents('php://input'), true) ?? [];
$input = array_merge($_POST, $rawInput);
$action = $input['action'] ?? $_GET['action'] ?? '';

// ============================================================================
// 1. POST - Client Enquiry Submission (Public) OR Admin Actions
// ============================================================================
if ($method === 'POST' && empty($action)) {
    // Normalize field names across various form implementations
    $companyName = trim($input['company_name'] ?? $input['company'] ?? $input['companyName'] ?? '');
    $contactPerson = trim($input['contact_person'] ?? $input['name'] ?? $input['contactPerson'] ?? $input['contactName'] ?? '');
    $email = trim($input['email'] ?? $input['workEmail'] ?? '');
    $phone = trim($input['phone'] ?? $input['mobileNumber'] ?? '');
    $companyWebsite = trim($input['company_website'] ?? $input['companyWebsite'] ?? '');
    $location = trim($input['business_location'] ?? $input['location'] ?? $input['jobLocation'] ?? '');
    $partnershipType = trim($input['partnership_type'] ?? $input['partnershipType'] ?? $input['serviceType'] ?? '');
    $geographicCoverage = trim($input['geographic_coverage'] ?? $input['geographicCoverage'] ?? '');
    
    // Support array or string industries
    $industriesRoles = $input['industries_roles'] ?? $input['industry'] ?? $input['industries'] ?? '';
    if (is_array($industriesRoles)) {
        $industriesRoles = implode(', ', $industriesRoles);
    }
    $industriesRoles = trim((string)$industriesRoles);

    $companyIntro = trim($input['company_introduction'] ?? $input['companyIntroduction'] ?? $input['intro'] ?? '');
    $existingNetwork = trim($input['existing_network'] ?? $input['existingNetwork'] ?? '');

    // Requirement details (may come from multi-step intake wizard or single form)
    $partnershipReq = $input['partnership_requirement'] ?? $input['role'] ?? $input['jobTitle'] ?? $input['candidateRequirements'] ?? '';
    if (is_array($partnershipReq)) {
        $partnershipReq = json_encode($partnershipReq, JSON_UNESCAPED_UNICODE);
    }
    $partnershipReq = trim((string)$partnershipReq);

    // If submitted from intake wizard with extra structured fields, format them cleanly
    if (!empty($input['numberOfOpenings']) || !empty($input['requiredSkills']) || !empty($input['experienceRequired'])) {
        $extraDetails = [];
        if (!empty($input['jobTitle'])) $extraDetails[] = "Role: " . $input['jobTitle'];
        if (!empty($input['numberOfOpenings'])) $extraDetails[] = "Openings: " . $input['numberOfOpenings'];
        if (!empty($input['experienceRequired'])) $extraDetails[] = "Experience: " . $input['experienceRequired'];
        if (!empty($input['workMode'])) $extraDetails[] = "Work Mode: " . $input['workMode'];
        if (!empty($input['employmentType'])) $extraDetails[] = "Employment Type: " . $input['employmentType'];
        if (!empty($input['minCTC']) || !empty($input['maxCTC'])) $extraDetails[] = "CTC: " . ($input['minCTC'] ?? '') . " - " . ($input['maxCTC'] ?? '');
        if (!empty($input['requiredSkills'])) {
            $skillsList = is_array($input['requiredSkills']) ? implode(', ', $input['requiredSkills']) : $input['requiredSkills'];
            $extraDetails[] = "Skills: " . $skillsList;
        }
        if (!empty($input['hiringTimeline'])) $extraDetails[] = "Timeline: " . $input['hiringTimeline'];

        if (!empty($extraDetails)) {
            $structuredInfo = implode(" | ", $extraDetails);
            $partnershipReq = !empty($partnershipReq) ? $partnershipReq . "\n[" . $structuredInfo . "]" : $structuredInfo;
        }
    }

    $additionalMsg = trim($input['additional_message'] ?? $input['message'] ?? $input['additionalRequirements'] ?? '');

    // Validation
    $errors = [];
    if (empty($companyName)) {
        $errors[] = 'Company Name is required.';
    }
    if (empty($contactPerson)) {
        $errors[] = 'Contact Person Name is required.';
    }
    if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $errors[] = 'A valid official email is required.';
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

    try {
        $sql = "INSERT INTO client_enquiries (
                    company_name, contact_person, email, phone, company_website,
                    business_location, partnership_type, geographic_coverage,
                    industries_roles, company_introduction, existing_network,
                    partnership_requirement, additional_message, status, created_at
                ) VALUES (
                    :company_name, :contact_person, :email, :phone, :company_website,
                    :business_location, :partnership_type, :geographic_coverage,
                    :industries_roles, :company_introduction, :existing_network,
                    :partnership_requirement, :additional_message, 'New', NOW()
                )";

        $stmt = $pdo->prepare($sql);
        $stmt->execute([
            ':company_name'             => $companyName,
            ':contact_person'           => $contactPerson,
            ':email'                    => $email,
            ':phone'                    => $phone,
            ':company_website'          => $companyWebsite ?: null,
            ':business_location'        => $location ?: null,
            ':partnership_type'         => $partnershipType ?: 'Recruitment Partnership',
            ':geographic_coverage'      => $geographicCoverage ?: null,
            ':industries_roles'         => $industriesRoles ?: null,
            ':company_introduction'     => $companyIntro ?: null,
            ':existing_network'         => $existingNetwork ?: null,
            ':partnership_requirement'  => $partnershipReq ?: null,
            ':additional_message'       => $additionalMsg ?: null
        ]);

        $newEnquiryId = (int)$pdo->lastInsertId();

        // Dispatch non-blocking email notification
        sendEnquiryNotification([
            'id'                      => $newEnquiryId,
            'company_name'            => $companyName,
            'contact_person'          => $contactPerson,
            'email'                   => $email,
            'phone'                   => $phone,
            'company_website'         => $companyWebsite,
            'business_location'       => $location,
            'partnership_type'        => $partnershipType,
            'geographic_coverage'     => $geographicCoverage,
            'industries_roles'        => $industriesRoles,
            'company_introduction'    => $companyIntro,
            'partnership_requirement' => $partnershipReq,
            'additional_message'      => $additionalMsg
        ]);

        http_response_code(201);
        echo json_encode([
            'status' => 'success',
            'message' => 'Partnership enquiry submitted successfully! Our corporate advisory team will connect within 2 hours.',
            'data' => [
                'id' => $newEnquiryId,
                'company_name' => $companyName,
                'contact_person' => $contactPerson
            ]
        ], JSON_UNESCAPED_UNICODE);
        exit;

    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode([
            'status' => 'error',
            'message' => 'Database error saving enquiry. Please try again later.'
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
        'message' => 'Unauthorized. Admin login required to access client enquiries.'
    ]);
    exit;
}

// ----------------------------------------------------------------------------
// GET: List Enquiries or Single Enquiry
// ----------------------------------------------------------------------------
if ($method === 'GET') {
    $id = isset($_GET['id']) ? (int)$_GET['id'] : 0;

    if ($id > 0) {
        // Single enquiry
        try {
            $stmt = $pdo->prepare("SELECT * FROM client_enquiries WHERE id = :id LIMIT 1");
            $stmt->execute([':id' => $id]);
            $enquiry = $stmt->fetch(PDO::FETCH_ASSOC);

            if (!$enquiry) {
                http_response_code(404);
                echo json_encode(['status' => 'error', 'message' => 'Enquiry not found.']);
                exit;
            }

            echo json_encode([
                'status' => 'success',
                'data' => $enquiry
            ], JSON_UNESCAPED_UNICODE);
            exit;
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(['status' => 'error', 'message' => 'Failed to fetch enquiry details.']);
            exit;
        }
    } else {
        // List enquiries with filters
        $search = isset($_GET['search']) ? trim($_GET['search']) : '';
        $status = isset($_GET['status']) ? trim($_GET['status']) : '';

        $query = "SELECT * FROM client_enquiries WHERE 1=1";
        $params = [];

        if (!empty($search)) {
            $query .= " AND (company_name LIKE :search OR contact_person LIKE :search OR email LIKE :search OR phone LIKE :search OR business_location LIKE :search OR partnership_type LIKE :search)";
            $params[':search'] = "%{$search}%";
        }

        if (!empty($status)) {
            $query .= " AND status = :status";
            $params[':status'] = $status;
        }

        $query .= " ORDER BY created_at DESC";

        try {
            $stmt = $pdo->prepare($query);
            $stmt->execute($params);
            $enquiries = $stmt->fetchAll(PDO::FETCH_ASSOC);

            echo json_encode([
                'status' => 'success',
                'count' => count($enquiries),
                'data' => $enquiries
            ], JSON_UNESCAPED_UNICODE);
            exit;
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(['status' => 'error', 'message' => 'Failed to fetch enquiries list.']);
            exit;
        }
    }
}

// ----------------------------------------------------------------------------
// UPDATE: Status and Recruiter Notes
// ----------------------------------------------------------------------------
if ($method === 'PUT' || ($method === 'POST' && $action === 'update')) {
    $id = isset($input['id']) ? (int)$input['id'] : 0;
    if ($id <= 0) {
        http_response_code(400);
        echo json_encode(['status' => 'error', 'message' => 'Invalid enquiry ID.']);
        exit;
    }

    $allowedStatuses = ['New', 'Contacted', 'In Discussion', 'Converted', 'Closed'];
    $newStatus = isset($input['status']) ? trim($input['status']) : null;
    $recruiterNotes = isset($input['recruiter_notes']) ? trim($input['recruiter_notes']) : null;

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

        $sql = "UPDATE client_enquiries SET " . implode(', ', $updateFields) . " WHERE id = :id";
        $stmt = $pdo->prepare($sql);
        $stmt->execute($params);

        echo json_encode([
            'status' => 'success',
            'message' => 'Client enquiry updated successfully.'
        ]);
        exit;
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['status' => 'error', 'message' => 'Failed to update enquiry record.']);
        exit;
    }
}

// ----------------------------------------------------------------------------
// DELETE: Delete Enquiry
// ----------------------------------------------------------------------------
if ($method === 'DELETE' || ($method === 'POST' && $action === 'delete')) {
    $id = isset($input['id']) ? (int)$input['id'] : 0;
    if ($id <= 0) {
        http_response_code(400);
        echo json_encode(['status' => 'error', 'message' => 'Invalid enquiry ID.']);
        exit;
    }

    try {
        $delStmt = $pdo->prepare("DELETE FROM client_enquiries WHERE id = :id");
        $delStmt->execute([':id' => $id]);

        echo json_encode([
            'status' => 'success',
            'message' => 'Client enquiry deleted successfully.'
        ]);
        exit;
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['status' => 'error', 'message' => 'Failed to delete enquiry record.']);
        exit;
    }
}

http_response_code(405);
echo json_encode(['status' => 'error', 'message' => 'Method Not Allowed']);
?>
