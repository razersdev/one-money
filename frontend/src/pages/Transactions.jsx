import { useState } from "react"

function Transactions() {
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)

  const [searchQuery, setSearchQuery] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")
  const [categoryFilter, setCategoryFilter] = useState("all")

  const [transactions, setTransactions] = useState([
    {
      id: 1,
      date: "2026-09-14",
      description: "Grocery Shopping",
      category: "Food",
      type: "Expense",
      amount: 150000,
    },
    {
      id: 2,
      date: "2026-09-13",
      description: "Freelance Payment",
      category: "Income",
      type: "Income",
      amount: 2500000,
    },
    {
      id: 3,
      date: "2026-09-12",
      description: "Internet Bill",
      category: "Bills",
      type: "Expense",
      amount: 350000,
    },
  ])

  const [formData, setFormData] = useState({
    description: "",
    amount: "",
    type: "Expense",
    category: "Food",
    date: "",
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
      description: "",
      amount: "",
      type: "Expense",
      category: "Food",
      date: "",
    })

    setEditingId(null)
    setShowForm(false)
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    if (editingId !== null) {
      setTransactions((previous) =>
        previous.map((transaction) =>
          transaction.id === editingId
            ? {
                ...transaction,
                description: formData.description,
                amount: Number(formData.amount),
                type: formData.type,
                category: formData.category,
                date: formData.date,
              }
            : transaction
        )
      )
    } else {
      const newTransaction = {
        id: Date.now(),
        date: formData.date,
        description: formData.description,
        category: formData.category,
        type: formData.type,
        amount: Number(formData.amount),
      }

      setTransactions((previous) => [
        newTransaction,
        ...previous,
      ])
    }

    resetForm()
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

    setShowForm(true)
  }

  const handleEdit = (transaction) => {
    setEditingId(transaction.id)

    setFormData({
      description: transaction.description,
      amount: transaction.amount,
      type: transaction.type,
      category: transaction.category,
      date: transaction.date,
    })

    setShowForm(true)
  }

  const filteredTransactions = transactions.filter((transaction) => {
    const matchesSearch =
      transaction.description
        .toLowerCase()
        .includes(searchQuery.toLowerCase())

    const matchesType =
      typeFilter === "all" ||
      transaction.type.toLowerCase() === typeFilter

    const matchesCategory =
      categoryFilter === "all" ||
      transaction.category.toLowerCase() === categoryFilter

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
          <p>Manage your income and expenses.</p>
        </div>

        <button
          className="primary-button"
          onClick={handleAddTransaction}
        >
          + Add Transaction
        </button>
      </div>

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
                <option value="Expense">Expense</option>
                <option value="Income">Income</option>
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
                <option value="Food">Food</option>
                <option value="Bills">Bills</option>
                <option value="Transport">Transport</option>
                <option value="Shopping">Shopping</option>
                <option value="Entertainment">
                  Entertainment
                </option>
                <option value="Income">Income</option>
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
              >
                Cancel
              </button>

              <button
                type="submit"
                className="primary-button"
              >
                {editingId !== null
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
          <option value="all">All Types</option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>

        <select
          value={categoryFilter}
          onChange={(event) =>
            setCategoryFilter(event.target.value)
          }
        >
          <option value="all">All Categories</option>
          <option value="food">Food</option>
          <option value="bills">Bills</option>
          <option value="transport">Transport</option>
          <option value="shopping">Shopping</option>
          <option value="entertainment">
            Entertainment
          </option>
          <option value="income">Income</option>
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

          {filteredTransactions.map((transaction) => (
            <div
              className="transaction-row"
              key={transaction.id}
            >
              <span>{transaction.date}</span>

              <span>{transaction.description}</span>

              <span>{transaction.category}</span>

              <span>{transaction.type}</span>

              <span>
                Rp{" "}
                {transaction.amount.toLocaleString("id-ID")}
              </span>

              <span>
                <button
                  type="button"
                  onClick={() => handleEdit(transaction)}
                >
                  Edit
                </button>
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Transactions