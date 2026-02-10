<?php
header("Content-Type: application/json");
require "../config/database.php";

try {
    $from        = $_GET['from'] ?? null;
    $to          = $_GET['to'] ?? null;
    $department  = $_GET['department'] ?? null;

    $sql = "
        SELECT DISTINCT
            e.id,
            e.full_name
        FROM attendance a
        INNER JOIN employees e ON a.employee_id = e.id
        WHERE 1 = 1
    ";

    $params = [];

    if ($from && $to) {
        $sql .= " AND a.date BETWEEN ? AND ?";
        $params[] = $from;
        $params[] = $to;
    }

    if ($department) {
        $sql .= " AND e.department = ?";
        $params[] = $department;
    }

    $sql .= " ORDER BY e.full_name ASC";

    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);

    echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
    exit;

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        "error" => "Failed to fetch attendance employees"
    ]);
    exit;
}
