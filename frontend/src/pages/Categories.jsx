import { useState } from "react"

function Categories() {
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)

  const [searchTerm, setSearchTerm] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")

  const [categories, setCategories] = useState([
    {
      id: 1,
      name: "Food",
      type: "Expense",
    },
    {
      id: 2,
      name: "Bills",
      type: "Expense",
    },
    {
      id: 3,
      name: "Transport",
      type: "Expense",
    },
    {
      id: 4,
      name: "Shopping",
      type: "Expense",
    },
    {
      id: 5,
      name: "Salary",
      type: "Income",
    },
  ])

  const [formData, setFormData] = useState({
    name: "",
    type: "Expense",
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
      type: "Expense",
    })

    setEditingId(null)
    setShowForm(false)
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    if (editingId !== null) {
      setCategories((previous) =>
        previous.map((category) =>
          category.id === editingId
            ? {
                ...category,
                name: formData.name,
                type: formData.type,
              }
            : category
        )
      )
    } else {
      const newCategory = {
        id: Date.now(),
        name: formData.name,
        type: formData.type,
      }

      setCategories((previous) => [
        ...previous,
        newCategory,
      ])
    }

    resetForm()
  }

  const handleAddCategory = () => {
    setEditingId(null)

    setFormData({
      name: "",
      type: "Expense",
    })

    setShowForm(true)
  }

  const handleEdit = (category) => {
    setEditingId(category.id)

    setFormData({
      name: category.name,
      type: category.type,
    })

    setShowForm(true)
  }

  const handleDelete = (id) => {
    setCategories((previous) =>
      previous.filter((category) => category.id !== id)
    )
  }

  const filteredCategories = categories.filter((category) => {
    const matchesSearch = category.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase())

    const matchesType =
      typeFilter === "all" ||
      category.type.toLowerCase() === typeFilter

    return matchesSearch && matchesType
  })

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Categories</h1>
          <p>Manage your transaction categories.</p>
        </div>

        <button
          className="primary-button"
          onClick={handleAddCategory}
        >
          + Add Category
        </button>
      </div>

      {showForm && (
        <div className="transaction-form-card">
          <div className="form-header">
            <div>
              <h2>
                {editingId !== null
                  ? "Edit Category"
                  : "Add Category"}
              </h2>

              <p>
                {editingId !== null
                  ? "Update your category."
                  : "Create a new category."}
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
                Category Name
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
                  : "Add Category"}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="transaction-filters">
        <input
          type="text"
          placeholder="Search categories..."
          value={searchTerm}
          onChange={(event) =>
            setSearchTerm(event.target.value)
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
      </div>

      <div className="transaction-card">
        <div className="transaction-table">
          <div className="transaction-row transaction-header">
            <span>Category</span>
            <span>Type</span>
            <span>Action</span>
          </div>

          {filteredCategories.map((category) => (
            <div
              className="transaction-row"
              key={category.id}
            >
              <span>{category.name}</span>

              <span>{category.type}</span>

              <span>
                <button
                  type="button"
                  onClick={() => handleEdit(category)}
                >
                  Edit
                </button>

                <button
                  type="button"
                  onClick={() =>
                    handleDelete(category.id)
                  }
                >
                  Delete
                </button>
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Categories