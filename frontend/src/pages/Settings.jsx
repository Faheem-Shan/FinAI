// import { useState, useEffect } from "react";
// import { Monitor, Bell, Shield, Moon, Sun, ChevronRight } from "lucide-react";

// const Settings = () => {
//   const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
//   const [notifications, setNotifications] = useState(true);
//   const [weekly, setWeekly] = useState(false);
//   const [hideBalance, setHideBalance] = useState(false);

//   useEffect(() => {
//     document.documentElement.setAttribute("data-theme", theme);
//   }, []);

//   const toggleTheme = (newTheme) => {
//     setTheme(newTheme);
//     localStorage.setItem("theme", newTheme);
//     document.documentElement.setAttribute("data-theme", newTheme);
//   };

//   return (
//     <div className="max-w-3xl mx-auto space-y-6">
//       {/* 🔹 HEADER */}
//       <div>
//         <h1 className="font-outfit text-2xl font-bold text-text-main tracking-tight italic">Preferences</h1>
//         <p className="text-[10px] text-text-secondary font-black uppercase tracking-widest mt-0.5 opacity-50">Local environment configuration</p>
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
//         {/* THEME */}
//         <section className="bg-white p-6 rounded-3xl border border-gray-100 shadow-md">
//           <div className="flex items-center gap-3 mb-6">
//             <div className="w-10 h-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center">
//               <Monitor size={18} className="stroke-[2.5]" />
//             </div>
//             <h2 className="font-outfit text-lg font-bold text-text-main">Interface Appearance</h2>
//           </div>

//           <div className="grid grid-cols-2 gap-4">
//             {/* LIGHT */}
//             <button
//               onClick={() => toggleTheme("light")}
//               className={`group relative p-4 rounded-2xl border-2 transition-all duration-300 ${
//                 theme === "light" 
//                   ? "border-primary bg-primary/[0.02] shadow-md shadow-primary/5" 
//                   : "border-gray-100 bg-white hover:border-gray-200 hover:shadow-sm"
//               }`}
//             >
//               <div className="w-full h-12 rounded-xl bg-gray-50 border border-gray-100 mb-3 flex p-2 gap-2 overflow-hidden opacity-50">
//                 <div className="w-1/4 bg-white rounded-md"></div>
//                 <div className="flex-1 bg-white rounded-md"></div>
//               </div>
//               <div className="flex items-center justify-center gap-2">
//                 <Sun size={14} className={theme === "light" ? "text-primary" : "text-text-secondary"} />
//                 <span className={`text-[12px] font-black uppercase tracking-widest ${theme === "light" ? "text-primary" : "text-text-main"}`}>Day</span>
//               </div>
//             </button>

//             {/* DARK */}
//             <button
//               onClick={() => toggleTheme("dark")}
//               className={`group relative p-4 rounded-2xl border-2 transition-all duration-300 ${
//                 theme === "dark" 
//                   ? "border-primary bg-primary/[0.02] shadow-md shadow-primary/5" 
//                   : "border-gray-100 bg-white hover:border-gray-200 hover:shadow-sm"
//               }`}
//             >
//               <div className="w-full h-12 rounded-xl bg-[#0F172A] border border-gray-800 mb-3 flex p-2 gap-2 overflow-hidden opacity-50">
//                 <div className="w-1/4 bg-[#1E293B] rounded-md"></div>
//                 <div className="flex-1 bg-[#1E293B] rounded-md"></div>
//               </div>
//               <div className="flex items-center justify-center gap-2">
//                 <Moon size={14} className={theme === "dark" ? "text-primary" : "text-text-secondary"} />
//                 <span className={`text-[12px] font-black uppercase tracking-widest ${theme === "dark" ? "text-primary" : "text-text-main"}`}>Night</span>
//               </div>
//             </button>
//           </div>
//         </section>

//         {/* CONTROLS */}
//         <div className="grid md:grid-cols-2 gap-6">
//            {/* NOTIFICATIONS */}
//            <section className="bg-white p-6 rounded-3xl border border-gray-100 shadow-md">
//              <div className="flex items-center gap-3 mb-6">
//                <div className="w-10 h-10 bg-red-50 text-red-500 rounded-xl flex items-center justify-center">
//                  <Bell size={18} className="stroke-[2.5]" />
//                </div>
//                <h2 className="font-outfit text-lg font-bold text-text-main">Sync Alerts</h2>
//              </div>

//              <div className="space-y-3">
//                <SettingRow
//                  title="Push Alerts"
//                  desc="Real-time system updates."
//                  value={notifications}
//                  setValue={setNotifications}
//                />
//                <div className="h-px bg-gray-50"></div>
//                <SettingRow
//                  title="Weekly Digest"
//                  desc="Spending trend reports."
//                  value={weekly}
//                  setValue={setWeekly}
//                />
//              </div>
//            </section>

//            {/* PRIVACY */}
//            <section className="bg-white p-6 rounded-3xl border border-gray-100 shadow-md">
//              <div className="flex items-center gap-3 mb-6">
//                <div className="w-10 h-10 bg-blue-50 text-blue-500 rounded-xl flex items-center justify-center">
//                  <Shield size={18} className="stroke-[2.5]" />
//                </div>
//                <h2 className="font-outfit text-lg font-bold text-text-main">Data Privacy</h2>
//              </div>

