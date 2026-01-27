import { useEffect, useState, useCallback } from "react"
import DTRPrint from "./PrintDTR"

const PER_PAGE = 10

export default function AdminAttendanceRecords() {
  const [records, setRecords] = useState([])
  const [employees, setEmployees] = useState([])
  const [department, setDepartment] = useState("")
  const [employeeId, setEmployeeId] = useState("")
  const [fromDate, setFromDate] = useState("")
  const [toDate, setToDate] = useState("")
  const [loading, setLoading] = useState(false)

  const [page, setPage] = useState(1)

  /* =====================
     FETCH ATTENDANCE
  ===================== */
  const fetchRecords = useCallback(() => {
    setLoading(true)

    const params = new URLSearchParams()
    if (fromDate) params.append("from", fromDate)
    if (toDate) params.append("to", toDate)
    if (department) params.append("department", department)
    if (employeeId) params.append("employee_id", employeeId)

    fetch(
      `http://localhost/online-dtr-api/admin/attendance_records.php?${params}`
    )
      .then(res => res.json())
      .then(data => {
        setRecords(Array.isArray(data) ? data : [])
        setPage(1) // reset page on new fetch
      })
      .finally(() => setLoading(false))
  }, [fromDate, toDate, department, employeeId])

  /* =====================
     FETCH EMPLOYEES
  ===================== */
  const fetchEmployees = useCallback(() => {
    const params = new URLSearchParams()
    if (fromDate && toDate) {
      params.append("from", fromDate)
      params.append("to", toDate)
    }
    if (department) params.append("department", department)

    fetch(
      `http://localhost/online-dtr-api/admin/attendance_employees.php?${params}`
    )
      .then(res => res.json())
      .then(data => setEmployees(Array.isArray(data) ? data : []))
  }, [fromDate, toDate, department])

  useEffect(() => {
    fetchEmployees()
    fetchRecords()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  /* =====================
     PAGINATION (CLIENT SIDE)
  ===================== */
  const totalPages = Math.ceil(records.length / PER_PAGE)
  const start = (page - 1) * PER_PAGE
  const paginatedRecords = records.slice(start, start + PER_PAGE)

  return (
    <div>
      {/* ===================== PRINT (FULL DATA – SAFE) ===================== */}
      <DTRPrint
        records={records}
        fromDate={fromDate}
        toDate={toDate}
        department={department}
      />

      {/* HEADER */}
      <div className="flex justify-between items-center mb-6 no-print">
        <div>
          <h1 className="text-2xl font-semibold text-white">
            Attendance Records
          </h1>
          <p className="text-sm text-slate-400">
            Daily Time Records (DTR)
          </p>
        </div>

        <button
          onClick={() => window.print()}
          className="px-4 py-2 text-sm text-white bg-purple-600 rounded-lg hover:bg-purple-700"
        >
          Print DTR
        </button>
      </div>

      {/* FILTERS */}
      <div className="grid grid-cols-1 gap-4 mb-4 md:grid-cols-4 no-print">
        <input
          type="date"
          value={fromDate}
          onChange={e => setFromDate(e.target.value)}
          className="px-3 py-2 text-white rounded-lg border bg-slate-900 border-white/10"
        />

        <input
          type="date"
          value={toDate}
          onChange={e => setToDate(e.target.value)}
          className="px-3 py-2 text-white rounded-lg border bg-slate-900 border-white/10"
        />

        <select
          value={department}
          onChange={e => setDepartment(e.target.value)}
          className="px-3 py-2 text-white rounded-lg border bg-slate-900 border-white/10"
        >
          <option value="">All Departments</option>
          <option>IT</option>
          <option>HR</option>
          <option>Finance</option>
          <option>Operations</option>
        </select>

        <select
          value={employeeId}
          onChange={e => setEmployeeId(e.target.value)}
          className="px-3 py-2 text-white rounded-lg border bg-slate-900 border-white/10"
        >
          <option value="">All Employees</option>
          {employees.map(emp => (
            <option key={emp.id} value={emp.id}>
              {emp.full_name}
            </option>
          ))}
        </select>
      </div>

      <button
        onClick={fetchRecords}
        className="px-4 py-2 mb-6 text-sm text-white bg-purple-600 rounded-lg hover:bg-purple-700 no-print"
      >
        Apply Filters
      </button>

      {/* TABLE */}
      <div className="overflow-hidden rounded-xl border bg-white/5 border-white/10">
        <table className="w-full text-sm text-slate-300">
          <thead className="bg-white/10">
            <tr>
              <th className="p-3 text-left">Employee</th>
              <th className="p-3 text-left">Date</th>
              <th className="p-3 text-left">Time In</th>
              <th className="p-3 text-left">Lunch Out</th>
              <th className="p-3 text-left">Lunch In</th>
              <th className="p-3 text-left">Time Out</th>
              <th className="p-3 text-left">Status</th>
            </tr>
          </thead>

          <tbody>
            {!loading && paginatedRecords.length === 0 && (
              <tr>
                <td colSpan="7" className="p-4 text-center text-slate-400">
                  No records found
                </td>
              </tr>
            )}

            {paginatedRecords.map((row, index) => (
              <tr key={index} className="border-t border-white/5">
                <td className="p-3">{row.full_name}</td>
                <td className="p-3">{row.date}</td>
                <td className="p-3">{row.time_in || "—"}</td>
                <td className="p-3">{row.lunch_out || "—"}</td>
                <td className="p-3">{row.lunch_in || "—"}</td>
                <td className="p-3">{row.time_out || "—"}</td>
                <td className="p-3">{row.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* PAGINATION */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center mt-4 text-sm text-slate-400 no-print">
          <span>
            Page {page} of {totalPages}
          </span>

          <div className="flex gap-2">
            <button
              disabled={page === 1}
              onClick={() => setPage(p => p - 1)}
              className="px-3 py-1 text-white bg-purple-600 rounded-md disabled:opacity-40 hover:bg-purple-700"
            >
              Prev
            </button>

            <button
              disabled={page === totalPages}
              onClick={() => setPage(p => p + 1)}
              className="px-3 py-1 text-white bg-purple-600 rounded-md disabled:opacity-40 hover:bg-purple-700"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
