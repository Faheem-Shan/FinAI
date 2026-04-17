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
    <div className="space-y-12 animate-in fade-in duration-1000 transition-colors duration-500">
      
      {/* 🔹 HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 text-[var(--text-main)] transition-colors">
        <div className="space-y-2">
          <h1 className="text-4xl font-black tracking-tight">Financial Goals</h1>
          <p className="text-[var(--text-secondary)] font-medium text-sm pl-1">Manage your income, savings, and spending limits</p>
        </div>
        
        <div className="flex items-center gap-4">
          <button 
             onClick={fetchAll}
             className="p-3 bg-[var(--bg-card)] border border-[var(--border)] text-[var(--text-secondary)] rounded-2xl hover:text-[var(--text-main)] hover:bg-[var(--bg-main)] transition-all shadow-sm group active:scale-95"
          >
            <RefreshCw size={18} className={`group-hover:rotate-180 transition-transform duration-700 ${loading ? "animate-spin" : ""}`} />
          </button>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-3 px-6 py-3 bg-green-500 text-white rounded-2xl font-black hover:bg-green-400 transition-all shadow-xl shadow-green-500/20 active:scale-95 text-xs uppercase tracking-widest"
          >
            <Plus size={18} /> Set Budget
          </button>
        </div>
      </div>

      {/* 🔹 SUMMARY CARDS (DYNAMIC) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* TOTAL INCOME */}
        <div className="bg-[var(--bg-card)]/50 backdrop-blur-xl p-5 rounded-[28px] border border-[var(--border)] shadow-xl relative overflow-hidden group hover:bg-[var(--bg-card)]/80 transition-all">
           <div className="absolute -right-2 -top-2 p-3 bg-green-500/10 rounded-full group-hover:scale-110 transition-transform duration-500">
            <TrendingUp size={18} className="text-green-500" />
          </div>
          <p className="text-[9px] font-black text-[var(--text-secondary)] uppercase tracking-widest pl-1">Total Monthly Income</p>
          <h2 className="text-2xl font-black mt-2 text-[var(--text-main)] tracking-tight">₹{totalIncome.toLocaleString('en-IN')}</h2>
          <p className="text-[9px] font-bold text-green-500 mt-1 uppercase">Salary & Credits</p>
        </div>

        {/* TOTAL SPENT */}
        <div className="bg-[var(--bg-card)]/50 backdrop-blur-xl p-5 rounded-[28px] border border-[var(--border)] shadow-xl relative overflow-hidden group hover:bg-[var(--bg-card)]/80 transition-all">
           <div className="absolute -right-2 -top-2 p-3 bg-rose-500/10 rounded-full group-hover:scale-110 transition-transform duration-500">
            <TrendingDown size={18} className="text-rose-500" />
          </div>
          <p className="text-[9px] font-black text-[var(--text-secondary)] uppercase tracking-widest pl-1">Total Spent So Far</p>
          <h2 className="text-2xl font-black mt-2 text-[var(--text-main)] tracking-tight">₹{totalExpense.toLocaleString('en-IN')}</h2>
          <p className="text-[9px] font-bold text-rose-500 mt-1 uppercase">Monthly Expenses</p>
        </div>

        {/* REMAINING BALANCE */}
        <div className="bg-[var(--bg-card)]/50 backdrop-blur-xl p-5 rounded-[28px] border border-[var(--border)] shadow-xl relative overflow-hidden group hover:bg-[var(--bg-card)]/80 transition-all">
           <div className="absolute -right-2 -top-2 p-3 bg-blue-500/10 rounded-full group-hover:scale-110 transition-transform duration-500">
            <Wallet size={18} className="text-blue-500" />
          </div>
          <p className="text-[9px] font-black text-[var(--text-secondary)] uppercase tracking-widest pl-1">Remaining Balance</p>
          <h2 className={`text-2xl font-black mt-2 tracking-tight ${balance < 0 ? 'text-rose-500' : 'text-blue-500'}`}>
            ₹{balance.toLocaleString('en-IN')}
          </h2>
          <p className="text-[9px] font-bold text-[var(--text-secondary)] mt-1 uppercase">{daysLeft} days until next month</p>
        </div>

        {/* TOTAL BUDGET LIMIT */}
        <div className="bg-[var(--bg-card)]/50 backdrop-blur-xl p-5 rounded-[28px] border border-[var(--border)] shadow-xl relative overflow-hidden group hover:bg-[var(--bg-card)]/80 transition-all">
           <div className="absolute -right-2 -top-2 p-3 bg-[var(--bg-main)] rounded-full group-hover:scale-110 transition-transform duration-500">
            <Target size={18} className="text-[var(--text-secondary)]" />
          </div>
          <p className="text-[9px] font-black text-[var(--text-secondary)] uppercase tracking-widest pl-1">Monthly Budget Goal</p>
          <h2 className="text-2xl font-black mt-2 text-[var(--text-main)] tracking-tight">₹{totalPlannedBudget.toLocaleString('en-IN')}</h2>
          <p className="text-[9px] font-bold text-[var(--text-secondary)] mt-1 uppercase">Limits Defined</p>
        </div>
      </div>

      {/* 🔹 BUDGET LIST AREA */}
      <div className="space-y-6">
        <div className="flex items-center gap-3 px-2">
           <div className="w-1 h-5 bg-green-500 rounded-full shadow-lg shadow-green-500/50" />
           <h2 className="text-xl font-black text-[var(--text-main)] tracking-tight">Categories Performance</h2>
        </div>
 
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 space-y-4 bg-[var(--bg-card)]/20 rounded-[32px] border border-[var(--border)]">
            <div className="w-12 h-12 border-4 border-green-500/20 border-t-green-500 rounded-full animate-spin" />
            <p className="text-[var(--text-secondary)] font-bold animate-pulse tracking-widest text-xs uppercase">Computing Financial Data...</p>
          </div>
        ) : budgets.length === 0 ? (
          <div className="bg-[var(--bg-card)]/30 backdrop-blur border-2 border-dashed border-[var(--border)] rounded-[32px] text-center p-20 flex flex-col items-center">
            <div className="w-24 h-24 bg-[var(--bg-main)] rounded-[32px] flex items-center justify-center text-5xl mb-8 shadow-inner grayscale opacity-50">📂</div>
            <h3 className="text-xl font-black text-[var(--text-main)]">Zero Budgets Configured</h3>
            <p className="text-[var(--text-secondary)] mt-3 max-w-[320px] font-medium leading-relaxed text-sm">Assign portion of your income to specific categories to start tracking limits.</p>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="mt-10 px-10 py-4 bg-green-500 text-white rounded-2xl font-black shadow-2xl hover:scale-[1.03] active:scale-95 transition-all text-xs tracking-wide uppercase"
            >
              + Create Your First Budget
            </button>
          </div>
        ) : (
          <div className="grid gap-6">
            {budgets.map((b) => {
              const spent = getSpent(b.category_name);
              const limit = parseFloat(b.amount);
              const percent = getPercent(spent, limit);
              const status = getStatus(spent, limit);
 
              return (
                <div key={b.id} className="bg-[var(--bg-card)]/40 backdrop-blur-xl p-6 rounded-[32px] border border-[var(--border)] shadow-xl hover:bg-[var(--bg-card)]/60 transition-all group overflow-hidden relative">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div className="flex items-center gap-5">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow-inner ${
                        spent > limit ? 'bg-rose-500/10' : 'bg-[var(--bg-main)]'
                      } border border-[var(--border)]`}>
                        📁
                      </div>
                      <div>
                        <h3 className="text-2xl font-black text-[var(--text-main)] tracking-tight leading-none capitalize">{b.category_name}</h3>
                        <p className="text-[9px] font-black text-[var(--text-secondary)] mt-2 uppercase tracking-widest">
                           Utilized <span className="text-[var(--text-main)] font-black">₹{spent.toLocaleString('en-IN')}</span> / Goal <span className="text-[var(--text-main)] font-black">₹{limit.toLocaleString('en-IN')}</span>
                        </p>
                      </div>
                    </div>
 
                    <div className="flex items-center gap-4 w-full md:w-auto">
                       <span className={`flex-1 md:flex-none inline-flex items-center justify-center px-4 py-1.5 rounded-lg text-[9px] font-black tracking-widest uppercase border ${
                         spent > limit ? 'bg-rose-500/10 text-rose-500 border-rose-500/20' : 
                         percent > 80 ? 'bg-orange-500/10 text-orange-400 border-orange-500/20' : 
                         'bg-green-500/10 text-green-500 border-green-500/20'
                       }`}>
                          {status.text}
                       </span>
                       <button 
                        onClick={() => deleteBudget(b.id)}
                        className="p-3 bg-[var(--bg-main)] text-[var(--text-secondary)] hover:text-rose-500 hover:bg-rose-500/10 border border-[var(--border)] rounded-xl transition-all active:scale-95"
                       >
                        <Trash2 size={16} />
                       </button>
                    </div>
                  </div>
 
                  {/* PROGRESS BAR SECTION */}
                  <div className="mt-6">
                    <div className="h-3 bg-[var(--bg-main)]/50 rounded-full overflow-hidden border border-[var(--border)] shadow-inner p-0.5">
                      <div 
                        className={`h-full rounded-full transition-all duration-1000 ease-out shadow-lg ${
                          spent > limit ? 'bg-rose-500 shadow-rose-500/50' : 
                          percent > 80 ? 'bg-orange-500 shadow-orange-500/50' : 
                          'bg-green-500 shadow-green-500/50'
                        }`}
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                    <div className="flex justify-between mt-4">
                      <span className="text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-widest">
                         {percent.toFixed(0)}% Allotted Funds Used
                      </span>
                      {spent > limit ? (
                        <span className="text-[10px] font-black text-rose-500 uppercase flex items-center tracking-widest">
                          <AlertCircle size={12} className="mr-1.5" /> Deficit of ₹{(spent - limit).toLocaleString('en-IN')}
                        </span>
                      ) : (
                        <span className="text-[10px] font-black text-green-500 uppercase tracking-widest bg-green-500/5 px-3 py-1 rounded-lg">
                          ₹{(limit - spent).toLocaleString('en-IN')} Remaining
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

      {/* 🔹 SET BUDGET MODAL (OVERHAULED) */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-2xl flex items-center justify-center z-[100] p-4 animate-in fade-in duration-300">
          <div className="bg-[var(--bg-card)] border border-[var(--border)] p-10 rounded-[50px] w-full max-w-md shadow-2xl animate-in zoom-in duration-300">
            <div className="flex justify-between items-center mb-10">
              <div>
                <h3 className="text-3xl font-black text-[var(--text-main)] tracking-tight">Set Budget</h3>
                <p className="text-[var(--text-secondary)] text-[10px] font-black mt-1 uppercase tracking-widest">Defined Spending Ceiling</p>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)} 
                className="p-3.5 bg-[var(--bg-main)] hover:bg-slate-500/10 rounded-2xl text-[var(--text-secondary)] transition-all active:scale-95"
              >
                <X size={20} />
              </button>
            </div>
 
            <form onSubmit={handleAddBudget} className="space-y-8">
              <div className="space-y-4">
                <div className="flex justify-between items-center mb-1">
                  <label className="text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-widest ml-1">Category</label>
                  <button 
                    type="button" 
                    onClick={() => setIsCategoryModalOpen(true)}
                    className="text-[9px] font-black text-green-500 bg-green-500/10 px-3 py-1 rounded-lg border border-green-500/20 hover:bg-green-500/20"
                  >
                    + NEW
                  </button>
                </div>
                <select
                  required
                  className="w-full px-6 py-4 bg-[var(--bg-main)]/50 border border-[var(--border)] rounded-3xl outline-none focus:border-green-500/50 text-[var(--text-main)] font-bold transition-all appearance-none cursor-pointer"
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                >
                  <option value="" className="bg-[var(--bg-card)]">Choose Category</option>
                  {categories.map(c => (
                    <option key={c.id} value={c.id} className="bg-[var(--bg-card)]">{c.name}</option>
                  ))}
                </select>
              </div>
 
              <div className="space-y-4">
                <label className="text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-widest ml-1">Allocation Amount ($)</label>
                <div className="relative">
                  <span className="absolute left-6 top-1/2 -translate-y-1/2 text-[var(--text-secondary)] font-black text-xl">$</span>
                  <input
                    type="number"
                    step="0.01"
                    required
                    placeholder="0.00"
                    className="w-full pl-12 pr-6 py-5 bg-[var(--bg-main)]/50 border border-[var(--border)] rounded-3xl outline-none focus:border-green-500 transition-all text-[var(--text-main)] font-black text-3xl shadow-inner focus:ring-4 focus:ring-green-500/10"
                    value={form.amount}
                    onChange={(e) => setForm({ ...form, amount: e.target.value })}
                  />
                </div>
              </div>
 
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-widest ml-1">Month</label>
                  <input
                    type="number"
                    min="1" max="12"
                    className="w-full px-4 py-4 bg-[var(--bg-main)]/50 border border-[var(--border)] rounded-2xl outline-none focus:border-green-500 text-[var(--text-main)] font-bold text-center"
                    value={form.month}
                    onChange={(e) => setForm({ ...form, month: e.target.value })}
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-widest ml-1">Year</label>
                  <input
                    type="number"
                    className="w-full px-4 py-4 bg-[var(--bg-main)]/50 border border-[var(--border)] rounded-2xl outline-none focus:border-green-500 text-[var(--text-main)] font-bold text-center"
                    value={form.year}
                    onChange={(e) => setForm({ ...form, year: e.target.value })}
                  />
                </div>
              </div>
 
              <button className="w-full py-5 bg-green-500 text-white rounded-[28px] font-black text-lg shadow-2xl hover:bg-green-400 active:scale-95 transition-all mt-4 uppercase tracking-widest">
                Save Allocation
              </button>
            </form>
          </div>
        </div>
      )}
 
      {/* 🔹 NEW CATEGORY MODAL */}
      {isCategoryModalOpen && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-md flex items-center justify-center z-[110] p-4">
          <div className="bg-[var(--bg-card)] border border-[var(--border)] p-10 rounded-[40px] w-full max-w-sm shadow-2xl animate-in zoom-in duration-200">
            <h3 className="text-2xl font-black text-[var(--text-main)] mb-8 tracking-tight capitalize">New Category</h3>
            
            <form onSubmit={handleCreateCategory} className="space-y-6">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-widest ml-1">Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Server Costs"
                  className="w-full px-6 py-4 bg-[var(--bg-main)] border border-[var(--border)] rounded-2xl outline-none focus:border-green-500 transition-all text-[var(--text-main)] font-bold"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                />
              </div>
 
              <div className="flex gap-4">
                 <button 
                  type="button"
                  onClick={() => setIsCategoryModalOpen(false)}
                  className="flex-1 py-4 bg-[var(--bg-main)] text-[var(--text-secondary)] rounded-2xl font-bold hover:bg-slate-500/10 transition-all text-[10px] uppercase tracking-widest"
                 >
                  Back
                 </button>
                 <button className="flex-1 py-4 bg-green-500 text-white rounded-2xl font-black shadow-xl shadow-green-500/10 hover:bg-green-400 transition-all text-[10px] uppercase tracking-widest">
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