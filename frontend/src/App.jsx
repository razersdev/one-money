import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"

import Login from "./pages/Login"
import Dashboard from "./pages/Dashboard"
import MainLayout from "./layouts/MainLayout"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        <Route path="/login" element={<Login />} />

        <Route element={<MainLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>

        <Route path="/register" element={<div>Register</div>} />
        <Route path="/transactions" element={<div>Transactions</div>} />
        <Route path="/categories" element={<div>Categories</div>} />
        <Route path="/budgets" element={<div>Budgets</div>} />
        <Route path="/reports" element={<div>Reports</div>} />
        <Route path="/settings" element={<div>Settings</div>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App