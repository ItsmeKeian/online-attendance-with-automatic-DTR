<?php
header("Content-Type: application/json");
require "../config/database.php";

date_default_timezone_set("Asia/Manila"); // FIX TIMEZONE

$data = json_decode(file_get_contents("php://input"), true);
$employee_code = $data["employee_code"] ?? null;

if (!$employee_code) {
  echo json_encode(null);
  exit;
}

$date = date("Y-m-d");

$stmt = $pdo->prepare("
  SELECT time_in, lunch_out, lunch_in, time_out
  FROM attendance
  WHERE employee_code = ?
    AND `date` = ?
  ORDER BY id DESC
  LIMIT 1
");

$stmt->execute([$employee_code, $date]);
$row = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$row) {
  echo json_encode(null);
  exit;
}

echo json_encode([
  "time_in"   => $row["time_in"] ?: null,
  "lunch_out" => $row["lunch_out"] ?: null,
  "lunch_in"  => $row["lunch_in"] ?: null,
  "time_out"  => $row["time_out"] ?: null,
]);
