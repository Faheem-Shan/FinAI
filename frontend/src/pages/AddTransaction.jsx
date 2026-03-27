import { useState, useEffect } from "react";
import api from "../api/axios";
import { Check, X, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

const AddTransaction = () => {
  const [formData, setFormData] = useState({
    amount: "",
    type: "expense",
    category: "",
    date: new Date().toISOString().split("T")[0],
    description: "",
  });

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");

  const navigate = useNavigate();

  // 🔹 Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get("finance/categories/");
        setCategories(res.data);
      } catch (err) {
        console.error("ERROR:", err.response?.data);
      }
    };
    fetchCategories();
  }, []);

  // 🔹 Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post("finance/transactions/", formData);
      navigate("/transactions");
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Create category
  const handleCreateCategory = async (e) => {
    e.preventDefault();

    if (!newCategoryName) return;

    try {
      const res = await api.post("finance/categories/", {
        name: newCategoryName,
        type: formData.type,
      });

      setCategories([...categories, res.data]);
      setFormData({ ...formData, category: res.data.id });
      setIsCategoryModalOpen(false);
      setNewCategoryName("");
    } catch (err) {
      console.error("❌ CATEGORY ERROR:", err.response?.data);
    }
  };

  const filteredCategories = categories.filter(
    (c) => c.type === formData.type
  );

  return (
    <div className="flex flex-col items-center px-4 py-8">

      {/* 🔹 HEADER */}
      <div className="text-center mb-10">
        <h1 className="text-2xl font-bold text-text-main">New Entry</h1>
        <p className="text-sm text-text-secondary mt-2">
          Categorize your cash flow to get better AI insights.
        </p>
      </div>

      {/* 🔹 FORM */}
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-2xl card space-y-6"
      >

        {/* 🔹 TYPE TOGGLE */}
        <div className="grid grid-cols-2 bg-gray-100 p-1 rounded-xl">
          <button
            type="button"
            onClick={() =>
              setFormData({ ...formData, type: "expense", category: "" })
            }
            className={`py-3 rounded-lg font-semibold transition ${
              formData.type === "expense"
                ? "bg-white shadow text-red-500"
                : "text-text-secondary"
            }`}
          >
            Expense
          </button>

          <button
            type="button"
            onClick={() =>
              setFormData({ ...formData, type: "income", category: "" })
            }
            className={`py-3 rounded-lg font-semibold transition ${
              formData.type === "income"
                ? "bg-white shadow text-primary"
                : "text-text-secondary"
            }`}
          >
            Income
          </button>
        </div>

        {/* 🔹 AMOUNT */}
        <div>
          <label className="block text-sm font-semibold mb-2">
            Transaction Value
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary font-bold">
              $
            </span>
            <input
              type="number"
              required
              placeholder="0.00"
              className="w-full pl-8 pr-4 py-4 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-lg font-semibold"
              value={formData.amount}
              onChange={(e) =>
                setFormData({ ...formData, amount: e.target.value })
              }
            />
          </div>
        </div>

        {/* 🔹 CATEGORY + DATE */}
        <div className="grid grid-cols-2 gap-4">

          {/* CATEGORY */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-semibold">Category</label>
              <button
                type="button"
                onClick={() => setIsCategoryModalOpen(true)}
                className="text-xs text-primary flex items-center gap-1"
              >
                <Plus size={14} /> NEW
              </button>
            </div>

            <select
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-200"
              value={formData.category}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
              }
            >
              <option value="">Choose {formData.type} type...</option>
              {filteredCategories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* DATE */}
          <div>
            <label className="block text-sm font-semibold mb-2">
              Transaction Date
            </label>
            <input
              type="date"
              className="w-full px-4 py-3 rounded-xl border border-gray-200"
              value={formData.date}
              onChange={(e) =>
                setFormData({ ...formData, date: e.target.value })
              }
            />
          </div>
        </div>

        {/* 🔹 DESCRIPTION */}
        <div>
          <label className="block text-sm font-semibold mb-2">
            Ref / Description
          </label>
          <input
            type="text"
            placeholder="e.g. Starbucks Coffee, Salary"
            className="w-full px-4 py-3 rounded-xl border border-gray-200"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
          />
        </div>

        {/* 🔹 BUTTONS */}
        <div className="flex gap-4 pt-2">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 py-3 bg-primary text-white rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-primary-hover"
          >
            <Check size={18} />
            {loading
              ? "Saving..."
              : `Add ${formData.type}`}
          </button>

          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-6 py-3 border border-gray-200 rounded-xl"
          >
            Discard
          </button>
        </div>
      </form>

      {/* 🔹 CATEGORY MODAL */}
      {isCategoryModalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-2xl w-full max-w-sm space-y-4">

            <div className="flex justify-between items-center">
              <h3 className="font-semibold">
                Add {formData.type} Category
              </h3>
              <button onClick={() => setIsCategoryModalOpen(false)}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateCategory} className="space-y-4">
              <input
                type="text"
                required
                placeholder="Category name"
                className="w-full px-4 py-3 border rounded-xl"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
              />

              <button className="w-full py-3 bg-primary text-white rounded-xl">
                Create Category
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddTransaction;