// import { useState, useEffect, useContext } from "react";
// import api from "../api/axios";
// import { Check, X, Plus } from "lucide-react";
// import { useNavigate } from "react-router-dom";
// import { AuthContext } from "../context/AuthContext";


// const AddTransaction = () => {
//   const [formData, setFormData] = useState({
//     amount: "",
//     type: "expense",
//     category: "",
//     date: new Date().toISOString().split("T")[0],
//     description: "",
//   });

//   const [categories, setCategories] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
//   const [newCategoryName, setNewCategoryName] = useState("");
//   const [suggestedCategory, setSuggestedCategory] = useState("");

//   const { user } = useContext(AuthContext);

//   const navigate = useNavigate();


//   // 🔹 Fetch categories
//   useEffect(() => {
//     const fetchCategories = async () => {
//       try {
//         const res = await api.get("finance/categories/");
//         setCategories(res.data);
//       } catch (err) {
//         console.error("ERROR:", err.response?.data);
//       }
//     };
//     fetchCategories();
//   }, []);

//   // 🔹 Submit
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);

//     try {
//       await api.post("finance/transactions/", formData);
//       navigate("/transactions");
//     } catch (err) {
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // 🔹 Create category
//   const handleCreateCategory = async (e) => {
//     e.preventDefault();

//     if (!newCategoryName) return;

//     try {
//       const res = await api.post("finance/categories/", {
//         name: newCategoryName,
//         type: formData.type,
//       });

//       setCategories([...categories, res.data]);
//       setFormData({ ...formData, category: res.data.id });
//       setIsCategoryModalOpen(false);
//       setNewCategoryName("");
//     } catch (err) {
//       console.error("❌ CATEGORY ERROR:", err.response?.data);
//     }
//   };

//   const filteredCategories = categories.filter(
//     (c) => c.type === formData.type
//   );

//   return (
//     <div className="flex flex-col items-center px-4 py-8">

//       {/* 🔹 HEADER */}
//       <div className="text-center mb-10">
//         <h1 className="text-2xl font-bold text-text-main">New Entry</h1>
//         <p className="text-sm text-text-secondary mt-2">
//           Categorize your cash flow to get better AI insights.
//         </p>
//         {user?.role === "accountant" && (
//           <div className="mt-4 px-4 py-2 bg-yellow-50 text-yellow-700 border border-yellow-200 rounded-lg text-xs font-medium inline-block">
//             Note: Your transaction will be sent for approval.
//           </div>
//         )}
//       </div>


//       {/* 🔹 FORM */}
//       <form
//         onSubmit={handleSubmit}
//         className="w-full max-w-2xl card space-y-6"
//       >

//         {/* 🔹 TYPE TOGGLE */}
//         <div className="grid grid-cols-2 bg-gray-100 p-1 rounded-xl">
//           <button
//             type="button"
//             onClick={() =>
//               setFormData({ ...formData, type: "expense", category: "" })
//             }
//             className={`py-3 rounded-lg font-semibold transition ${formData.type === "expense"
//                 ? "bg-white shadow text-red-500"
//                 : "text-text-secondary"
//               }`}
//           >
//             Expense
//           </button>

//           <button
//             type="button"
//             onClick={() =>
//               setFormData({ ...formData, type: "income", category: "" })
//             }
//             className={`py-3 rounded-lg font-semibold transition ${formData.type === "income"
//                 ? "bg-white shadow text-primary"
//                 : "text-text-secondary"
//               }`}
//           >
//             Income
//           </button>
//         </div>

//         {/* 🔹 AMOUNT */}
//         <div>
//           <label className="block text-sm font-semibold mb-2">
//             Transaction Value
//           </label>
//           <div className="relative">
//             <span className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary font-bold">
//               $
//             </span>
//             <input
//               type="number"
//               required
//               placeholder="0.00"
//               className="w-full pl-8 pr-4 py-4 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-lg font-semibold"
//               value={formData.amount}
//               onChange={(e) =>
//                 setFormData({ ...formData, amount: e.target.value })
//               }
//             />
//           </div>
//         </div>

//         {/* 🔹 CATEGORY + DATE */}
//         <div className="grid grid-cols-2 gap-4">

