import { useEffect, useState } from "react"
import api from "../services/api"

function Budgets() {
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)

  const [budgets, setBudgets] = useState([])
  const [categories, setCategories] = useState([])
  const [transactions, setTransactions] = useState([])

  const [formData, setFormData] = useState({
    category_id: "",
    amount: "",
  })

  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  // =========================
  // LOAD ALL DATA
  // =========================

  const loadData = async () => {
    try {
      setLoading(true)
      setError("")

      const [
        budgetsResponse,
        categoriesResponse,
        transactionsResponse,
      ] = await Promise.all([
        api.get("/budgets"),
        api.get("/categories"),
        api.get("/transactions"),
      ])

      const budgetData =
        budgetsResponse.data.data || []

      const categoryData =
        categoriesResponse.data.data || []

      const transactionData =
        transactionsResponse.data.data || []

      setCategories(categoryData)
      setTransactions(transactionData)

      // =========================
      // SYNC BUDGET DATA
      // =========================

      const syncedBudgets = budgetData.map(
        (budget) => {
          const category = categoryData.find(
            (item) =>
              item.id === budget.category_id
          )

          const categoryName =
            category?.name || "Unknown Category"

          const spent =
            transactionData
              .filter(
                (transaction) =>
                  transaction.type?.toLowerCase() ===
                    "expense" &&
                  transaction.category?.toLowerCase() ===
                    categoryName.toLowerCase()
              )
              .reduce(
                (total, transaction) =>
                  total +
                  Number(transaction.amount || 0),
                0
              )

          return {
            ...budget,
            category_name: categoryName,
            spent,
          }
        }
      )

      setBudgets(syncedBudgets)

    } catch (error) {
      console.error(
        "Budget data request failed:",
        error
      )

      if (error.response) {
        const detail =
          error.response.data?.detail

        if (typeof detail === "string") {
          setError(detail)
        } else {
          setError(
            "Gagal mengambil data budget."
          )
        }
      } else {
        setError(
          "Tidak dapat terhubung ke server."
        )
      }

    } finally {
      setLoading(false)
    }
  }

  // =========================
  // INITIAL LOAD
  // =========================

  useEffect(() => {
    loadData()
  }, [])

  // =========================
  // FORMAT INPUT CURRENCY
  // =========================

  const formatInputCurrency = (value) => {
    const numericValue =
      value.replace(/\D/g, "")

    if (!numericValue) {
      return ""
    }

    return Number(
      numericValue
    ).toLocaleString("id-ID")
  }

  const parseCurrency = (value) => {
    return Number(
      value.replace(/\./g, "")
    )
  }

  // =========================
  // HANDLE INPUT
  // =========================

  const handleChange = (event) => {
    const { name, value } = event.target

    if (name === "amount") {
      setFormData((previous) => ({
        ...previous,
        amount:
          formatInputCurrency(value),
      }))

      return
    }

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
      setError(
        "Silakan pilih category."
      )
      return
    }

    const numericAmount =
      parseCurrency(
        formData.amount
      )

    if (
      !numericAmount ||
      numericAmount <= 0
    ) {
      setError(
        "Budget amount harus lebih dari 0."
      )
      return
    }

    try {
      setSubmitting(true)
      setError("")
      setSuccess("")

      const payload = {
        category_id:
          Number(formData.category_id),
        amount:
          numericAmount,
      }

      if (editingId !== null) {
        // =========================
        // UPDATE
        // =========================

        await api.put(
          `/budgets/${editingId}`,
          payload
        )

        setSuccess(
          "Budget berhasil diperbarui."
        )

      } else {
        // =========================
        // CREATE
        // =========================

        await api.post(
          "/budgets",
          payload
        )

        setSuccess(
          "Budget berhasil ditambahkan."
        )
      }

      resetForm()

      await loadData()

    } catch (error) {
      console.error(
        "Budget save failed:",
        error
      )

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
      category_id:
        String(budget.category_id),

      amount:
        formatInputCurrency(
          String(budget.amount)
        ),
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

      await api.delete(
        `/budgets/${id}`
      )

      setSuccess(
        "Budget berhasil dihapus."
      )

      await loadData()

    } catch (error) {
      console.error(
        "Budget delete failed:",
        error
      )

      setError(
        error.response?.data?.detail ||
          "Gagal menghapus budget."
      )
    }
  }

  // =========================
  // FORMAT CURRENCY DISPLAY
  // =========================

  const formatCurrency = (value) => {
    return new Intl.NumberFormat(
      "id-ID",
      {
        style: "currency",
        currency: "IDR",
        maximumFractionDigits: 0,
      }
    ).format(value)
  }

  // =========================
  // RENDER
  // =========================

  return (
    <div className="page">

      {/* PAGE HEADER */}

      <div className="page-header">

        <div>

          <h1>
            Budgets
          </h1>

          <p>
            Manage your spending limits.
          </p>

        </div>

        <button
          type="button"
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
            border:
              "1px solid #a7f3d0",
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
            border:
              "1px solid #fecaca",
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
              disabled={submitting}
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
                value={
                  formData.category_id
                }
                onChange={handleChange}
                required
                disabled={submitting}
              >

                <option value="">
                  Select Category
                </option>

                {categories.map(
                  (category) => (
                    <option
                      key={category.id}
                      value={category.id}
                    >
                      {category.name}
                    </option>
                  )
                )}

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
                type="text"
                inputMode="numeric"
                placeholder="e.g. 1.000.000"
                value={
                  formData.amount
                }
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

            <p>
              Loading budgets...
            </p>

          </div>

        ) : budgets.length === 0 ? (

          <div className="budget-card">

            <p>
              Belum ada budget.
            </p>

          </div>

        ) : (

          budgets.map(
            (budget) => {

              const spent =
                Number(
                  budget.spent
                ) || 0

              const amount =
                Number(
                  budget.amount
                ) || 0

              const percentage =
                amount > 0
                  ? Math.min(
                      (spent /
                        amount) *
                        100,
                      100
                    )
                  : 0

              const remaining =
                Math.max(
                  amount - spent,
                  0
                )

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
                          handleEdit(
                            budget
                          )
                        }
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          handleDelete(
                            budget.id
                          )
                        }
                      >
                        Delete
                      </button>

                    </div>

                  </div>


                  {/* AMOUNT */}

                  <div className="budget-amount">

                    <strong>
                      {formatCurrency(
                        spent
                      )}
                    </strong>

                    <span>
                      {" "}of{" "}
                      {formatCurrency(
                        amount
                      )}
                    </span>

                  </div>


                  {/* PROGRESS BAR */}

                  <div className="budget-progress">

                    <div
                      className="budget-progress-bar"
                      style={{
                        width:
                          `${percentage}%`,
                      }}
                    />

                  </div>


                  {/* STATUS */}

                  <div className="budget-status">

                    <span>
                      {Math.round(
                        percentage
                      )}% used
                    </span>

                    <span>
                      {formatCurrency(
                        remaining
                      )} remaining
                    </span>

                  </div>

                </div>

              )
            }
          )

        )}

      </div>

    </div>
  )
}

export default Budgets