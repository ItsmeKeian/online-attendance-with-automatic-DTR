<?php
header("Content-Type: application/json");
require "../config/database.php";

try {

    $from        = $_GET["from"] ?? null;
    $to          = $_GET["to"] ?? null;
    $department  = $_GET["department"] ?? null;
    $employee_id = $_GET["employee_id"] ?? null;

    $sql = "
        SELECT
            a.id,
            a.date,
            a.time_in,
            a.lunch_out,
            a.lunch_in,
            a.time_out,

            a.photo_in,
            a.photo_lunch_out,
            a.photo_lunch_in,
            a.photo_out,

            a.status,
            a.late_minutes,
            a.undertime_minutes,
            a.remarks,

            e.id AS employee_id,
            e.employee_code,
            e.full_name,
            e.department,
            e.job_title

        FROM attendance a
        INNER JOIN employees e ON a.employee_id = e.id
        WHERE 1=1
    ";

    $params = [];

    // FILTER DATE
    if ($from && $to) {
        $sql .= " AND a.date BETWEEN ? AND ?";
        $params[] = $from;
        $params[] = $to;
    } elseif ($from) {
        $sql .= " AND a.date >= ?";
        $params[] = $from;
    } elseif ($to) {
        $sql .= " AND a.date <= ?";
        $params[] = $to;
    }

    // FILTER DEPARTMENT
    if (!empty($department)) {
        $sql .= " AND e.department = ?";
        $params[] = $department;
    }

    // FILTER EMPLOYEE
    if (!empty($employee_id)) {
        $sql .= " AND e.id = ?";
        $params[] = $employee_id;
    }

    $sql .= " ORDER BY a.date DESC, e.full_name ASC";

    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);

    $records = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode($records);
    exit;

} catch (Exception $e) {

    http_response_code(500);

    echo json_encode([
        "error" => "Failed to fetch attendance records",
        "debug" => $e->getMessage()
    ]);

    exit;
}
?>
