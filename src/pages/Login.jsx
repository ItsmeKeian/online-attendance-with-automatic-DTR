import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

export default function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [darkMode, setDarkMode] = useState(false)

  const navigate = useNavigate()

  useEffect(() => {
    const savedTheme = localStorage.getItem("loginTheme")
    if (savedTheme === "dark") {
      setDarkMode(true)
    }
  }, [])

  function toggleTheme() {
    setDarkMode(prev => {
      const newMode = !prev
      localStorage.setItem("loginTheme", newMode ? "dark" : "light")
      return newMode
    })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError("")

    try {
      const res = await fetch("http://localhost/online-dtr-api/auth/login.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || "Login failed")
        return
      }

      if (data.user.role !== "admin") {
        setError("Unauthorized access")
        return
      }

      localStorage.setItem("user", JSON.stringify(data.user))
      localStorage.setItem("role", "admin")

      window.location.href = "/admin"
    } catch {
      setError("Server error. Please try again.")
    }
  }

  return (
    <div
      className={`flex justify-center items-center px-4 min-h-screen transition-colors duration-300
        ${
          darkMode
            ? "bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950"
            : "bg-gradient-to-br from-slate-100 via-slate-200 to-slate-100"
        }`}
    >
      <div className="w-full max-w-md">
        {/* Card */}
        <div
          className={`relative p-8 rounded-2xl border shadow-xl transition-colors duration-300
            ${
              darkMode
                ? "bg-slate-900 border-slate-700"
                : "bg-white border-slate-200"
            }`}
        >
          {/* Toggle Switch */}
          <div className="flex absolute top-5 right-5 gap-2 items-center">
            <span className="text-sm">{darkMode ? "" : ""}</span>

            <button
              onClick={toggleTheme}
              type="button"
              className={`relative w-12 h-6 flex items-center rounded-full transition-colors duration-300
                ${darkMode ? "bg-violet-600" : "bg-slate-300"}`}
            >
              <span
                className={`absolute w-5 h-5 bg-white rounded-full shadow-md transition-transform duration-300
                  ${darkMode ? "translate-x-6" : "translate-x-1"}`}
              />
            </button>
          </div>

          {/* Header */}
          <div className="mb-8 text-center">
            <h1
              className={`text-2xl font-bold ${
                darkMode ? "text-white" : "text-slate-900"
              }`}
            >
              SmartDTR Login
            </h1>

            <p
              className={`mt-2 text-sm ${
                darkMode ? "text-slate-400" : "text-slate-500"
              }`}
            >
              Sign in to access the SmartDTR Admin Panel
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="p-3 mb-5 text-sm text-red-700 bg-red-50 rounded-xl border border-red-200">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                className={`block mb-2 text-sm font-medium ${
                  darkMode ? "text-slate-200" : "text-slate-700"
                }`}
              >
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="admin@email.com"
                className={`px-4 py-3 w-full rounded-xl border focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-colors duration-300
                  ${
                    darkMode
                      ? "text-white bg-slate-800 border-slate-700 placeholder:text-slate-400"
                      : "bg-slate-50 border-slate-300 text-slate-900 placeholder:text-slate-400"
                  }`}
                required
              />
            </div>

            <div>
              <label
                className={`block mb-2 text-sm font-medium ${
                  darkMode ? "text-slate-200" : "text-slate-700"
                }`}
              >
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Enter your password"
                className={`px-4 py-3 w-full rounded-xl border focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-colors duration-300
                  ${
                    darkMode
                      ? "text-white bg-slate-800 border-slate-700 placeholder:text-slate-400"
                      : "bg-slate-50 border-slate-300 text-slate-900 placeholder:text-slate-400"
                  }`}
                required
              />
            </div>

            <button
              type="submit"
              className="py-3 w-full font-semibold text-white bg-violet-600 rounded-xl shadow-md transition hover:bg-violet-700 active:scale-[0.98]"
            >
              Sign In
            </button>
          </form>

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className={`${darkMode ? "text-slate-500" : "text-slate-400"} text-xs`}>
              © {new Date().getFullYear()} Keian Camposano Gacillos
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
