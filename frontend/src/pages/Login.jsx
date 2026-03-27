import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

import api from "../api/axios";
import { AuthContext } from "../context/AuthContext";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleSubmit = async (e) => {
  e.preventDefault();

  if (!username || !password) {
    setError("Please enter your username and password");
    return;
  }

  try {
    const response = await api.post("accounts/login/", {
      username,
      password,
    });

    const { access, refresh } = response.data;

    
    localStorage.setItem("token", access);
    localStorage.setItem("refresh", refresh);

    login(access);

    navigate("/dashboard");

  } catch (err) {
    setError(err.response?.data?.detail || "Invalid credentials. Please try again.");
  }
};

  return (
    <div className="min-h-screen grid lg:grid-cols-2 font-inter bg-cream selection:bg-primary/20">

      {/* 🔹 LEFT SIDE */}
      <div className="flex flex-col justify-center px-6 py-12 md:px-20">
        <div className="max-w-sm w-full mx-auto">

          {/* Logo */}
          <div 
            className="flex items-center gap-2.5 mb-12 cursor-pointer group"
            onClick={() => navigate('/')}
          >
            <div className="w-9 h-9 bg-primary text-white rounded-xl flex items-center justify-center font-bold text-lg shadow-lg shadow-primary/20 group-hover:scale-105 transition-transform">
              F
            </div>
            <span className="font-outfit text-xl font-bold tracking-tight text-text-main">
              FinAI
            </span>
          </div>

          {/* Title */}
          <div className="mb-10">
            <h1 className="font-outfit text-3xl font-bold text-text-main tracking-tight mb-2">
              Welcome back
            </h1>
            <p className="text-sm text-text-secondary">
              Sign in to continue managing your finances.
            </p>
            {/* <p className="text-xs text-green-600 font-medium mt-2">
              🔒 Secure login • Your data is protected
            </p> */}
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">

            {error && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-3 bg-red-50 border border-red-100 rounded-xl text-red-500 text-sm"
              >
                {error}
              </motion.div>
            )}

            {/* Username */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-text-secondary">
                Username
              </label>
              <input
                type="text"
                placeholder="Enter your username"
                className="w-full px-4 py-3 bg-white rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none text-sm"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            {/* Password */}
            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <label className="text-xs font-semibold text-text-secondary">
                  Password
                </label>
                <Link 
                  to="#" 
                  className="text-xs text-primary hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <input
                type="password"
                placeholder="Enter your password"
                className="w-full px-4 py-3 bg-white rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none text-sm"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {/* Button */}
            <button 
              type="submit" 
              className="w-full py-3 bg-primary text-white rounded-xl font-semibold text-sm shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 mt-2"
            >
              Sign In <ArrowRight size={16} />
            </button>
          </form>

          {/* Register */}
          <p className="mt-8 text-center text-sm text-text-secondary">
            Don’t have an account?
            <Link 
              to="/register" 
              className="text-primary font-semibold hover:underline ml-1"
            >
              Create one
            </Link>
          </p>

        </div>
      </div>

      {/* 🔹 RIGHT SIDE */}
      <div className="hidden lg:flex bg-primary relative overflow-hidden items-center justify-center px-16">

        {/* Glow */}
        <div className="absolute top-0 right-0 w-[700px] h-[700px] bg-white opacity-20 rounded-full blur-[120px] -mr-40 -mt-40"></div>

        <div className="relative z-10 text-center max-w-sm">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >

            <h2 className="font-outfit text-4xl font-bold text-white leading-tight mb-6">
              Manage your money <br />
              <span className="opacity-70">with confidence.</span>
            </h2>

            <p className="text-white/80 text-sm mb-8">
              Track expenses, analyze trends, and make smarter financial decisions.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 text-white">
              <div className="bg-white/10 backdrop-blur-md border border-white/20 p-5 rounded-2xl">
                <p className="text-2xl font-bold">10K+</p>
                <p className="text-xs opacity-60">Users</p>
              </div>
              <div className="bg-white/10 backdrop-blur-md border border-white/20 p-5 rounded-2xl">
                <p className="text-2xl font-bold">$2M+</p>
                <p className="text-xs opacity-60">Tracked</p>
              </div>
            </div>

            {/* Quote */}
            <div className="mt-10 p-5 bg-white/5 rounded-2xl border border-white/10">
              <p className="text-white/70 text-sm italic">
                "FinAI gives me complete control over my spending."
              </p>
              <p className="text-white/40 text-xs mt-3">
                — Verified User
              </p>
            </div>

          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Login;