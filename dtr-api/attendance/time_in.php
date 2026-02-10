<?php
header("Content-Type: application/json");
require "../config/database.php";

date_default_timezone_set("Asia/Manila"); // FIX TIMEZONE

$data = json_decode(file_get_contents("php://input"), true);

$employee_code = trim($data['employee_code'] ?? '');
$photo = $data['photo'] ?? null;

if (!$employee_code || !$photo) {
  echo json_encode(["error" => "Missing data"]);
  exit;
}

$stmt = $pdo->prepare("SELECT id FROM employees WHERE employee_code = ?");
$stmt->execute([$employee_code]);
$employee = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$employee) {
  echo json_encode(["error" => "Employee not found"]);
  exit;
}

$date = date("Y-m-d");
$time = date("H:i:s");

$scheduled_in = strtotime($date . " 08:00:00");
$actual_in = strtotime($date . " " . $time);

$late_minutes = 0;
if ($actual_in > $scheduled_in) {
  $late_minutes = floor(($actual_in - $scheduled_in) / 60);
}


$stmt = $pdo->prepare("
  INSERT INTO attendance (employee_id, employee_code, `date`, time_in, photo_in, status, late_minutes, remarks)
    VALUES (?, ?, ?, ?, ?, 'in', ?, ?)
    ON DUPLICATE KEY UPDATE
      time_in = IFNULL(time_in, VALUES(time_in)),
      photo_in = IFNULL(photo_in, VALUES(photo_in)),
      late_minutes = VALUES(late_minutes),
      remarks = VALUES(remarks),
      status = 'in'

");

$remarks = ($late_minutes > 0) ? "late" : "on-time";

$stmt->execute([
  $employee['id'],
  $employee_code,
  $date,
  $time,
  $photo,
  $late_minutes,
  $remarks
]);


echo json_encode([
  "success" => true,
  "message" => "TIME IN recorded successfully"
]);
