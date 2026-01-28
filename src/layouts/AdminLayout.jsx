import { NavLink, Outlet } from "react-router-dom"

export default function AdminLayout() {
  return (
    <div className="flex min-h-screen bg-linear-to-br from-slate-950 via-slate-900 to-indigo-950 text-slate-200">

      {/* SIDEBAR */}
      <aside className="w-64 border-r backdrop-blur bg-slate-950/80 border-white/5">
        <div className="px-6 py-6 text-xl font-semibold tracking-wide">
          Admin Panel
        </div>

        <nav className="px-3 space-y-1">
          {[
            { to: "/admin", label: "Dashboard", end: true },
            { to: "/admin/employees", label: "Employees" },
            { to: "/admin/attendance", label: "Attendance Records" },
            { to: "/admin/profile", label: "Profile" },
          ].map(({ to, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `block px-4 py-2 rounded-lg transition relative
                ${
                  isActive
                    ? "bg-white/10 text-white before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:h-6 before:w-1 before:bg-purple-500 before:rounded-full"
                    : "hover:bg-white/5 text-slate-300"
                }`
              }
            >
              {label}
            </NavLink>

            
          ))}

         

          

          <button
            onClick={() => {
              localStorage.clear()
              window.location.href = "/admin/"
            }}
            className="px-4 py-2 mt-6 w-full text-left text-red-400 rounded-lg hover:bg-red-500/10"
          >
            Logout
          </button>
        </nav>
      </aside>

      {/* CONTENT */}
      <main className="flex-1 p-10">
        <Outlet />
      </main>
    </div>
  )
}
