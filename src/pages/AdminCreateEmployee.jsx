import { useState } from "react"
import Swal from "sweetalert2"

const INITIAL_FORM = {
  full_name: "",
  email: "",
  phone: "",
  age: "",
  job_title: "",
  sex: "",
  department: "",
  address: ""
}

export default function AdminCreateEmployee({ isOpen, onClose, onSuccess }) {
  const [form, setForm] = useState(INITIAL_FORM)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  if (!isOpen) return null

  /* =====================
     HANDLERS
  ===================== */

  function handleChange(e) {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
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
          body: JSON.stringify(form)
        }
      )

      const data = await res.json()

      if (!res.ok || data?.error) {
        setError(data?.error || "Server error")
        return
      }

      /* =====================
         SUCCESS MODAL
      ===================== */
      await Swal.fire({
        title: "Employee Created",
        html: `
          <div class="mt-2 text-sm text-slate-300">
            Employee has been created successfully.
          </div>

          <div class="px-4 py-3 mt-4 rounded-lg border bg-slate-800 border-white/10">
            <span class="text-xs text-slate-400">Employee Code</span>
            <div class="font-mono text-lg text-emerald-400">
              ${data.employee_code}
            </div>
          </div>
        `,
        icon: "success",
        background: "#020617",
        color: "#e5e7eb",
        confirmButtonText: "OK",
        confirmButtonColor: "#7c3aed",
        backdrop: "rgba(2,6,23,0.8)",
        customClass: {
          popup: "rounded-2xl border border-white/10 shadow-2xl"
        }
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

  /* =====================
     UI
  ===================== */

  return (
    <div className="flex fixed inset-0 z-50 justify-center items-center px-4 bg-black/70">
      <div className="w-full max-w-3xl rounded-2xl border shadow-xl bg-slate-900 border-white/10">

        {/* HEADER */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-white/10">
          <h2 className="text-lg font-semibold text-white">
            Create Employee
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white"
          >
            ✕
          </button>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="px-4 py-3 text-sm text-rose-400 rounded-lg bg-rose-500/10">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {[
              ["full_name", "Full Name"],
              ["email", "Email"],
              ["phone", "Phone Number"],
              ["age", "Age"],
              ["job_title", "Job Title"]
            ].map(([name, label]) => (
              <input
                key={name}
                name={name}
                value={form[name]}
                placeholder={label}
                onChange={handleChange}
                className="px-4 py-2 text-white rounded-lg border bg-slate-800 border-white/10 focus:ring-2 focus:ring-purple-600"
              />
            ))}

            <select
              name="sex"
              value={form.sex}
              onChange={handleChange}
              className="px-4 py-2 text-white rounded-lg border bg-slate-800 border-white/10"
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
              className="px-4 py-2 text-white rounded-lg border bg-slate-800 border-white/10 md:col-span-2"
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
              className="px-4 py-2 text-white rounded-lg border bg-slate-800 border-white/10 md:col-span-2"
            />
          </div>

          {/* FOOTER */}
          <div className="flex gap-3 justify-end pt-4 border-t border-white/10">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-slate-300 hover:bg-white/5"
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
