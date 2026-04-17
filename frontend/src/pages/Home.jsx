import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  PieChart, 
  BarChart3, 
  Zap, 
  ChevronRight, 
  Shield,
  Clock
} from 'lucide-react';

// ✅ IMPORT LOCAL IMAGE
import heroImg from '../assets/hero.png';
import financeImg from '../assets/finance.png';

const Home = () => {
  const navigate = useNavigate();

  const features = [
    {
      title: 'Expense Tracking',
      description: 'Automatically categorize and monitor your daily spending.',
      icon: <TrendingUp className="w-6 h-6" />,
      color: 'bg-emerald-50 text-emerald-500',
    },
    {
      title: 'Budget Management',
      description: 'Set monthly limits and get alerts before overspending.',
      icon: <PieChart className="w-6 h-6" />,
      color: 'bg-blue-50 text-blue-500',
    },
    {
      title: 'Financial Analytics',
      description: 'Understand spending with charts and reports.',
      icon: <BarChart3 className="w-6 h-6" />,
      color: 'bg-purple-50 text-purple-500',
    },
    {
      title: 'AI Insights',
      description: 'Get smart suggestions based on your habits.',
      icon: <Zap className="w-6 h-6" />,
      color: 'bg-amber-50 text-amber-500',
    },
  ];

  return (
    <div className="min-h-screen bg-cream font-inter">
      {/* 🔹 NAVBAR */}
      <nav className="fixed top-0 inset-x-0 z-50 bg-white/70 backdrop-blur-lg border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer group" onClick={() => navigate('/')}>
            <div className="w-10 h-10 bg-primary text-white rounded-xl flex items-center justify-center font-bold text-xl shadow-lg shadow-primary/20 group-hover:scale-105 transition-transform">
              F
            </div>
            <span className="font-outfit text-2xl font-bold tracking-tight text-text-main">FinAI</span>
          </div>

          <div className="hidden md:flex items-center gap-10">
            <a href="/" className="text-sm font-semibold text-text-main hover:text-primary transition-colors">Home</a>
            <a href="#features" className="text-sm font-semibold text-text-secondary hover:text-primary transition-colors">Features</a>
            <a href="#about" className="text-sm font-semibold text-text-secondary hover:text-primary transition-colors">About</a>
          </div>

          <div className="flex items-center gap-4">
            <Link to="/login" className="text-sm font-bold text-text-main hover:text-primary px-4 py-2 transition-colors">
              Login
            </Link>
            <Link 
              to="/register" 
              className="px-6 py-2.5 bg-primary text-white rounded-xl font-bold text-sm shadow-lg shadow-primary/25 hover:bg-primary-hover hover:-translate-y-0.5 transition-all"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      <main className="pt-20">
        {/* 🔹 HERO */}
        <section className="relative px-6 py-20 lg:py-32 overflow-hidden">
          <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-bold mb-6">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                </span>
                POWERED BY ADVANCED AI
              </div>

              <h1 className="font-outfit text-6xl md:text-7xl font-bold text-text-main tracking-tight leading-[1.1] mb-8">
                Smart Personal <br />
                Finance <span className="text-gradient">Analyzer</span>
              </h1>

              <p className="text-xl text-text-secondary leading-relaxed mb-10 max-w-lg">
                Experience the future of money management. Track income, monitor expenses, and get AI-powered insights to reach your goals faster.
              </p>

              <div className="flex flex-wrap gap-4">
                <button 
                  onClick={() => navigate('/register')} 
                  className="px-8 py-4 bg-primary text-white rounded-2xl font-bold text-lg shadow-xl shadow-primary/30 hover:bg-primary-hover hover:-translate-y-1 transition-all flex items-center gap-2"
                >
                  Start Saving Now <ChevronRight size={20} />
                </button>
                <button 
                  onClick={() => navigate('/login')} 
                  className="px-8 py-4 bg-white text-text-main border border-gray-200 rounded-2xl font-bold text-lg hover:bg-gray-50 transition-all shadow-sm"
                >
                  Explore App
                </button>
              </div>

              <div className="mt-12 flex items-center gap-8">
                <div>
                  <p className="text-2xl font-bold text-text-main">10k+</p>
                  <p className="text-sm font-medium text-text-secondary">Active Users</p>
                </div>
                <div className="w-px h-8 bg-gray-200"></div>
                <div>
                  <p className="text-2xl font-bold text-text-main">98%</p>
                  <p className="text-sm font-medium text-text-secondary">Accuracy</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="absolute -inset-4 bg-primary/20 rounded-3xl blur-3xl -z-10"></div>
              <img 
                src={heroImg} 
                alt="FinAI Dashboard" 
                className="w-full h-auto rounded-[2rem] shadow-2xl border border-white/50 transform lg:rotate-2 hover:rotate-0 transition-transform duration-700"
              />
              <div className="absolute -bottom-10 -left-10 p-6 bg-white rounded-3xl shadow-2xl border border-gray-100 hidden md:block animate-bounce-slow">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-emerald-200">
                    <TrendingUp size={24} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-text-secondary">Monthly Savings</p>
                    <p className="text-xl font-black text-text-main">+₹1,240.50</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* 🔹 FEATURES */}
        <section id="features" className="px-6 py-24 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="text-center max-w-2xl mx-auto mb-20">
              <h2 className="font-outfit text-4xl md:text-5xl font-bold text-text-main mb-6">
                Built for <span className="text-gradient">modern finance</span>
              </h2>
              <p className="text-lg text-text-secondary">
                Powerful tools to help you take control of your financial life. Simple, smart, and secure.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((f, i) => (
                <div key={i} className="group p-8 bg-cream/50 rounded-3xl border border-transparent hover:border-primary/20 hover:bg-white hover:shadow-xl transition-all duration-300">
                  <div className={`w-14 h-14 ${f.color} rounded-2xl flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform`}>
                    {f.icon}
                  </div>
                  <h3 className="text-xl font-bold text-text-main mb-3">{f.title}</h3>
                  <p className="text-text-secondary leading-relaxed">{f.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 🔹 ABOUT / SECURITY */}
        <section id="about" className="px-6 py-24">
          <div className="max-w-7xl mx-auto bg-primary rounded-[3rem] p-8 md:p-16 lg:p-24 overflow-hidden relative">
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-black/5 rounded-full blur-3xl -ml-20 -mb-20"></div>
            
            <div className="grid lg:grid-cols-2 gap-16 items-center relative z-10">
              <div className="order-2 lg:order-1">
                 <img src={financeImg} alt="Security" className="w-full h-auto rounded-3xl shadow-2xl transform lg:-rotate-2" />
              </div>
              
              <div className="text-white order-1 lg:order-2">
                <h2 className="font-outfit text-4xl md:text-5xl font-bold mb-8 leading-tight">
                  Bank-grade security <br />
                  you can trust 100%
                </h2>
                <p className="text-xl text-white/80 mb-10 leading-relaxed">
                  Your financial data is protected with 256-bit AES encryption. We never store your bank credentials and maintain the highest security standards.
                </p>

                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md">
                      <Shield className="text-white" size={24} />
                    </div>
                    <div>
                      <p className="font-bold text-lg">Secure & Encrypted</p>
                      <p className="text-white/70">End-to-end data encryption protocol.</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md">
                      <Clock className="text-white" size={24} />
                    </div>
                    <div>
                      <p className="font-bold text-lg">Real-time Monitoring</p>
                      <p className="text-white/70">Instant alerts for any unusual activity.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 🔹 CONTACT */}
<section id="contact" className="px-6 py-24 bg-white">
  <div className="max-w-4xl mx-auto">
    <div className="bg-cream rounded-[2.5rem] p-8 md:p-12 shadow-xl border border-gray-100 flex flex-col md:flex-row gap-12 items-center">

      {/* LEFT SIDE */}
      <div className="md:w-1/2">
        <p className="text-xs font-bold text-primary uppercase tracking-widest mb-2">
          Contact Us
        </p>

        <h3 className="font-outfit text-3xl font-bold text-text-main mb-4">
          Have questions?
        </h3>

        <p className="text-text-secondary mb-8 leading-relaxed">
          Our team is here to help you get the most out of FinAI. Reach out anytime.
        </p>

        <div className="space-y-2">
          <p className="font-semibold text-text-main">Email: help@finai.io</p>
          <p className="font-semibold text-text-main">Phone: 9845782091</p>
        </div>
      </div>

      {/* RIGHT SIDE FORM */}
      <form className="md:w-1/2 w-full space-y-5">

        {/* NAME */}
        <input
          type="text"
          placeholder="Your Name"
          className="w-full px-5 py-4 bg-white rounded-2xl border border-gray-200 
          focus:border-primary focus:ring-4 focus:ring-primary/10 
          transition-all shadow-sm outline-none"
        />

        {/* EMAIL */}
        <input
          type="email"
          placeholder="Email Address"
          className="w-full px-5 py-4 bg-white rounded-2xl border border-gray-200 
          focus:border-primary focus:ring-4 focus:ring-primary/10 
          transition-all shadow-sm outline-none"
        />

        {/* MESSAGE */}
        <textarea
          placeholder="How can we help?"
          rows="4"
          className="w-full px-5 py-4 bg-white rounded-2xl border border-gray-200 
          focus:border-primary focus:ring-4 focus:ring-primary/10 
          transition-all shadow-sm resize-none outline-none"
        ></textarea>

        {/* BUTTON */}
        <button
          type="submit"
          className="w-full py-4 bg-primary text-white rounded-2xl font-bold 
          shadow-lg shadow-primary/30 hover:bg-primary-hover 
          hover:-translate-y-0.5 transition-all active:scale-[0.98]"
        >
          Send Message
        </button>

      </form>
    </div>
  </div>
</section>

        {/* 🔹 FOOTER */}
        <footer className="px-6 py-12 bg-cream text-center">
          <div className="max-w-7xl mx-auto border-t border-gray-200 pt-12">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold">F</div>
              <span className="font-outfit text-xl font-bold text-text-main">FinAI</span>
            </div>
            <p className="text-sm text-text-secondary font-medium">
              &copy; {new Date().getFullYear()} FinAI Technologies Inc. All rights reserved.
            </p>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default Home;