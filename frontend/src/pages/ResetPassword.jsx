import { useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Lock, Eye, EyeOff, Loader2, CheckCircle2, ShieldCheck } from "lucide-react";
import authService from "../services/authService";

const ResetPassword = () => {
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  
  const { uid, token } = useParams();
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (loading) return;

    if (!formData.password.trim() || !formData.confirmPassword.trim()) {
      setError("Please fill in all fields.");
      return;
    }

    if (formData.password.trim() !== formData.confirmPassword.trim()) {
      setError("Passwords do not match.");
      return;
    }

    if (formData.password.trim().length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    setLoading(true);
    try {
      await authService.resetPassword(uid, token, formData.password.trim());
      setSuccess(true);
      // Automatically redirect after 3 seconds
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (err) {
      setError(err.response?.data?.error || err.response?.data?.detail || "Something went wrong. Please try again or request a new link.");
    } finally {
      setLoading(false);
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

          {!success ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              {/* Title */}
              <div className="mb-10">
                <h1 className="font-outfit text-3xl font-bold text-text-main tracking-tight mb-2">
                  Reset Password
                </h1>
                <p className="text-sm text-text-secondary leading-relaxed">
                  Choose a new, secure password for your FinAI account.
                </p>
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

                {/* Password */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-text-secondary px-1">
                    New Password
                  </label>
                  <div className="relative group">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary group-focus-within:text-primary transition-colors">
                      <Lock size={18} />
                    </div>
                    <input
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter new password"
                      className="w-full pl-12 pr-12 py-3.5 bg-white rounded-xl border border-gray-200 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none text-sm"
                      value={formData.password}
                      onChange={handleInputChange}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-text-main transition-colors"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-text-secondary px-1">
                    Confirm Password
                  </label>
                  <div className="relative group">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary group-focus-within:text-primary transition-colors">
                      <Lock size={18} />
                    </div>
                    <input
                      name="confirmPassword"
                      type={showPassword ? "text" : "password"}
                      placeholder="Confirm new password"
                      className="w-full pl-12 pr-4 py-3.5 bg-white rounded-xl border border-gray-200 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none text-sm"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                {/* Button */}
                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full py-3.5 bg-primary text-white rounded-xl font-semibold text-sm shadow-md shadow-primary/20 hover:shadow-lg hover:-translate-y-0.5 disabled:opacity-70 disabled:translate-y-0 disabled:shadow-none transition-all flex items-center justify-center gap-2 mt-2"
                >
                  {loading ? (
                    <>
                      <Loader2 size={18} className="animate-spin" /> Updating...
                    </>
                  ) : (
                    "Reset Password"
                  )}
                </button>
              </form>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-green-50 text-green-500 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-green-100 shadow-sm shadow-green-100/50">
                <CheckCircle2 size={32} />
              </div>
              <h2 className="font-outfit text-2xl font-bold text-text-main mb-3">Password updated!</h2>
              <p className="text-sm text-text-secondary leading-relaxed mb-8">
                Your password has been successfully reset. Redirecting you to login...
              </p>
              
              <Link 
                to="/login" 
                className="inline-flex items-center justify-center w-full py-3.5 bg-primary text-white rounded-xl font-semibold text-sm hover:shadow-lg transition-all"
              >
                Go to Login Now
              </Link>
            </motion.div>
          )}
        </div>
      </div>

      {/* 🔹 RIGHT SIDE - Visual Element */}
      <div className="hidden lg:flex bg-primary relative overflow-hidden items-center justify-center px-16">
        <div className="absolute top-0 right-0 w-[700px] h-[700px] bg-white opacity-20 rounded-full blur-[120px] -mr-40 -mt-40"></div>
        <div className="relative z-10 text-center max-w-sm">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="w-20 h-20 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 flex items-center justify-center mx-auto mb-8 shadow-2xl">
              <ShieldCheck className="text-white" size={36} />
            </div>
            <h2 className="font-outfit text-4xl font-bold text-white leading-tight mb-6">
              Enhanced Security
            </h2>
            <p className="text-white/80 text-sm">
              Use a combination of uppercase, lowercase, numbers, and special characters to create a strong password.
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
