<?php
require "../config/database.php";

$department = $_GET['department'] ?? "";
$search = $_GET['search'] ?? "";

$where = [];
$params = [];

/* =====================
   FILTER BY DEPARTMENT
===================== */
if (!empty($department)) {
    $where[] = "department = ?";
    $params[] = $department;
}

/* =====================
   SEARCH FILTER
===================== */
if (!empty($search)) {
    $where[] = "(full_name LIKE ? OR employee_code LIKE ? OR email LIKE ?)";
    $params[] = "%$search%";
    $params[] = "%$search%";
    $params[] = "%$search%";
}

$whereSql = "";
if (count($where) > 0) {
    $whereSql = " WHERE " . implode(" AND ", $where);
}

/* =====================
   FETCH ALL EMPLOYEES
===================== */
$sql = "SELECT full_name, employee_code, email, department, job_title, created_at 
        FROM employees
        $whereSql
        ORDER BY created_at DESC";

$stmt = $pdo->prepare($sql);
$stmt->execute($params);
$employees = $stmt->fetchAll(PDO::FETCH_ASSOC);

/* =====================
   DOWNLOAD CSV
===================== */
header("Content-Type: text/csv");
header("Content-Disposition: attachment; filename=employees_export.csv");

$output = fopen("php://output", "w");

fputcsv($output, ["Full Name", "Employee ID", "Email", "Department", "Job Title", "Date Created"]);

foreach ($employees as $row) {
    fputcsv($output, [
        $row["full_name"],
        $row["employee_code"],
        $row["email"],
        $row["department"],
        $row["job_title"],
        $row["created_at"]
    ]);
}

fclose($output);
exit;
