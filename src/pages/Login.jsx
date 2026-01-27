import { useState } from "react"
import { useNavigate } from "react-router-dom"

export default function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const navigate = useNavigate()

  function handleSubmit(e) {
    e.preventDefault()
    setError("")

    fetch("http://localhost/online-dtr-api/auth/login.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    })
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          setError(data.error)
          return
        }

        // 🔒 ADMIN ONLY
        if (data.user.role !== "admin") {
          setError("Unauthorized access")
          return
        }

        // SAVE ADMIN SESSION
        localStorage.setItem("user", JSON.stringify(data.user))
        localStorage.setItem("role", "admin")

        navigate("/admin")
      })
      .catch(() => {
        setError("Server error. Please try again.")
      })
  }

  return (
    <div className="flex justify-center items-center min-h-screen via-gray-900 to-black bg-linear-to-br from-slate-900">
      <div className="p-8 w-full max-w-md rounded-2xl border-2 border-violet-600 shadow-2xl bg-slate-950">

        <div className="mb-8 text-center">
          <h1 className="text-3xl font-extrabold text-violet-600">
            Admin Login
          </h1>
          <p className="mt-2 text-sm text-violet-600">
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
              className="px-4 py-3 w-full text-white rounded-xl border border-violet-600"
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
              className="px-4 py-3 w-full text-white rounded-xl border border-violet-600"
              required
            />
          </div>

          <button
            type="submit"
            className="py-3 w-full font-semibold text-white bg-violet-600 rounded-xl hover:bg-violet-700"
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  )
}
