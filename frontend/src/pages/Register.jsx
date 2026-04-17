// import { useState } from "react";
// import { useNavigate, Link } from "react-router-dom";
// import { motion } from "framer-motion";
// import { ArrowRight } from "lucide-react";

// import api from "../api/axios";

// const Register = () => {
//   const [formData, setFormData] = useState({
//     username: "",
//     email: "",
//     password: ""
//   });

//   const [error, setError] = useState("");
//   const navigate = useNavigate();

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!formData.username || !formData.email || !formData.password) {
//       setError("Incomplete registration parameters");
//       return;
//     }

//     try {
//       await api.post("accounts/register/", formData);
//       navigate("/login");
//     } catch (err) {
//       setError(
//         err.response?.data?.username?.[0] ||
//         err.response?.data?.email?.[0] ||
//         "Registration failure. Integrity conflict likely."
//       );
//     }
//   };

//   return (
//     <div className="min-h-screen grid lg:grid-cols-2 font-inter bg-cream selection:bg-primary/20">
//       {/* 🔹 FORM SIDE */}
//       <div className="flex flex-col justify-center px-6 py-12 md:px-20">
//         <div className="max-w-sm w-full mx-auto">
//           {/* Logo */}
//           <div className="flex items-center gap-2.5 mb-12 cursor-pointer group" onClick={() => navigate('/')}>
//             <div className="w-9 h-9 bg-primary text-white rounded-xl flex items-center justify-center font-bold text-lg shadow-lg shadow-primary/20 group-hover:scale-105 transition-transform">
//               F
//             </div>
//             <span className="font-outfit text-xl font-bold tracking-tight text-text-main">FinAI</span>
//           </div>

//           <div className="mb-10">
//             <h1 className="font-outfit text-3xl font-bold text-text-main tracking-tight mb-2 italic">Node Registration</h1>
//             <p className="text-[12px] text-text-secondary font-bold uppercase tracking-widest opacity-60">Join the collective network</p>
//           </div>

//           <form onSubmit={handleSubmit} className="space-y-4">
//             {error && (
//               <motion.div 
//                 initial={{ opacity: 0, scale: 0.95 }}
//                 animate={{ opacity: 1, scale: 1 }}
//                 className="p-3.5 bg-red-50 border border-red-100 rounded-xl text-red-500 text-[11px] font-black uppercase tracking-wide flex items-center gap-2"
//               >
//                 <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></div>
//                 {error}
//               </motion.div>
//             )}

//             <div className="space-y-1.5">
//               <label className="text-[11px] font-black text-text-secondary uppercase tracking-widest ml-1 opacity-50">Operational Handle</label>
//               <input
//                 type="text"
//                 placeholder="Choose unique identifier"
//                 className="w-full px-4 py-3 bg-white rounded-xl border border-gray-100 focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all shadow-sm outline-none text-sm font-bold text-text-main placeholder:text-gray-200"
//                 value={formData.username}
//                 onChange={(e) => setFormData({ ...formData, username: e.target.value })}
//               />
//             </div>

//             <div className="space-y-1.5">
//               <label className="text-[11px] font-black text-text-secondary uppercase tracking-widest ml-1 opacity-50">Digital Communication</label>
//               <input
//                 type="email"
//                 placeholder="name@nexus.com"
//                 className="w-full px-4 py-3 bg-white rounded-xl border border-gray-100 focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all shadow-sm outline-none text-sm font-bold text-text-main placeholder:text-gray-200"
//                 value={formData.email}
//                 onChange={(e) => setFormData({ ...formData, email: e.target.value })}
//               />
//             </div>

//             <div className="space-y-1.5">
//               <label className="text-[11px] font-black text-text-secondary uppercase tracking-widest ml-1 opacity-50">Encryption Key</label>
//               <input
//                 type="password"
//                 placeholder="••••••••••••"
//                 className="w-full px-4 py-3 bg-white rounded-xl border border-gray-100 focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all shadow-sm outline-none text-sm font-bold text-text-main placeholder:text-gray-200"
//                 value={formData.password}
//                 onChange={(e) => setFormData({ ...formData, password: e.target.value })}
//               />
//             </div>

//             <button 
//               type="submit" 
//               className="w-full py-3.5 bg-text-main text-white rounded-xl font-black text-[12px] uppercase tracking-[0.2em] shadow-xl shadow-text-main/20 hover:bg-black hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 active:scale-[0.98] mt-4"
//             >
//               Establish Node <ArrowRight size={16} />
//             </button>
//           </form>

//           <p className="mt-8 text-center text-[12px] text-text-secondary font-medium">
//             Member already? <Link to="/login" className="text-primary font-black uppercase tracking-widest hover:underline ml-1">Authenticate</Link>
//           </p>
//         </div>
//       </div>

//       {/* 🔹 VISUAL SIDE */}
//       <div className="hidden lg:flex bg-primary relative overflow-hidden items-center justify-center px-16">
//         <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-white opacity-20 rounded-full blur-[120px] -mr-40 -mt-40"></div>
//         <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-white opacity-10 rounded-full blur-[100px] -ml-20 -mb-20"></div>
        
//         <div className="relative z-10 text-center max-w-sm">
//           <motion.div
//             initial={{ opacity: 0, y: 10 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.6 }}
//           >
//             <h2 className="font-outfit text-4xl font-black text-white leading-tight mb-8 tracking-tighter italic">
//               Scale Your <br />
//               <span className="opacity-30">Capital.</span>
//             </h2>
            
//             <div className="grid grid-cols-2 gap-4 text-white">
//               <div className="bg-white/10 backdrop-blur-md border border-white/20 p-5 rounded-2xl text-left">
//                 <p className="text-2xl font-black mb-1">98%</p>
//                 <p className="text-[9px] font-black text-white/40 uppercase tracking-widest">Accuracy</p>
//               </div>
//               <div className="bg-white/10 backdrop-blur-md border border-white/20 p-5 rounded-2xl text-left">
//                 <p className="text-2xl font-black mb-1">$450+</p>
//                 <p className="text-[9px] font-black text-white/40 uppercase tracking-widest">Avg. Yield</p>
//               </div>
//             </div>

//             <div className="mt-10 p-5 bg-white/5 rounded-2xl border border-white/10">
//                <p className="text-white/60 text-[12px] font-medium italic leading-relaxed">
//                   "Systematic approach to wealth. The insights are non-negotiable for my workflow."
//                </p>
//                <div className="flex items-center justify-center gap-2 mt-4">
//                   <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
//                   <p className="text-white/40 text-[10px] uppercase font-black tracking-widest">S. Jenkins, Designer</p>
//                </div>
//             </div>
//           </motion.div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Register;

import { useState, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  ArrowRight, 
  Eye, 
  EyeOff,
  Check
} from "lucide-react";

import api from "../api/axios";

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: ""
  });

  const [accountType, setAccountType] = useState("personal"); // personal or business
  const [companyName, setCompanyName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const emailParam = params.get("email");
    if (emailParam) {
      setFormData(prev => ({ ...prev, email: emailParam }));
    }
  }, [location]);


  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.username || !formData.email || !formData.password) {
      setError("Please fill in all required fields");
      return;
    }

    if (accountType === "business" && !companyName) {
      setError("Company name is required for business accounts");
      return;
    }

    try {
      await api.post("accounts/register/", { 
        ...formData, 
        account_type: accountType, 
        company_name: companyName 
      });
      navigate("/login");
    } catch (err) {
      setError(
        err.response?.data?.error ||
        err.response?.data?.username?.[0] ||
        err.response?.data?.email?.[0] ||
        "Registration failed. Please try again."
      );
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 font-inter bg-cream selection:bg-primary/20">
      
      {/* 🔹 LEFT SIDE (FORM) */}
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
              Create your account
            </h1>
            <p className="text-sm text-text-secondary">
              Start managing your finances smarter with AI-powered insights.
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

            {/* ACCOUNT TYPE TOGGLE */}
            <div className="flex gap-2 p-1 bg-gray-100 rounded-xl mb-6">
              <button 
                type="button"
                onClick={() => setAccountType("personal")}
                className={`flex-1 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${accountType === 'personal' ? 'bg-white text-primary shadow-sm' : 'text-gray-400'}`}
              >
                Personal
              </button>
              <button 
                type="button"
                onClick={() => setAccountType("business")}
                className={`flex-1 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${accountType === 'business' ? 'bg-white text-primary shadow-sm' : 'text-gray-400'}`}
              >
                Business
              </button>
            </div>

            {/* Username */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-text-secondary">
                Username
              </label>
              <input
                type="text"
                placeholder="Enter your username"
                className="w-full px-4 py-3 bg-white rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none text-sm"
                value={formData.username}
                onChange={(e) =>
                  setFormData({ ...formData, username: e.target.value })
                }
              />
            </div>

            {/* Email */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-text-secondary">
                Email Address
              </label>
              <input
                type="email"
                placeholder="you@example.com"
                className="w-full px-4 py-3 bg-white rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none text-sm"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
            </div>

            {/* COMPANY NAME (BUSINESS ONLY) */}
            {accountType === "business" && (
               <div className="space-y-1 animate-in fade-in slide-in-from-top-2 duration-300">
                <label className="text-xs font-semibold text-text-secondary">
                  Company Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Acme Corp"
                  className="w-full px-4 py-3 bg-white rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none text-sm"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                />
              </div>
            )}

            {/* Password */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-text-secondary">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a strong password"
                  className="w-full px-4 py-3 bg-white rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none text-sm pr-11"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-text-main transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Button */}
            <button 
              type="submit" 
              className="w-full py-3 bg-primary text-white rounded-xl font-semibold text-sm shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 mt-2"
            >
              Get Started <ArrowRight size={16} />
            </button>
          </form>

          {/* Login */}
          <p className="mt-8 text-center text-sm text-text-secondary">
            Already have an account?
            <Link 
              to="/login" 
              className="text-primary font-semibold hover:underline ml-1"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>

      {/* 🔹 RIGHT SIDE (VISUAL) */}
      <div 
        className="hidden lg:flex relative overflow-hidden items-center justify-center px-16 bg-cover bg-center bg-primary"
        style={{ 
          backgroundImage: `url('/bg-register.png')` 
        }}
      >
        {/* Dark Overlay for readability */}
        <div className="absolute inset-0 bg-primary/60 backdrop-blur-[1px]"></div>

        {/* Glow effects */}
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-white opacity-10 rounded-full blur-[120px] -mr-40 -mt-40"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-white opacity-5 rounded-full blur-[100px] -ml-20 -mb-20"></div>

        <div className="relative z-10 text-center max-w-sm">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >

            <h2 className="font-outfit text-4xl font-bold text-white leading-tight mb-6">
              Take control of your <br />
              <span className="opacity-70">financial future.</span>
            </h2>

            <p className="text-white/80 text-sm mb-8">
              Track expenses, analyze trends, and grow your savings with AI.
            </p>

            {/* Feature Highlights */}
            <div className="mt-8 space-y-3">
              {[
                "Multi-Tenant Secure Data Isolation",
                "Role-Based Approval Workflows",
                "AI-Powered Financial Insights"
              ].map((feature, i) => (
                <div key={i} className="flex items-center gap-3 bg-white/10 backdrop-blur-md border border-white/10 p-4 rounded-xl text-left">
                  <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                    <Check size={14} className="text-white" />
                  </div>
                  <span className="text-sm font-semibold text-white/90">{feature}</span>
                </div>
              ))}
            </div>

          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Register;