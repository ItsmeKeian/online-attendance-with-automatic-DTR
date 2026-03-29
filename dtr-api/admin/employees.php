<?php
header("Content-Type: application/json");
require "../config/database.php";

$department = $_GET['department'] ?? "";
$search = $_GET['search'] ?? "";

$page  = max(1, intval($_GET['page'] ?? 1));
$limit = 10;
$offset = ($page - 1) * $limit;

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

/* =====================
   BUILD WHERE CLAUSE
===================== */
$whereSql = "";
if (count($where) > 0) {
    $whereSql = " WHERE " . implode(" AND ", $where);
}

/* =====================
   COUNT TOTAL
===================== */
$countSql = "SELECT COUNT(*) FROM employees" . $whereSql;
$countStmt = $pdo->prepare($countSql);
$countStmt->execute($params);
$total = (int)$countStmt->fetchColumn();

/* =====================
   FETCH DATA
===================== */
$sql = "SELECT * FROM employees" . $whereSql . " 
        ORDER BY created_at DESC 
        LIMIT $limit OFFSET $offset";

$stmt = $pdo->prepare($sql);
$stmt->execute($params);

echo json_encode([
    "data" => $stmt->fetchAll(PDO::FETCH_ASSOC),
    "total" => $total,
    "page" => $page,
    "limit" => $limit
]);
exit;
