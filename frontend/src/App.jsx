import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"

import Login from "./pages/Login"
import Register from "./pages/Register"
import Dashboard from "./pages/Dashboard"
import MainLayout from "./layouts/MainLayout"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Default */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        {/* Authentication */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Main Application */}
        <Route element={<MainLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />

          <Route
            path="/transactions"
            element={<div>Transactions</div>}
          />

          <Route
            path="/categories"
            element={<div>Categories</div>}
          />

          <Route
            path="/budgets"
            element={<div>Budgets</div>}
          />

          <Route
            path="/reports"
            element={<div>Reports</div>}
          />

          <Route
            path="/settings"
            element={<div>Settings</div>}
          />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App