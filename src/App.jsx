import { Routes, Route, Navigate } from "react-router-dom"

import EmployeeKiosk from "./pages/EmployeeKiosk"
import Login from "./pages/Login"

import AdminLayout from "./layouts/AdminLayout"
import AdminDashboard from "./pages/AdminDashboard"
import AdminEmployees from "./pages/AdminEmployees"
import AdminAttendanceRecords from "./pages/AdminAttendanceRecords"

import ProtectedAdminRoute from "./components/ProtectedAdminRoute"

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<EmployeeKiosk />} />
      <Route path="/admin/login" element={<Login />} />

      {/* Protected Wrapper */}
      <Route path="/admin" element={<ProtectedAdminRoute />}>
        <Route element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="employees" element={<AdminEmployees />} />
          <Route path="attendance" element={<AdminAttendanceRecords />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
