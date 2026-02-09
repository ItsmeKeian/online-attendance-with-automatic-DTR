import { NavLink, Outlet } from "react-router-dom"
import { useEffect, useRef, useState } from "react"

export default function AdminLayout() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "dark")
  const dropdownRef = useRef(null)

  useEffect(() => {
    const root = document.documentElement

    if (theme === "dark") root.classList.add("dark")
    else root.classList.remove("dark")

    localStorage.setItem("theme", theme)
  }, [theme])

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsDropdownOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  function handleLogout() {
    localStorage.clear()
    window.location.href = "/admin/"
  }

  function handleToggleTheme() {
    const newTheme = theme === "dark" ? "light" : "dark"
    setTheme(newTheme)

    // AUTO HIDE MENU AFTER CLICK
    setIsDropdownOpen(false)

    // 🔥 IMPORTANT: notify other pages (dashboard) instantly
    window.dispatchEvent(new Event("themeChanged"))
  }

  return (
    <div className="min-h-screen to-indigo-200 bg-linear-to-br from-slate-100 via-slate-200 text-slate-900 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950 dark:text-slate-200 print:bg-white print:text-black">

      {/* SIDEBAR (FIXED) */}
      <aside className="fixed top-0 left-0 z-40 w-64 h-screen border-r backdrop-blur bg-white/60 border-black/10 dark:bg-slate-950/70 dark:border-white/5 print:hidden">
        <div className="px-6 py-5 text-xl font-semibold tracking-wide">
          Admin Panel
        </div>

        <nav className="px-3 space-y-1">
          {[
            { to: "/admin", label: "Dashboard", end: true },
            { to: "/admin/employees", label: "Employees" },
            { to: "/admin/attendance", label: "Attendance Records" },
            { to: "/admin/profile", label: "Settings" },
          ].map(({ to, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
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
      <div className="flex flex-col ml-64 min-h-screen print:ml-0">

        {/* HEADER (FIXED) */}
        <header className="flex fixed top-0 right-0 left-64 z-30 justify-between items-center px-10 h-16 border-b backdrop-blur bg-white/40 border-black/10 dark:bg-slate-950/30 dark:border-white/5 print:hidden">

          <div className="text-sm text-slate-600 dark:text-slate-400">
            {/* Future breadcrumb/title */}
          </div>

          <div className="flex gap-4 items-center">
            <div ref={dropdownRef} className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex gap-2 items-center px-4 py-2 rounded-lg border shadow-sm border-black/10 bg-white/70 hover:bg-white dark:bg-slate-950/50 dark:border-white/10 dark:hover:bg-slate-900"
              >
                <span className="text-lg leading-none">☰</span>
              </button>

              {isDropdownOpen && (
                <div className="overflow-hidden absolute right-0 z-50 mt-2 w-52 bg-white rounded-xl border shadow-lg border-black/10 dark:border-white/10 dark:bg-slate-950">

                  <button className="px-4 py-3 w-full text-sm text-left hover:bg-black/5 dark:hover:bg-white/5">
                    Settings
                  </button>

                  <button
                    className="px-4 py-3 w-full text-sm text-left hover:bg-black/5 dark:hover:bg-white/5"
                    onClick={handleToggleTheme}
                  >
                    {theme === "dark" ? "Light Mode" : "Dark Mode"}
                  </button>

                  <button
                    className="px-4 py-3 w-full text-sm text-left text-red-500 hover:bg-red-500/10"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>

                </div>
              )}
            </div>
          </div>
        </header>

        {/* CONTENT */}
        <main className="overflow-y-auto flex-1 px-10 pt-20 pb-10 print:overflow-visible print:p-0 print:pt-0 print:pb-0">
          <Outlet />
        </main>

      </div>
    </div>
  )
}
