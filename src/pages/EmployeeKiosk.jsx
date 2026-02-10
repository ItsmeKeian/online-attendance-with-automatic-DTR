import { useEffect, useState, useRef } from "react"
import CameraModal from "../components/CameraModal"

export default function EmployeeKiosk() {
  const [now, setNow] = useState(new Date())
  const [employeeCode, setEmployeeCode] = useState("")

  const [employee, setEmployee] = useState(null) // NEW
  const [attendance, setAttendance] = useState(null)

  const [action, setAction] = useState(null)
  const [showCamera, setShowCamera] = useState(false)

  const [message, setMessage] = useState("")
  const [error, setError] = useState("")

  const beepRef = useRef(null)

  useEffect(() => {
    beepRef.current = new Audio("/beep.mp3")
  }, [])

  /* LIVE CLOCK */
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  /* FETCH EMPLOYEE INFO */
  async function fetchEmployee(code) {
    if (!code) {
      setEmployee(null)
      return
    }

    try {
      const res = await fetch(
        "http://localhost/online-dtr-api/employees/get_employee.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ employee_code: code }),
        }
      )

      const data = await res.json()

      if (data.error) {
        setEmployee(null)
        return
      }

      setEmployee(data)
    } catch {
      setEmployee(null)
    }
  }

  /* FETCH ATTENDANCE STATUS */
  async function fetchStatus(code) {
    if (!code) {
      setAttendance(null)
      return
    }

    try {
      const res = await fetch(
        "http://localhost/online-dtr-api/attendance/status.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ employee_code: code }),
        }
      )

      const data = await res.json()
      setAttendance(data)
    } catch {
      setAttendance(null)
    }
  }

  /* OPEN CAMERA */
  function openCamera(type) {
    if (!employeeCode) {
      setError("Please enter your Employee ID")
      return
    }

    if (!employee) {
      setError("Employee not found. Please enter a valid Employee ID.")
      return
    }

    setError("")
    setMessage("")
    setAction(type)
    setShowCamera(true)
  }

  /* AFTER PHOTO */
  async function handleCapture(photo) {
    setShowCamera(false)

    try {
      const res = await fetch(
        `http://localhost/online-dtr-api/attendance/${action}.php`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            employee_code: employeeCode,
            photo,
          }),
        }
      )

      const data = await res.json()

      if (data.error) {
        setError(data.error)
        return
      }

      beepRef.current.currentTime = 0
      beepRef.current.play()

      if (!data.success) {
        setError(data.error || "Action failed.")
        return
      }
      
      setMessage(data.message)
      
      await fetchStatus(employeeCode)

      setTimeout(() => {
        setEmployeeCode("")
        setEmployee(null)
        setAttendance(null)
        setMessage("")
        setError("")
      }, 2000)
    } catch {
      setError("Server error. Please try again.")
    }
  }

  /* BUTTON STATE LOGIC */
  const hasValidEmployee = employee !== null

  const canTimeIn = hasValidEmployee && attendance === null

  const canLunchOut =
    hasValidEmployee && attendance && attendance.time_in && !attendance.lunch_out

  const canLunchIn =
    hasValidEmployee && attendance && attendance.lunch_out && !attendance.lunch_in

  const canTimeOut =
    hasValidEmployee && attendance && attendance.lunch_in && !attendance.time_out

  return (
    <div className="flex flex-col items-center px-4 min-h-screen text-white via-gray-900 to-black bg-linear-to-br from-slate-900">
      {/* HEADER */}
      <div className="mt-10 mb-6 text-center">
        <h1 className="text-3xl font-bold">Employee Attendance</h1>

        <p className="mt-1 text-slate-400">
          {now.toLocaleDateString(undefined, {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>

        <p className="mt-2 font-mono text-xl">
          {now.toLocaleTimeString()}
        </p>
      </div>

      <div className="mb-4 text-sm text-slate-400">
        Please select the correct action before capturing your photo
      </div>

      {error && (
        <div className="px-4 py-2 mb-4 w-full max-w-md text-red-400 rounded-lg bg-red-500/10">
          {error}
        </div>
      )}

      {message && (
        <div className="justify-items-center px-4 py-2 mb-4 w-full max-w-md text-center text-emerald-400 rounded-lg bg-emerald-500/10">
          {message}
        </div>
      )}

      {/* EMPLOYEE ID */}
      <input
        value={employeeCode}
        onChange={(e) => {
          const code = e.target.value
          setEmployeeCode(code)
          setError("")
          setMessage("")

          fetchEmployee(code)
          fetchStatus(code)
        }}
        placeholder="Employee ID (e.g. EMP-2789)"
        className="px-4 py-3 mb-4 w-full max-w-md text-center rounded-xl border bg-slate-800 border-white/10 focus:outline-none focus:ring-2 focus:ring-purple-600"
      />

      {/* EMPLOYEE PREVIEW */}
      {employee && (
        <div className="p-4 mb-6 w-full max-w-md rounded-xl border bg-white/5 border-white/10">
          <p className="text-lg font-semibold">{employee.full_name}</p>
          <p className="text-sm text-slate-300">
            {employee.department} • {employee.job_title}
          </p>

          <div className="mt-2 text-sm">
            <span className="text-slate-400">Status: </span>
            <span className="font-semibold text-emerald-400">
              Active
            </span>
          </div>
        </div>
      )}

      {!employee && employeeCode && (
        <div className="p-4 mb-6 w-full max-w-md text-yellow-400 rounded-xl border bg-yellow-500/10 border-yellow-500/20">
          Employee not found. Please check your Employee ID.
        </div>
      )}

      {/* ACTION BUTTONS */}
      <div className="grid grid-cols-2 gap-4 w-full max-w-md">
        <ActionButton
          label="TIME IN"
          color="bg-emerald-600"
          disabled={!canTimeIn}
          onClick={() => openCamera("time_in")}
        />

        <ActionButton
          label="LUNCH OUT"
          color="bg-yellow-500"
          disabled={!canLunchOut}
          onClick={() => openCamera("lunch_out")}
        />

        <ActionButton
          label="LUNCH IN"
          color="bg-blue-500"
          disabled={!canLunchIn}
          onClick={() => openCamera("lunch_in")}
        />

        <ActionButton
          label="TIME OUT"
          color="bg-rose-600"
          disabled={!canTimeOut}
          onClick={() => openCamera("time_out")}
        />
      </div>

      {showCamera && (
        <CameraModal
          onCapture={handleCapture}
          onClose={() => setShowCamera(false)}
        />
      )}
    </div>
  )
}

/* BUTTON */
function ActionButton({ label, color, disabled, onClick }) {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className={`
        h-20 md:h-24 rounded-2xl text-base md:text-lg font-semibold transition
        ${color}
        ${disabled
          ? "opacity-40 cursor-not-allowed"
          : "hover:opacity-90 active:scale-95"}
      `}
    >
      {label}
    </button>
  )
}

