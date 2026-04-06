// import { NavLink } from 'react-router-dom';
// import { LayoutDashboard, ReceiptText, PlusCircle, PieChart, Lightbulb } from 'lucide-react';

// const Sidebar = () => {
//   const menuItems = [
//     { name: 'Dashboard', icon: <LayoutDashboard size={22} />, path: '/dashboard' },
//     { name: 'Transactions', icon: <ReceiptText size={22} />, path: '/transactions' },
//     { name: 'Add Transaction', icon: <PlusCircle size={22} />, path: '/add' },
//     { name: 'Budgets', icon: <PieChart size={22} />, path: '/budgets' },
//     { name: 'AI Insights', icon: <Lightbulb size={22} />, path: '/insights' },
//   ];

//   return (
//     <aside className="w-56 min-h-screen p-5 bg-[var(--bg-card)] border-r border-[var(--border)]">

//       {/* LOGO */}
//       <div className="flex items-center gap-2 mb-8">
//         <div className="w-8 h-8 bg-[var(--color-primary)] text-white flex items-center justify-center rounded-lg">
//           F
//         </div>
//         <span className="font-bold text-main">FinAI</span>
//       </div>

//       {/* MENU */}
//       <nav className="space-y-2">
//         {menuItems.map(item => (
//           <NavLink
//             key={item.name}
//             to={item.path}
//             className={({ isActive }) =>
//               `flex items-center gap-3 p-3 rounded-xl text-[15px] ${
//                 isActive
//                   ? "bg-[rgba(21,204,129,0.1)] text-[var(--color-primary)]"
//                   : "text-secondary hover:bg-[rgba(0,0,0,0.05)] dark:hover:bg-[rgba(255,255,255,0.05)]"
//               }`
//             }
//           >
//             {item.icon}
//             {item.name}
//           </NavLink>
//         ))}
//       </nav>

//     </aside>
//   );
// };

// export default Sidebar;

import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  ReceiptText,
  PlusCircle,
  PieChart,
  Lightbulb,
  MessageSquare,
  Building2,
  User,
} from "lucide-react";

const Sidebar = ({ collapsed, setCollapsed, user }) => {
const isCompany = !!user?.tenant_details;

const menuItems = [
    { name: "Dashboard", icon: <LayoutDashboard size={20} />, path: "/dashboard" },
    { name: "Transactions", icon: <ReceiptText size={20} />, path: "/transactions" },
    { name: "Add", icon: <PlusCircle size={20} />, path: "/add" },
    { name: "Budgets", icon: <PieChart size={20} />, path: "/budgets" },
    { name: "AI Insights", icon: <Lightbulb size={20} />, path: "/insights" },

    ...(isCompany
      ? [{ name: "Team Chat", icon: <MessageSquare size={20} />, path: "/chat" }]
      : []),
  ];

  return (
    <aside
      onMouseEnter={() => setCollapsed(false)}
      onMouseLeave={() => setCollapsed(true)}
      className={`fixed top-0 left-0 h-full bg-[var(--bg-card)] border-r border-[var(--border)]
      transition-all duration-300 z-50
      ${collapsed ? "w-[72px]" : "w-[240px]"}`}
    >
      {/* LOGO */}
      <div className="flex items-center gap-3 px-4 py-5">
        <div className="w-9 h-9 bg-[var(--color-primary)] text-white flex items-center justify-center rounded-lg font-bold">
          F
        </div>
        {!collapsed && (
          <span className="font-bold text-lg text-main">FinAI</span>
        )}
      </div>

      {/* WORKSPACE */}
      <div className="px-3 mb-6">
        <div className="flex items-center gap-3 p-2 rounded-xl bg-[rgba(0,0,0,0.03)] dark:bg-[rgba(255,255,255,0.05)]">
          
          <div className="w-9 h-9 flex items-center justify-center rounded-lg bg-primary text-white">
            {isCompany ? <Building2 size={18} /> : <User size={18} />}
          </div>

          {!collapsed && (
            <div className="overflow-hidden">
              <p className="text-sm font-semibold truncate">
                {isCompany ? user.tenant_details.name : "Personal Workspace"}
              </p>
              <p className="text-xs text-secondary">
                {isCompany ? "Company" : "Individual"}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* MENU */}
      <nav className="flex flex-col gap-1 px-2">
        {menuItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 p-3 rounded-xl transition-all ${
                isActive
                  ? "bg-[rgba(21,204,129,0.1)] text-[var(--color-primary)]"
                  : "text-secondary hover:bg-[rgba(0,0,0,0.05)] dark:hover:bg-[rgba(255,255,255,0.05)]"
              }`
            }
          >
            {item.icon}

            {!collapsed && (
              <span className="text-sm font-medium">{item.name}</span>
            )}
          </NavLink>
        ))}
      </nav>

      {/* FOOTER */}
      <div className="absolute bottom-4 w-full text-center text-xs text-secondary">
        {!collapsed && "v1.0.0"}
      </div>
    </aside>
  );
};

export default Sidebar;