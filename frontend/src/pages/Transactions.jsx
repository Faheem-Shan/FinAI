import { useState, useEffect, useCallback } from "react";
import api from "../api/axios";
import { Search, Download, Plus, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [categories, setCategories] = useState([]);

  const navigate = useNavigate();

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
    <div className="max-w-6xl mx-auto px-6 py-8">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Transactions History</h1>
          <p className="text-gray-500 text-sm">
            Review and manage your AI-categorized spending
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 border rounded-xl text-sm hover:bg-gray-50"
          >
            <Download size={16} /> Export CSV
          </button>

          <button
            onClick={() => navigate("/add")}
            className="flex items-center gap-2 px-5 py-2 bg-green-500 text-white rounded-xl shadow"
          >
            <Plus size={16} /> Add Transaction
          </button>
        </div>
      </div>

      {/* CARD */}
      <div className="bg-white rounded-2xl border shadow-sm">

        {/* FILTER */}
        <div className="p-5 border-b flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-[250px]">
            <Search className="absolute left-3 top-3 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Search description or category..."
              className="w-full pl-9 pr-3 py-2 border rounded-xl text-sm focus:outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <select
            className="px-3 py-2 border rounded-xl text-sm"
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
          >
            <option value="">All Types</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>

          <select
            className="px-3 py-2 border rounded-xl text-sm"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="">All Categories</option>
            {categories.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>

        {/* TABLE */}
        <table className="w-full">
          <thead className="bg-gray-50 text-xs text-gray-400">
            <tr>
              <th className="p-4 text-left">DATE</th>
              <th className="p-4 text-left">DESCRIPTION</th>
              <th className="p-4 text-left">CATEGORY</th>
              <th className="p-4 text-left">TYPE</th>
              <th className="p-4 text-right">AMOUNT</th>
              <th></th>
            </tr>
          </thead>

          <tbody>
            {transactions.map(t => (
              <tr key={t.id} className="border-t">
                <td className="p-4 text-sm">
                  {new Date(t.date).toLocaleDateString()}
                </td>

                <td className="p-4 font-black text-slate-800 text-sm">
                  {t.description}
                </td>

                {/* CATEGORY */}
                <td className="p-4">
                  <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-tight">
                    {t.category_name || "Uncategorized"}
                  </span>
                </td>

                {/* TYPE */}
                <td className="p-4">
                  <span className={`text-[10px] font-black px-2.5 py-1 rounded-lg uppercase tracking-wider ${
                    t.type === "income" ? "bg-emerald-100 text-emerald-700 border border-emerald-200" : "bg-rose-100 text-rose-700 border border-rose-200"
                  }`}>
                    {t.type}
                  </span>
                </td>

                {/* AMOUNT */}
                <td
                  className={`p-4 text-right font-black text-sm ${
                    t.type === "expense" ? "text-rose-500" : "text-emerald-500"
                  }`}
                >
                  {t.type === "expense" ? "-" : "+"}${parseFloat(t.amount).toLocaleString()}
                </td>

                {/* DELETE */}
                <td className="p-4">
                  <button onClick={() => deleteTransaction(t.id)}>
                    <Trash2 size={16} className="text-gray-400 hover:text-red-500" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* EMPTY */}
        {transactions.length === 0 && !loading && (
          <div className="p-10 text-center text-gray-400">
            No transactions found
          </div>
        )}

        {loading && (
          <div className="p-10 text-center">Loading...</div>
        )}

        <div className="p-4 text-sm text-gray-500">
          Showing {transactions.length} transactions
        </div>
      </div>
    </div>
  );
};

export default Transactions;