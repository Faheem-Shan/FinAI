import { Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useContext } from "react";

import Layout from "./components/Layout";

import Dashboard from "./pages/Dashboard";
import Transactions from "./pages/Transactions";
import AddTransaction from "./pages/AddTransaction";
import Budgets from "./pages/Budgets";
// import Insights from "./pages/Insights";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Settings from "./pages/Settings";
import Profile from "./pages/Profile";
import Home from "./pages/Home";

import { AuthContext } from "./context/AuthContext";


const PrivateRoute = ({ children }) => {
  const { token, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream">
        <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  return token ? children : <Navigate to="/login" />;
};

function App() {
  useEffect(() => {
    const theme = localStorage.getItem("theme") || "light";
    document.documentElement.setAttribute("data-theme", theme);
  }, []);

  return (
    <Routes>

      {/* PUBLIC */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* PROTECTED WITH LAYOUT */}
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <Layout><Dashboard /></Layout>
          </PrivateRoute>
        }
      />

      <Route
        path="/transactions"
        element={
          <PrivateRoute>
            <Layout><Transactions /></Layout>
          </PrivateRoute>
        }
      />

      <Route
        path="/add"
        element={
          <PrivateRoute>
            <Layout><AddTransaction /></Layout>
          </PrivateRoute>
        }
      />
      
      <Route
          path="/add-transaction"
          element={
            <PrivateRoute>
              <Layout><AddTransaction /></Layout>
            </PrivateRoute>
          }
        />

      <Route
        path="/budgets"
        element={
          <PrivateRoute>
            <Layout><Budgets /></Layout>
          </PrivateRoute>
        }
      />

      {/* <Route
        path="/insights"
        element={
          <PrivateRoute>
            <Layout><Insights /></Layout>
          </PrivateRoute>
        }
      /> */}

      <Route
        path="/settings"
        element={
          <PrivateRoute>
            <Layout><Settings /></Layout>
          </PrivateRoute>
        }
      />

      <Route
        path="/profile"
        element={
          <PrivateRoute>
            <Layout><Profile /></Layout>
          </PrivateRoute>
        }
      />

    </Routes>
  );
}

export default App;