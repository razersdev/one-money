import { useEffect, useState } from "react"
import api from "../services/api"

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


const categoryColors = [
  "#2563eb",
  "#16a34a",
  "#dc2626",
  "#d97706",
  "#64748b",
]


function Dashboard() {
  const [dashboardData, setDashboardData] = useState({
    total_income: 0,
    total_expense: 0,
    balance: 0,
    expense_by_category: {},
    financial_overview: [],
  })

  const [recentTransactions, setRecentTransactions] = useState([])

  const [loading, setLoading] = useState(true)

  const [error, setError] = useState("")


  useEffect(() => {
    async function fetchDashboard() {
      try {
        setLoading(true)
        setError("")

        const response = await api.get("/dashboard")

        console.log(
          "Dashboard response:",
          response.data
        )

        setDashboardData(response.data.data)

      } catch (error) {
        console.error(
          "Dashboard request failed:",
          error
        )

        if (error.response) {
          const detail =
            error.response.data?.detail

          if (typeof detail === "string") {
            setError(detail)
          } else {
            setError(
              "Failed to load dashboard."
            )
          }
        } else {
          setError(
            "Unable to connect to the server."
          )
        }
      } finally {
        setLoading(false)
      }
    }


    async function fetchRecentTransactions() {
      try {
        const response = await api.get(
          "/transactions"
        )

        console.log(
          "Transactions response:",
          response.data
        )

        const transactions =
          response.data.data || []

        setRecentTransactions(
          transactions.slice(0, 3)
        )

      } catch (error) {
        console.error(
          "Transactions request failed:",
          error
        )
      }
    }


    fetchDashboard()
    fetchRecentTransactions()

  }, [])


  const expenseCategoryData =
    Object.entries(
      dashboardData.expense_by_category
    ).map(([name, value]) => ({
      name,
      value,
    }))


  return (
    <section className="dashboard">

      {/* Dashboard Header */}

      <div className="dashboard-header">

        <div>

          <p className="dashboard-eyebrow">
            Overview
          </p>

          <h1>
            Dashboard
          </h1>

          <p className="dashboard-subtitle">
            Here's your financial overview.
          </p>

        </div>


        <button className="dashboard-action">
          Add Transaction
        </button>

      </div>


      {/* Error */}

      {error && (
        <div
          className="auth-error"
          role="alert"
        >
          {error}
        </div>
      )}


      {/* Summary Cards */}

      <div className="summary-grid">

        <article className="summary-card summary-card-balance">

          <p className="summary-label">
            Total Balance
          </p>

          <h2>
            {loading
              ? "Loading..."
              : `Rp ${Number(
                  dashboardData.balance
                ).toLocaleString("id-ID")}`}
          </h2>

        </article>


        <article className="summary-card summary-card-income">

          <p className="summary-label">
            Income
          </p>

          <h2>
            {loading
              ? "Loading..."
              : `Rp ${Number(
                  dashboardData.total_income
                ).toLocaleString("id-ID")}`}
          </h2>

        </article>


        <article className="summary-card summary-card-expense">

          <p className="summary-label">
            Expense
          </p>

          <h2>
            {loading
              ? "Loading..."
              : `Rp ${Number(
                  dashboardData.total_expense
                ).toLocaleString("id-ID")}`}
          </h2>

        </article>

      </div>


      {/* Financial Overview */}

      <div className="chart-card">

        <div className="chart-header">

          <div>

            <h2>
              Financial Overview
            </h2>

            <p>
              Income and expenses over the last 6 months.
            </p>

          </div>

        </div>


        <div className="chart-container">

          <ResponsiveContainer
            width="100%"
            height="100%"
          >

            <AreaChart
              data={
                dashboardData.financial_overview
              }
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
                  `Rp ${Number(
                    value
                  ).toLocaleString(
                    "id-ID"
                  )}`
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

            <h2>
              Expense by Category
            </h2>

            <p>
              Distribution of your expenses by category.
            </p>

          </div>

        </div>


        <div className="category-chart-container">

          <ResponsiveContainer
            width="100%"
            height="100%"
          >

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

                {expenseCategoryData.map(
                  (entry, index) => (
                    <Cell
                      key={`cell-${entry.name}`}
                      fill={
                        categoryColors[
                          index %
                          categoryColors.length
                        ]
                      }
                    />
                  )
                )}

              </Pie>


              <Tooltip
                formatter={(value) =>
                  `Rp ${Number(
                    value
                  ).toLocaleString(
                    "id-ID"
                  )}`
                }
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

            <h2>
              Recent Transactions
            </h2>

            <p>
              Your latest financial activity.
            </p>

          </div>


          <button className="view-all-button">
            View All
          </button>

        </div>


        <div className="transaction-list">

          {recentTransactions.length === 0 ? (

            <p>
              No transactions yet.
            </p>

          ) : (

            recentTransactions.map(
              (transaction) => {

                const isIncome =
                  transaction.type.toLowerCase() ===
                  "income"

                return (

                  <div
                    className="transaction-item"
                    key={transaction.id}
                  >

                    <div>

                      <h3>
                        {transaction.description}
                      </h3>

                      <p>
                        {isIncome
                          ? "Income"
                          : "Expense"}{" "}
                        ·{" "}
                        {transaction.category}
                      </p>

                    </div>


                    <span
                      className={
                        isIncome
                          ? "transaction-income"
                          : "transaction-expense"
                      }
                    >

                      {isIncome
                        ? "+"
                        : "-"}{" "}

                      Rp{" "}

                      {Number(
                        transaction.amount
                      ).toLocaleString(
                        "id-ID"
                      )}

                    </span>

                  </div>

                )
              }
            )

          )}

        </div>

      </div>

    </section>
  )
}


export default Dashboard