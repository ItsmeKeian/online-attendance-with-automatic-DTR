<?php
ini_set('display_errors', 0);
error_reporting(0);

header("Content-Type: application/json");
require_once "../config/database.php";

$data = json_decode(file_get_contents("php://input"), true);
$user_id = $data["user_id"] ?? null;

if (!$user_id) {
    echo json_encode(["error" => "User ID required"]);
    exit;
}

$stmt = $pdo->prepare("
    SELECT date, time_in, time_out, status
    FROM attendance
    WHERE user_id = ?
    ORDER BY date DESC
");

$stmt->execute([$user_id]);
$records = $stmt->fetchAll(PDO::FETCH_ASSOC);

echo json_encode($records);
exit;
