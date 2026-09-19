import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"

import Login from "./pages/Login"
import Register from "./pages/Register"
import Dashboard from "./pages/Dashboard"
import Transactions from "./pages/Transactions"
import Categories from "./pages/Categories"
import Budgets from "./pages/Budgets"
import Reports from "./pages/Reports"
import MainLayout from "./layouts/MainLayout"
import ProtectedRoute from "./components/ProtectedRoute"

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Default */}
        <Route
          path="/"
          element={<Navigate to="/dashboard" replace />}
        />

        {/* Authentication */}
        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        {/* Protected Main Application */}
        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>

            <Route
              path="/dashboard"
              element={<Dashboard />}
            />

            <Route
              path="/transactions"
              element={<Transactions />}
            />

            <Route
              path="/categories"
              element={<Categories />}
            />

            <Route
              path="/budgets"
              element={<Budgets />}
            />

            <Route
              path="/reports"
              element={<Reports />}
            />

            <Route
              path="/settings"
              element={<div>Settings</div>}
            />

          </Route>
        </Route>

      </Routes>
    </BrowserRouter>
  )
}

export default App