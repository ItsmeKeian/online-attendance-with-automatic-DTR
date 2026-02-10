<?php
header("Content-Type: application/json");

include("../config/database.php");

$data = json_decode(file_get_contents("php://input"), true);
$employee_code = $data["employee_code"] ?? "";

if (!$employee_code) {
    echo json_encode(["error" => "Employee code is required"]);
    exit;
}

try {
    $stmt = $pdo->prepare("SELECT full_name, department, job_title FROM employees WHERE employee_code = ?");
    $stmt->execute([$employee_code]);

    $employee = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$employee) {
        echo json_encode(["error" => "Employee not found"]);
        exit;
    }

    echo json_encode($employee);

} catch (Exception $e) {
    echo json_encode(["error" => "Server error"]);
}
