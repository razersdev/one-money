import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts"

const chartData = [
  { month: "Jan", income: 4500000, expense: 1800000 },
  { month: "Feb", income: 5200000, expense: 2100000 },
  { month: "Mar", income: 4800000, expense: 1700000 },
  { month: "Apr", income: 6100000, expense: 2300000 },
  { month: "May", income: 5700000, expense: 1900000 },
  { month: "Jun", income: 7000000, expense: 1750000 },
]

function Dashboard() {
  return (
    <section className="dashboard">
      {/* Dashboard Header */}
      <div className="dashboard-header">
        <div>
          <p className="dashboard-eyebrow">Overview</p>

          <h1>Dashboard</h1>

          <p className="dashboard-subtitle">
            Here's your financial overview.
          </p>
        </div>

        <button className="dashboard-action">
          Add Transaction
        </button>
      </div>

      {/* Summary Cards */}
      <div className="summary-grid">
        <article className="summary-card">
          <p className="summary-label">Total Balance</p>
          <h2>Rp 5.250.000</h2>
        </article>

        <article className="summary-card">
          <p className="summary-label">Income</p>
          <h2>Rp 7.000.000</h2>
        </article>

        <article className="summary-card">
          <p className="summary-label">Expense</p>
          <h2>Rp 1.750.000</h2>
        </article>
      </div>

      {/* Financial Chart */}
      <div className="chart-card">
        <div className="chart-header">
          <div>
            <h2>Financial Overview</h2>

            <p>
              Income and expenses over the last 6 months.
            </p>
          </div>
        </div>

        <div className="chart-container">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />

              <XAxis dataKey="month" />

              <YAxis />

              <Tooltip />

              <Area
                type="monotone"
                dataKey="income"
                stroke="#334155"
                fill="#334155"
                fillOpacity={0.08}
              />

              <Area
                type="monotone"
                dataKey="expense"
                stroke="#94a3b8"
                fill="#94a3b8"
                fillOpacity={0.08}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="transactions-card">
        <div className="transactions-header">
          <div>
            <h2>Recent Transactions</h2>

            <p>
              Your latest financial activity.
            </p>
          </div>

          <button className="view-all-button">
            View All
          </button>
        </div>

        <div className="transaction-list">
          <div className="transaction-item">
            <div>
              <h3>Monthly Salary</h3>
              <p>Income · Jun 28, 2026</p>
            </div>

            <span className="transaction-income">
              + Rp 7.000.000
            </span>
          </div>

          <div className="transaction-item">
            <div>
              <h3>Food & Drinks</h3>
              <p>Expense · Jun 27, 2026</p>
            </div>

            <span className="transaction-expense">
              - Rp 75.000
            </span>
          </div>

          <div className="transaction-item">
            <div>
              <h3>Transportation</h3>
              <p>Expense · Jun 26, 2026</p>
            </div>

            <span className="transaction-expense">
              - Rp 50.000
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Dashboard