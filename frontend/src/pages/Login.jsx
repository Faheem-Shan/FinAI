import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Eye, EyeOff, ShieldCheck, Lock, Fingerprint } from "lucide-react";

import api from "../api/axios";
import { AuthContext } from "../context/AuthContext";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      setError("Please enter your username and password");
      return;
    }
    try {
      const response = await api.post("accounts/login/", { username, password });
      const { access, refresh } = response.data;
      localStorage.setItem("access", access);
      localStorage.setItem("refresh", refresh);
      login(access);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.detail || "Invalid credentials. Please try again.");
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 font-inter bg-[var(--bg-card)] selection:bg-primary/20">

      {/* 🔹 LEFT SIDE */}
      <div className="flex flex-col justify-center px-6 py-12 md:px-20">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-sm w-full mx-auto"
        >

          {/* Logo */}
          <motion.div
            variants={itemVariants}
            className="flex items-center gap-2.5 mb-12 cursor-pointer group"
            onClick={() => navigate('/')}
          >
            <div className="w-9 h-9 bg-primary text-white rounded-xl flex items-center justify-center font-bold text-lg shadow-lg shadow-primary/20 group-hover:scale-105 transition-transform">
              F
            </div>
            <span className="font-bold text-xl tracking-tight text-main">
              FinAI
            </span>
          </motion.div>

          {/* Title */}
          <motion.div variants={itemVariants} className="mb-10">
            <h1 className="text-3xl font-bold text-main tracking-tight mb-2">
              Welcome back
            </h1>
            <p className="text-sm text-secondary">
              Sign in to continue managing your finances.
            </p>
          </motion.div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">

            {error && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="p-3 bg-red-50 border border-red-100 rounded-xl text-red-500 text-sm"
              >
                {error}
              </motion.div>
            )}

            {/* Username */}
            <motion.div variants={itemVariants} className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-secondary/70">
                Username
              </label>
              <input
                type="text"
                placeholder="Enter your username"
                className="w-full px-4 py-3 bg-[rgba(0,0,0,0.02)] dark:bg-[rgba(255,255,255,0.02)] border border-[var(--border)] rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none text-sm"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </motion.div>

            {/* Password */}
            <motion.div variants={itemVariants} className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold uppercase tracking-wider text-secondary/70">
                  Password
                </label>
                <Link to="/forgot-password" size={14} className="text-xs text-primary font-bold hover:underline">
                  Forgot?
                </Link>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 bg-[rgba(0,0,0,0.02)] dark:bg-[rgba(255,255,255,0.02)] border border-[var(--border)] rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none text-sm"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary hover:text-primary transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </motion.div>

            {/* Button */}
            <motion.button
              variants={itemVariants}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              type="submit"
              className="w-full py-3 bg-primary text-white rounded-xl font-bold text-sm shadow-lg shadow-primary/20 hover:bg-primary-dark transition-all flex items-center justify-center gap-2 mt-2"
            >
              Sign In <ArrowRight size={16} />
            </motion.button>
          </form>

          {/* Register link */}
          <motion.p variants={itemVariants} className="mt-8 text-center text-sm text-secondary">
            Don’t have an account?
            <Link to="/register" className="text-primary font-bold hover:underline ml-1">
              Create one
            </Link>
          </motion.p>

        </motion.div>
      </div>

      {/* 🔹 RIGHT SIDE */}
      <div
        className="hidden lg:flex relative overflow-hidden items-center justify-center px-16 bg-cover bg-center bg-primary"
        style={{ backgroundImage: `url('/bg-login.png')` }}
      >
        <div className="absolute inset-0 bg-primary/60 backdrop-blur-[1px]"></div>

        <div className="relative z-10 text-center max-w-sm">
          {/* Content removed for a neat minimalist look */}
        </div>
      </div>
    </div>
  );
};

export default Login;