import { useEffect, useState } from "react"
import api from "../services/api"

function Categories() {
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)

  const [searchTerm, setSearchTerm] = useState("")

  const [categories, setCategories] = useState([])

  const [formData, setFormData] = useState({
    name: "",
  })

  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  // =========================
  // GET CATEGORIES
  // =========================

  const fetchCategories = async () => {
    try {
      setLoading(true)
      setError("")

      const response = await api.get("/categories")

      setCategories(response.data.data)
    } catch (error) {
      console.error(error)

      setError(
        error.response?.data?.detail ||
          "Gagal mengambil data categories."
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCategories()
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
      name: "",
    })

    setEditingId(null)
    setShowForm(false)
  }

  // =========================
  // OPEN ADD FORM
  // =========================

  const handleAddCategory = () => {
    setEditingId(null)

    setFormData({
      name: "",
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

    if (!formData.name.trim()) {
      setError("Category name tidak boleh kosong.")
      return
    }

    try {
      setSubmitting(true)
      setError("")
      setSuccess("")

      if (editingId !== null) {
        // UPDATE
        const response = await api.put(
          `/categories/${editingId}`,
          {
            name: formData.name.trim(),
          }
        )

        const updatedCategory = response.data.data

        setCategories((previous) =>
          previous.map((category) =>
            category.id === editingId
              ? updatedCategory
              : category
          )
        )

        setSuccess("Category berhasil diperbarui.")
      } else {
        // CREATE
        const response = await api.post(
          "/categories",
          {
            name: formData.name.trim(),
          }
        )

        const newCategory = response.data.data

        setCategories((previous) => [
          newCategory,
          ...previous,
        ])

        setSuccess("Category berhasil ditambahkan.")
      }

      setFormData({
        name: "",
      })

      setEditingId(null)
      setShowForm(false)
    } catch (error) {
      console.error(error)

      setError(
        error.response?.data?.detail ||
          "Gagal menyimpan category."
      )
    } finally {
      setSubmitting(false)
    }
  }

  // =========================
  // EDIT
  // =========================

  const handleEdit = (category) => {
    setEditingId(category.id)

    setFormData({
      name: category.name,
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
      "Yakin ingin menghapus category ini?"
    )

    if (!confirmed) {
      return
    }

    try {
      setError("")
      setSuccess("")

      await api.delete(`/categories/${id}`)

      setCategories((previous) =>
        previous.filter(
          (category) => category.id !== id
        )
      )

      setSuccess("Category berhasil dihapus.")
    } catch (error) {
      console.error(error)

      setError(
        error.response?.data?.detail ||
          "Gagal menghapus category."
      )
    }
  }

  // =========================
  // FILTER
  // =========================

  const filteredCategories = categories.filter(
    (category) =>
      category.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
  )

  // =========================
  // RENDER
  // =========================

  return (
    <div className="page">
      {/* PAGE HEADER */}

      <div className="page-header">
        <div>
          <h1>Categories</h1>

          <p>
            Manage your transaction categories.
          </p>
        </div>

        <button
          className="primary-button"
          onClick={handleAddCategory}
        >
          + Add Category
        </button>
      </div>

      {/* SUCCESS MESSAGE */}

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

      {/* ERROR MESSAGE */}

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
                disabled={submitting}
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
                    : "Add Category"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* SEARCH */}

      <div className="transaction-filters">
        <input
          type="text"
          placeholder="Search categories..."
          value={searchTerm}
          onChange={(event) =>
            setSearchTerm(event.target.value)
          }
        />
      </div>

      {/* CATEGORY TABLE */}

      <div className="transaction-card">
        <div className="transaction-table">
          <div className="transaction-row transaction-header">
            <span>Category</span>
            <span>Action</span>
          </div>

          {loading ? (
            <div
              className="transaction-row"
              style={{
                justifyContent: "center",
              }}
            >
              <span>
                Loading categories...
              </span>
            </div>
          ) : filteredCategories.length === 0 ? (
            <div
              className="transaction-row"
              style={{
                justifyContent: "center",
              }}
            >
              <span>
                {searchTerm
                  ? "Category tidak ditemukan."
                  : "Belum ada category."}
              </span>
            </div>
          ) : (
            filteredCategories.map((category) => (
              <div
                className="transaction-row"
                key={category.id}
              >
                <span>
                  {category.name}
                </span>

                <span>
                  <button
                    type="button"
                    onClick={() =>
                      handleEdit(category)
                    }
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
            ))
          )}
        </div>
      </div>
    </div>
  )
}

export default Categories