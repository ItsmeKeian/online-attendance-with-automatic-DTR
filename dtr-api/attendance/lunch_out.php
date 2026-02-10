<?php
header("Content-Type: application/json");
require "../config/database.php";

date_default_timezone_set("Asia/Manila");

$data = json_decode(file_get_contents("php://input"), true);

$employee_code = trim($data['employee_code'] ?? '');
$photo = $data['photo'] ?? null;

if (!$employee_code || !$photo) {
  echo json_encode(["error" => "Missing data"]);
  exit;
}

$date = date("Y-m-d");
$time = date("H:i:s");

$stmt = $pdo->prepare("
  UPDATE attendance
  SET lunch_out = ?, photo_lunch_out = ?, status = 'lunch'
  WHERE employee_code = ? AND `date` = ?
");

$stmt->execute([$time, $photo, $employee_code, $date]);

if ($stmt->rowCount() === 0) {
  echo json_encode(["error" => "No TIME IN record found for today."]);
  exit;
}

echo json_encode([
  "success" => true,
  "message" => "LUNCH OUT recorded successfully",
  "action" => "LUNCH OUT"
]);
