import { useState } from "react"
import { useNavigate } from "react-router-dom"

export default function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const navigate = useNavigate()

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
    <div className="flex justify-center items-center px-4 min-h-screen via-gray-900 to-black bg-linear-to-br from-slate-900">
      <div className="p-6 w-full max-w-md rounded-2xl border-2 border-violet-600 shadow-2xl md:p-8 bg-slate-950">

        <div className="mb-8 text-center">
          <h1 className="text-2xl font-extrabold text-violet-600 md:text-3xl">
            Admin Login
          </h1>
          <p className="mt-2 text-xs text-violet-600 md:text-sm">
            Online DTR – HR Access Only
          </p>
        </div>

        {error && (
          <div className="p-3 mb-4 text-sm text-red-600 bg-red-100 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block mb-1 text-sm font-medium text-violet-600">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="px-4 py-3 w-full text-white rounded-xl border border-violet-600 bg-slate-900 focus:outline-none focus:ring-2 focus:ring-violet-600"
              required
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium text-violet-600">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="px-4 py-3 w-full text-white rounded-xl border border-violet-600 bg-slate-900 focus:outline-none focus:ring-2 focus:ring-violet-600"
              required
            />
          </div>

          <button
            type="submit"
            className="py-3 w-full font-semibold text-white bg-violet-600 rounded-xl transition hover:bg-violet-700 active:scale-95"
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  )
}
