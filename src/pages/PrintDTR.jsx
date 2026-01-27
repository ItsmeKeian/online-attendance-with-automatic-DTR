// =========================
// PRINT DTR – FORM 48
// =========================

function getMonthLabel(records) {
  if (!records || records.length === 0) return "____________"

  const date = new Date(records[0].date)
  return date.toLocaleString("en-US", {
    month: "long",
    year: "numeric",
  })
}

export default function DTRPrint({ records, department }) {
  const monthLabel = getMonthLabel(records)

  // =========================
  // GROUP RECORDS
  // =========================
  const grouped = records.reduce((acc, row) => {
    const day = new Date(row.date).getDate()

    if (!acc[row.employee_id]) {
      acc[row.employee_id] = {
        name: row.full_name,
        department: row.department,
        records: {},
      }
    }

    acc[row.employee_id].records[day] = row
    return acc
  }, {})

  const employees = Object.values(grouped)

  // =========================
  // 2 FORMS PER PAGE
  // =========================
  const pages = []
  for (let i = 0; i < employees.length; i += 2) {
    pages.push(employees.slice(i, i + 2))
  }

  return (
    <div className="print-area hidden print:block">
      {pages.map((pair, pageIndex) => (
        <div key={pageIndex} className="print-page">
          <div className="print-grid">
            {pair.map((emp, idx) => (
              <DTRForm
                key={idx}
                employee={emp}
                department={department}
                monthLabel={monthLabel}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

// =========================
// SINGLE FORM 48
// =========================
function DTRForm({ employee, department, monthLabel }) {
  return (
    <div className="dtr-form">
      <h2 className="text-center font-bold">
        Civil Service Form No. 48
      </h2>
      <h3 className="text-center font-bold mb-2">
        DAILY TIME RECORD
      </h3>

      <div className="text-xs mb-2">
        <p>
          Name: <strong>{employee.name}</strong>
        </p>
        <p>
          For the month of: <strong>{monthLabel}</strong>
        </p>
        <p>
          Department: {department || employee.department}
        </p>
      </div>

      <table className="dtr-table">
        <thead>
          <tr>
            <th rowSpan="2">Day</th>
            <th colSpan="2">A.M.</th>
            <th colSpan="2">P.M.</th>
            <th colSpan="2">Undertime</th>
          </tr>
          <tr>
            <th>In</th>
            <th>Out</th>
            <th>In</th>
            <th>Out</th>
            <th>Hours</th>
            <th>Min</th>
          </tr>
        </thead>

        <tbody>
          {Array.from({ length: 31 }, (_, i) => {
            const day = i + 1
            const r = employee.records[day] || {}

            return (
              <tr key={day}>
                <td>{day}</td>
                <td>{r.time_in || ""}</td>
                <td>{r.lunch_out || ""}</td>
                <td>{r.lunch_in || ""}</td>
                <td>{r.time_out || ""}</td>
                <td></td>
                <td></td>
              </tr>
            )
          })}
        </tbody>
      </table>

      <div className="dtr-footer">
        <p>
          I certify on my honor that the above is a true and correct report
          of the hours of work performed.
        </p>

        <div className="mt-4 text-center">
          <p>__________________________</p>
          <p>Employee Signature</p>
        </div>
      </div>
    </div>
  )
}
