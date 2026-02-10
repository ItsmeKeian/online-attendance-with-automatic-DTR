import { Navigate, Outlet } from "react-router-dom"

export default function ProtectedAdminRoute() {
  const role = localStorage.getItem("role")

  if (role !== "admin") {
    return <Navigate to="/admin/login" replace />
  }

  return <Outlet />
}
