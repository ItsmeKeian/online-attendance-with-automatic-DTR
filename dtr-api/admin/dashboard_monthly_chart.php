<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: GET, OPTIONS");

require_once("../config/database.php");

try {
    $stmt = $pdo->prepare("
        SELECT 
            DATE_FORMAT(date, '%b') AS month,
            MONTH(date) AS month_num,
            COUNT(DISTINCT employee_id) AS presentCount
        FROM attendance
        WHERE time_in IS NOT NULL
        AND date >= DATE_SUB(CURDATE(), INTERVAL 6 MONTH)
        GROUP BY month, month_num
        ORDER BY month_num ASC
    ");

    $stmt->execute();
    $data = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode($data);

} catch (Exception $e) {
    echo json_encode([]);
}
?>
