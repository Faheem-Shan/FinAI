// import { useEffect, useState, useContext } from "react";
// import api from "../api/axios";
// import { AuthContext } from "../context/AuthContext";
// import { 
//   LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
//   PieChart, Pie, Cell, Legend 
// } from 'recharts';
// import { 
//   TrendingUp, TrendingDown, Brain, AlertTriangle, CheckCircle, Info, 
//   DollarSign, PieChart as PieIcon, Activity, Target
// } from 'lucide-react';

// const Insights = () => {
//   const [transactions, setTransactions] = useState([]);
//   const [prediction, setPrediction] = useState(null);
//   const [ruleInsights, setRuleInsights] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const { user } = useContext(AuthContext);

//   useEffect(() => {
//     loadAllInsights();
//   }, []);

//   const loadAllInsights = async () => {
//     try {
//       setLoading(true);
//       // 1. Fetch Transactions for charts
//       const res = await api.get("finance/transactions/");
//       const data = res.data;
//       setTransactions(data);

//       // 2. Fetch Rule-based insights from Backend
//       const insightRes = await api.get("finance/insights/");
//       setRuleInsights(insightRes.data);

//       // 3. AI Prediction (spending)
//       const validExpenses = data.filter(t => 
//         t.type === "expense" && (user.company ? t.status === "approved" : true)
//       );

//       if (validExpenses.length > 0) {
//         const amounts = validExpenses.map(t => parseFloat(t.amount));
//         const ai = await fetch("http://127.0.0.1:8001/predict-spending", {
//           method: "POST",
//           headers: {"Content-Type":"application/json"},
//           body: JSON.stringify({ amounts })
//         });
//         const result = await ai.json();
//         setPrediction(result.prediction);
//       } else {
//         setPrediction(0);
//       }
//     } catch (err) {
//       console.error("Failed to load insights", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // 🧪 DATA PROCESSING
//   const expensesOnly = transactions.filter(t => t.type === 'expense' && (user.company ? t.status === 'approved' : true));
//   const totalSpending = expensesOnly.reduce((sum, t) => sum + parseFloat(t.amount), 0);

//   // 📊 Trend Data (Aggregated by Unique Date)
//   const groupedData = {};
//   expensesOnly.forEach(t => {
//     const dateKey = new Date(t.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
//     groupedData[dateKey] = (groupedData[dateKey] || 0) + parseFloat(t.amount);
//   });

//   const trendData = Object.keys(groupedData).map(date => ({
//     date,
//     amount: groupedData[date],
//     rawDate: new Date(date) // for sorting
//   })).sort((a, b) => a.rawDate - b.rawDate);

//   // 🍩 Category Data
//   const categoryMap = {};
//   expensesOnly.forEach(t => {
//     const cat = t.category_name || "General";
//     categoryMap[cat] = (categoryMap[cat] || 0) + parseFloat(t.amount);
//   });
//   const pieData = Object.keys(categoryMap).map(name => ({ name, value: categoryMap[name] }));

//   const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

//   if (loading) return (
//     <div className="min-h-[60vh] flex items-center justify-center">
//       <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
//     </div>
//   );

//   return (
//     <div className="p-6 max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
//       {/* 🚀 HEADER & ROLE */}
//       <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
//         <div>
//           <h1 className="text-3xl font-black text-main flex items-center gap-3">
//             <Brain className="text-primary" /> AI Insights & Analysis
//           </h1>
//           <p className="text-secondary font-medium mt-1">Smart tracking powered by your historical patterns.</p>
//         </div>
//         <div className="flex items-center gap-3 px-4 py-2 bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl">
//           <Activity size={18} className="text-primary" />
//           <span className="text-xs font-black uppercase tracking-widest text-secondary">
//             Role: <span className="text-primary">{user?.role || "Personal Account"}</span>
//           </span>
//         </div>
//       </div>

//       {/* 💰 TOP CARDS GRID */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
//         {/* Total Spending */}
//         <div className="card p-6 border-l-4 border-emerald-500">
//           <div className="flex justify-between items-start mb-4">
//             <div className="p-3 bg-emerald-50 rounded-xl text-emerald-600">
//               <DollarSign size={24} />
//             </div>
//             <span className="text-[10px] font-black uppercase tracking-widest px-2 py-1 bg-emerald-50 text-emerald-700 rounded-lg">Verified</span>
//           </div>
//           <p className="text-sm font-bold text-secondary mb-1">Total Spending</p>
//           <h2 className="text-3xl font-black text-main">₹{totalSpending.toLocaleString()}</h2>
//         </div>

