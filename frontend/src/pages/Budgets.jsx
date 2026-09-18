import { useEffect, useState } from "react"
import api from "../services/api"

function Budgets() {
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)

  const [budgets, setBudgets] = useState([])
  const [categories, setCategories] = useState([])

  const [formData, setFormData] = useState({
    category_id: "",
    amount: "",
  })

  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  // =========================
  // GET BUDGETS
  // =========================

  const fetchBudgets = async () => {
    try {
      const response = await api.get("/budgets")

      setBudgets(response.data.data)
    } catch (error) {
      console.error(error)

      setError(
        error.response?.data?.detail ||
          "Gagal mengambil data budget."
      )
    }
  }

  // =========================
  // GET CATEGORIES
  // =========================

  const fetchCategories = async () => {
    try {
      const response = await api.get("/categories")

      setCategories(response.data.data)
    } catch (error) {
      console.error(error)

      setError(
        error.response?.data?.detail ||
          "Gagal mengambil data categories."
      )
    }
  }

  // =========================
  // INITIAL LOAD
  // =========================

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        setError("")

        await Promise.all([
          fetchBudgets(),
          fetchCategories(),
        ])
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  // =========================
  // HANDLE INPUT
  // =========================

  const handleChange = (event) => {
    const { name, value } = event.target

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }))
  }

  // =========================
  // RESET FORM
  // =========================

  const resetForm = () => {
    setFormData({
      category_id: "",
      amount: "",
    })

    setEditingId(null)
    setShowForm(false)
  }

  // =========================
  // ADD BUDGET
  // =========================

  const handleAddBudget = () => {
    setEditingId(null)

    setFormData({
      category_id: "",
      amount: "",
    })

    setError("")
    setSuccess("")

    setShowForm(true)
  }

  // =========================
  // CREATE / UPDATE
  // =========================

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!formData.category_id) {
      setError("Silakan pilih category.")
      return
    }

    if (!formData.amount || Number(formData.amount) <= 0) {
      setError("Budget amount harus lebih dari 0.")
      return
    }

    try {
      setSubmitting(true)
      setError("")
      setSuccess("")

      const payload = {
        category_id: Number(formData.category_id),
        amount: Number(formData.amount),
      }

      if (editingId !== null) {
        // =========================
        // UPDATE
        // =========================

        const response = await api.put(
          `/budgets/${editingId}`,
          payload
        )

        const updatedBudget = response.data.data

        setBudgets((previous) =>
          previous.map((budget) =>
            budget.id === editingId
              ? updatedBudget
              : budget
          )
        )

        setSuccess("Budget berhasil diperbarui.")
      } else {
        // =========================
        // CREATE
        // =========================

        const response = await api.post(
          "/budgets",
          payload
        )

        const newBudget = response.data.data

        setBudgets((previous) => [
          newBudget,
          ...previous,
        ])

        setSuccess("Budget berhasil ditambahkan.")
      }

      resetForm()
    } catch (error) {
      console.error(error)

      setError(
        error.response?.data?.detail ||
          "Gagal menyimpan budget."
      )
    } finally {
      setSubmitting(false)
    }
  }

  // =========================
  // EDIT
  // =========================

  const handleEdit = (budget) => {
    setEditingId(budget.id)

    setFormData({
      category_id: String(budget.category_id),
      amount: String(budget.amount),
    })

    setError("")
    setSuccess("")

    setShowForm(true)
  }

  // =========================
  // DELETE
  // =========================

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Yakin ingin menghapus budget ini?"
    )

    if (!confirmed) {
      return
    }

    try {
      setError("")
      setSuccess("")

      await api.delete(`/budgets/${id}`)

      setBudgets((previous) =>
        previous.filter(
          (budget) => budget.id !== id
        )
      )

      setSuccess("Budget berhasil dihapus.")
    } catch (error) {
      console.error(error)

      setError(
        error.response?.data?.detail ||
          "Gagal menghapus budget."
      )
    }
  }

  // =========================
  // FORMAT CURRENCY
  // =========================

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(value)
  }

  // =========================
  // RENDER
  // =========================

  return (
    <div className="page">
      {/* PAGE HEADER */}

      <div className="page-header">
        <div>
          <h1>Budgets</h1>

          <p>
            Manage your spending limits.
          </p>
        </div>

        <button
          className="primary-button"
          onClick={handleAddBudget}
        >
          + Add Budget
        </button>
      </div>

      {/* SUCCESS */}

      {success && (
        <div
          style={{
            marginBottom: "16px",
            padding: "12px 16px",
            borderRadius: "8px",
            background: "#ecfdf5",
            color: "#047857",
            border: "1px solid #a7f3d0",
          }}
        >
          {success}
        </div>
      )}

      {/* ERROR */}

      {error && (
        <div
          style={{
            marginBottom: "16px",
            padding: "12px 16px",
            borderRadius: "8px",
            background: "#fef2f2",
            color: "#b91c1c",
            border: "1px solid #fecaca",
          }}
        >
          {error}
        </div>
      )}

      {/* FORM */}

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
            {/* CATEGORY */}

            <div className="form-group">
              <label htmlFor="category_id">
                Category
              </label>

              <select
                id="category_id"
                name="category_id"
                value={formData.category_id}
                onChange={handleChange}
                required
                disabled={submitting}
              >
                <option value="">
                  Select Category
                </option>

                {categories.map((category) => (
                  <option
                    key={category.id}
                    value={category.id}
                  >
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            {/* AMOUNT */}

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
                disabled={submitting}
              />
            </div>

            {/* ACTIONS */}

            <div className="form-actions">
              <button
                type="button"
                onClick={resetForm}
                disabled={submitting}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="primary-button"
                disabled={submitting}
              >
                {submitting
                  ? "Saving..."
                  : editingId !== null
                    ? "Save Changes"
                    : "Add Budget"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* BUDGET LIST */}

      <div className="budget-grid">
        {loading ? (
          <div className="budget-card">
            <p>Loading budgets...</p>
          </div>
        ) : budgets.length === 0 ? (
          <div className="budget-card">
            <p>
              Belum ada budget.
            </p>
          </div>
        ) : (
          budgets.map((budget) => {
            const spent = Number(budget.spent) || 0
            const amount = Number(budget.amount) || 0

            const percentage =
              amount > 0
                ? Math.min(
                    (spent / amount) * 100,
                    100
                  )
                : 0

            const remaining =
              Math.max(amount - spent, 0)

            return (
              <div
                className="budget-card"
                key={budget.id}
              >
                {/* HEADER */}

                <div className="budget-card-header">
                  <div>
                    <h3>
                      {budget.category_name}
                    </h3>

                    <p>
                      Budget
                    </p>
                  </div>

                  <div className="budget-actions">
                    <button
                      type="button"
                      onClick={() =>
                        handleEdit(budget)
                      }
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

                {/* AMOUNT */}

                <div className="budget-amount">
                  <strong>
                    {formatCurrency(spent)}
                  </strong>

                  <span>
                    of {formatCurrency(amount)}
                  </span>
                </div>

                {/* PROGRESS BAR */}

                <div className="budget-progress">
                  <div
                    className="budget-progress-bar"
                    style={{
                      width: `${percentage}%`,
                    }}
                  />
                </div>

                {/* STATUS */}

                <div className="budget-status">
                  <span>
                    {Math.round(percentage)}% used
                  </span>

                  <span>
                    {formatCurrency(remaining)}{" "}
                    remaining
                  </span>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}

export default Budgets