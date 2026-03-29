<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: http://localhost:5173");

require "../config/database.php";

try {
    $stmt = $pdo->prepare("
        SELECT department, COUNT(*) as total
        FROM employees
        GROUP BY department
        ORDER BY total DESC
    ");
    $stmt->execute();

    $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode($rows);

} catch (Exception $e) {
    echo json_encode([]);
}