//         {/* Prediction */}
//         <div className="card p-6 border-l-4 border-primary">
//           <div className="flex justify-between items-start mb-4">
//             <div className="p-3 bg-primary/10 rounded-xl text-primary">
//               <TrendingUp size={24} />
//             </div>
//             <span className="text-[10px] font-black uppercase tracking-widest px-2 py-1 bg-primary text-white rounded-lg">AI Forecast</span>
//           </div>
//           <p className="text-sm font-bold text-secondary mb-1">Next Period Predicted</p>
//           <h2 className="text-3xl font-black text-main">₹{prediction?.toLocaleString() || '0'}</h2>
//         </div>

//         {/* Health */}
//         <div className="card p-6 border-l-4 border-blue-500">
//           <div className="flex justify-between items-start mb-4">
//             <div className="p-3 bg-blue-50 rounded-xl text-blue-600">
//               <Target size={24} />
//             </div>
//             <span className="text-[10px] font-black uppercase tracking-widest px-2 py-1 bg-blue-50 text-blue-700 rounded-lg">Goal Status</span>
//           </div>
//           <p className="text-sm font-bold text-secondary mb-1">Financial Health</p>
//           <h2 className="text-3xl font-black text-main">
//             {totalSpending > prediction ? "Exceeding" : "On Track"}
//           </h2>
//         </div>
//       </div>

//       {/* 📊 CHARTS SECTION */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
//         {/* Spending Trend */}
//         <div className="card p-6 flex flex-col h-[400px]">
//           <h3 className="text-lg font-black text-main mb-6 flex items-center gap-2">
//             <TrendingDown size={20} className="text-primary" /> Recent Spending Trend
//           </h3>
//           <div className="flex-1 w-full">
//             <ResponsiveContainer width="100%" height="100%">
//               <AreaChart data={trendData}>
//                 <defs>
//                   <linearGradient id="colorAmt" x1="0" y1="0" x2="0" y2="1">
//                     <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
//                     <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
//                   </linearGradient>
//                 </defs>
//                 <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
//                 <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
//                 <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
//                 <Tooltip 
//                   contentStyle={{ 
//                     borderRadius: '16px', 
//                     border: 'none', 
//                     boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
//                     fontWeight: 'bold'
//                   }} 
//                 />
//                 <Area type="monotone" dataKey="amount" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorAmt)" />
//               </AreaChart>
//             </ResponsiveContainer>
//           </div>
//         </div>

//         {/* Category Breakdown */}
//         <div className="card p-6 flex flex-col h-[400px]">
//           <h3 className="text-lg font-black text-main mb-6 flex items-center gap-2">
//             <PieIcon size={20} className="text-primary" /> Expenditure Breakdown
//           </h3>
//           <div className="flex-1 w-full">
//             <ResponsiveContainer width="100%" height="100%">
//               <PieChart>
//                 <Pie
//                   data={pieData}
//                   cx="50%"
//                   cy="45%"
//                   innerRadius={80}
//                   outerRadius={110}
//                   paddingAngle={5}
//                   dataKey="value"
//                 >
//                   {pieData.map((entry, index) => (
//                     <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
//                   ))}
//                 </Pie>
//                 <Tooltip />
//                 <Legend layout="horizontal" verticalAlign="bottom" align="center" wrapperStyle={{ paddingTop: '20px' }} />
//               </PieChart>
//             </ResponsiveContainer>
//           </div>
//         </div>
//       </div>

//       {/* 🤖 SMART RECOMMENDATIONS (AI ENGINE) */}
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
//         {/* AI Forecast Card */}
//         <div className="p-8 bg-primary rounded-3xl text-white shadow-2xl shadow-primary/30 relative overflow-hidden group">
//           <div className="absolute -right-10 -bottom-10 opacity-10 group-hover:scale-110 transition-transform duration-700">
//              <Brain size={250} />
//           </div>
          
//           <div className="relative z-10">
//             <h3 className="text-xl font-black mb-4 flex items-center gap-2">
//               <Brain size={24} /> FinAI Smart Suggestion
//             </h3>
//             <p className="text-white/80 font-medium leading-relaxed mb-6">
//               Based on your pattern of "{trendingCategory(transactions)}" expenses, our model predicts you will likely spend 
//               <span className="text-white font-black underline decoration-2 underline-offset-4 ml-1">
//                 ₹{prediction?.toLocaleString()}
//               </span> next period.
//             </p>
//             <div className="p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20">
//               <p className="text-sm font-bold flex items-center gap-2">
//                 <Info size={16} /> Tip: Try reducing "{trendingCategory(transactions)}" by 10% to save ₹{(prediction * 0.1).toFixed(0)}.
//               </p>
//             </div>
//           </div>
//         </div>