//           {/* CATEGORY */}
//           <div>
//             <div className="flex justify-between items-center mb-2">
//               <label className="text-sm font-semibold">Category</label>
//               <button
//                 type="button"
//                 onClick={() => setIsCategoryModalOpen(true)}
//                 className="text-xs text-primary flex items-center gap-1"
//               >
//                 <Plus size={14} /> NEW
//               </button>
//             </div>

//             <select
//               required
//               className="w-full px-4 py-3 rounded-xl border border-gray-200"
//               value={formData.category}
//               onChange={(e) =>
//                 setFormData({ ...formData, category: e.target.value })
//               }
//             >
//               <option value="">Choose {formData.type} type...</option>
//               {filteredCategories.map((c) => (
//                 <option key={c.id} value={c.id}>
//                   {c.name}
//                 </option>
//               ))}
//             </select>
//           </div>

//           {/* DATE */}
//           <div>
//             <label className="block text-sm font-semibold mb-2">
//               Transaction Date
//             </label>
//             <input
//               type="date"
//               className="w-full px-4 py-3 rounded-xl border border-gray-200"
//               value={formData.date}
//               onChange={(e) =>
//                 setFormData({ ...formData, date: e.target.value })
//               }
//             />
//           </div>
//         </div>

//         {/* 🔹 DESCRIPTION */}
//         <div>
//           <label className="block text-sm font-semibold mb-2">
//             Ref / Description
//           </label>
//           <input
//             type="text"
//             placeholder="e.g. Starbucks Coffee, Salary"
//             className="w-full px-4 py-3 rounded-xl border border-gray-200"
//             value={formData.description}
//             onChange={(e) =>
//               setFormData({ ...formData, description: e.target.value })
//             }
//           />
//         </div>

//         {/* 🔹 BUTTONS */}
//         <div className="flex gap-4 pt-2">
//           <button
//             type="submit"
//             disabled={loading}
//             className="flex-1 py-3 bg-primary text-white rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-primary-hover"
//           >
//             <Check size={18} />
//             {loading
//               ? "Saving..."
//               : `Add ${formData.type}`}
//           </button>

//           <button
//             type="button"
//             onClick={() => navigate(-1)}
//             className="px-6 py-3 border border-gray-200 rounded-xl"
//           >
//             Discard
//           </button>
//         </div>
//       </form>

//       {/* 🔹 CATEGORY MODAL */}
//       {isCategoryModalOpen && (
//         <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
//           <div className="bg-white p-6 rounded-2xl w-full max-w-sm space-y-4">

//             <div className="flex justify-between items-center">
//               <h3 className="font-semibold">
//                 Add {formData.type} Category
//               </h3>
//               <button onClick={() => setIsCategoryModalOpen(false)}>
//                 <X size={18} />
//               </button>
//             </div>

//             <form onSubmit={handleCreateCategory} className="space-y-4">
//               <input
//                 type="text"
//                 required
//                 placeholder="Category name"
//                 className="w-full px-4 py-3 border rounded-xl"
//                 value={newCategoryName}
//                 onChange={(e) => setNewCategoryName(e.target.value)}
//               />

//               <button className="w-full py-3 bg-primary text-white rounded-xl">
//                 Create Category
//               </button>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default AddTransaction;


// import { useState, useEffect, useContext } from "react";
// import api from "../api/axios";
// import { Check, X, Plus, DollarSign } from "lucide-react"; // Restored icons
// import { useNavigate } from "react-router-dom";
// import { AuthContext } from "../context/AuthContext";

// const AddTransaction = () => {
//   const [formData, setFormData] = useState({
//     amount: "",
//     type: "expense",
//     category: "",
//     date: new Date().toISOString().split("T")[0],
//     description: "",
//   });

//   const [categories, setCategories] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
//   const [newCategoryName, setNewCategoryName] = useState("");
//   const [suggestedCategory, setSuggestedCategory] = useState(""); // 🤖 AI Suggestion State

//   const { user } = useContext(AuthContext);
//   const navigate = useNavigate();

//   // 🔹 Fetch categories
//   useEffect(() => {
//     api.get("finance/categories/").then(res => setCategories(res.data));
//   }, []);

