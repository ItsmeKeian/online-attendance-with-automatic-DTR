import { useEffect, useState, useCallback } from "react"
import Swal from "sweetalert2"
import AdminCreateEmployeeModal from "./AdminCreateEmployee"
import AdminEditEmployeeModal from "./AdminEditEmployee"
import { getSwalTheme } from "../utils/swalTheme"

const LIMIT = 10

export default function AdminEmployees() {
  const [employees, setEmployees] = useState([])
  const [department, setDepartment] = useState("")
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)

  const [showModal, setShowModal] = useState(false)

  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedEmployee, setSelectedEmployee] = useState(null)

  const totalPages = Math.ceil(total / LIMIT)

  /* =====================
     FETCH EMPLOYEES
  ===================== */
  const fetchEmployees = useCallback(
    async (currentPage = page) => {
      setLoading(true)

      const params = new URLSearchParams({
        page: currentPage,
      })

      if (department) params.append("department", department)
      if (search.trim()) params.append("search", search.trim())

      const res = await fetch(
        `http://localhost/online-dtr-api/admin/employees.php?${params}`
      )

      const json = await res.json()

      setEmployees(json.data || [])
      setTotal(json.total || 0)
      setLoading(false)
    },
    [department, page, search]
  )

  /* =====================
     RESET PAGE WHEN FILTER/SEARCH CHANGES
  ===================== */
  useEffect(() => {
    setPage(1)
  }, [department, search])

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
    const theme = getSwalTheme()

    const result = await Swal.fire({
      title: "Delete Employee?",
      html: `
        <b>${emp.full_name}</b><br/>
        <span style="font-size:12px; opacity:0.7;">${emp.employee_code}</span>
      `,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Delete",
      confirmButtonColor: "#7c3aed",
      cancelButtonColor: theme.cancelButtonColor,
      background: theme.background,
      color: theme.color,
      backdrop: theme.backdrop,
    })

    if (!result.isConfirmed) return

    await fetch("http://localhost/online-dtr-api/admin/delete_employee.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: emp.id }),
    })

    await Swal.fire({
      icon: "success",
      title: "Employee deleted",
      background: theme.background,
      color: theme.color,
      confirmButtonColor: theme.confirmButtonColor,
      backdrop: theme.backdrop,
    })

    fetchEmployees(page)
  }

  /* =====================
     EDIT EMPLOYEE
  ===================== */
  function handleEdit(emp) {
    setSelectedEmployee(emp)
    setShowEditModal(true)
  }

  /* =====================
     EXPORT EMPLOYEES
  ===================== */
  function handleExport() {
    const params = new URLSearchParams()

    if (department) params.append("department", department)
    if (search.trim()) params.append("search", search.trim())

    const url = `http://localhost/online-dtr-api/admin/export_employees.php?${params}`

    const link = document.createElement("a")
    link.href = url
    link.download = "employees_export.csv"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="w-full">
      {/* HEADER */}
      <div className="flex flex-col gap-4 mb-6 md:flex-row md:items-start md:justify-between">
        <div className="w-full">
          <h1 className="text-xl font-semibold md:text-2xl text-slate-900 dark:text-white">
            Employees Records
          </h1>
          <p className="mt-1 text-xs md:text-sm text-slate-500 dark:text-slate-400">
            Manage employees and department assignments
          </p>

          {/* SEARCH */}
          <div className="mt-4">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search name, employee ID, email..."
              className="px-4 py-2 w-full rounded-lg border shadow-sm bg-white/70 border-black/10 text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-600 dark:bg-slate-900/40 dark:border-white/10 dark:text-white md:w-96"
            />
          </div>
        </div>

        {/* RIGHT ACTIONS */}
       
        <div className="flex flex-col gap-3 items-start md:items-end">
        <div className="flex gap-2">
                <button
                  onClick={handleExport}
                  className="px-4 py-2 text-sm text-white whitespace-nowrap rounded-lg bg-slate-700 hover:bg-slate-600"
                >
                  Export List
                </button>

                <button
                  onClick={() => setShowModal(true)}
                  className="px-4 py-2 text-sm font-medium text-white whitespace-nowrap bg-purple-600 rounded-lg hover:bg-purple-700"
                >
                  Create Employee
                </button>
              </div>


            <select
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="px-3 py-2 w-full rounded-lg border shadow-sm md:w-60 bg-white/70 border-black/10 text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-600 dark:bg-slate-900/40 dark:border-white/10 dark:text-white"
            >
              <option value="">All Departments</option>
              <option>IT</option>
              <option>HR</option>
              <option>Finance</option>
              <option>Operations</option>
            </select>
          </div>



      </div>

      {/* ===================== MOBILE VIEW (CARDS) ===================== */}
      <div className="grid grid-cols-1 gap-4 md:hidden">
        {loading && (
          <div className="p-6 text-center rounded-xl border text-slate-600 dark:text-slate-400 bg-white/70 border-black/10 dark:bg-white/5 dark:border-white/10">
            Loading...
          </div>
        )}

        {!loading && employees.length === 0 && (
          <div className="p-6 text-center rounded-xl border text-slate-600 dark:text-slate-400 bg-white/70 border-black/10 dark:bg-white/5 dark:border-white/10">
            No employees found.
          </div>
        )}

        {!loading &&
          employees.map((emp) => (
            <div
              key={emp.id}
              className="p-4 rounded-xl border shadow-sm bg-white/70 border-black/10 dark:bg-white/5 dark:border-white/10"
            >
              <div className="flex gap-3 justify-between items-start">
                <div>
                  <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
                    {emp.full_name}
                  </h2>
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    {emp.employee_code}
                  </p>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(emp)}
                    className="px-3 py-1 text-xs text-white bg-purple-600 rounded-md hover:bg-purple-700"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(emp)}
                    className="px-3 py-1 text-xs text-white bg-purple-600 rounded-md hover:bg-purple-700"
                  >
                    Delete
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-2 mt-4 text-xs text-slate-700 dark:text-slate-300">
                <p>
                  <span className="font-semibold">Email:</span> {emp.email}
                </p>
                <p>
                  <span className="font-semibold">Department:</span>{" "}
                  {emp.department}
                </p>
                <p>
                  <span className="font-semibold">Job Title:</span>{" "}
                  {emp.job_title}
                </p>
                <p>
                  <span className="font-semibold">Date Created:</span>{" "}
                  {new Date(emp.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
      </div>

      {/* ===================== DESKTOP VIEW (TABLE) ===================== */}
      <div className="hidden md:block">
        <div className="overflow-x-auto rounded-xl border shadow-sm bg-white/70 border-black/10 dark:bg-white/5 dark:border-white/10">
          <table className="min-w-[900px] w-full text-sm text-slate-800 dark:text-slate-300">
            <thead className="bg-black/5 dark:bg-white/10">
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
                  <td
                    colSpan="7"
                    className="p-6 text-center text-slate-600 dark:text-slate-400"
                  >
                    Loading...
                  </td>
                </tr>
              )}

              {!loading && employees.length === 0 && (
                <tr>
                  <td
                    colSpan="7"
                    className="p-6 text-center text-slate-600 dark:text-slate-400"
                  >
                    No employees found.
                  </td>
                </tr>
              )}

              {!loading &&
                employees.map((emp) => (
                  <tr
                    key={emp.id}
                    className="border-t border-black/5 dark:border-white/5"
                  >
                    <td className="p-3">{emp.full_name}</td>
                    <td className="p-3">{emp.employee_code}</td>
                    <td className="p-3">{emp.email}</td>
                    <td className="p-3">{emp.department}</td>
                    <td className="p-3">{emp.job_title}</td>
                    <td className="p-3">
                      {new Date(emp.created_at).toLocaleDateString()}
                    </td>

                    <td className="p-3 text-center">
                      <div className="flex gap-2 justify-center">
                        <button
                          onClick={() => handleEdit(emp)}
                          className="px-3 py-1 text-xs text-white bg-purple-600 rounded-md hover:bg-purple-700"
                        >
                          Edit
                        </button>

                        <button
                          onClick={() => handleDelete(emp)}
                          className="px-3 py-1 text-xs text-white bg-purple-600 rounded-md hover:bg-purple-700"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* PAGINATION */}
      <div className="flex flex-col gap-3 justify-between items-start mt-4 text-sm md:flex-row md:items-center text-slate-600 dark:text-slate-400">
        <span>
          Page {page} of {totalPages || 1}
        </span>

        <div className="flex gap-2">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            className="px-3 py-1 text-white bg-purple-600 rounded-lg disabled:opacity-40 hover:bg-purple-700"
          >
            Prev
          </button>

          <button
            disabled={page === totalPages || totalPages === 0}
            onClick={() => setPage((p) => p + 1)}
            className="px-3 py-1 text-white bg-purple-700 rounded-lg disabled:opacity-40 hover:bg-purple-800"
          >
            Next
          </button>
        </div>
      </div>

      {/* CREATE MODAL */}
      <AdminCreateEmployeeModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSuccess={() => fetchEmployees(page)}
      />

      {/* EDIT MODAL */}
      <AdminEditEmployeeModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        employee={selectedEmployee}
        onSuccess={() => fetchEmployees(page)}
      />
    </div>
  )
}
