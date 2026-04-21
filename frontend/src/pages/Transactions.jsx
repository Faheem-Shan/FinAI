import { useState, useEffect, useCallback, useContext } from "react";
import api from "../api/axios";
import { Search, Download, Plus, Trash2, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [categories, setCategories] = useState([]);

  const { user: currentUser } = useContext(AuthContext);
  const showCreatedBy = currentUser?.company && (currentUser?.role === "admin" || currentUser?.role === "manager");

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const navigate = useNavigate();

  // Pagination Logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = transactions.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(transactions.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const fetchTransactions = useCallback(async () => {
    try {
      setLoading(true);
      const params = {};
      if (searchTerm) params.search = searchTerm;
      if (typeFilter) params.type = typeFilter;
      if (categoryFilter) params.category = categoryFilter;

      const res = await api.get("finance/transactions/", { params });
      setTransactions(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [searchTerm, typeFilter, categoryFilter]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  useEffect(() => {
    api.get("finance/categories/").then(res => setCategories(res.data));
  }, []);

  const deleteTransaction = async (id) => {
    if (!window.confirm("Delete this transaction?")) return;
    await api.delete(`finance/transactions/${id}/`);
    fetchTransactions();
  };

  const handleExport = async () => {
    const res = await api.get("finance/export/", { responseType: "blob" });
    const url = window.URL.createObjectURL(new Blob([res.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "transactions.csv");
    link.click();
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700 transition-colors duration-500">
      
      {/* 🔹 HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-black text-[var(--text-main)] tracking-tight">Transactions</h1>
          <p className="text-[var(--text-secondary)] font-medium text-xs text-balance">Review and manage your AI-categorized spending</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button onClick={handleExport} className="flex items-center gap-2 px-5 py-2.5 bg-[var(--bg-card)] border border-[var(--border)] text-[var(--text-main)] rounded-2xl font-bold hover:bg-[var(--bg-main)] transition-all shadow-sm text-xs">
            <Download size={16} /> Export
          </button>
          <button
            onClick={() => navigate("/add")}
            className="flex items-center gap-2 px-5 py-2.5 bg-green-500 hover:bg-green-400 text-white font-black rounded-2xl shadow-lg shadow-green-500/20 transition-all active:scale-95 text-xs uppercase tracking-widest"
          >
            <Plus size={16} /> New Entry
          </button>
        </div>
      </div>

      {/* MAIN CARD */}
      <div className="bg-[var(--bg-card)]/40 backdrop-blur-xl rounded-[2.5rem] border border-[var(--border)] shadow-2xl overflow-hidden transition-all">

        {/* FILTERS BAR */}
        <div className="p-6 border-b border-[var(--border)] flex flex-wrap gap-4 items-center bg-[var(--bg-main)]/30">
          <div className="relative flex-1 min-w-[300px]">
            <Search className="absolute left-4 top-3.5 text-[var(--text-secondary)]" size={18} />
            <input
              type="text"
              placeholder="Search description or category..."
              className="w-full pl-12 pr-4 py-3 bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl text-sm text-[var(--text-main)] placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500/50 transition-all font-bold"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex gap-3">
            <select
              className="px-4 py-3 bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl text-sm text-[var(--text-main)] focus:outline-none focus:border-green-500/50 cursor-pointer font-bold"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
            >
              <option value="" className="bg-[var(--bg-card)]">All Types</option>
              <option value="income" className="bg-[var(--bg-card)]">Income</option>
              <option value="expense" className="bg-[var(--bg-card)]">Expense</option>
            </select>

            <select
              className="px-4 py-3 bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl text-sm text-[var(--text-main)] focus:outline-none focus:border-green-500/50 cursor-pointer font-bold"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="" className="bg-[var(--bg-card)]">All Categories</option>
              {categories.map(c => (
                <option key={c.id} value={c.id} className="bg-[var(--bg-card)]">{c.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* TABLE SECTION */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[var(--bg-main)]/30 text-[10px] text-[var(--text-secondary)] font-bold uppercase tracking-[0.2em]">
              <tr>
                <th className="p-5 text-left font-black">DATE</th>
                {showCreatedBy && <th className="p-5 text-left font-black">CREATED BY</th>}
                <th className="p-5 text-left font-black">DESCRIPTION</th>
                <th className="p-5 text-left font-black">CATEGORY</th>
                <th className="p-5 text-left font-black">TYPE</th>
                <th className="p-5 text-left font-black">STATUS</th>
                <th className="p-5 text-right font-black">AMOUNT</th>
                <th className="p-5"></th>
              </tr>
            </thead>

            <tbody className="divide-y divide-[var(--border)]">
              {currentItems.map(t => (
                <tr key={t.id} className="hover:bg-[var(--bg-main)]/40 transition-colors group">
                  <td className="p-5 text-xs font-medium text-[var(--text-secondary)]">
                    {new Date(t.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                  </td>

                  {/* CREATED BY */}
                  {showCreatedBy && (
                    <td className="p-5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center font-black text-[10px] shadow-inner ring-1 ring-white/10 uppercase">
                          {t.user_name?.charAt(0) || "U"}
                        </div>
                        <div>
                          <div className="text-xs font-bold text-[var(--text-main)] leading-none mb-1">{t.user_name}</div>
                          <div className="text-[8px] [var(--text-secondary)] uppercase tracking-tighter font-black bg-[var(--bg-main)] px-1.5 py-0.5 rounded border border-[var(--border)] inline-block">
                            {t.user_role}
                          </div>
                        </div>
                      </div>
                    </td>
                  )}

                  <td className="p-5 font-bold text-[var(--text-main)] text-sm group-hover:text-green-500 transition-colors">
                    {t.description}
                  </td>

                  {/* CATEGORY */}
                  <td className="p-5">
                    <span className="bg-[var(--bg-main)] text-[var(--text-secondary)] border border-[var(--border)] px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-tight shadow-sm">
                      {t.category_name || "General"}
                    </span>
                  </td>

                  {/* TYPE */}
                  <td className="p-5">
                    <span className={`text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest border ${
                      t.type === "income" 
                        ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" 
                        : "bg-rose-500/10 text-rose-500 border-rose-500/20"
                    }`}>
                      {t.type}
                    </span>
                  </td>

                 {/* STATUS */}
                <td className="p-5">
                  <div className="flex flex-col gap-1">
                    
                    {/* STATUS BADGE */}
                    <div className="flex items-center gap-1.5">
                      <div className={`w-1.5 h-1.5 rounded-full ${
                        t.status === "approved" ? "bg-green-500 shadow-sm shadow-green-500/50" :
                        t.status === "rejected" ? "bg-rose-500 shadow-sm shadow-rose-500/50" : "bg-yellow-500 shadow-sm shadow-yellow-500/50"
                      }`} />
                      <span className={`text-[10px] font-bold uppercase tracking-wide ${
                        t.status === "approved" ? "text-green-500" :
                        t.status === "rejected" ? "text-rose-500" : "text-yellow-500"
                      }`}>
                        {t.status}
                      </span>
                    </div>

                    {/* 🔥 NEW: APPROVAL INFO (ONLY IF APPROVED) */}
                    {t.status === "approved" && t.approved_by_name && (
                      <div className="text-[9px] text-[var(--text-secondary)] font-medium">
                        Approved by <span className="font-bold text-[var(--text-main)]">{t.approved_by_name}</span>
                      </div>
                    )}

                    {/* 🔥 OPTIONAL: APPROVAL TIME */}
                    {t.status === "approved" && t.approved_at && (
                      <div className="text-[8px] text-slate-400">
                        {new Date(t.approved_at).toLocaleString()}
                      </div>
                    )}

                  </div>
                </td>

                  {/* AMOUNT */}
                  <td className={`p-5 text-right font-black text-sm tabular-nums ${t.type === 'income' ? 'text-green-500' : 'text-rose-500'}`}>
                    <span className="text-[10px] mr-1">₹</span>
                    {parseFloat(t.amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </td>

                  {/* ACTIONS */}
                  <td className="p-5 text-right">
                    <button 
                      onClick={() => deleteTransaction(t.id)}
                      className="p-2 hover:bg-rose-500/10 rounded-xl transition-all group/btn"
                    >
                      <Trash2 size={14} className="text-slate-500 group-hover/btn:text-rose-500 transition-colors" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* LOADING / EMPTY STATES */}
        {transactions.length === 0 && !loading && (
          <div className="py-20 text-center">
            <div className="text-[var(--text-secondary)] font-bold mb-2">No transaction history found</div>
            <p className="text-slate-500 text-xs text-balance px-10">Start recording your cash flow to see your full history here.</p>
          </div>
        )}

        {loading && (
          <div className="py-20 text-center animate-pulse">
            <div className="inline-block w-8 h-8 border-2 border-green-500/30 border-t-green-500 rounded-full animate-spin mb-4" />
            <div className="text-[var(--text-secondary)] text-xs font-bold">Fetching secure data...</div>
          </div>
        )}

        {/* 🔹 PAGINATION FOOTER */}
        <div className="p-5 bg-[var(--bg-main)]/30 border-t border-[var(--border)] flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-[10px] font-black text-[var(--text-main)] uppercase tracking-[0.2em]">
            Page <span className="text-green-600">{currentPage}</span> of {totalPages || 1}
          </div>

          <div className="flex items-center gap-2">
            <button 
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => prev - 1)}
              className="px-4 py-2 bg-[var(--bg-card)] border border-[var(--border)] text-[var(--text-main)] rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-green-500 hover:text-white transition-all disabled:opacity-30 disabled:hover:bg-[var(--bg-card)] disabled:hover:text-[var(--text-main)]"
            >
              Previous
            </button>
            
            <div className="flex items-center gap-1">
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i+1}
                  onClick={() => setCurrentPage(i+1)}
                  className={`w-8 h-8 rounded-lg text-xs font-black flex items-center justify-center transition-all ${
                    currentPage === i+1 ? "bg-green-500 text-white shadow-lg shadow-green-500/20" : "text-[var(--text-main)] hover:bg-[var(--bg-main)]"
                  }`}
                >
                  {i+1}
                </button>
              ))}
            </div>

            <button 
              disabled={currentPage === totalPages || totalPages === 0}
              onClick={() => setCurrentPage(prev => prev + 1)}
              className="px-4 py-2 bg-[var(--bg-card)] border border-[var(--border)] text-[var(--text-main)] rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-green-500 hover:text-white transition-all disabled:opacity-30 disabled:hover:bg-[var(--bg-card)] disabled:hover:text-[var(--text-main)]"
            >
              Next
            </button>
          </div>

          <div className="text-[10px] font-bold text-[var(--text-main)] uppercase tracking-wider">
            Total <span className="text-green-600 font-black">{transactions.length}</span> Records
          </div>
        </div>
      </div>
    </div>
  );
};

export default Transactions;