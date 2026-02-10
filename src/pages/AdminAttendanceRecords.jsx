import { useEffect, useState, useCallback, useRef } from "react"
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

  // Search employee input
  const [searchEmployee, setSearchEmployee] = useState("")
  const [showDropdown, setShowDropdown] = useState(false)
  const dropdownRef = useRef(null)

  // MODAL
  const [selectedRecord, setSelectedRecord] = useState(null)

  /* =====================
     CLICK OUTSIDE DROPDOWN
  ===================== */
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

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
        setPage(1)
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
     QUICK FILTER BUTTONS
  ===================== */
  function formatDate(dateObj) {
    return dateObj.toISOString().split("T")[0]
  }

  function handleToday() {
    const today = new Date()
    const formatted = formatDate(today)

    setFromDate(formatted)
    setToDate(formatted)
    setPage(1)
  }

  function handleThisWeek() {
    const now = new Date()
    const day = now.getDay()
    const diff = now.getDate() - day + (day === 0 ? -6 : 1)

    const monday = new Date(now.setDate(diff))
    const sunday = new Date(monday)
    sunday.setDate(monday.getDate() + 6)

    setFromDate(formatDate(monday))
    setToDate(formatDate(sunday))
    setPage(1)
  }

  function handleThisMonth() {
    const now = new Date()
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1)
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0)

    setFromDate(formatDate(firstDay))
    setToDate(formatDate(lastDay))
    setPage(1)
  }

  /* =====================
     SUMMARY COUNTS
  ===================== */
  const totalRecords = records.length
  const totalLate = records.filter(r => r.remarks === "late").length
  const incompleteLogs = records.filter(
    r => !r.time_in || !r.lunch_out || !r.lunch_in || !r.time_out
  ).length

  /* =====================
     PAGINATION
  ===================== */
  const totalPages = Math.ceil(records.length / PER_PAGE)
  const start = (page - 1) * PER_PAGE
  const paginatedRecords = records.slice(start, start + PER_PAGE)

  /* =====================
     SEARCH FILTER EMPLOYEES
  ===================== */
  const filteredEmployees = employees.filter(emp =>
    emp.full_name.toLowerCase().includes(searchEmployee.toLowerCase())
  )

  function handleSelectEmployee(emp) {
    setEmployeeId(emp.id)
    setSearchEmployee(emp.full_name)
    setShowDropdown(false)
  }

  function clearEmployeeFilter() {
    setEmployeeId("")
    setSearchEmployee("")
    setShowDropdown(false)
  }

  /* =====================
     EXPORT CSV
  ===================== */
  function exportCSV() {
    if (!records.length) return

    const headers = [
      "Employee",
      "Date",
      "Time In",
      "Lunch Out",
      "Lunch In",
      "Time Out",
      "Status",
      "Remarks",
    ]

    const rows = records.map(r => [
      r.full_name,
      r.date,
      r.time_in || "",
      r.lunch_out || "",
      r.lunch_in || "",
      r.time_out || "",
      r.status,
      r.remarks || "",
    ])

    const csvContent = [headers, ...rows]
      .map(e => e.map(x => `"${String(x).replace(/"/g, '""')}"`).join(","))
      .join("\n")

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)

    const link = document.createElement("a")
    link.href = url
    link.download = "attendance_records.csv"
    link.click()

    URL.revokeObjectURL(url)
  }

  /* =====================
     MODAL HELPERS
  ===================== */
  function closeModal() {
    setSelectedRecord(null)
  }

  function getRemarksBadge(row) {
    if (row.remarks === "late") {
      return (
        <span className="px-2 py-1 text-xs text-yellow-700 bg-yellow-200 rounded-md dark:text-yellow-300 dark:bg-yellow-500/20">
          LATE
        </span>
      )
    }

    if (row.time_in && row.lunch_out && row.lunch_in && row.time_out) {
      return (
        <span className="px-2 py-1 text-xs text-green-700 bg-green-200 rounded-md dark:text-green-300 dark:bg-green-500/20">
          ON TIME
        </span>
      )
    }

    return (
      <span className="px-2 py-1 text-xs text-red-700 bg-red-200 rounded-md dark:text-red-300 dark:bg-red-500/20">
        INCOMPLETE
      </span>
    )
  }

  function getStatusBadge(status) {
    const base =
      "px-2 py-1 text-xs rounded-md font-medium inline-block text-center"

    if (status === "out") {
      return (
        <span
          className={`text-green-700 bg-green-200 ${base} dark:bg-green-500/20 dark:text-green-300`}
        >
          OUT
        </span>
      )
    }

    if (status === "lunch") {
      return (
        <span
          className={`text-yellow-700 bg-yellow-200 ${base} dark:bg-yellow-500/20 dark:text-yellow-300`}
        >
          LUNCH
        </span>
      )
    }

    return (
      <span
        className={`text-blue-700 bg-blue-200 ${base} dark:bg-blue-500/20 dark:text-blue-300`}
      >
        IN
      </span>
    )
  }

  return (
    <div className="w-full">
      {/* ===================== PRINT (FULL DATA) ===================== */}
      <DTRPrint
        records={records}
        fromDate={fromDate}
        toDate={toDate}
        department={department}
      />

      {/* HEADER */}
      <div className="flex flex-col gap-4 justify-between mb-6 md:flex-row md:items-center no-print">
        <div>
          <h1 className="text-xl font-semibold md:text-2xl text-slate-900 dark:text-white">
            Attendance Records
          </h1>
          <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400">
            Daily Time Records (DTR)
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={exportCSV}
            className="px-4 py-2 text-sm text-white rounded-lg bg-slate-700 hover:bg-slate-800"
          >
            Export CSV
          </button>

          <button
            onClick={() => window.print()}
            className="px-4 py-2 text-sm text-white bg-purple-600 rounded-lg hover:bg-purple-700"
          >
            Print DTR
          </button>
        </div>
      </div>

      {/* SUMMARY CARDS */}
      <div className="grid grid-cols-1 gap-4 mb-6 md:grid-cols-3 no-print">
        <div className="p-4 bg-white rounded-xl border shadow-sm border-black/10 dark:border-white/10 dark:bg-white/5">
          <p className="text-xs text-slate-600 dark:text-slate-400">
            Total Records
          </p>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            {totalRecords}
          </h2>
        </div>

        <div className="p-4 bg-white rounded-xl border shadow-sm border-black/10 dark:border-white/10 dark:bg-white/5">
          <p className="text-xs text-slate-600 dark:text-slate-400">Late</p>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            {totalLate}
          </h2>
        </div>

        <div className="p-4 bg-white rounded-xl border shadow-sm border-black/10 dark:border-white/10 dark:bg-white/5">
          <p className="text-xs text-slate-600 dark:text-slate-400">
            Incomplete Logs
          </p>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            {incompleteLogs}
          </h2>
        </div>
      </div>

      {/* QUICK FILTERS */}
      <div className="flex flex-wrap gap-2 mb-4 no-print">
        <button
          onClick={handleToday}
          className="px-3 py-1 text-sm text-white bg-purple-600 rounded-lg hover:bg-purple-700"
        >
          Today
        </button>

        <button
          onClick={handleThisWeek}
          className="px-3 py-1 text-sm text-white bg-purple-600 rounded-lg hover:bg-purple-700"
        >
          This Week
        </button>

        <button
          onClick={handleThisMonth}
          className="px-3 py-1 text-sm text-white bg-purple-600 rounded-lg hover:bg-purple-700"
        >
          This Month
        </button>
      </div>

      {/* FILTERS */}
      <div className="grid grid-cols-1 gap-3 mb-4 md:grid-cols-2 lg:grid-cols-4 no-print">
        <input
          type="date"
          value={fromDate}
          onChange={e => setFromDate(e.target.value)}
          className="px-3 py-2 bg-white rounded-lg border shadow-sm border-black/10 text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-600 dark:bg-slate-900 dark:border-white/10 dark:text-white"
        />

        <input
          type="date"
          value={toDate}
          onChange={e => setToDate(e.target.value)}
          className="px-3 py-2 bg-white rounded-lg border shadow-sm border-black/10 text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-600 dark:bg-slate-900 dark:border-white/10 dark:text-white"
        />

        <select
          value={department}
          onChange={e => setDepartment(e.target.value)}
          className="px-3 py-2 bg-white rounded-lg border shadow-sm border-black/10 text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-600 dark:bg-slate-900 dark:border-white/10 dark:text-white"
        >
          <option value="">All Departments</option>
          <option>IT</option>
          <option>HR</option>
          <option>Finance</option>
          <option>Operations</option>
        </select>

        {/* SEARCH INPUT DROPDOWN */}
        <div ref={dropdownRef} className="relative">
          <div className="relative">
            <input
              type="text"
              value={searchEmployee}
              onChange={e => {
                setSearchEmployee(e.target.value)
                setShowDropdown(true)
              }}
              onFocus={() => setShowDropdown(true)}
              placeholder="Search employee name..."
              className="px-3 py-2 w-full bg-white rounded-lg border shadow-sm border-black/10 text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-600 dark:bg-slate-900 dark:border-white/10 dark:text-white"
            />

            {employeeId && (
              <button
                onClick={clearEmployeeFilter}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
              >
                ✕
              </button>
            )}
          </div>

          {showDropdown && searchEmployee && filteredEmployees.length > 0 && (
            <div className="overflow-y-auto absolute z-50 mt-2 w-full max-h-60 bg-white rounded-lg border shadow-lg border-black/10 dark:bg-slate-900 dark:border-white/10">
              {filteredEmployees.map(emp => (
                <button
                  key={emp.id}
                  onClick={() => handleSelectEmployee(emp)}
                  className="block px-3 py-2 w-full text-sm text-left text-slate-900 hover:bg-black/5 dark:text-white dark:hover:bg-white/10"
                >
                  {emp.full_name}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <button
        onClick={() => {
          fetchRecords()
          setShowDropdown(false)
        }}
        className="px-4 py-2 mb-6 text-sm text-white bg-purple-600 rounded-lg hover:bg-purple-700 no-print"
      >
        Apply Filters
      </button>

      {/* ===================== MOBILE VIEW (CARDS) ===================== */}
      <div className="grid grid-cols-1 gap-4 md:hidden no-print">
        {!loading && paginatedRecords.length === 0 && (
          <div className="p-4 text-sm text-center bg-white rounded-xl border text-slate-600 border-black/10 dark:text-slate-400 dark:bg-white/5 dark:border-white/10">
            No records found
          </div>
        )}

        {paginatedRecords.map((row, index) => (
          <div
            key={index}
            className="p-4 bg-white rounded-xl border shadow-sm border-black/10 dark:bg-white/5 dark:border-white/10"
          >
            <div className="flex gap-3 justify-between items-start">
              <div>
                <p className="text-sm font-semibold text-slate-900 dark:text-white">
                  {row.full_name}
                </p>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  {row.date}
                </p>
              </div>

              <div className="flex flex-col gap-1 items-end">
                {getStatusBadge(row.status)}
                {getRemarksBadge(row)}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-4 text-xs text-slate-700 dark:text-slate-300">
              <p>
                <span className="font-semibold">Time In:</span>{" "}
                {row.time_in || "—"}
              </p>
              <p>
                <span className="font-semibold">Lunch Out:</span>{" "}
                {row.lunch_out || "—"}
              </p>
              <p>
                <span className="font-semibold">Lunch In:</span>{" "}
                {row.lunch_in || "—"}
              </p>
              <p>
                <span className="font-semibold">Time Out:</span>{" "}
                {row.time_out || "—"}
              </p>
            </div>

            <button
              onClick={() => setSelectedRecord(row)}
              className="px-3 py-2 mt-4 w-full text-sm text-white bg-purple-600 rounded-lg hover:bg-purple-700"
            >
              View Details
            </button>
          </div>
        ))}
      </div>

      {/* ===================== DESKTOP VIEW (TABLE) ===================== */}
      <div className="hidden md:block no-print">
        <div className="overflow-x-auto bg-white rounded-xl border shadow-sm border-black/10 dark:bg-white/5 dark:border-white/10">
          <table className="min-w-[900px] w-full text-sm text-slate-800 dark:text-slate-300">
            <thead className="bg-black/5 dark:bg-white/10">
              <tr>
                <th className="p-3 text-left">Employee</th>
                <th className="p-3 text-left">Date</th>
                <th className="p-3 text-left">Time In</th>
                <th className="p-3 text-left">Lunch Out</th>
                <th className="p-3 text-left">Lunch In</th>
                <th className="p-3 text-left">Time Out</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-left">Remarks</th>
                <th className="p-3 text-left">Action</th>
              </tr>
            </thead>

            <tbody>
              {!loading && paginatedRecords.length === 0 && (
                <tr>
                  <td
                    colSpan="9"
                    className="p-4 text-center text-slate-600 dark:text-slate-400"
                  >
                    No records found
                  </td>
                </tr>
              )}

              {paginatedRecords.map((row, index) => (
                <tr
                  key={index}
                  className="border-t border-black/5 dark:border-white/5"
                >
                  <td className="p-3">{row.full_name}</td>
                  <td className="p-3">{row.date}</td>
                  <td className="p-3">{row.time_in || "—"}</td>
                  <td className="p-3">{row.lunch_out || "—"}</td>
                  <td className="p-3">{row.lunch_in || "—"}</td>
                  <td className="p-3">{row.time_out || "—"}</td>

                  <td className="p-3">{getStatusBadge(row.status)}</td>
                  <td className="p-3">{getRemarksBadge(row)}</td>

                  <td className="p-3">
                    <button
                      onClick={() => setSelectedRecord(row)}
                      className="px-3 py-1 text-xs text-white bg-purple-600 rounded-md hover:bg-purple-700"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* PAGINATION */}
      {totalPages > 1 && (
        <div className="flex flex-col gap-3 justify-between items-start mt-4 text-sm md:flex-row md:items-center text-slate-600 dark:text-slate-400 no-print">
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

      {/* ===================== MODAL VIEW ===================== */}
      {selectedRecord && (
        <div className="flex fixed inset-0 z-50 justify-center items-center p-4 bg-black/60 no-print">
          <div className="p-5 w-full max-w-3xl bg-white rounded-xl border shadow-lg border-black/10 dark:bg-slate-900 dark:border-white/10 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Attendance Details
              </h2>

              <button
                onClick={closeModal}
                className="px-4 py-1 text-sm text-white bg-purple-600 rounded-lg hover:bg-purple-700"
              >
                Close
              </button>
            </div>

            <div className="grid grid-cols-1 gap-3 mb-6 text-sm md:grid-cols-2 text-slate-700 dark:text-slate-300">
              <p>
                Employee: <strong>{selectedRecord.full_name}</strong>
              </p>
              <p>
                Employee Code: <strong>{selectedRecord.employee_code}</strong>
              </p>
              <p>
                Department: <strong>{selectedRecord.department}</strong>
              </p>
              <p>
                Job Title: <strong>{selectedRecord.job_title}</strong>
              </p>
              <p>
                Date: <strong>{selectedRecord.date}</strong>
              </p>
              <p>
                Status: <strong>{selectedRecord.status}</strong>
              </p>
              <p>
                Late Minutes: <strong>{selectedRecord.late_minutes || 0}</strong>
              </p>
              <p>
                Undertime Minutes:{" "}
                <strong>{selectedRecord.undertime_minutes || 0}</strong>
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {/* TIME IN */}
              <div className="p-4 rounded-lg border border-black/10 bg-black/5 dark:bg-white/5 dark:border-white/10">
                <p className="text-sm font-semibold text-slate-900 dark:text-white">
                  Time In
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  {selectedRecord.time_in || "—"}
                </p>

                {selectedRecord.photo_in && (
                  <img
                    src={selectedRecord.photo_in}
                    alt="Time In"
                    className="object-cover mt-3 w-full h-40 rounded-lg"
                  />
                )}
              </div>

              {/* LUNCH OUT */}
              <div className="p-4 rounded-lg border border-black/10 bg-black/5 dark:bg-white/5 dark:border-white/10">
                <p className="text-sm font-semibold text-slate-900 dark:text-white">
                  Lunch Out
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  {selectedRecord.lunch_out || "—"}
                </p>

                {selectedRecord.photo_lunch_out && (
                  <img
                    src={selectedRecord.photo_lunch_out}
                    alt="Lunch Out"
                    className="object-cover mt-3 w-full h-40 rounded-lg"
                  />
                )}
              </div>

              {/* LUNCH IN */}
              <div className="p-4 rounded-lg border border-black/10 bg-black/5 dark:bg-white/5 dark:border-white/10">
                <p className="text-sm font-semibold text-slate-900 dark:text-white">
                  Lunch In
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  {selectedRecord.lunch_in || "—"}
                </p>

                {selectedRecord.photo_lunch_in && (
                  <img
                    src={selectedRecord.photo_lunch_in}
                    alt="Lunch In"
                    className="object-cover mt-3 w-full h-40 rounded-lg"
                  />
                )}
              </div>

              {/* TIME OUT */}
              <div className="p-4 rounded-lg border border-black/10 bg-black/5 dark:bg-white/5 dark:border-white/10">
                <p className="text-sm font-semibold text-slate-900 dark:text-white">
                  Time Out
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  {selectedRecord.time_out || "—"}
                </p>

                {selectedRecord.photo_out && (
                  <img
                    src={selectedRecord.photo_out}
                    alt="Time Out"
                    className="object-cover mt-3 w-full h-40 rounded-lg"
                  />
                )}
              </div>
            </div>

            <div className="mt-6">
              <p className="text-sm font-semibold text-slate-900 dark:text-white">
                Remarks:
              </p>
              <div className="mt-2">{getRemarksBadge(selectedRecord)}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
