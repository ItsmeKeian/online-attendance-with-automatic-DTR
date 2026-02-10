<?php
header("Content-Type: application/json");
require "../config/database.php";

$data = json_decode(file_get_contents("php://input"), true);

$email = trim($data['email'] ?? '');
$password = $data['password'] ?? '';

if (!$email || !$password) {
    http_response_code(400);
    echo json_encode(["error" => "Email and password required"]);
    exit;
}

$stmt = $pdo->prepare("
    SELECT u.id, u.password, u.role,
           e.id AS employee_id,
           e.full_name,
           e.employee_code
    FROM users u
    LEFT JOIN employees e ON u.employee_id = e.id
    WHERE u.email = ?
");
$stmt->execute([$email]);
$user = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$user || !password_verify($password, $user['password'])) {
    http_response_code(401);
    echo json_encode(["error" => "Invalid credentials"]);
    exit;
}

echo json_encode([
    "user" => [
        "id" => $user['id'],
        "name" => $user['full_name'],
        "email" => $email,
        "role" => $user['role'],
        "employee_code" => $user['employee_code']
    ]
]);
exit;
