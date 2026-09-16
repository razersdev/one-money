import { useState } from "react"

function Budgets() {
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)

  const [budgets, setBudgets] = useState([
    {
      id: 1,
      name: "Food",
      amount: 1000000,
      spent: 650000,
      period: "Monthly",
    },
    {
      id: 2,
      name: "Transport",
      amount: 500000,
      spent: 275000,
      period: "Monthly",
    },
    {
      id: 3,
      name: "Shopping",
      amount: 750000,
      spent: 600000,
      period: "Monthly",
    },
  ])

  const [formData, setFormData] = useState({
    name: "",
    amount: "",
    period: "Monthly",
  })

  const handleChange = (event) => {
    const { name, value } = event.target

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }))
  }

  const resetForm = () => {
    setFormData({
      name: "",
      amount: "",
      period: "Monthly",
    })

    setEditingId(null)
    setShowForm(false)
  }

  const handleAddBudget = () => {
    setEditingId(null)

    setFormData({
      name: "",
      amount: "",
      period: "Monthly",
    })

    setShowForm(true)
  }

  const handleEdit = (budget) => {
    setEditingId(budget.id)

    setFormData({
      name: budget.name,
      amount: budget.amount,
      period: budget.period,
    })

    setShowForm(true)
  }

  const handleDelete = (id) => {
    setBudgets((previous) =>
      previous.filter((budget) => budget.id !== id)
    )
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    const amount = Number(formData.amount)

    if (editingId !== null) {
      setBudgets((previous) =>
        previous.map((budget) =>
          budget.id === editingId
            ? {
                ...budget,
                name: formData.name,
                amount,
                period: formData.period,
              }
            : budget
        )
      )
    } else {
      const newBudget = {
        id: Date.now(),
        name: formData.name,
        amount,
        spent: 0,
        period: formData.period,
      }

      setBudgets((previous) => [
        ...previous,
        newBudget,
      ])
    }

    resetForm()
  }

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(value)
  }

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Budgets</h1>
          <p>Manage your spending limits.</p>
        </div>

        <button
          className="primary-button"
          onClick={handleAddBudget}
        >
          + Add Budget
        </button>
      </div>

      {showForm && (
        <div className="transaction-form-card">
          <div className="form-header">
            <div>
              <h2>
                {editingId !== null
                  ? "Edit Budget"
                  : "Add Budget"}
              </h2>

              <p>
                {editingId !== null
                  ? "Update your budget."
                  : "Create a new spending budget."}
              </p>
            </div>

            <button
              type="button"
              onClick={resetForm}
            >
              ×
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">
                Budget Name
              </label>

              <input
                id="name"
                name="name"
                type="text"
                placeholder="e.g. Food"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="amount">
                Budget Amount
              </label>

              <input
                id="amount"
                name="amount"
                type="number"
                min="1"
                placeholder="e.g. 1000000"
                value={formData.amount}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="period">
                Period
              </label>

              <select
                id="period"
                name="period"
                value={formData.period}
                onChange={handleChange}
              >
                <option value="Monthly">
                  Monthly
                </option>

                <option value="Weekly">
                  Weekly
                </option>

                <option value="Yearly">
                  Yearly
                </option>
              </select>
            </div>

            <div className="form-actions">
              <button
                type="button"
                onClick={resetForm}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="primary-button"
              >
                {editingId !== null
                  ? "Save Changes"
                  : "Add Budget"}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="budget-grid">
        {budgets.map((budget) => {
          const percentage =
            budget.amount > 0
              ? Math.min(
                  (budget.spent / budget.amount) * 100,
                  100
                )
              : 0

          const remaining =
            budget.amount - budget.spent

          return (
            <div
              className="budget-card"
              key={budget.id}
            >
              <div className="budget-card-header">
                <div>
                  <h3>{budget.name}</h3>
                  <p>{budget.period}</p>
                </div>

                <div className="budget-actions">
                  <button
                    type="button"
                    onClick={() => handleEdit(budget)}
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      handleDelete(budget.id)
                    }
                  >
                    Delete
                  </button>
                </div>
              </div>

              <div className="budget-amount">
                <strong>
                  {formatCurrency(budget.spent)}
                </strong>

                <span>
                  of {formatCurrency(budget.amount)}
                </span>
              </div>

              <div className="budget-progress">
                <div
                  className="budget-progress-bar"
                  style={{
                    width: `${percentage}%`,
                  }}
                />
              </div>

              <div className="budget-status">
                <span>
                  {Math.round(percentage)}% used
                </span>

                <span>
                  {formatCurrency(
                    Math.max(remaining, 0)
                  )}{" "}
                  remaining
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default Budgets