//              <SettingRow
//                title="Ghost Mode"
//                desc="Blur sensitive dashboard data."
//                value={hideBalance}
//                setValue={setHideBalance}
//              />
//            </section>
//         </div>
//       </div>
//     </div>
//   );
// };

// const SettingRow = ({ title, desc, value, setValue }) => (
//   <div 
//     className="flex items-center justify-between p-2.5 rounded-xl hover:bg-gray-50/50 transition-colors cursor-pointer group"
//     onClick={() => setValue(!value)}
//   >
//     <div className="max-w-[70%]">
//       <p className="text-[12px] font-black text-text-main uppercase tracking-tighter group-hover:text-primary transition-colors">{title}</p>
//       <p className="text-[10px] text-text-secondary font-medium tracking-tight opacity-60 leading-tight">{desc}</p>
//     </div>

//     <div className="relative">
//       <div className={`w-10 h-6 rounded-full transition-all duration-300 ${value ? 'bg-primary shadow-lg shadow-primary/20' : 'bg-gray-100'}`}>
//         <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-all duration-300 ${value ? 'left-5' : 'left-1'}`}></div>
//       </div>
//     </div>
//   </div>
// );

// export default Settings;

import { useState, useEffect } from "react";
import { Moon, Sun, Bell, Shield } from "lucide-react";

const Settings = () => {
  const [theme, setTheme] = useState("light");
  const [notifications, setNotifications] = useState(true);
  const [weekly, setWeekly] = useState(false);
  const [privacy, setPrivacy] = useState(false);

  // LOAD THEME
  useEffect(() => {
    const saved = localStorage.getItem("theme") || "light";
    setTheme(saved);

    if (saved === "dark") {
      document.documentElement.classList.add("dark");
    }
  }, []);

  // APPLY THEME
  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }

    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <div className="max-w-[1000px] mx-auto px-6 py-6 space-y-8">

      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-bold text-main">Settings</h1>
        <p className="text-sm text-secondary">
          Manage your account preferences
        </p>
      </div>

      {/* APPEARANCE */}
      <section className="card">
        <div className="flex items-center gap-2 mb-6">
          <Sun size={18} className="text-primary" />
          <h2 className="font-semibold text-lg text-main">Appearance</h2>
        </div>

        <div className="grid grid-cols-2 gap-4">

          <button
            onClick={() => setTheme("light")}
            className={`p-5 rounded-xl border transition ${
              theme === "light"
                ? "border-[var(--color-primary)] bg-[rgba(21,204,129,0.1)]"
                : "border-[var(--border)]"
            }`}
          >
            <Sun size={20} />
            <p className="mt-2 font-semibold text-main">Light Mode</p>
          </button>

          <button
            onClick={() => setTheme("dark")}
            className={`p-5 rounded-xl border transition ${
              theme === "dark"
                ? "border-[var(--color-primary)] bg-[rgba(21,204,129,0.1)]"
                : "border-[var(--border)]"
            }`}
          >
            <Moon size={20} />
            <p className="mt-2 font-semibold text-main">Dark Mode</p>
          </button>

        </div>
      </section>

      {/* NOTIFICATIONS */}
      <section className="card">
        <div className="flex items-center gap-2 mb-4">
          <Bell size={18} className="text-primary" />
          <h2 className="font-semibold text-lg text-main">Notifications</h2>
        </div>

        <SettingRow
          title="Push Notifications"
          desc="Receive real-time alerts"
          value={notifications}
          setValue={setNotifications}
        />

        <SettingRow
          title="Weekly Reports"
          desc="Get weekly financial summary"
          value={weekly}
          setValue={setWeekly}
        />
      </section>

      {/* PRIVACY */}
      <section className="card">
        <div className="flex items-center gap-2 mb-4">
          <Shield size={18} className="text-primary" />
          <h2 className="font-semibold text-lg text-main">Privacy</h2>
        </div>

        <SettingRow
          title="Hide Balance"
          desc="Hide sensitive financial data"
          value={privacy}
          setValue={setPrivacy}
        />
      </section>

    </div>
  );
};

// TOGGLE
const SettingRow = ({ title, desc, value, setValue }) => (
  <div
    onClick={() => setValue(!value)}
    className="flex items-center justify-between p-4 rounded-xl cursor-pointer transition hover:bg-[rgba(0,0,0,0.03)] dark:hover:bg-[rgba(255,255,255,0.05)]"
  >
    <div>
      <p className="font-medium text-main">{title}</p>
      <p className="text-sm text-secondary">{desc}</p>
    </div>

    <div className={`w-12 h-6 rounded-full transition ${
      value ? "bg-[var(--color-primary)]" : "bg-gray-300"
    }`}>
      <div
        className={`w-5 h-5 bg-white rounded-full mt-0.5 transition ${
          value ? "ml-6" : "ml-1"
        }`}
      />
    </div>
  </div>
);

export default Settings;