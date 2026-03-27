import { useEffect, useState } from "react";
import api from "../api/axios";
import { Plus, Edit3, Trash2, RefreshCw } from "lucide-react";

const Budgets = () => {
  const [budgets, setBudgets] = useState([]);
  const [summary, setSummary] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);

      const [bRes, dRes] = await Promise.all([
        api.get("budgets/"),
        api.get("finance/dashboard/")
      ]);

      setBudgets(bRes.data);
      setSummary(dRes.data.spending_by_category || []);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const getSpent = (name) => {
    const item = summary.find((s) => s.category__name === name);
    return item ? parseFloat(item.amount) : 0;
  };

  const getStatus = (spent, limit) => {
    const ratio = spent / limit;

    if (ratio > 1)
      return {
        text: "OVER BUDGET",
        badge: "bg-red-100 text-red-500",
        bar: "bg-red-500"
      };

    if (ratio > 0.8)
      return {
        text: "NEAR LIMIT",
        badge: "bg-yellow-100 text-yellow-600",
        bar: "bg-yellow-500"
      };

    return {
      text: "ON TRACK",
      badge: "bg-green-100 text-green-600",
      bar: "bg-primary"
    };
  };

  const totalBudget = budgets.reduce((a, b) => a + parseFloat(b.amount_limit), 0);
  const totalSpent = summary.reduce((a, b) => a + parseFloat(b.amount), 0);
  const remaining = totalBudget - totalSpent;

  return (
    <div className="max-w-[1200px] mx-auto px-6 py-10 space-y-10">

      {/* 🔹 HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-text-main">
            Monthly Budgets
          </h1>
          {/* <p className="text-sm text-text-secondary mt-1">
            AI-powered tracking of your spending habits and limits.
          </p> */}
        </div>

        <div className="flex gap-3">
          <button
            onClick={fetchData}
            className="flex items-center gap-2 px-4 py-2 border rounded-xl text-sm hover:bg-gray-50"
          >
            <RefreshCw size={16} /> Refresh
          </button>

          <button className="flex items-center gap-2 px-5 py-2 bg-primary text-white rounded-xl text-sm shadow hover:bg-primary-hover">
            <Plus size={16} /> New Category
          </button>
        </div>
      </div>

      {/* 🔹 SUMMARY */}
      <div className="grid md:grid-cols-3 gap-6">

        <div className="card">
          <p className="text-sm text-text-secondary">Total Monthly Budget</p>
          <h2 className="text-3xl font-bold mt-2">
            ${totalBudget.toLocaleString()}
          </h2>
          <p className="text-xs text-primary font-semibold mt-1">
            +2.4% vs last month
          </p>
        </div>

        <div className="card">
          <p className="text-sm text-text-secondary">Total Spent So Far</p>
          <h2 className="text-3xl font-bold mt-2">
            ${totalSpent.toLocaleString()}
          </h2>
          <p className="text-xs text-yellow-500 font-semibold mt-1">
            {totalBudget > 0
              ? `${((totalSpent / totalBudget) * 100).toFixed(0)}% utilized`
              : "0% utilized"}
          </p>
        </div>

        <div className="card">
          <p className="text-sm text-text-secondary">Remaining Funds</p>
          <h2 className="text-3xl font-bold mt-2">
            ${remaining.toLocaleString()}
          </h2>
          <p className="text-xs text-text-secondary mt-1">
            12 days left
          </p>
        </div>
      </div>

      {/* 🔹 LOADING */}
      {loading && (
        <div className="text-center py-20 text-text-secondary">
          Loading budgets...
        </div>
      )}

      {/* 🔹 EMPTY */}
      {!loading && budgets.length === 0 && (
        <div className="card text-center py-20">

          <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            📦
          </div>

          <h3 className="text-lg font-semibold text-text-main">
            No monthly budgets set
          </h3>

          <p className="text-sm text-text-secondary mt-2 max-w-sm mx-auto">
            Create targets for your spending categories to get smart AI insights.
          </p>

          <button className="mt-6 px-6 py-3 bg-primary text-white rounded-xl font-semibold shadow hover:scale-105 transition">
            + Add Your First Category
          </button>
        </div>
      )}

      {/* 🔹 LIST */}
      <div className="space-y-6">

        {budgets.map((b) => {
          const spent = getSpent(b.category_name);
          const limit = parseFloat(b.amount_limit);
          const percent = Math.min((spent / limit) * 100, 100);
          const status = getStatus(spent, limit);

          return (
            <div key={b.id} className="card">

              {/* TOP */}
              <div className="flex justify-between items-center">

                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
                    📁
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-text-main">
                      {b.category_name}
                    </h3>
                    <p className="text-sm text-text-secondary">
                      Spent: <span className="font-semibold text-text-main">${spent}</span> / Budget: <span className="font-semibold text-text-main">${limit}</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className={`text-xs px-3 py-1 rounded-lg font-semibold ${status.badge}`}>
                    {status.text}
                  </span>

                  <Edit3 size={16} className="text-gray-500 cursor-pointer" />
                  <Trash2 size={16} className="text-red-500 cursor-pointer" />
                </div>
              </div>

              {/* PROGRESS */}
              <div className="mt-5 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className={`${status.bar} h-full transition-all duration-500`}
                  style={{ width: `${percent}%` }}
                />
              </div>

              {/* FOOT */}
              <div className="flex justify-between text-xs mt-3 text-text-secondary">
                <span>
                  <span className="font-semibold text-text-main">
                    {percent.toFixed(0)}%
                  </span>{" "}
                  of budget used
                </span>

                {spent > limit && (
                  <span className="text-red-500 font-semibold">
                    Exceeded by ${spent - limit}
                  </span>
                )}
              </div>

            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Budgets;