//   // 🤖 AI CATEGORY SUGGESTION LOGIC
//   const getCategorySuggestion = async (desc) => {
//     if (!desc || desc.length < 3) return;
//     try {
//       const res = await fetch("http://127.0.0.1:8001/predict-category", {
//         method: "POST",
//         headers: {"Content-Type": "application/json"},
//         body: JSON.stringify({ description: desc })
//       });
//       const data = await res.json();
//       setSuggestedCategory(data.category);
//     } catch (err) { console.log("AI Offline", err); }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     try {
//       await api.post("finance/transactions/", formData);
//       navigate("/transactions");
//     } catch (err) { console.error(err); } finally { setLoading(false); }
//   };

//   const handleCreateCategory = async (e) => {
//     e.preventDefault();
//     if (!newCategoryName) return;
//     const res = await api.post("finance/categories/", { name: newCategoryName, type: formData.type });
//     setCategories([...categories, res.data]);
//     setFormData({ ...formData, category: res.data.id });
//     setIsCategoryModalOpen(false);
//     setNewCategoryName("");
//   };

//   const filteredCategories = categories.filter((c) => c.type === formData.type);

//   return (
//     <div className="flex flex-col items-center pt-2 transition-colors duration-500">
//       <div className="mb-8 flex justify-center w-full">
//         <div className="px-4 py-1.5 bg-green-500/10 text-green-500 border border-green-500/20 rounded-full text-[10px] font-black uppercase tracking-widest inline-flex items-center gap-2 shadow-lg shadow-green-500/5">
//             <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
//             AI-Enhanced Analysis
//         </div>
//       </div>

//       {/* 🔹 FORM CARD (Reduced Width & Padding) */}
//       <form onSubmit={handleSubmit} className="w-full max-w-lg bg-[var(--bg-card)]/40 backdrop-blur-xl rounded-[2rem] border border-[var(--border)] p-7 space-y-6 shadow-2xl relative overflow-hidden transition-all">

//         {/* TYPE TOGGLE (Lower Height) */}
//         <div className="grid grid-cols-2 bg-[var(--bg-main)]/50 p-1 rounded-xl border border-[var(--border)]">
//           <button 
//             type="button" 
//             onClick={() => setFormData({ ...formData, type: "expense", category: "" })}
//             className={`py-2 rounded-lg font-black text-[10px] uppercase tracking-widest transition-all duration-300 ${
//               formData.type === "expense" 
//                 ? "bg-rose-500 text-white shadow-lg shadow-rose-500/20" 
//                 : "text-[var(--text-secondary)] hover:text-[var(--text-main)]"
//             }`}
//           >
//             Expense
//           </button>
//           <button 
//             type="button" 
//             onClick={() => setFormData({ ...formData, type: "income", category: "" })}
//             className={`py-2 rounded-lg font-black text-[10px] uppercase tracking-widest transition-all duration-300 ${
//               formData.type === "income" 
//                 ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20" 
//                 : "text-[var(--text-secondary)] hover:text-[var(--text-main)]"
//             }`}
//           >
//             Income
//           </button>
//         </div>

//         {/* AMOUNT (Reduced Font & Padding) */}
//         <div className="space-y-2">
//           <label className="text-[9px] font-black text-[var(--text-secondary)] uppercase tracking-widest ml-1">Current Transaction Value</label>
//           <div className="relative group">
//             <span className="absolute left-5 top-1/2 -translate-y-1/2 text-[var(--text-secondary)] font-black text-xl group-focus-within:text-green-500 transition-colors">$</span>
//             <input 
//               type="number" 
//               required 
//               placeholder="0.00" 
//               value={formData.amount}
//               onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
//               className="w-full pl-10 pr-4 py-4 bg-[var(--bg-main)]/30 border border-[var(--border)] rounded-2xl outline-none focus:border-green-500/50 text-[var(--text-main)] font-black text-2xl shadow-inner transition-all focus:bg-[var(--bg-card)]"
//             />
//           </div>
//         </div>

