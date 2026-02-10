<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS");

require "../config/database.php";

$data = json_decode(file_get_contents("php://input"), true);

$id = $data["id"] ?? null;
$full_name = $data["full_name"] ?? "";
$email = $data["email"] ?? "";
$department = $data["department"] ?? "";
$job_title = $data["job_title"] ?? "";

if (!$id) {
    echo json_encode(["success" => false, "message" => "Missing employee ID"]);
    exit;
}

$sql = "UPDATE employees 
        SET full_name = ?, email = ?, department = ?, job_title = ?
        WHERE id = ?";

$stmt = $pdo->prepare($sql);
$success = $stmt->execute([$full_name, $email, $department, $job_title, $id]);

echo json_encode(["success" => $success]);
exit;
