<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: http://localhost:5173");

require "../config/database.php";

try {
    $stmt = $pdo->prepare("
        SELECT 
            date,
            COUNT(DISTINCT employee_id) AS presentCount
        FROM attendance
        WHERE time_in IS NOT NULL
        AND date >= DATE_SUB(CURDATE(), INTERVAL 6 DAY)
        GROUP BY date
        ORDER BY date ASC
    ");
    $stmt->execute();

    $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode($rows);

} catch (Exception $e) {
    echo json_encode([]);
}
?>
