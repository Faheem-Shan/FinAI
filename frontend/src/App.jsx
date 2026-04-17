import { Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useContext } from "react";

import Layout from "./components/Layout";

import Dashboard from "./pages/Dashboard";
import Transactions from "./pages/Transactions";
import AddTransaction from "./pages/AddTransaction";
import Budgets from "./pages/Budgets";
import Insights from "./pages/Insights";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Settings from "./pages/Settings";
import Profile from "./pages/Profile";
import Home from "./pages/Home";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import PendingApprovals from "./pages/PendingApprovals";
import Organization from "./pages/Organization";



import { AuthContext } from "./context/AuthContext";
import { Toaster } from "react-hot-toast";


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
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, []);

  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />
      <Routes>


      {/* PUBLIC */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset/:uid/:token" element={<ResetPassword />} />


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
        path="/budgets"
        element={
          <PrivateRoute>
            <Layout><Budgets /></Layout>
          </PrivateRoute>
        }
      />

      <Route
        path="/insights"
        element={
          <PrivateRoute>
            <Layout><Insights /></Layout>
          </PrivateRoute>
        }
      />

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

      {/* ✅ MULTI-TENANT SaaS ROUTES */}
      <Route
        path="/approvals"
        element={
          <PrivateRoute>
            <Layout><PendingApprovals /></Layout>
          </PrivateRoute>
        }
      />

      <Route
        path="/organization"
        element={
          <PrivateRoute>
            <Layout><Organization /></Layout>
          </PrivateRoute>
        }
      />


    </Routes>
    </>
  );
}


export default App;