//         {/* System & Rule Insights */}
//         <div className="space-y-4">
//           <h3 className="text-lg font-black text-main mb-4 px-2">System Observations</h3>
//           {ruleInsights.length > 0 ? (
//             ruleInsights.map((ins, i) => (
//               <div key={i} className="flex items-start gap-4 p-4 bg-white border border-[var(--border)] rounded-2xl shadow-sm hover:translate-x-1 transition-transform">
//                 <div className={`p-2 rounded-xl mt-1 ${
//                   ins.type === 'warning' ? 'bg-amber-50 text-amber-600' : 
//                   ins.type === 'success' ? 'bg-emerald-50 text-emerald-600' : 
//                   'bg-blue-50 text-blue-600'
//                 }`}>
//                   {ins.type === 'warning' ? <AlertTriangle size={20} /> : <CheckCircle size={20} />}
//                 </div>
//                 <div>
//                   <h4 className="font-black text-main text-sm uppercase tracking-tight">{ins.title}</h4>
//                   <p className="text-sm text-secondary mt-0.5 leading-tight">{ins.description}</p>
//                 </div>
//               </div>
//             ))
//           ) : (
//             <div className="p-10 text-center border-2 border-dashed border-[var(--border)] rounded-3xl">
//               <p className="text-secondary font-bold">No anomalies detected in your spending yet. 🌟</p>
//             </div>
//           )}
//         </div>

//       </div>

//     </div>
//   );
// };

// // Helper for dynamic text
// const trendingCategory = (transactions) => {
//   const map = {};
//   transactions.filter(t => t.type === 'expense').forEach(t => {
//     map[t.category_name] = (map[t.category_name] || 0) + 1;
//   });
//   return Object.keys(map).reduce((a, b) => map[a] > map[b] ? a : b, "general");
// };

// export default Insights;

import { useEffect, useState, useContext } from "react";
import api from "../api/axios";
import { AuthContext } from "../context/AuthContext";
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend 
} from 'recharts';
import { 
  TrendingUp, TrendingDown, Brain, AlertTriangle, CheckCircle, Info, 
  DollarSign, PieChart as PieIcon, Activity, Target
} from 'lucide-react';

