import { useEffect, useState } from "react"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend,
  AreaChart,
  Area
} from "recharts"

export default function AdminDashboard() {
  const [stats, setStats] = useState(null)
  const [chartData, setChartData] = useState([])
  const [deptData, setDeptData] = useState([])
  const [monthlyData, setMonthlyData] = useState([])

  // REACTIVE THEME DETECTOR
  const [isDark, setIsDark] = useState(
    document.documentElement.classList.contains("dark")
  )

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains("dark"))
    })

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"]
    })

    return () => observer.disconnect()
  }, [])

  // Theme colors for recharts
  const gridColor = isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)"
  const axisColor = isDark ? "#94a3b8" : "#334155"
  const tooltipBg = isDark ? "#0f172a" : "#ffffff"
  const tooltipText = isDark ? "#e2e8f0" : "#0f172a"
  const tooltipBorder = isDark ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.12)"

  useEffect(() => {
    fetch("http://localhost/online-dtr-api/admin/dashboard_stats.php")
      .then(res => res.json())
      .then(data => setStats(data))
  }, [])

  useEffect(() => {
    fetch("http://localhost/online-dtr-api/admin/dashboard_chart.php")
      .then(res => res.json())
      .then(data => setChartData(data))
  }, [])

  useEffect(() => {
    fetch("http://localhost/online-dtr-api/admin/dashboard_department_chart.php")
      .then(res => res.json())
      .then(data => setDeptData(data))
  }, [])

  useEffect(() => {
    fetch("http://localhost/online-dtr-api/admin/dashboard_monthly_chart.php")
      .then(res => res.json())
      .then(data => setMonthlyData(data))
  }, [])

  const pieData = [
    { name: "Present", value: Number(stats?.presentToday || 0) },
    { name: "Absent", value: Number(stats?.absentToday || 0) }
  ]

  const pieColors = ["#38bdf8", "#a855f7"]


  const tooltipStyle = {
    backgroundColor: tooltipBg,
    border: `1px solid ${tooltipBorder}`,
    borderRadius: "12px",
    color: tooltipText,
    fontSize: "13px",
    padding: "10px 12px"
  }

  return (
    <div>
      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">
          Admin Dashboard
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          System overview and daily attendance summary
        </p>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 gap-6 mb-10 md:grid-cols-3">
        <StatCard label="Total Employees" value={stats?.totalEmployees ?? "—"} />
        <StatCard
          label="Present Today"
          value={stats?.presentToday ?? "—"}
          color="text-emerald-500 dark:text-emerald-400"
        />
        <StatCard
          label="Absent Today"
          value={stats?.absentToday ?? "—"}
          color="text-rose-500 dark:text-rose-400"
        />
      </div>

      {/* CHARTS GRID */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Attendance Trend (Line) */}
        <div className="p-6 rounded-xl border backdrop-blur lg:col-span-2 bg-white/70 border-black/10 dark:bg-white/5 dark:border-white/10">
          <h2 className="mb-1 text-lg font-semibold text-slate-900 dark:text-white">
          Attendance Summary (7 Days)
          </h2>
          <p className="mb-6 text-sm text-slate-500 dark:text-slate-400">
            Daily present employees overview
          </p>

          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                <XAxis dataKey="date" stroke={axisColor} />
                <YAxis stroke={axisColor} allowDecimals={false} />
                <Tooltip contentStyle={tooltipStyle} />
                <Line
                  type="monotone"
                  dataKey="presentCount"
                  stroke="#a855f7"
                  strokeWidth={3}
                  dot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Department Bar Chart */}
        <div className="p-6 rounded-xl border backdrop-blur bg-white/70 border-black/10 dark:bg-white/5 dark:border-white/10">
          <h2 className="mb-1 text-lg font-semibold text-slate-900 dark:text-white">
            Employees by Department
          </h2>
          <p className="mb-6 text-sm text-slate-500 dark:text-slate-400">
            Total employees per department
          </p>

          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={deptData}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                <XAxis dataKey="department" stroke={axisColor} />
                <YAxis stroke={axisColor} allowDecimals={false} />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar dataKey="total" fill="#a855f7" radius={[6, 6, 0, 0]} />

              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Monthly Attendance (Area Chart) */}
        <div className="p-6 rounded-xl border backdrop-blur lg:col-span-2 bg-white/70 border-black/10 dark:bg-white/5 dark:border-white/10">
          <h2 className="mb-1 text-lg font-semibold text-slate-900 dark:text-white">
            Monthly Attendance
          </h2>
          <p className="mb-6 text-sm text-slate-500 dark:text-slate-400">
            Present employees per month
          </p>

          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                <XAxis dataKey="month" stroke={axisColor} />
                <YAxis stroke={axisColor} allowDecimals={false} />
                <Tooltip contentStyle={tooltipStyle} />
                <Area
                  type="monotone"
                  dataKey="presentCount"
                  stroke="#a855f7"
                  fill="rgba(168,85,247,0.25)"
                  strokeWidth={3}
                />

              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Attendance Today (Pie) */}
        <div className="p-6 rounded-xl border backdrop-blur bg-white/70 border-black/10 dark:bg-white/5 dark:border-white/10">
          <h2 className="mb-1 text-lg font-semibold text-slate-900 dark:text-white">
            Attendance Today
          </h2>
          <p className="mb-6 text-sm text-slate-500 dark:text-slate-400">
            Present & Absent
          </p>

          <div className="flex justify-center items-center h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={4}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={index} fill={pieColors[index]} />
                  ))}
                </Pie>

                <Tooltip
                  contentStyle={tooltipStyle}
                  labelStyle={{ color: tooltipText }}
                  itemStyle={{ color: tooltipText }}
                />

                <Legend
                  wrapperStyle={{
                    color: axisColor
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  )
}

function StatCard({ label, value, color = "text-slate-900 dark:text-white" }) {
  return (
    <div className="p-6 rounded-xl border backdrop-blur bg-white/70 border-black/10 dark:bg-white/5 dark:border-white/10">
      <p className="text-sm text-slate-500 dark:text-slate-400">{label}</p>
      <p className={`mt-3 text-3xl font-semibold ${color}`}>{value}</p>
    </div>
  )
}
