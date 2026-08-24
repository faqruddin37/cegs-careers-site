<?php
/**
 * CEGS REST API - Live Jobs Endpoint
 * Returns JSON of active job postings from MySQL database
 */

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET');

require_once __DIR__ . '/../db.php';

$pdo = getDBConnection();

if (!$pdo) {
    http_response_code(503);
    echo json_encode([
        'status' => 'error',
        'message' => 'Database connection failed. Please check MySQL credentials in db.php.',
        'data' => []
    ]);
    exit;
}

try {
    $search = isset($_GET['search']) ? trim($_GET['search']) : '';
    $location = isset($_GET['location']) ? trim($_GET['location']) : '';

    $query = "SELECT * FROM jobs WHERE 1=1";
    $params = [];

    if (!empty($search)) {
        $query .= " AND (job_role LIKE :search OR company_name LIKE :search OR qualification LIKE :search OR additional_notes LIKE :search)";
        $params[':search'] = "%{$search}%";
    }

    if (!empty($location)) {
        $query .= " AND location LIKE :location";
        $params[':location'] = "%{$location}%";
    }

    $query .= " ORDER BY posted_date DESC";

    $stmt = $pdo->prepare($query);
    $stmt->execute($params);
    $jobs = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        'status' => 'success',
        'count' => count($jobs),
        'data' => $jobs
    ], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'status' => 'error',
        'message' => 'Query execution failed: ' . $e->getMessage(),
        'data' => []
    ]);
}
?>