//         {/* CATEGORY + DATE */}
//         <div className="grid md:grid-cols-2 gap-4">
//           <div className="space-y-2">
//             <div className="flex justify-between items-center px-1">
//               <label className="text-[9px] font-black text-[var(--text-secondary)] uppercase tracking-widest">Category</label>
//               <button 
//                 type="button" 
//                 onClick={() => setIsCategoryModalOpen(true)} 
//                 className="text-[8px] font-black text-green-500 bg-green-500/10 px-2 py-0.5 rounded border border-green-500/20 hover:bg-green-500/20"
//               >
//                 + NEW
//               </button>
//             </div>
//             <select 
//               required 
//               value={formData.category} 
//               onChange={(e) => setFormData({ ...formData, category: e.target.value })}
//               className="w-full px-4 py-3 bg-[var(--bg-main)]/30 border border-[var(--border)] rounded-xl outline-none focus:border-green-500/50 text-[var(--text-main)] font-bold text-xs appearance-none transition-all cursor-pointer focus:bg-[var(--bg-card)]"
//             >
//               <option value="" className="bg-[var(--bg-card)]">Choose {formData.type}...</option>
//               {filteredCategories.map((c) => <option key={c.id} value={c.id} className="bg-[var(--bg-card)]">{c.name}</option>)}
//             </select>
//           </div>

//           <div className="space-y-2">
//             <label className="text-[9px] font-black text-[var(--text-secondary)] uppercase tracking-widest ml-1">Date</label>
//             <input 
//               type="date" 
//               value={formData.date} 
//               onChange={(e) => setFormData({ ...formData, date: e.target.value })}
//               className="w-full px-4 py-3 bg-[var(--bg-main)]/30 border border-[var(--border)] rounded-xl outline-none focus:border-green-500/50 text-[var(--text-main)] font-bold text-xs transition-all focus:bg-[var(--bg-card)]" 
//             />
//           </div>
//         </div>

//         {/* DESCRIPTION + AI SUGGESTION */}
//         <div className="space-y-2">
//           <label className="text-[9px] font-black text-[var(--text-secondary)] uppercase tracking-widest ml-1">Ref / Description</label>
//           <input 
//             type="text" 
//             placeholder="e.g. Starbucks, Amazon" 
//             value={formData.description}
//             onChange={(e) => {
//               setFormData({ ...formData, description: e.target.value });
//               getCategorySuggestion(e.target.value);
//             }}
//             className="w-full px-4 py-3 bg-[var(--bg-main)]/30 border border-[var(--border)] rounded-xl outline-none focus:border-green-500/50 text-[var(--text-main)] font-bold text-xs transition-all focus:bg-[var(--bg-card)]"
//           />
//           {suggestedCategory && (
//             <div className="mt-2 flex items-center gap-2 text-green-600 bg-green-500/5 p-2.5 rounded-xl border border-green-500/10 animate-in slide-in-from-left duration-300">
//                <span className="text-[8px] font-black bg-green-500 text-white px-1.5 py-0.5 rounded uppercase tracking-tighter shadow-sm">AI Match:</span>
//                <span className="text-xs font-bold capitalize">{suggestedCategory}</span>
//             </div>
//           )}
//         </div>

//         {/* BUTTONS (More Compact) */}
//         <div className="flex flex-col sm:flex-row gap-3 pt-2">
//           <button 
//             type="submit" 
//             disabled={loading}
//             className="flex-1 py-4 bg-green-500 text-white rounded-2xl font-black text-sm flex items-center justify-center gap-2 hover:bg-green-400 active:scale-95 transition-all shadow-xl shadow-green-500/10 uppercase tracking-widest"
//           >
//             {loading ? <RefreshCw className="animate-spin" size={16} /> : <Check size={18} />}
//             {loading ? "SAVING..." : `ADD ${formData.type}`}
//           </button>
//           <button 
//             type="button" 
//             onClick={() => navigate(-1)}
//             className="px-8 py-4 bg-[var(--bg-main)] border border-[var(--border)] text-[var(--text-secondary)] rounded-2xl font-bold hover:bg-[var(--bg-card)] hover:text-[var(--text-main)] transition-all active:scale-95 uppercase tracking-widest text-[10px]"
//           >
//             Discard
//           </button>
//         </div>
//       </form>

