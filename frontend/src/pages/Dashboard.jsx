import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts"

const chartData = [
  { month: "Jan", income: 4500000, expense: 1800000 },
  { month: "Feb", income: 5200000, expense: 2100000 },
  { month: "Mar", income: 4800000, expense: 1700000 },
  { month: "Apr", income: 6100000, expense: 2300000 },
  { month: "May", income: 5700000, expense: 1900000 },
  { month: "Jun", income: 7000000, expense: 1750000 },
]

const expenseCategoryData = [
  { name: "Food", value: 35 },
  { name: "Transport", value: 20 },
  { name: "Bills", value: 18 },
  { name: "Shopping", value: 15 },
  { name: "Other", value: 12 },
]

const categoryColors = [
  "#2563eb",
  "#16a34a",
  "#dc2626",
  "#d97706",
  "#64748b",
]

const recentTransactions = [
  {
    id: 1,
    title: "Monthly Salary",
    type: "Income",
    date: "Jun 28, 2026",
    amount: 7000000,
  },
  {
    id: 2,
    title: "Food & Drinks",
    type: "Expense",
    date: "Jun 27, 2026",
    amount: 75000,
  },
  {
    id: 3,
    title: "Transportation",
    type: "Expense",
    date: "Jun 26, 2026",
    amount: 50000,
  },
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
        <article className="summary-card summary-card-balance">
          <p className="summary-label">Total Balance</p>
          <h2>Rp 5.250.000</h2>
        </article>

        <article className="summary-card summary-card-income">
          <p className="summary-label">Income</p>
          <h2>Rp 7.000.000</h2>
        </article>

        <article className="summary-card summary-card-expense">
          <p className="summary-label">Expense</p>
          <h2>Rp 1.750.000</h2>
        </article>
      </div>

      {/* Financial Overview */}
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
            <AreaChart
              data={chartData}
              margin={{
                top: 10,
                right: 10,
                left: 0,
                bottom: 0,
              }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
              />

              <XAxis
                dataKey="month"
                tickLine={false}
                axisLine={false}
              />

              <YAxis
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) =>
                  `${value / 1000000}M`
                }
              />

              <Tooltip
                formatter={(value) =>
                  `Rp ${Number(value).toLocaleString("id-ID")}`
                }
              />

              <Area
                type="monotone"
                dataKey="income"
                name="Income"
                stroke="#16a34a"
                fill="#16a34a"
                fillOpacity={0.08}
                strokeWidth={2}
              />

              <Area
                type="monotone"
                dataKey="expense"
                name="Expense"
                stroke="#dc2626"
                fill="#dc2626"
                fillOpacity={0.06}
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Expense by Category */}
      <div className="category-card">
        <div className="category-header">
          <div>
            <h2>Expense by Category</h2>

            <p>
              Distribution of your expenses by category.
            </p>
          </div>
        </div>

        <div className="category-chart-container">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={expenseCategoryData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="45%"
                innerRadius={75}
                outerRadius={115}
                paddingAngle={2}
              >
                {expenseCategoryData.map((entry, index) => (
                  <Cell
                    key={`cell-${entry.name}`}
                    fill={categoryColors[index]}
                  />
                ))}
              </Pie>

              <Tooltip
                formatter={(value) => `${value}%`}
              />

              <Legend
                verticalAlign="bottom"
                height={36}
              />
            </PieChart>
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
          {recentTransactions.map((transaction) => (
            <div
              className="transaction-item"
              key={transaction.id}
            >
              <div>
                <h3>{transaction.title}</h3>

                <p>
                  {transaction.type} · {transaction.date}
                </p>
              </div>

              <span
                className={
                  transaction.type === "Income"
                    ? "transaction-income"
                    : "transaction-expense"
                }
              >
                {transaction.type === "Income" ? "+" : "-"} Rp{" "}
                {transaction.amount.toLocaleString("id-ID")}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Dashboard