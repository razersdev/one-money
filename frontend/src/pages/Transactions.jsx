import { useEffect, useState } from "react"
import api from "../services/api"

function Transactions() {
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)

  const [searchQuery, setSearchQuery] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")
  const [categoryFilter, setCategoryFilter] = useState("all")

  const [transactions, setTransactions] = useState([])
  const [categories, setCategories] = useState([])

  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const [formData, setFormData] = useState({
    description: "",
    amount: "",
    type: "Expense",
    category: "",
    date: "",
  })

  // =========================
  // FETCH TRANSACTIONS
  // =========================

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
          setError(
            "Failed to load transactions."
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

  // =========================
  // FETCH CATEGORIES
  // =========================

  const fetchCategories = async () => {
    try {
      const response = await api.get("/categories")

      console.log(
        "Categories response:",
        response.data
      )

      setCategories(response.data.data || [])
    } catch (error) {
      console.error(
        "Categories request failed:",
        error
      )

      if (error.response) {
        const detail = error.response.data?.detail

        if (typeof detail === "string") {
          setError(detail)
        } else {
          setError(
            "Failed to load categories."
          )
        }
      } else {
        setError(
          "Unable to connect to the server."
        )
      }
    }
  }

  // =========================
  // INITIAL LOAD
  // =========================

  useEffect(() => {
    fetchTransactions()
    fetchCategories()
  }, [])

  // =========================
  // CURRENCY HELPERS
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
      description: "",
      amount: "",
      type: "Expense",
      category: "",
      date: "",
    })

    setEditingId(null)
    setShowForm(false)
  }

  // =========================
  // ADD TRANSACTION
  // =========================

  const handleAddTransaction = () => {
    console.log(
      "🔥 ADD TRANSACTION CLICKED"
    )

    setEditingId(null)

    setFormData({
      description: "",
      amount: "",
      type: "Expense",
      category: "",
      date: "",
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

    if (!formData.description.trim()) {
      setError(
        "Description is required."
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
        "Amount must be greater than 0."
      )
      return
    }

    if (!formData.category) {
      setError(
        "Please select a category."
      )
      return
    }

    try {
      setSubmitting(true)
      setError("")
      setSuccess("")

      // =========================
      // UPDATE
      // =========================

      if (editingId !== null) {
        const response = await api.put(
          `/transactions/${editingId}`,
          {
            type:
              formData.type.toLowerCase(),

            amount:
              numericAmount,

            description:
              formData.description.trim(),

            category:
              formData.category,
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

      // =========================
      // CREATE
      // =========================

      const response = await api.post(
        "/transactions",
        {
          type:
            formData.type.toLowerCase(),

          amount:
            numericAmount,

          description:
            formData.description.trim(),

          category:
            formData.category,
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
        const detail =
          error.response.data?.detail

        if (typeof detail === "string") {
          setError(detail)

        } else if (
          Array.isArray(detail)
        ) {
          setError(
            detail
              .map(
                (item) => item.msg
              )
              .join(", ")
          )

        } else {
          setError(
            "Failed to save transaction."
          )
        }

      } else {
        setError(
          "Unable to connect to the server."
        )
      }

    } finally {
      setSubmitting(false)
    }
  }

  // =========================
  // EDIT
  // =========================

  const handleEdit = (transaction) => {
    setEditingId(transaction.id)

    setFormData({
      description:
        transaction.description,

      amount:
        formatInputCurrency(
          String(transaction.amount)
        ),

      type:
        transaction.type === "income"
          ? "Income"
          : "Expense",

      category:
        transaction.category,

      date:
        transaction.created_at
          ? transaction.created_at.slice(
              0,
              10
            )
          : "",
    })

    setError("")
    setSuccess("")
    setShowForm(true)
  }

  // =========================
  // DELETE
  // =========================

  const handleDelete = async (
    transactionId
  ) => {
    const confirmed =
      window.confirm(
        "Are you sure you want to delete this transaction?"
      )

    if (!confirmed) {
      return
    }

    try {
      setError("")
      setSuccess("")

      const response =
        await api.delete(
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
        const detail =
          error.response.data?.detail

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

  // =========================
  // FILTER TRANSACTIONS
  // =========================

  const filteredTransactions =
    transactions.filter(
      (transaction) => {
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
          transaction.category
            .toLowerCase() ===
            categoryFilter

        return (
          matchesSearch &&
          matchesType &&
          matchesCategory
        )
      }
    )

  // =========================
  // RENDER
  // =========================

  return (
    <div className="page">

      {/* PAGE HEADER */}

      <div className="page-header">

        <div>

          <h1>
            Transactions
          </h1>

          <p>
            Manage your income and expenses.
          </p>

        </div>

        <button
          type="button"
          className="primary-button"
          onClick={
            handleAddTransaction
          }
        >
          + Add Transaction
        </button>

      </div>


      {/* ERROR */}

      {error && (
        <div
          className="auth-error"
          role="alert"
        >
          {error}
        </div>
      )}


      {/* SUCCESS */}

      {success && (
        <div
          className="auth-success"
          role="status"
        >
          {success}
        </div>
      )}


      {/* FORM */}

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

            {/* DESCRIPTION */}

            <div className="form-group">

              <label htmlFor="description">
                Description
              </label>

              <input
                id="description"
                name="description"
                type="text"
                placeholder="e.g. Grocery Shopping"
                value={
                  formData.description
                }
                onChange={handleChange}
                required
                disabled={submitting}
              />

            </div>


            {/* AMOUNT */}

            <div className="form-group">

              <label htmlFor="amount">
                Amount
              </label>

              <input
                id="amount"
                name="amount"
                type="text"
                inputMode="numeric"
                placeholder="e.g. 150.000"
                value={
                  formData.amount
                }
                onChange={handleChange}
                required
                disabled={submitting}
              />

            </div>


            {/* TYPE */}

            <div className="form-group">

              <label htmlFor="type">
                Type
              </label>

              <select
                id="type"
                name="type"
                value={
                  formData.type
                }
                onChange={handleChange}
                disabled={submitting}
              >

                <option value="Expense">
                  Expense
                </option>

                <option value="Income">
                  Income
                </option>

              </select>

            </div>


            {/* CATEGORY */}

            <div className="form-group">

              <label htmlFor="category">
                Category
              </label>

              <select
                id="category"
                name="category"
                value={
                  formData.category
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
                      value={
                        category.name
                      }
                    >
                      {category.name}
                    </option>
                  )
                )}

              </select>

            </div>


            {/* DATE */}

            <div className="form-group">

              <label htmlFor="date">
                Date
              </label>

              <input
                id="date"
                name="date"
                type="date"
                value={
                  formData.date
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
                    : "Add Transaction"}
              </button>

            </div>

          </form>

        </div>
      )}


      {/* FILTERS */}

      <div className="transaction-filters">

        <input
          type="text"
          placeholder="Search transactions..."
          value={
            searchQuery
          }
          onChange={(event) =>
            setSearchQuery(
              event.target.value
            )
          }
        />

        <select
          value={
            typeFilter
          }
          onChange={(event) =>
            setTypeFilter(
              event.target.value
            )
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
          value={
            categoryFilter
          }
          onChange={(event) =>
            setCategoryFilter(
              event.target.value
            )
          }
        >

          <option value="all">
            All Categories
          </option>

          {categories.map(
            (category) => (
              <option
                key={category.id}
                value={
                  category.name.toLowerCase()
                }
              >
                {category.name}
              </option>
            )
          )}

        </select>

      </div>


      {/* TRANSACTION TABLE */}

      <div className="transaction-card">

        <div className="transaction-table">

          <div className="transaction-row transaction-header">

            <span>
              Date
            </span>

            <span>
              Description
            </span>

            <span>
              Category
            </span>

            <span>
              Type
            </span>

            <span>
              Amount
            </span>

            <span>
              Action
            </span>

          </div>


          {/* LOADING */}

          {loading && (
            <div className="transaction-row">

              <span>
                Loading...
              </span>

            </div>
          )}


          {/* EMPTY */}

          {!loading &&
            filteredTransactions.length ===
              0 && (
              <div className="transaction-row">

                <span>
                  No transactions found.
                </span>

              </div>
            )}


          {/* DATA */}

          {!loading &&
            filteredTransactions.map(
              (transaction) => {

                const isIncome =
                  transaction.type
                    .toLowerCase() ===
                  "income"

                return (
                  <div
                    className="transaction-row"
                    key={
                      transaction.id
                    }
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
                      {
                        transaction.description
                      }
                    </span>

                    <span>
                      {
                        transaction.category
                      }
                    </span>

                    <span>
                      {
                        transaction.type
                      }
                    </span>

                    <span>
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