//       {/* CATEGORY MODAL (Compact Version) */}
//       {isCategoryModalOpen && (
//         <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center z-[110] p-4">
//           <div className="bg-[var(--bg-card)] border border-[var(--border)] p-8 rounded-[2.5rem] w-full max-w-sm shadow-2xl animate-in zoom-in duration-200">
//             <h3 className="text-xl font-black text-[var(--text-main)] mb-6 tracking-tight capitalize">New {formData.type} Category</h3>
//             <form onSubmit={handleCreateCategory} className="space-y-4">
//               <div className="space-y-2">
//                 <label className="text-[9px] font-black text-[var(--text-secondary)] uppercase tracking-widest ml-1">Name</label>
//                 <input 
//                   type="text" 
//                   required 
//                   placeholder="e.g. Server Costs" 
//                   value={newCategoryName}
//                   onChange={(e) => setNewCategoryName(e.target.value)}
//                   className="w-full px-5 py-3 bg-[var(--bg-main)] border border-[var(--border)] rounded-xl outline-none focus:border-green-400 transition-all text-[var(--text-main)] font-bold text-xs"
//                 />
//               </div>
//               <div className="flex gap-3 pt-2">
//                  <button 
//                   type="button"
//                   onClick={() => setIsCategoryModalOpen(false)}
//                   className="flex-1 py-3 bg-[var(--bg-main)] text-[var(--text-secondary)] rounded-xl font-bold hover:bg-[var(--bg-card)] transition-all text-[9px] uppercase tracking-widest"
//                  >
//                   Back
//                  </button>
//                  <button className="flex-1 py-3 bg-green-500 text-white rounded-xl font-black shadow-xl shadow-green-500/10 hover:bg-green-400 transition-all text-[9px] uppercase tracking-widest">
//                   Create
//                  </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default AddTransaction;

