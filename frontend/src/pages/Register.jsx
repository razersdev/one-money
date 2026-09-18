import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"

import api from "../services/api"

function Register() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()

  async function handleSubmit(event) {
    event.preventDefault()

    setError("")
    setSuccess("")

    if (!name.trim()) {
      setError("Name is required.")
      return
    }

    if (!email.trim()) {
      setError("Email is required.")
      return
    }

    if (!email.includes("@")) {
      setError("Please enter a valid email.")
      return
    }

    if (!password) {
      setError("Password is required.")
      return
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters.")
      return
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.")
      return
    }

    setLoading(true)

    try {
      const response = await api.post("/auth/register", {
        name: name.trim(),
        email: email.trim(),
        password: password,
      })

      console.log("Register response:", response.data)

      setSuccess("Account created successfully.")

      setTimeout(() => {
        navigate("/login")
      }, 1000)
    } catch (error) {
      console.error("Register failed:", error)

      if (error.response) {
        const detail = error.response.data?.detail

        if (Array.isArray(detail)) {
          setError(
            detail
              .map((item) => item.msg)
              .join(", ")
          )
        } else if (typeof detail === "string") {
          setError(detail)
        } else {
          setError("Registration failed.")
        }
      } else {
        setError("Unable to connect to the server.")
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-card">
        <div className="auth-header">
          <p className="auth-eyebrow">One Money</p>

          <h1>Create your account</h1>

          <p>
            Start managing your finances with One Money.
          </p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          {error && (
            <div className="auth-error" role="alert">
              {error}
            </div>
          )}

          {success && (
            <div className="auth-success" role="status">
              {success}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="name">Name</label>

            <input
              id="name"
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Your name"
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>

            <input
              id="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>

            <input
              id="password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Create a password"
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirm-password">
              Confirm Password
            </label>

            <input
              id="confirm-password"
              type="password"
              value={confirmPassword}
              onChange={(event) =>
                setConfirmPassword(event.target.value)
              }
              placeholder="Confirm your password"
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            className="auth-button"
            disabled={loading}
          >
            {loading
              ? "Creating account..."
              : "Create Account"}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Already have an account?{" "}
            <Link to="/login">Sign in</Link>
          </p>
        </div>
      </section>
    </main>
  )
}

export default Register