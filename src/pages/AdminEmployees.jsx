import { useEffect, useState, useCallback } from "react"
import Swal from "sweetalert2"
import AdminCreateEmployeeModal from "./AdminCreateEmployee"

const LIMIT = 10

export default function AdminEmployees() {
  const [employees, setEmployees] = useState([])
  const [department, setDepartment] = useState("")
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)

  const totalPages = Math.ceil(total / LIMIT)

  /* =====================
     FETCH EMPLOYEES
  ===================== */
  const fetchEmployees = useCallback(async (currentPage = page) => {
    setLoading(true)

    const params = new URLSearchParams({
      page: currentPage
    })

    if (department) params.append("department", department)

    const res = await fetch(
      `http://localhost/online-dtr-api/admin/employees.php?${params}`
    )

    const json = await res.json()

    setEmployees(json.data || [])
    setTotal(json.total || 0)
    setLoading(false)
  }, [department, page])

  /* =====================
     RESET PAGE WHEN FILTER CHANGES
  ===================== */
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    
    setPage(1)
  }, [department])

  /* =====================
     LOAD DATA
  ===================== */
  useEffect(() => {
    fetchEmployees(page)
  }, [fetchEmployees, page])

  /* =====================
     DELETE EMPLOYEE
  ===================== */
  async function handleDelete(emp) {
    const result = await Swal.fire({
      title: "Delete Employee?",
      html: `
        <b>${emp.full_name}</b><br/>
        <span class="text-xs text-slate-400">${emp.employee_code}</span>
      `,
      icon: "warning",
      background: "#020617",
      color: "#e5e7eb",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#334155",
      confirmButtonText: "Delete",
      backdrop: "rgba(2,6,23,0.8)"
    })

    if (!result.isConfirmed) return

    await fetch("http://localhost/online-dtr-api/admin/delete_employee.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: emp.id })
    })

    Swal.fire({
      icon: "success",
      title: "Employee deleted",
      background: "#020617",
      color: "#e5e7eb",
      confirmButtonColor: "#7c3aed"
    })

    fetchEmployees(page)
  }

  /* =====================
     UI
  ===================== */
  return (
    <div>
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-white">Employees</h1>
        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 text-white bg-purple-600 rounded-lg hover:bg-purple-700"
        >
          Create Employee
        </button>
      </div>

      {/* FILTER */}
      <div className="flex justify-end mb-4">
        <select
          value={department}
          onChange={e => setDepartment(e.target.value)}
          className="px-3 py-2 w-60 text-white rounded-lg border bg-slate-800 border-white/10"
        >
          <option value="">All Departments</option>
          <option>IT</option>
          <option>HR</option>
          <option>Finance</option>
          <option>Operations</option>
        </select>
      </div>

      {/* TABLE */}
      <div className="overflow-hidden rounded-xl border bg-white/5 border-white/10">
        <table className="w-full text-sm text-slate-300">
          <thead className="bg-white/10">
            <tr>
              <th className="p-3 text-left">Full Name</th>
              <th className="p-3 text-left">Employee ID</th>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-left">Department</th>
              <th className="p-3 text-left">Job Title</th>
              <th className="p-3 text-left">Date Created</th>
              <th className="p-3 text-center">Action</th>
            </tr>
          </thead>

          <tbody>
            {loading && (
              <tr>
                <td colSpan="7" className="p-6 text-center text-slate-400">
                  Loading...
                </td>
              </tr>
            )}

            {!loading &&
              employees.map(emp => (
                <tr key={emp.id} className="border-t border-white/5">
                  <td className="p-3">{emp.full_name}</td>
                  <td className="p-3">{emp.employee_code}</td>
                  <td className="p-3">{emp.email}</td>
                  <td className="p-3">{emp.department}</td>
                  <td className="p-3">{emp.job_title}</td>
                  <td className="p-3">
                    {new Date(emp.created_at).toLocaleDateString()}
                  </td>
                  <td className="p-3 text-center">
                    <button
                      onClick={() => handleDelete(emp)}
                      className="px-3 py-1 text-xs text-white bg-purple-600 rounded-md hover:bg-purple-700"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {/* PAGINATION */}
      <div className="flex justify-between items-center mt-4 text-sm text-slate-400">
        <span>
          Page {page} of {totalPages}
        </span>

        <div className="flex gap-2">
          <button
            disabled={page === 1}
            onClick={() => setPage(p => p - 1)}
            className="px-3 py-1 text-white bg-purple-600 rounded-lg disabled:opacity-40"
          >
            Prev
          </button>

          <button
            disabled={page === totalPages}
            onClick={() => setPage(p => p + 1)}
            className="px-3 py-1 text-white bg-purple-700 rounded-lg disabled:opacity-40"
          >
            Next
          </button>
        </div>
      </div>

      {/* MODAL */}
      <AdminCreateEmployeeModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSuccess={() => fetchEmployees(page)}
      />
    </div>
  )
}
