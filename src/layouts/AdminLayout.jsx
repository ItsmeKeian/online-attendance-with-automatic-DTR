import { NavLink, Outlet, useNavigate } from "react-router-dom"
import { useEffect, useRef, useState } from "react"

export default function AdminLayout() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "dark")

  const dropdownRef = useRef(null)
  const sidebarRef = useRef(null)

  const navigate = useNavigate()

  // AUTH CHECK
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"))

    if (!user || user.role !== "admin") {
      navigate("/admin/login", { replace: true })
    }
  }, [navigate])

  // THEME APPLY
  useEffect(() => {
    const root = document.documentElement

    if (theme === "dark") root.classList.add("dark")
    else root.classList.remove("dark")

    localStorage.setItem("theme", theme)
  }, [theme])

  // CLICK OUTSIDE (DROPDOWN + SIDEBAR)
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsDropdownOpen(false)
      }

      if (sidebarRef.current && !sidebarRef.current.contains(e.target)) {
        setIsSidebarOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  function handleLogout() {
    localStorage.removeItem("user")
    localStorage.removeItem("role")
    window.location.href = "/admin/login"
  }

  function handleToggleTheme() {
    const newTheme = theme === "dark" ? "light" : "dark"
    setTheme(newTheme)

    setIsDropdownOpen(false)
    window.dispatchEvent(new Event("themeChanged"))
  }

  const navLinks = [
    { to: "/admin", label: "Dashboard", end: true },
    { to: "/admin/employees", label: "Employees" },
    { to: "/admin/attendance", label: "Attendance Records" },
    { to: "/admin/profile", label: "Settings" },
  ]

  return (
    <div className="min-h-screen to-indigo-200 bg-linear-to-br from-slate-100 via-slate-200 text-slate-900 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950 dark:text-slate-200 print:bg-white print:text-black">

      {/* MOBILE OVERLAY */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 md:hidden"></div>
      )}

      {/* SIDEBAR */}
      <aside
        ref={sidebarRef}
        className={`
          fixed top-0 left-0 z-50 h-screen w-64 border-r backdrop-blur
          bg-white/60 border-black/10 dark:bg-slate-950/70 dark:border-white/5
          transform transition-transform duration-300 ease-in-out
          print:hidden
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
        `}
      >
        <div className="px-6 py-5 text-xl font-semibold tracking-wide">
          Admin Panel
        </div>

        <nav className="px-3 space-y-1">
          {navLinks.map(({ to, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={() => setIsSidebarOpen(false)}
              className={({ isActive }) =>
                `block px-4 py-2 rounded-lg transition relative
                ${
                  isActive
                    ? "bg-black/10 text-black before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:h-6 before:w-1 before:bg-purple-500 before:rounded-full dark:bg-white/10 dark:text-white"
                    : "hover:bg-black/5 text-slate-700 dark:hover:bg-white/5 dark:text-slate-300"
                }`
              }
            >
              {label}
            </NavLink>
          ))}

          <button
            onClick={handleLogout}
            className="px-4 py-2 mt-6 w-full text-left text-red-500 rounded-lg hover:bg-red-500/10"
          >
            Logout
          </button>
        </nav>
      </aside>

      {/* MAIN WRAPPER */}
      <div className="flex flex-col min-h-screen md:ml-64 print:ml-0">

        {/* HEADER */}
<header className="flex fixed top-0 right-0 left-0 z-30 justify-between items-center px-4 h-16 border-b backdrop-blur md:justify-end md:px-10 bg-white/40 border-black/10 dark:bg-slate-950/30 dark:border-white/5 md:left-64 print:hidden">

  {/* MOBILE ONLY: SIDEBAR BUTTON (LEFT) */}
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="flex justify-center items-center w-10 h-10 rounded-lg border md:hidden border-black/10 bg-white/70 hover:bg-white dark:bg-slate-950/50 dark:border-white/10 dark:hover:bg-slate-900"
          >
            ☰
          </button>

              {/* RIGHT SIDE BUTTONS */}
              <div className="flex gap-3 items-center">

                {/* SETTINGS DROPDOWN BUTTON */}
                <div ref={dropdownRef} className="relative">
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex justify-center items-center w-10 h-10 rounded-lg border shadow-sm border-black/10 bg-white/70 hover:bg-white dark:bg-slate-950/50 dark:border-white/10 dark:hover:bg-slate-900"
                  >
                    {/* MOBILE ICON */}
                    <span className="text-lg leading-none md:hidden">⚙</span>

                    {/* DESKTOP ICON */}
                    <span className="hidden text-lg leading-none md:inline">☰</span>
                  </button>

                  {isDropdownOpen && (
                    <div className="overflow-hidden absolute right-0 z-50 mt-2 w-52 bg-white rounded-xl border shadow-lg border-black/10 dark:border-white/10 dark:bg-slate-950">

                      <button
                        
                        className="px-4 py-3 w-full text-sm text-left hover:bg-black/5 dark:hover:bg-white/5"
                      >
                        Settings
                      </button>

                      <button
                        onClick={handleToggleTheme}
                        className="px-4 py-3 w-full text-sm text-left hover:bg-black/5 dark:hover:bg-white/5"
                      >
                        {theme === "dark" ? "Light Mode" : "Dark Mode"}
                      </button>

                      <button
                        onClick={handleLogout}
                        className="px-4 py-3 w-full text-sm text-left text-red-500 hover:bg-red-500/10"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>

  </div>
</header>



        {/* CONTENT */}
        <main className="overflow-y-auto flex-1 px-4 pt-20 pb-10 md:px-10 print:overflow-visible print:p-0 print:pt-0 print:pb-0">
          <Outlet />
        </main>

      </div>
    </div>
  )
}
