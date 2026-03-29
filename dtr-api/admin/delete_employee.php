<?php
header("Content-Type: application/json");
require "../config/database.php";

$data = json_decode(file_get_contents("php://input"), true);
$id = $data['id'] ?? null;

if (!$id) {
    http_response_code(400);
    echo json_encode(["error" => "Invalid employee ID"]);
    exit;
}

try {
    $pdo->beginTransaction();

    // delete user account
    $stmt = $pdo->prepare("DELETE FROM users WHERE employee_id = ?");
    $stmt->execute([$id]);

    // delete employee
    $stmt = $pdo->prepare("DELETE FROM employees WHERE id = ?");
    $stmt->execute([$id]);

    $pdo->commit();

    echo json_encode(["success" => true]);
    exit;

} catch (Throwable $e) {
    $pdo->rollBack();
    http_response_code(500);
    echo json_encode(["error" => "Server error"]);
    exit;
}