import { useState, useEffect } from "react";
import api from "../api/axios";
import { Check, RefreshCw } from "lucide-react";
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
  const [suggestedCategory, setSuggestedCategory] = useState("");

  // ✅ ADDED STATES (LOGIC ONLY)
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    api.get("finance/categories/").then(res => setCategories(res.data));
  }, []);

  const getCategorySuggestion = async (desc) => {
    // 1. Hide suggestion when input is cleared or too short
    if (!desc || desc.trim().length < 3) {
      setSuggestedCategory("");
      return;
    }

    try {
      let user = null;

      try {
        user = JSON.parse(localStorage.getItem("user"));
      } catch (e) {
        console.log("Invalid user in localStorage");
      }

      const res = await fetch("http://127.0.0.1:8001/predict-category", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          description: desc,
          user_id: user?.id,
          company_id: user?.company ? user.company.id : null
        })
    });

      const data = await res.json();
      const suggestion = data.category?.toLowerCase();

      if (!suggestion) {
        setSuggestedCategory("");
        return;
      }

      
      setSuggestedCategory(suggestion);

      
      if (categories.length > 0) {
        const match = categories.find(c =>
          c.type === formData.type &&
          (c.name.toLowerCase().includes(suggestion) || suggestion.includes(c.name.toLowerCase()))
        );

        if (match) {
          setFormData(prev => ({ ...prev, category: match.id }));
        }
      }
    } catch (err) {
      console.log("AI Offline", err);
      setSuggestedCategory("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("finance/transactions/", formData);
      navigate("/transactions");
    } finally {
      setLoading(false);
    }
  };

  
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
      console.error(err);
    }
  };

  const filteredCategories = categories.filter(
    (c) => c.type === formData.type
  );

  return (
    <div className="flex flex-col items-center pt-6">

      {/* AI TAG */}
      <div className="mb-6">
        <div className="px-4 py-2 bg-green-500/10 text-green-600 rounded-full text-sm font-medium flex items-center gap-2">
          <span className="w-2 h-2 bg-green-500 rounded-full" />
          AI-Enhanced Analysis
        </div>
      </div>

      {/* FORM */}
      <form onSubmit={handleSubmit} className="w-full max-w-xl bg-[var(--bg-card)] rounded-2xl border border-[var(--border)] p-6 space-y-5 shadow-md">

        {/* TYPE */}
        <div className="grid grid-cols-2 bg-[var(--bg-main)] rounded-xl p-1">
          <button
            type="button"
            onClick={() => setFormData({ ...formData, type: "expense", category: "" })}
            className={`py-2 rounded-lg text-sm font-medium ${formData.type === "expense"
                ? "bg-rose-500 text-white"
                : "text-[var(--text-secondary)]"
              }`}
          >
            Expense
          </button>

          <button
            type="button"
            onClick={() => setFormData({ ...formData, type: "income", category: "" })}
            className={`py-2 rounded-lg text-sm font-medium ${formData.type === "income"
                ? "bg-green-500 text-white"
                : "text-[var(--text-secondary)]"
              }`}
          >
            Income
          </button>
        </div>

        {/* AMOUNT */}
        <div>
          <label className="text-sm text-[var(--text-secondary)]">Amount</label>

          <div className="relative mt-1">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg text-[var(--text-secondary)]">₹</span>

            <input
              type="number"
              required
              placeholder="0.00"
              value={formData.amount}
              onChange={(e) =>
                setFormData({ ...formData, amount: e.target.value })
              }
              className="w-full pl-10 pr-4 py-3 bg-[var(--bg-main)] border border-[var(--border)] rounded-xl text-lg font-semibold outline-none focus:border-green-500"
            />
          </div>
        </div>

        {/* CATEGORY + DATE */}
        <div className="grid md:grid-cols-2 gap-4">

          <div>
            {/* ✅ ONLY SMALL ADDITION (NO DESIGN CHANGE) */}
            <div className="flex justify-between items-center">
              <label className="text-sm text-[var(--text-secondary)]">Category</label>
              <button
                type="button"
                onClick={() => setIsCategoryModalOpen(true)}
                className="text-xs text-green-600"
              >
                + NEW
              </button>
            </div>

            <select
              required
              value={formData.category}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
              }
              className="w-full mt-1 px-4 py-3 bg-[var(--bg-main)] border border-[var(--border)] rounded-xl text-base"
            >
              <option value="">Choose {formData.type}</option>
              {filteredCategories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm text-[var(--text-secondary)]">Date</label>

            <input
              type="date"
              value={formData.date}
              onChange={(e) =>
                setFormData({ ...formData, date: e.target.value })
              }
              className="w-full mt-1 px-4 py-3 bg-[var(--bg-main)] border border-[var(--border)] rounded-xl"
            />
          </div>
        </div>

        {/* DESCRIPTION */}
        <div>
          <label className="text-sm text-[var(--text-secondary)]">Description</label>

          <input
            type="text"
            placeholder="e.g. Starbucks, Amazon"
            value={formData.description}
            onChange={(e) => {
              setFormData({ ...formData, description: e.target.value });
              getCategorySuggestion(e.target.value);
            }}
            className="w-full mt-1 px-4 py-3 bg-[var(--bg-main)] border border-[var(--border)] rounded-xl text-base"
          />

          {suggestedCategory && (
            <div className="mt-2 text-sm text-green-600 bg-green-100 px-3 py-2 rounded-lg">
              AI Suggestion: {suggestedCategory.charAt(0).toUpperCase() + suggestedCategory.slice(1)}
            </div>
          )}
        </div>

        {/* BUTTONS */}
        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 py-3 bg-green-500 text-white rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-green-400"
          >
            {loading ? <RefreshCw className="animate-spin" size={16} /> : <Check size={16} />}
            Add {formData.type}
          </button>

          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-6 py-3 border border-[var(--border)] rounded-xl text-[var(--text-secondary)]"
          >
            Cancel
          </button>
        </div>

      </form>

      {/* ✅ CATEGORY MODAL (LOGIC ONLY ADDED) */}
      {isCategoryModalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-2xl w-full max-w-sm space-y-4">

            <div className="flex justify-between items-center">
              <h3 className="font-semibold">
                Add {formData.type} Category
              </h3>
              <button onClick={() => setIsCategoryModalOpen(false)}>✕</button>
            </div>

            <form onSubmit={handleCreateCategory} className="space-y-4">
              <input
                type="text"
                required
                placeholder="Category name"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                className="w-full px-4 py-3 border rounded-xl"
              />

              <button className="w-full py-3 bg-green-500 text-white rounded-xl">
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