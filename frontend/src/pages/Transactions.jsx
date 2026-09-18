import { useEffect, useState } from "react"
import api from "../services/api"

function Transactions() {
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)

  const [searchQuery, setSearchQuery] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")
  const [categoryFilter, setCategoryFilter] = useState("all")

  const [transactions, setTransactions] = useState([])

  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const [formData, setFormData] = useState({
    description: "",
    amount: "",
    type: "Expense",
    category: "Food",
    date: "",
  })

  const fetchTransactions = async () => {
    try {
      setLoading(true)
      setError("")

      const response = await api.get("/transactions")

      console.log(
        "Transactions response:",
        response.data
      )

      setTransactions(response.data.data || [])
    } catch (error) {
      console.error(
        "Transactions request failed:",
        error
      )

      if (error.response) {
        const detail = error.response.data?.detail

        if (typeof detail === "string") {
          setError(detail)
        } else {
          setError("Failed to load transactions.")
        }
      } else {
        setError("Unable to connect to the server.")
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTransactions()
  }, [])

  const handleChange = (event) => {
    const { name, value } = event.target

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }))
  }

  const resetForm = () => {
    setFormData({
      description: "",
      amount: "",
      type: "Expense",
      category: "Food",
      date: "",
    })

    setEditingId(null)
    setShowForm(false)
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    try {
      setSubmitting(true)
      setError("")
      setSuccess("")

      if (editingId !== null) {
        const response = await api.put(
          `/transactions/${editingId}`,
          {
            type: formData.type.toLowerCase(),
            amount: Number(formData.amount),
            description: formData.description.trim(),
            category: formData.category,
          }
        )

        console.log(
          "Update transaction response:",
          response.data
        )

        setSuccess(
          "Transaction updated successfully."
        )

        resetForm()

        await fetchTransactions()

        return
      }

      const response = await api.post(
        "/transactions",
        {
          type: formData.type.toLowerCase(),
          amount: Number(formData.amount),
          description: formData.description.trim(),
          category: formData.category,
        }
      )

      console.log(
        "Create transaction response:",
        response.data
      )

      setSuccess(
        "Transaction added successfully."
      )

      resetForm()

      await fetchTransactions()
    } catch (error) {
      console.error(
        "Transaction request failed:",
        error
      )

      if (error.response) {
        const detail = error.response.data?.detail

        if (typeof detail === "string") {
          setError(detail)
        } else if (Array.isArray(detail)) {
          setError(
            detail
              .map((item) => item.msg)
              .join(", ")
          )
        } else {
          setError("Failed to save transaction.")
        }
      } else {
        setError("Unable to connect to the server.")
      }
    } finally {
      setSubmitting(false)
    }
  }

  const handleAddTransaction = () => {
    setEditingId(null)

    setFormData({
      description: "",
      amount: "",
      type: "Expense",
      category: "Food",
      date: "",
    })

    setError("")
    setSuccess("")
    setShowForm(true)
  }

  const handleEdit = (transaction) => {
    setEditingId(transaction.id)

    setFormData({
      description: transaction.description,
      amount: transaction.amount,
      type:
        transaction.type === "income"
          ? "Income"
          : "Expense",
      category: transaction.category,
      date: transaction.created_at
        ? transaction.created_at.slice(0, 10)
        : "",
    })

    setError("")
    setSuccess("")
    setShowForm(true)
  }

  const handleDelete = async (transactionId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this transaction?"
    )

    if (!confirmed) {
      return
    }

    try {
      setError("")
      setSuccess("")

      const response = await api.delete(
        `/transactions/${transactionId}`
      )

      console.log(
        "Delete transaction response:",
        response.data
      )

      setSuccess(
        "Transaction deleted successfully."
      )

      await fetchTransactions()
    } catch (error) {
      console.error(
        "Delete transaction failed:",
        error
      )

      if (error.response) {
        const detail = error.response.data?.detail

        if (typeof detail === "string") {
          setError(detail)
        } else {
          setError(
            "Failed to delete transaction."
          )
        }
      } else {
        setError(
          "Unable to connect to the server."
        )
      }
    }
  }

  const filteredTransactions =
    transactions.filter((transaction) => {
      const matchesSearch =
        transaction.description
          .toLowerCase()
          .includes(
            searchQuery.toLowerCase()
          )

      const matchesType =
        typeFilter === "all" ||
        transaction.type.toLowerCase() ===
          typeFilter

      const matchesCategory =
        categoryFilter === "all" ||
        transaction.category.toLowerCase() ===
          categoryFilter

      return (
        matchesSearch &&
        matchesType &&
        matchesCategory
      )
    })

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Transactions</h1>
          <p>
            Manage your income and expenses.
          </p>
        </div>

        <button
          className="primary-button"
          onClick={handleAddTransaction}
        >
          + Add Transaction
        </button>
      </div>

      {error && (
        <div
          className="auth-error"
          role="alert"
        >
          {error}
        </div>
      )}

      {success && (
        <div
          className="auth-success"
          role="status"
        >
          {success}
        </div>
      )}

      {showForm && (
        <div className="transaction-form-card">
          <div className="form-header">
            <div>
              <h2>
                {editingId !== null
                  ? "Edit Transaction"
                  : "Add Transaction"}
              </h2>

              <p>
                {editingId !== null
                  ? "Update your transaction details."
                  : "Enter your transaction details."}
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
            <div className="form-group">
              <label htmlFor="description">
                Description
              </label>

              <input
                id="description"
                name="description"
                type="text"
                placeholder="e.g. Grocery Shopping"
                value={formData.description}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="amount">
                Amount
              </label>

              <input
                id="amount"
                name="amount"
                type="number"
                min="1"
                placeholder="e.g. 150000"
                value={formData.amount}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="type">
                Type
              </label>

              <select
                id="type"
                name="type"
                value={formData.type}
                onChange={handleChange}
              >
                <option value="Expense">
                  Expense
                </option>

                <option value="Income">
                  Income
                </option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="category">
                Category
              </label>

              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
              >
                <option value="Food">
                  Food
                </option>

                <option value="Bills">
                  Bills
                </option>

                <option value="Transport">
                  Transport
                </option>

                <option value="Shopping">
                  Shopping
                </option>

                <option value="Entertainment">
                  Entertainment
                </option>

                <option value="Income">
                  Income
                </option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="date">
                Date
              </label>

              <input
                id="date"
                name="date"
                type="date"
                value={formData.date}
                onChange={handleChange}
                required
              />
            </div>

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
                    : "Add Transaction"}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="transaction-filters">
        <input
          type="text"
          placeholder="Search transactions..."
          value={searchQuery}
          onChange={(event) =>
            setSearchQuery(event.target.value)
          }
        />

        <select
          value={typeFilter}
          onChange={(event) =>
            setTypeFilter(event.target.value)
          }
        >
          <option value="all">
            All Types
          </option>

          <option value="income">
            Income
          </option>

          <option value="expense">
            Expense
          </option>
        </select>

        <select
          value={categoryFilter}
          onChange={(event) =>
            setCategoryFilter(event.target.value)
          }
        >
          <option value="all">
            All Categories
          </option>

          <option value="food">
            Food
          </option>

          <option value="bills">
            Bills
          </option>

          <option value="transport">
            Transport
          </option>

          <option value="shopping">
            Shopping
          </option>

          <option value="entertainment">
            Entertainment
          </option>

          <option value="income">
            Income
          </option>
        </select>
      </div>

      <div className="transaction-card">
        <div className="transaction-table">
          <div className="transaction-row transaction-header">
            <span>Date</span>
            <span>Description</span>
            <span>Category</span>
            <span>Type</span>
            <span>Amount</span>
            <span>Action</span>
          </div>

          {loading && (
            <div className="transaction-row">
              <span>
                Loading...
              </span>
            </div>
          )}

          {!loading &&
            filteredTransactions.length === 0 && (
              <div className="transaction-row">
                <span>
                  No transactions found.
                </span>
              </div>
            )}

          {!loading &&
            filteredTransactions.map(
              (transaction) => {
                const isIncome =
                  transaction.type.toLowerCase() ===
                  "income"

                return (
                  <div
                    className="transaction-row"
                    key={transaction.id}
                  >
                    <span>
                      {transaction.created_at
                        ? transaction.created_at.slice(
                            0,
                            10
                          )
                        : "-"}
                    </span>

                    <span>
                      {transaction.description}
                    </span>

                    <span>
                      {transaction.category}
                    </span>

                    <span>
                      {transaction.type}
                    </span>

                    <span>
                      {isIncome ? "+" : "-"} Rp{" "}
                      {Number(
                        transaction.amount
                      ).toLocaleString(
                        "id-ID"
                      )}
                    </span>

                    <span>
                      <button
                        type="button"
                        onClick={() =>
                          handleEdit(
                            transaction
                          )
                        }
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          handleDelete(
                            transaction.id
                          )
                        }
                      >
                        Delete
                      </button>
                    </span>
                  </div>
                )
              }
            )}
        </div>
      </div>
    </div>
  )
}

export default Transactions