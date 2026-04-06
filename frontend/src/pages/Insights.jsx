import { useState, useEffect } from "react";
import api from "../api/axios";
import { Sparkles, Brain, ArrowRight, Lightbulb, AlertTriangle, ShieldCheck } from "lucide-react";

const Insights = () => {
  const [insights, setInsights] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInsights = async () => {
      try {
        const res = await api.get("finance/insights/");
        setInsights(res.data);
      } catch (err) {
        console.error("❌ INSIGHTS ERROR:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchInsights();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <div className="relative">
          <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
          <Sparkles className="absolute -top-2 -right-2 text-yellow-400 animate-pulse" size={20} />
        </div>
        <p className="text-sm font-semibold text-text-secondary animate-pulse">Running AI Analysis...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-10 space-y-10 font-outfit">
      
      {/* 🔹 HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-primary font-black uppercase text-[10px] tracking-widest mb-1">
            <Brain size={14} /> Neural Analysis Engine
          </div>
          <h1 className="text-4xl font-black text-text-main leading-tight italic">
            Financial <span className="text-primary">Insights</span>
          </h1>
          <p className="text-sm text-text-secondary font-medium mt-1">
            AI-driven patterns detected in your spending habits.
          </p>
        </div>

        <div className="bg-white px-4 py-2 rounded-xl border-2 border-gray-100 flex items-center gap-3">
           <div className="w-2 h-2 rounded-full bg-green-500 animate-ping" />
           <span className="text-[11px] font-black uppercase text-text-secondary tracking-tight">Active Sync</span>
        </div>
      </div>

      {/* 🔹 GRID */}
      <div className="grid gap-6">
        {insights.map((insight, idx) => (
          <div 
            key={idx}
            className={`group p-8 rounded-3xl border-2 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 cursor-default
              ${insight.type === 'warning' 
                ? 'bg-red-50/50 border-red-100 hover:border-red-200' 
                : 'bg-emerald-50/30 border-emerald-100 hover:border-emerald-200'}`}
          >
            <div className="flex items-start gap-6">
              <div className={`p-4 rounded-2xl shadow-lg
                ${insight.type === 'warning' ? 'bg-white text-red-500' : 'bg-white text-emerald-500'}`}>
                {insight.type === 'warning' ? <AlertTriangle size={28} /> : <ShieldCheck size={28} />}
              </div>

              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className={`text-xl font-bold ${insight.type === 'warning' ? 'text-red-900' : 'text-emerald-900'}`}>
                    {insight.title}
                  </h3>
                  <span className={`text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest
                    ${insight.type === 'warning' ? 'bg-red-500 text-white' : 'bg-emerald-500 text-white'}`}>
                    {insight.type}
                  </span>
                </div>
                
                <p className="text-sm text-text-secondary mt-3 leading-relaxed font-medium max-w-lg">
                  {insight.description}
                </p>

                <div className="mt-6 flex items-center gap-2 text-[11px] font-black uppercase tracking-tighter text-primary group-hover:gap-4 transition-all">
                  View Detail Analysis <ArrowRight size={14} />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 🔹 BOTTOM INFO */}
      <div className="p-8 rounded-[32px] bg-slate-900 text-white overflow-hidden relative">
         <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
               <h4 className="text-lg font-bold">Optimization Suggestion</h4>
               <p className="text-sm text-slate-400 mt-1">Based on current flow, you could save $340/mo by switching to yearly plans.</p>
            </div>
            <button className="px-6 py-3 bg-[var(--color-primary)] rounded-2xl font-bold text-sm whitespace-nowrap hover:scale-105 transition-all">
               Activate Smart Saver
            </button>
         </div>
         <div className="absolute right-0 top-0 opacity-10 -rotate-12 translate-x-12 -translate-y-12">
            <Lightbulb size={240} />
         </div>
      </div>

    </div>
  );
};

export default Insights;
