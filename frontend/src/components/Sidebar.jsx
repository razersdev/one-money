import { NavLink, useNavigate } from "react-router-dom"

function Sidebar() {
  const navigate = useNavigate()

  function handleLogout() {
    localStorage.removeItem("access_token")
    navigate("/login", { replace: true })
  }

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <h2>One Money</h2>
      </div>

      <nav className="sidebar-nav">
        <NavLink to="/dashboard">Dashboard</NavLink>
        <NavLink to="/transactions">Transactions</NavLink>
        <NavLink to="/categories">Categories</NavLink>
        <NavLink to="/budgets">Budgets</NavLink>
        <NavLink to="/reports">Reports</NavLink>
        <NavLink to="/settings">Settings</NavLink>
      </nav>

      <div className="sidebar-footer">
        <button
          type="button"
          onClick={handleLogout}
          className="logout-button"
        >
          Logout
        </button>
      </div>
    </aside>
  )
}

export default Sidebar