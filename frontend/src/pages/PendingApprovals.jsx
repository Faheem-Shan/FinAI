import { useState, useEffect } from "react";
import api from "../api/axios";
import { Check, X, Clock, IndianRupee } from "lucide-react";
import { toast } from "react-hot-toast";

const PendingApprovals = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPending = async () => {
    try {
      const res = await api.get("finance/transactions/pending/");
      setTransactions(res.data);
    } catch (err) {
      console.error("Failed to fetch pending transactions", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPending();
  }, []);

  const handleAction = async (id, action) => {
    try {
      await api.post(`finance/transactions/${id}/approve/`, { action });
      toast.success(`Transaction ${action}ed!`);
      fetchPending();
    } catch (err) {
      toast.error("Action failed");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold text-main">Pending Approvals</h1>
        <p className="text-secondary text-sm">
          Review and approve transactions submitted by accountants.
        </p>
      </div>

      <div className="bg-[var(--bg-card)] rounded-2xl border border-[var(--border)] overflow-hidden">
        {transactions.length === 0 ? (
          <div className="p-12 text-center text-secondary">
            <Clock className="mx-auto mb-4 opacity-20" size={48} />
            <p>No pending approvals found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[var(--border)] bg-[rgba(0,0,0,0.02)] dark:bg-[rgba(255,255,255,0.02)]">
                  <th className="p-4 font-semibold text-sm">Date</th>
                  <th className="p-4 font-semibold text-sm">Description</th>
                  <th className="p-4 font-semibold text-sm">Category</th>
                  <th className="p-4 font-semibold text-sm text-right">Amount</th>
                  <th className="p-4 font-semibold text-sm text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]">
                {transactions.map((t) => (
                  <tr key={t.id} className="hover:bg-[rgba(0,0,0,0.01)] dark:hover:bg-[rgba(255,255,255,0.01)] transition-colors">
                    <td className="p-4 text-sm text-secondary">
                      {new Date(t.date).toLocaleDateString()}
                    </td>
                    <td className="p-4">
                      <p className="text-sm font-medium text-main">{t.description}</p>
                      <p className="text-xs text-secondary">Submitted by {t.user_name || "Accountant"}</p>
                    </td>
                    <td className="p-4 text-sm text-secondary">
                      <span className="px-2 py-1 rounded-lg bg-[rgba(0,0,0,0.05)] text-xs">
                        {t.category_name}
                      </span>
                    </td>
                    <td className={`p-4 text-sm font-bold text-right ${t.type === 'income' ? 'text-green-500' : 'text-red-500'}`}>
                      {t.type === 'income' ? '+' : '-'}₹{t.amount}
                    </td>
                    <td className="p-4 whitespace-nowrap text-center">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => handleAction(t.id, "approve")}
                          className="w-9 h-9 flex items-center justify-center rounded-xl bg-green-500/10 text-green-500 hover:bg-green-500 hover:text-white transition-all shadow-sm"
                          title="Approve"
                        >
                          <Check size={18} />
                        </button>
                        <button
                          onClick={() => handleAction(t.id, "reject")}
                          className="w-9 h-9 flex items-center justify-center rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all shadow-sm"
                          title="Reject"
                        >
                          <X size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default PendingApprovals;
