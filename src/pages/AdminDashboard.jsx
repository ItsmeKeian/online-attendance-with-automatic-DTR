import { useEffect, useState } from "react"

export default function AdminDashboard() {
  const [stats, setStats] = useState(null)

  useEffect(() => {
    fetch("http://localhost/online-dtr-api/admin/dashboard_stats.php")
      .then(res => res.json())
      .then(data => setStats(data))
  }, [])

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-white">
          Admin Dashboard
        </h1>
        <p className="mt-1 text-sm text-slate-400">
          System overview and daily attendance summary
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <StatCard
          label="Total Employees"
          value={stats?.totalEmployees ?? "—"}
        />
        <StatCard
          label="Present Today"
          value={stats?.presentToday ?? "—"}
          color="text-emerald-400"
        />
        <StatCard
          label="Absent Today"
          value={stats?.absentToday ?? "—"}
          color="text-rose-400"
        />
      </div>
    </div>
  )
}

function StatCard({ label, value, color = "text-white" }) {
  return (
    <div className="p-6 rounded-xl border backdrop-blur bg-white/5 border-white/10">
      <p className="text-sm text-slate-400">{label}</p>
      <p className={`mt-3 text-3xl font-semibold ${color}`}>
        {value}
      </p>
    </div>
  )
}
