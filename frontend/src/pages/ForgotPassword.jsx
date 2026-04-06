import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Mail, Loader2, CheckCircle2 } from "lucide-react";
import authService from "../services/authService";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email.trim()) {
      setError("Please enter your email address");
      return;
    }

    setLoading(true);
    try {
      await authService.forgotPassword(email);
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.error || err.response?.data?.detail || "Something went wrong. Please try again.");
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
                  Forgot password?
                </h1>
                <p className="text-sm text-text-secondary leading-relaxed">
                  No worries! Enter your email below and we'll send you instructions to reset your password.
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-5">
                {error && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-3 bg-red-50 border border-red-100 rounded-xl text-red-500 text-sm"
                  >
                    {error}
                  </motion.div>
                )}

                {/* Email */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-text-secondary px-1">
                    Email Address
                  </label>
                  <div className="relative group">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary group-focus-within:text-primary transition-colors">
                      <Mail size={18} />
                    </div>
                    <input
                      type="email"
                      placeholder="e.g. name@example.com"
                      className="w-full pl-12 pr-4 py-3.5 bg-white rounded-xl border border-gray-200 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none text-sm placeholder:text-gray-400"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
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
                      <Loader2 size={18} className="animate-spin" /> Sending Link...
                    </>
                  ) : (
                    "Send Reset Link"
                  )}
                </button>

                {/* Return to Login */}
                <Link 
                  to="/login" 
                  className="flex items-center justify-center gap-2 text-sm text-text-secondary hover:text-primary transition-colors mt-4 py-2"
                >
                  <ArrowLeft size={16} /> Back to Sign In
                </Link>
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
              <h2 className="font-outfit text-2xl font-bold text-text-main mb-3">Check your inbox</h2>
              <p className="text-sm text-text-secondary leading-relaxed mb-8">
                We've sent a password reset link to <span className="font-semibold text-text-main">{email}</span>. Please check your email and follow the instructions.
              </p>
              
              <Link 
                to="/login" 
                className="inline-flex items-center justify-center w-full py-3.5 bg-white border border-gray-200 text-text-main rounded-xl font-semibold text-sm hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm"
              >
                Return to Login
              </Link>

              <p className="mt-8 text-xs text-text-secondary">
                Didn't receive the email? Check your spam folder or 
                <button 
                  onClick={handleSubmit} 
                  className="text-primary font-semibold hover:underline ml-1"
                >
                  try again
                </button>
              </p>
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
              <Mail className="text-white" size={36} />
            </div>
            <h2 className="font-outfit text-4xl font-bold text-white leading-tight mb-6">
              Password Recovery
            </h2>
            <p className="text-white/80 text-sm">
              Securing your financial data is our priority. Follow the steps to regain access to your account safely.
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
