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
        <p className="text-sm text-slate-400 mt-1">
          System overview and daily attendance summary
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
    <div className="rounded-xl bg-white/5 border border-white/10 p-6 backdrop-blur">
      <p className="text-sm text-slate-400">{label}</p>
      <p className={`mt-3 text-3xl font-semibold ${color}`}>
        {value}
      </p>
    </div>
  )
}
