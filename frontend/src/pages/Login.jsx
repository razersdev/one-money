import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"

import api from "../services/api"

function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()

  async function handleSubmit(event) {
    event.preventDefault()

    setError("")

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

    setLoading(true)

    try {
      const response = await api.post("/auth/login", {
        email: email.trim(),
        password: password,
      })

      console.log("Login response:", response.data)

      const token = response.data.access_token

      localStorage.setItem("access_token", token)

      navigate("/dashboard")
    } catch (error) {
      console.error("Login failed:", error)

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
          setError("Login failed.")
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

          <h1>Welcome back</h1>

          <p>
            Sign in to continue managing your finances.
          </p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          {error && (
            <div className="auth-error" role="alert">
              {error}
            </div>
          )}

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
              placeholder="Enter your password"
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            className="auth-button"
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Don't have an account?{" "}
            <Link to="/register">Create one</Link>
          </p>
        </div>
      </section>
    </main>
  )
}

export default Login