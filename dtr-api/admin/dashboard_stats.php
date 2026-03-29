<?php
header("Content-Type: application/json");
require "../config/database.php";

$today = date("Y-m-d");

// Total employees
$totalStmt = $pdo->query("SELECT COUNT(*) FROM employees");
$totalEmployees = $totalStmt->fetchColumn();

// Present today
$presentStmt = $pdo->prepare("
    SELECT COUNT(DISTINCT employee_id)
    FROM attendance
    WHERE date = ? AND time_in IS NOT NULL
");
$presentStmt->execute([$today]);
$presentToday = $presentStmt->fetchColumn();

// Absent today
$absentToday = max(0, $totalEmployees - $presentToday);

echo json_encode([
    "totalEmployees" => (int)$totalEmployees,
    "presentToday" => (int)$presentToday,
    "absentToday" => (int)$absentToday
]);
