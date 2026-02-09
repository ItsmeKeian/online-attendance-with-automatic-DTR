import { useState, useEffect } from "react"
import Swal from "sweetalert2"
import { getSwalTheme } from "../utils/swalTheme"

export default function AdminEditEmployeeModal({
  isOpen,
  onClose,
  employee,
  onSuccess,
}) {
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    department: "",
    job_title: "",
  })

  useEffect(() => {
    if (employee) {
      setForm({
        full_name: employee.full_name || "",
        email: employee.email || "",
        department: employee.department || "",
        job_title: employee.job_title || "",
      })
    }
  }, [employee])

  if (!isOpen) return null

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function handleUpdate(e) {
    e.preventDefault()

    const theme = getSwalTheme()

    if (!form.full_name.trim() || !form.email.trim() || !form.department.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Missing fields",
        text: "Please fill out all required fields.",
        background: theme.background,
        color: theme.color,
        confirmButtonColor: theme.confirmButtonColor,
        backdrop: theme.backdrop,
      })
      return
    }

    const res = await fetch(
      "http://localhost/online-dtr-api/admin/update_employee.php",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: employee.id,
          ...form,
        }),
      }
    )

    const json = await res.json()

    if (json.success) {
      await Swal.fire({
        icon: "success",
        title: "Employee updated successfully",
        background: theme.background,
        color: theme.color,
        confirmButtonColor: theme.confirmButtonColor,
        backdrop: theme.backdrop,
      })

      onSuccess()
      onClose()
    } else {
      Swal.fire({
        icon: "error",
        title: "Update failed",
        text: json.message || "Something went wrong",
        background: theme.background,
        color: theme.color,
        confirmButtonColor: theme.confirmButtonColor,
        backdrop: theme.backdrop,
      })
    }
  }

  return (
    <div className="flex fixed inset-0 z-50 justify-center items-center backdrop-blur-sm bg-black/50">
      <div className="p-6 w-full max-w-lg rounded-xl border shadow-lg bg-white/90 border-black/10 dark:bg-slate-950 dark:border-white/10">
        {/* HEADER */}
        <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
          Edit Employee
        </h2>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
          Update employee information
        </p>

        {/* FORM */}
        <form onSubmit={handleUpdate} className="mt-6 space-y-4">
          {/* FULL NAME */}
          <div>
            <label className="block mb-1 text-sm font-medium text-slate-700 dark:text-slate-300">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              name="full_name"
              value={form.full_name}
              onChange={handleChange}
              placeholder="Enter full name"
              className="px-4 py-2 w-full bg-white rounded-lg border border-black/10 text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-600 dark:bg-slate-900 dark:border-white/10 dark:text-white"
            />
          </div>

          {/* EMAIL */}
          <div>
            <label className="block mb-1 text-sm font-medium text-slate-700 dark:text-slate-300">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Enter email address"
              className="px-4 py-2 w-full bg-white rounded-lg border border-black/10 text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-600 dark:bg-slate-900 dark:border-white/10 dark:text-white"
            />
          </div>

          {/* JOB TITLE */}
          <div>
            <label className="block mb-1 text-sm font-medium text-slate-700 dark:text-slate-300">
              Job Title
            </label>
            <input
              name="job_title"
              value={form.job_title}
              onChange={handleChange}
              placeholder="Enter job title"
              className="px-4 py-2 w-full bg-white rounded-lg border border-black/10 text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-600 dark:bg-slate-900 dark:border-white/10 dark:text-white"
            />
          </div>

          {/* DEPARTMENT */}
          <div>
            <label className="block mb-1 text-sm font-medium text-slate-700 dark:text-slate-300">
              Department <span className="text-red-500">*</span>
            </label>
            <select
              name="department"
              value={form.department}
              onChange={handleChange}
              className="px-4 py-2 w-full bg-white rounded-lg border border-black/10 text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-600 dark:bg-slate-900 dark:border-white/10 dark:text-white"
            >
              <option value="">Select Department</option>
              <option>IT</option>
              <option>HR</option>
              <option>Finance</option>
              <option>Operations</option>
            </select>
          </div>

          {/* BUTTONS */}
          <div className="flex gap-3 justify-end pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-black/10 hover:bg-black/5 dark:border-white/10 dark:hover:bg-white/5"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-4 py-2 text-white bg-purple-600 rounded-lg hover:bg-purple-700"
            >
              Update
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
