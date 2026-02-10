<?php
header("Content-Type: application/json");
require "../config/database.php";

$data = json_decode(file_get_contents("php://input"), true);

// =====================
// SANITIZE INPUT
// =====================
$full_name  = trim($data["full_name"] ?? "");
$email      = trim($data["email"] ?? "");
$phone      = trim($data["phone"] ?? "");
$address    = trim($data["address"] ?? "");
$age        = $data["age"] ?? null;
$sex        = trim($data["sex"] ?? "");
$department = trim($data["department"] ?? "");
$job_title  = trim($data["job_title"] ?? "");

// =====================
// VALIDATION
// =====================
if (!$full_name || !$email || !$department) {
    http_response_code(400);
    echo json_encode(["error" => "Full name, email, and department are required"]);
    exit;
}

try {
    $pdo->beginTransaction();

    // =====================
    // CHECK EMAIL DUPLICATE (EMPLOYEES ONLY)
    // =====================
    $check = $pdo->prepare("SELECT id FROM employees WHERE email = ?");
    $check->execute([$email]);

    if ($check->fetch()) {
        $pdo->rollBack();
        http_response_code(409);
        echo json_encode(["error" => "Employee email already exists"]);
        exit;
    }

    // =====================
    // GENERATE EMPLOYEE CODE
    // =====================
    do {
        $employee_code = "EMP-" . str_pad(random_int(1, 9999), 4, "0", STR_PAD_LEFT);
        $checkCode = $pdo->prepare("SELECT id FROM employees WHERE employee_code = ?");
        $checkCode->execute([$employee_code]);
    } while ($checkCode->fetch());

    // =====================
    // INSERT EMPLOYEE ONLY
    // =====================
    $stmt = $pdo->prepare("
        INSERT INTO employees
        (employee_code, full_name, email, phone, address, age, sex, department, job_title)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    ");

    $stmt->execute([
        $employee_code,
        $full_name,
        $email,
        $phone ?: null,
        $address ?: null,
        $age ?: null,
        $sex ?: null,
        $department,
        $job_title ?: null
    ]);

    $pdo->commit();

    echo json_encode([
        "success" => true,
        "employee_code" => $employee_code
    ]);
    exit;

} catch (Throwable $e) {
    if ($pdo->inTransaction()) {
        $pdo->rollBack();
    }

    http_response_code(500);
    echo json_encode(["error" => "Server error"]);
    exit;
}
