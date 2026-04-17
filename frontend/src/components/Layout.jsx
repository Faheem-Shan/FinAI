// import Sidebar from "./Sidebar";
// import Header from "./Header";

// const Layout = ({ children }) => {
//   return (
//     <div className="flex min-h-screen bg-cream selection:bg-primary/20">
//       <Sidebar />
//       <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
//         <Header />
//         <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 custom-scrollbar">
//           <div className="max-w-7xl mx-auto w-full transform origin-top transition-transform duration-500 hover:scale-[1.001]">
//             {children}
//           </div>
//         </main>
//       </div>
//     </div>
//   );
// };

// export default Layout;

import { useState, useEffect, useContext } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { AuthContext } from "../context/AuthContext";
import { layouts } from "chart.js";

// const Layout = ({ children }) => {
//   const [collapsed, setCollapsed] = useState(true);
//   const { user } = useContext(AuthContext);
  
//   // 🌓 THEME LOGIC
//   const [theme, setTheme] = useState(localStorage.getItem("theme") || "dark");

//   useEffect(() => {
//     const handleStorage = () => {
//       setTheme(localStorage.getItem("theme") || "dark");
//     };
//     window.addEventListener("storage", handleStorage);
//     // Also check for custom event if setting is in-tab
//     window.addEventListener("themeChange", handleStorage);
//     return () => {
//       window.removeEventListener("storage", handleStorage);
//       window.removeEventListener("themeChange", handleStorage);
//     };
//   }, []);

//   return (
//     <div className="flex min-h-screen bg-[var(--bg-main)] text-[var(--text-main)] transition-colors duration-500">

//       {/* ✅ SIDEBAR */}
//       <Sidebar
//         collapsed={collapsed}
//         setCollapsed={setCollapsed}
//         user={user}
//       />

//       {/* ✅ MAIN CONTENT */}
//       <div
//         className={`flex-1 flex flex-col min-w-0 h-screen overflow-hidden transition-all duration-300 
//         ${collapsed ? "ml-[72px]" : "ml-[240px]"}`}
//       >
//         <Header userProfile={user} />

//         <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-10 custom-scrollbar relative">
//           {/* Subtle background glow - only visible in dark mode or soft in light */}
//           <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/5 blur-[120px] rounded-full -z-10 opacity-50" />
          
//           <div className="max-w-7xl mx-auto w-full">
//             {children}
//           </div>
//         </main>
//       </div>
//     </div>
//   );
// };

// export default Layout;
const Layout = ({ children }) => {
  const [collapsed, setCollapsed] = useState(true);
  const { user } = useContext(AuthContext);

  return (
    <div className="flex min-h-screen bg-[var(--bg-main)] text-[var(--text-main)] transition-colors duration-500">

      {/* ✅ SIDEBAR */}
      <Sidebar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        user={user}
      />

      {/* ✅ MAIN CONTENT */}
      <div
        className={`flex-1 flex flex-col min-w-0 h-screen overflow-hidden transition-all duration-300 
        ${collapsed ? "ml-[80px]" : "ml-[260px]"}`}  // 🔥 UPDATED WIDTH (72→80, 240→260)
      >
        <Header userProfile={user} />

        <main className="flex-1 overflow-y-auto p-6 lg:p-10 relative"> {/* 🔥 Slight padding improvement */}
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/5 blur-[120px] rounded-full -z-10 opacity-50" />
          
          <div className="max-w-7xl mx-auto w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};
export default Layout;