import { Routes, Route, Navigate } from "react-router-dom"

// =====================
// PUBLIC (EMPLOYEE KIOSK)
// =====================
import EmployeeKiosk from "./pages/EmployeeKiosk"

// =====================
// ADMIN
// =====================
import Login from "./pages/Login"
import AdminLayout from "./layouts/AdminLayout"
import AdminDashboard from "./pages/AdminDashboard"
import AdminEmployees from "./pages/AdminEmployees"
import AdminAttendanceRecords from "./pages/AdminAttendanceRecords"

export default function App() {
  const role = localStorage.getItem("role")

  return (
    <Routes>
      {/* =====================
          EMPLOYEE KIOSK
      ===================== */}
      <Route path="/" element={<EmployeeKiosk />} />

      {/* =====================
          ADMIN LOGIN
      ===================== */}
      <Route path="/admin/login" element={<Login />} />

      {/* =====================
          ADMIN AREA (PROTECTED)
      ===================== */}
      <Route
        path="/admin"
        element={
          role === "admin"
            ? <AdminLayout />
            : <Navigate to="/admin/login" replace />
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="employees" element={<AdminEmployees />} />
        <Route path="attendance" element={<AdminAttendanceRecords />} />
      </Route>

      {/* =====================
          FALLBACK
      ===================== */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
