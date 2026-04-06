import { useEffect, useState } from "react";
import api from "../api/axios";
import { Plus, Trash2, RefreshCw, X, AlertCircle, CheckCircle2, TrendingUp, TrendingDown, Wallet, Target } from "lucide-react";

/**
 * Budgets Component
 * 
 * 🔍 FOCUS:
 * - Matches Expected UI with 4 summary cards (Income, Expense, Savings, Budget)
 * - Professional "Money Management" terminology
 * - Accurate progress bars and status indicators
 */
const Budgets = () => {
  const [budgets, setBudgets] = useState([]);
  const [summary, setSummary] = useState([]);
  const [categories, setCategories] = useState([]);
  const [balance, setBalance] = useState(0); 
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpense, setTotalExpense] = useState(0);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");

  const [form, setForm] = useState({
    category: "",
    amount: "",
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
  });

  // ---------------- FETCH DATA ----------------
  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    try {
      setLoading(true);
      const [bRes, dRes, cRes] = await Promise.all([
        api.get("finance/budgets/"),
        api.get("finance/dashboard/"),
        api.get("finance/categories/")
      ]);

      setBudgets(bRes.data);
      setSummary(dRes.data.spending_by_category || []);
      
      // ✅ SYNC WITH DASHBOARD DATA
      setBalance(dRes.data.total_savings || 0);
      setTotalIncome(dRes.data.total_income || 0);
      setTotalExpense(dRes.data.total_expense || 0);
      setCategories(cRes.data.filter(c => c.type === "expense"));
    } catch (err) {
      console.error("❌ FETCH ERROR:", err);
    } finally {
      setLoading(false);
    }
  };

  // ---------------- HELPERS ----------------

  const getSpent = (name) => {
    const item = summary.find(s => s.category__name === name);
    return item ? parseFloat(item.amount) : 0;
  };

  const getPercent = (spent, limit) => {
    if (!limit || limit === 0) return 0;
    return Math.min((spent / limit) * 100, 100);
  };

  const getStatus = (spent, limit) => {
    const ratio = spent / limit;
    if (ratio > 1) {
      return { 
        text: "OVER BUDGET", 
        badge: "bg-rose-100 text-rose-600 border border-rose-200", 
        bar: "bg-rose-500",
        icon: <AlertCircle size={12} className="mr-1" />
      };
    }
    if (ratio > 0.8) {
      return { 
        text: "NEAR LIMIT", 
        badge: "bg-amber-100 text-amber-700 border border-amber-200", 
        bar: "bg-amber-500",
        icon: <AlertCircle size={12} className="mr-1" />
      };
    }
    return { 
      text: "ON TRACK", 
      badge: "bg-emerald-100 text-emerald-700 border border-emerald-200", 
      bar: "bg-emerald-500",
      icon: <CheckCircle2 size={12} className="mr-1" />
    };
  };

  // ---------------- TOTALS ----------------

  const totalPlannedBudget = budgets.reduce((a, b) => a + parseFloat(b.amount), 0);
  const today = new Date();
  const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
  const daysLeft = lastDay - today.getDate();

  // ---------------- ACTIONS ----------------

  const handleAddBudget = async (e) => {
    e.preventDefault();
    try {
      await api.post("finance/budgets/", form);
      setIsModalOpen(false);
      setForm({ ...form, amount: "", category: "" });
      fetchAll();
    } catch (err) {
      console.error("❌ CREATE BUDGET ERROR:", err.response?.data);
      alert(err.response?.data?.error || "Failed to save budget");
    }
  };

  const handleCreateCategory = async (e) => {
    e.preventDefault();
    if (!newCategoryName) return;
    try {
      const res = await api.post("finance/categories/", {
        name: newCategoryName,
        type: "expense",
      });
      setCategories([...categories, res.data]);
      setForm({ ...form, category: res.data.id });
      setIsCategoryModalOpen(false);
      setNewCategoryName("");
    } catch (err) {
      console.error("❌ CREATE CATEGORY ERROR:", err);
    }
  };

  const deleteBudget = async (id) => {
    if (!window.confirm("Delete this budget target?")) return;
    try {
      await api.delete(`finance/budgets/${id}/`);
      fetchAll();
    } catch (err) {
      console.error("❌ DELETE ERROR:", err);
    }
  };

  // ---------------- RENDER ----------------

  return (
    <div className="max-w-[1200px] mx-auto px-6 py-8 space-y-8 font-outfit">
      
      {/* 🔹 HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Monthly Budgets</h1>
          <p className="text-slate-500 text-sm font-medium mt-1">Manage your income, savings, and spending limits</p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <button 
            onClick={fetchAll} 
            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all shadow-sm"
          >
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} /> Refresh
          </button>

          <button 
            onClick={() => setIsModalOpen(true)} 
            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-2.5 bg-emerald-500 text-white rounded-xl text-sm font-bold hover:bg-emerald-600 transition-all shadow-md shadow-emerald-200"
          >
            <Plus size={18} /> Set Budget
          </button>
        </div>
      </div>

      {/* 🔹 SUMMARY CARDS (4-CARD MONEY MANAGEMENT LAYOUT) */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* TOTAL INCOME (SALARY) */}
        <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm relative overflow-hidden group">
          <div className="absolute -right-2 -top-2 p-4 bg-emerald-50 rounded-full group-hover:scale-110 transition-transform duration-500">
            <TrendingUp size={20} className="text-emerald-500" />
          </div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Total Monthly Income</p>
          <h2 className="text-2xl font-black mt-3 text-slate-900">${totalIncome.toLocaleString()}</h2>
          <p className="text-[10px] font-bold text-emerald-600 mt-2">Salary & Other Credits</p>
        </div>

        {/* TOTAL SPENT */}
        <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm relative overflow-hidden group">
           <div className="absolute -right-2 -top-2 p-4 bg-rose-50 rounded-full group-hover:scale-110 transition-transform duration-500">
            <TrendingDown size={20} className="text-rose-500" />
          </div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Total Spent So Far</p>
          <h2 className="text-2xl font-black mt-3 text-slate-900">${totalExpense.toLocaleString()}</h2>
          <p className="text-[10px] font-bold text-rose-600 mt-2">All Monthly Expenses</p>
        </div>

        {/* REMAINING BALANCE (CASH) */}
        <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm relative overflow-hidden group">
           <div className="absolute -right-2 -top-2 p-4 bg-blue-50 rounded-full group-hover:scale-110 transition-transform duration-500">
            <Wallet size={20} className="text-blue-500" />
          </div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Remaining Balance</p>
          <h2 className={`text-2xl font-black mt-3 ${balance < 0 ? 'text-rose-600' : 'text-blue-600'}`}>
            ${balance.toLocaleString()}
          </h2>
          <p className="text-[10px] font-bold text-slate-400 mt-2">{daysLeft} days until next month</p>
        </div>

        {/* TOTAL BUDGET LIMIT */}
        <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm relative overflow-hidden group">
           <div className="absolute -right-2 -top-2 p-4 bg-slate-50 rounded-full group-hover:scale-110 transition-transform duration-500">
            <Target size={20} className="text-slate-500" />
          </div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Monthly Budget Goal</p>
          <h2 className="text-2xl font-black mt-3 text-slate-900">${totalPlannedBudget.toLocaleString()}</h2>
          <p className="text-[10px] font-bold text-slate-400 mt-2">Spending Limits Set</p>
        </div>

      </div>

      {/* 🔹 BUDGET LIST AREA */}
      <div className="space-y-6">
        <div className="flex items-center gap-2 px-2">
           <div className="w-1.5 h-6 bg-emerald-500 rounded-full" />
           <h2 className="text-xl font-black text-slate-900">Categories Performance</h2>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 space-y-4">
            <div className="w-12 h-12 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin" />
            <p className="text-slate-400 font-bold animate-pulse tracking-widest text-xs uppercase">Computing Financial Data...</p>
          </div>
        ) : budgets.length === 0 ? (
          <div className="bg-white border-2 border-dashed border-slate-100 rounded-[40px] text-center p-20 flex flex-col items-center shadow-lg shadow-slate-100/20">
            <div className="w-24 h-24 bg-slate-50 rounded-[32px] flex items-center justify-center text-5xl mb-8 shadow-inner">📦</div>
            <h3 className="text-2xl font-black text-slate-900">Zero Budgets Configured</h3>
            <p className="text-slate-500 mt-3 max-w-[320px] font-medium leading-relaxed">Assign portion of your income to specific categories to start tracking limits.</p>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="mt-10 px-10 py-4 bg-slate-900 text-white rounded-2xl font-black shadow-2xl hover:scale-[1.03] active:scale-95 transition-all text-sm tracking-wide"
            >
              + Create Your First Budget
            </button>
          </div>
        ) : (
          <div className="grid gap-5">
            {budgets.map((b) => {
              const spent = getSpent(b.category_name);
              const limit = parseFloat(b.amount);
              const percent = getPercent(spent, limit);
              const status = getStatus(spent, limit);

              return (
                <div key={b.id} className="bg-white p-6 md:p-8 rounded-[40px] border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-5">
                      <div className={`w-14 h-14 rounded-[20px] flex items-center justify-center text-2xl shadow-inner ${
                        spent > limit ? 'bg-rose-50' : 'bg-slate-50'
                      }`}>
                        📁
                      </div>
                      <div>
                        <h3 className="text-xl font-black text-slate-900 tracking-tight leading-none capitalize">{b.category_name}</h3>
                        <p className="text-xs font-bold text-slate-400 mt-2 uppercase tracking-wider">
                           Utilized <span className="text-slate-900">${spent.toLocaleString()}</span> / Goal <span className="text-slate-900">${limit.toLocaleString()}</span>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                       <span className={`inline-flex items-center px-4 py-1.5 rounded-xl text-[10px] font-black tracking-widest uppercase ${status.badge}`}>
                          {status.icon} {status.text}
                       </span>
                       <button 
                        onClick={() => deleteBudget(b.id)}
                        className="p-3 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-2xl transition-all"
                       >
                        <Trash2 size={20} />
                       </button>
                    </div>
                  </div>

                  {/* PROGRESS BAR */}
                  <div className="mt-8">
                    <div className="h-3 bg-slate-50 rounded-full overflow-hidden border border-slate-100 shadow-inner p-0.5">
                      <div 
                        className={`${status.bar} h-full rounded-full transition-all duration-1000 ease-out shadow-sm`}
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                    <div className="flex justify-between mt-4">
                      <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">
                         {percent.toFixed(0)}% Allotted Funds Used
                      </span>
                      {spent > limit ? (
                        <span className="text-[11px] font-black text-rose-500 uppercase flex items-center tracking-widest">
                          <AlertCircle size={12} className="mr-1.5" /> Deficit of ${(spent - limit).toLocaleString()}
                        </span>
                      ) : (
                        <span className="text-[11px] font-black text-emerald-600 uppercase tracking-widest">
                          ${(limit - spent).toLocaleString()} Remaining
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 🔹 SET BUDGET MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xl flex items-center justify-center z-50 p-4 animate-in fade-in duration-300">
          <div className="bg-white p-10 rounded-[50px] w-full max-w-md shadow-2xl border border-white/20 animate-in zoom-in duration-300">
            <div className="flex justify-between items-center mb-10">
              <div>
                <h3 className="text-3xl font-black text-slate-900 tracking-tight">Set Budget</h3>
                <p className="text-slate-500 text-sm font-medium mt-1 uppercase tracking-widest">Defined Spending Ceiling</p>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)} 
                className="p-3 bg-slate-50 hover:bg-slate-100 rounded-[20px] text-slate-400 transition-all"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleAddBudget} className="space-y-8">
              <div className="space-y-3">
                <div className="flex justify-between items-center mb-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Category</label>
                  <button 
                    type="button" 
                    onClick={() => setIsCategoryModalOpen(true)}
                    className="text-[10px] font-black text-emerald-500 bg-emerald-50 px-3 py-1 rounded-lg hover:bg-emerald-100"
                  >
                    + NEW
                  </button>
                </div>
                <select
                  required
                  className="w-full px-6 py-5 border-2 border-slate-50 bg-slate-50 rounded-3xl appearance-none outline-none focus:border-emerald-500 focus:bg-white transition-all text-slate-900 font-bold shadow-inner"
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                >
                  <option value="">Select Category</option>
                  {categories.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Allocation Amount ($)</label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.01"
                    required
                    placeholder="0.00"
                    className="w-full px-6 py-5 border-2 border-slate-50 bg-slate-50 rounded-3xl outline-none focus:border-emerald-500 focus:bg-white transition-all text-slate-900 font-black text-2xl shadow-inner"
                    value={form.amount}
                    onChange={(e) => setForm({ ...form, amount: e.target.value })}
                  />
                  <div className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-300 font-bold uppercase tracking-widest text-xs">USD</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Month</label>
                  <input
                    type="number"
                    min="1" max="12"
                    className="w-full px-6 py-4 border-2 border-slate-50 bg-slate-50 rounded-3xl outline-none focus:border-emerald-500 focus:bg-white transition-all font-bold shadow-inner text-center"
                    value={form.month}
                    onChange={(e) => setForm({ ...form, month: e.target.value })}
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Year</label>
                  <input
                    type="number"
                    className="w-full px-6 py-4 border-2 border-slate-50 bg-slate-50 rounded-3xl outline-none focus:border-emerald-500 focus:bg-white transition-all font-bold shadow-inner text-center"
                    value={form.year}
                    onChange={(e) => setForm({ ...form, year: e.target.value })}
                  />
                </div>
              </div>

              <button className="w-full py-6 bg-slate-900 text-white rounded-[30px] font-black text-lg shadow-2xl hover:scale-[1.02] active:scale-95 transition-all mt-4 uppercase tracking-widest">
                Save Allocation
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 🔹 NEW CATEGORY MODAL */}
      {isCategoryModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md flex items-center justify-center z-[60] p-4">
          <div className="bg-white p-10 rounded-[40px] w-full max-w-sm shadow-2xl animate-in zoom-in duration-200">
            <h3 className="text-2xl font-black text-slate-900 mb-8 tracking-tight">New Category</h3>
            
            <form onSubmit={handleCreateCategory} className="space-y-8">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Subscriptions"
                  className="w-full px-6 py-5 border-2 border-slate-50 bg-slate-50 rounded-3xl outline-none focus:border-emerald-500 focus:bg-white transition-all text-slate-900 font-bold shadow-inner"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                />
              </div>

              <div className="flex gap-4">
                 <button 
                  type="button"
                  onClick={() => setIsCategoryModalOpen(false)}
                  className="flex-1 py-4 bg-slate-50 text-slate-600 rounded-2xl font-bold hover:bg-slate-100 transition-all text-sm uppercase tracking-widest"
                 >
                  Cancel
                 </button>
                 <button className="flex-1 py-4 bg-slate-900 text-white rounded-2xl font-bold shadow-xl shadow-slate-200 hover:bg-slate-800 transition-all text-sm uppercase tracking-widest">
                  Create
                 </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Budgets;