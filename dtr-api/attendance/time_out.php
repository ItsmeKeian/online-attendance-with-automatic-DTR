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


$scheduled_out = strtotime($date . " 17:00:00");
$actual_out = strtotime($date . " " . $time);

$undertime_minutes = 0;
if ($actual_out < $scheduled_out) {
  $undertime_minutes = floor(($scheduled_out - $actual_out) / 60);
}


$stmt = $pdo->prepare("
 UPDATE attendance
SET time_out = ?, photo_out = ?, status = 'out', undertime_minutes = ?
WHERE employee_code = ? AND `date` = ?

");

$stmt->execute([$time, $photo, $undertime_minutes, $employee_code, $date]);


if ($stmt->rowCount() === 0) {
  echo json_encode(["error" => "No LUNCH IN record found for today."]);
  exit;
}

echo json_encode([
  "success" => true,
  "message" => "TIME OUT recorded successfully",
  "action" => "TIME OUT"
]);