const Insights = () => {
  const [transactions, setTransactions] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [prediction, setPrediction] = useState(null);
  const [ruleInsights, setRuleInsights] = useState([]);
  const [loading, setLoading] = useState(true);

  const { user } = useContext(AuthContext);

  useEffect(() => {
    loadAllInsights();
  }, []);

  const loadAllInsights = async () => {
    try {
      setLoading(true);

      // 🔹 Transactions
      const res = await api.get("finance/transactions/");
      const data = res.data;
      setTransactions(data);

      // 🔹 Rule insights
      const insightRes = await api.get("finance/insights/");
      setRuleInsights(insightRes.data);

      // 🔹 Budgets
      const budgetRes = await api.get("finance/budgets/");
      setBudgets(budgetRes.data);

      // 🔹 AI Prediction (FIXED user?.company)
      const validExpenses = data.filter(t => 
        t.type === "expense" && (user?.company ? t.status === "approved" : true)
      );

      if (validExpenses.length > 0) {
        const amounts = validExpenses.map(t => parseFloat(t.amount));

        const ai = await fetch("http://127.0.0.1:8001/predict-spending", {
          method: "POST",
          headers: {"Content-Type":"application/json"},
          body: JSON.stringify({ amounts })
        });

        const result = await ai.json();
        setPrediction(result.prediction);
      } else {
        setPrediction(0);
      }

    } catch (err) {
      console.error("Failed to load insights", err);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 EXPENSE FILTER (FIXED user?.company)
  const expensesOnly = transactions.filter(
    t => t.type === 'expense' && (user?.company ? t.status === 'approved' : true)
  );

  // 🔹 TOTAL SPENDING
  const totalSpending = expensesOnly.reduce(
    (sum, t) => sum + parseFloat(t.amount), 0
  );

  // 🔹 TOTAL BUDGET (correct field: amount)
  const totalBudget = budgets.reduce(
    (sum, b) => sum + parseFloat(b.amount || 0), 0
  );

  // 🔹 FINANCIAL HEALTH
  const health =
    totalBudget === 0
      ? "No Budget"
      : totalSpending > totalBudget
      ? "Exceeding"
      : totalSpending > totalBudget * 0.8
      ? "Warning"
      : "On Track";

  // 📊 Trend Data
  const groupedData = {};
  expensesOnly.forEach(t => {
    const dateKey = new Date(t.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    groupedData[dateKey] = (groupedData[dateKey] || 0) + parseFloat(t.amount);
  });

  const trendData = Object.keys(groupedData).map(date => ({
    date,
    amount: groupedData[date],
    rawDate: new Date(date)
  })).sort((a, b) => a.rawDate - b.rawDate);

  // 🍩 Category Data
  const categoryMap = {};
  expensesOnly.forEach(t => {
    const cat = t.category_name || "General";
    categoryMap[cat] = (categoryMap[cat] || 0) + parseFloat(t.amount);
  });

  const pieData = Object.keys(categoryMap).map(name => ({
    name,
    value: categoryMap[name]
  }));

  const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

  if (loading) return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-main flex items-center gap-3">
            <Brain className="text-primary" /> AI Insights & Analysis
          </h1>
          <p className="text-secondary font-medium mt-1">
            Smart tracking powered by your historical patterns.
          </p>
        </div>

        <div className="flex items-center gap-3 px-4 py-2 bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl">
          <Activity size={18} className="text-primary" />
          <span className="text-xs font-black uppercase tracking-widest text-secondary">
            Role: <span className="text-primary">{user?.role || "Personal Account"}</span>
          </span>
        </div>
      </div>

      {/* TOP CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <div className="card p-6 border-none bg-gradient-to-br from-green-500 to-emerald-600 text-white shadow-xl shadow-green-500/20">
          <p className="text-[10px] font-bold uppercase tracking-widest opacity-80 mb-2">Total Monthly Burn</p>
          <h2 className="text-3xl font-black">
            ₹{totalSpending.toLocaleString('en-IN')}
          </h2>
        </div>

        <div className="card p-6 border-none bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-xl shadow-blue-500/20">
          <p className="text-[10px] font-bold uppercase tracking-widest opacity-80 mb-2">AI Forecasted Outflow</p>
          <h2 className="text-3xl font-black">
            ₹{prediction !== null ? prediction.toLocaleString('en-IN') : '0'}
          </h2>
        </div>

        <div className="card p-6 border-l-4 border-blue-500">
          <p className="text-sm font-bold text-secondary mb-1">Financial Health</p>
          <h2 className="text-3xl font-black text-main">
            {health}
          </h2>
        </div>
      </div>

      {/* CHARTS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

        <div className="card p-6 h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Area dataKey="amount" stroke="#10b981" fill="#10b98133" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="card p-6 h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={pieData} dataKey="value">
                {pieData.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

      </div> 

      {/* SMART SUGGESTION */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        <div className="p-8 bg-primary rounded-3xl text-white shadow-2xl shadow-primary/30 relative overflow-hidden group">
          <div className="absolute -right-10 -bottom-10 opacity-10">
             <Brain size={250} />
          </div>
          
          <div className="relative z-10">
            <h3 className="text-xl font-black mb-4 flex items-center gap-2">
              <Brain size={24} /> FinAI Smart Suggestion
            </h3>

            <p className="text-white/80 font-medium leading-relaxed mb-6">
              Based on your pattern of "{trendingCategory(transactions)}" expenses, 
              you may spend ₹{prediction !== null ? prediction.toLocaleString('en-IN') : 0} next period.
            </p>

            <div className="p-4 bg-white/10 rounded-2xl border border-white/20">
              <p className="text-sm font-bold flex items-center gap-2">
                <Info size={16} />
                Try reducing "{trendingCategory(transactions)}" by 10% to save ₹
                {prediction ? (prediction * 0.1).toFixed(0) : 0}
              </p>
            </div>
          </div>
        </div>

        {/* System Observations */}
        <div className="space-y-4">
          <h3 className="text-lg font-black text-main mb-4 px-2">
            System Observations
          </h3>

          {ruleInsights.length > 0 ? (
            ruleInsights.map((ins, i) => (
              <div key={i} className="flex gap-4 p-4 bg-white border rounded-2xl shadow-sm">
                <div className="p-2 rounded-xl">
                  {ins.type === 'warning'
                    ? <AlertTriangle size={20} />
                    : <CheckCircle size={20} />}
                </div>

                <div>
                  <h4 className="font-black text-main text-sm">
                    {ins.title}
                  </h4>
                  <p className="text-sm text-secondary">
                    {ins.description}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="p-10 text-center border-2 border-dashed rounded-3xl">
              <p className="text-secondary font-bold">
                No anomalies detected yet 🌟
              </p>
            </div>
          )}
        </div>

      </div>

    </div>
  );
};

// Helper
const trendingCategory = (transactions) => {
  const map = {};

  transactions
    .filter(t => t.type === 'expense')
    .forEach(t => {
      const cat = t.category_name || "General";
      map[cat] = (map[cat] || 0) + 1;
    });

  const keys = Object.keys(map);
  if (keys.length === 0) return "General";

  return keys.reduce((a, b) => (map[a] > map[b] ? a : b));
};

export default Insights;