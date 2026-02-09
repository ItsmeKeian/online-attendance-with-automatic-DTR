import { useState } from "react"
import Swal from "sweetalert2"
import { getSwalTheme } from "../utils/swalTheme"

const INITIAL_FORM = {
  full_name: "",
  email: "",
  phone: "",
  age: "",
  job_title: "",
  sex: "",
  department: "",
  address: "",
}

export default function AdminCreateEmployee({ isOpen, onClose, onSuccess }) {
  const [form, setForm] = useState(INITIAL_FORM)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  if (!isOpen) return null

  function handleChange(e) {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  function resetForm() {
    setForm(INITIAL_FORM)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const res = await fetch(
        "http://localhost/online-dtr-api/admin/create_employee.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        }
      )

      const data = await res.json()

      if (!res.ok || data?.error) {
        setError(data?.error || "Server error")
        return
      }

      const theme = getSwalTheme()

      await Swal.fire({
        title: "Employee Created",
        html: `
          <div class="mt-2 text-sm text-slate-500">
            Employee has been created successfully.
          </div>
      
          <div class="px-4 py-3 mt-4 rounded-lg border bg-slate-100 border-slate-200">
            <span class="text-xs text-slate-500">Employee Code</span>
            <div class="font-mono text-lg text-emerald-600">
              ${data.employee_code}
            </div>
          </div>
        `,
        icon: "success",
        background: theme.background,
        color: theme.color,
        confirmButtonText: "OK",
        confirmButtonColor: theme.confirmButtonColor,
        backdrop: theme.backdrop,
        customClass: {
          popup: "rounded-2xl shadow-2xl",
        },
      })

      resetForm()
      onSuccess()
      onClose()
    } catch {
      setError("Server error")
    } finally {
      setLoading(false)
    }
  }

  const inputClass =
    "px-4 py-2 bg-white rounded-lg border shadow-sm border-black/10 text-slate-900 placeholder:text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-600 dark:bg-slate-800 dark:border-white/10 dark:text-white dark:placeholder:text-slate-50"

  return (
    <div className="flex fixed inset-0 z-50 justify-center items-center px-4 bg-black/60">
      <div className="w-full max-w-3xl bg-white rounded-2xl border shadow-xl border-black/10 dark:bg-slate-900 dark:border-white/10">
        {/* HEADER */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-black/10 dark:border-white/10">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
            Create Employee
          </h2>

          <button
            onClick={onClose}
            className="text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
          >
            ✕
          </button>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="px-4 py-3 text-sm text-rose-600 rounded-lg bg-rose-500/10 dark:text-rose-400">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <input
              name="full_name"
              value={form.full_name}
              placeholder="Full Name"
              onChange={handleChange}
              className={inputClass}
            />

            <input
              name="email"
              value={form.email}
              placeholder="Email"
              onChange={handleChange}
              className={inputClass}
            />

            <input
              name="phone"
              value={form.phone}
              placeholder="Phone Number"
              onChange={handleChange}
              className={inputClass}
            />

            <input
              name="age"
              value={form.age}
              placeholder="Age"
              onChange={handleChange}
              className={inputClass}
            />

            <input
              name="job_title"
              value={form.job_title}
              placeholder="Job Title"
              onChange={handleChange}
              className={inputClass}
            />

            <select
              name="sex"
              value={form.sex}
              onChange={handleChange}
              className={inputClass}
            >
              <option value="">Sex</option>
              <option>Male</option>
              <option>Female</option>
              <option>Other</option>
            </select>

            <select
              name="department"
              value={form.department}
              onChange={handleChange}
              className={`${inputClass} md:col-span-2`}
            >
              <option value="">Select Department</option>
              <option>IT</option>
              <option>HR</option>
              <option>Finance</option>
              <option>Operations</option>
            </select>

            <textarea
              name="address"
              rows="3"
              value={form.address}
              placeholder="Address"
              onChange={handleChange}
              className={`${inputClass} md:col-span-2`}
            />
          </div>

          {/* FOOTER */}
          <div className="flex gap-3 justify-end pt-4 border-t border-black/10 dark:border-white/10">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-slate-700 hover:bg-black/5 dark:text-slate-300 dark:hover:bg-white/5"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 text-white bg-purple-600 rounded-lg hover:bg-purple-700 disabled:opacity-50"
            >
              {loading ? "Creating..." : "Create Employee"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
