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

import { NavLink, Link } from "react-router-dom";
import {
  LayoutDashboard,
  ReceiptText,
  PlusCircle,
  PieChart,
  Lightbulb,
  MessageSquare,
  Building2,
  User as UserIcon,
} from "lucide-react";

const Sidebar = ({ collapsed, setCollapsed, user }) => {
  const isCompany = !!user?.tenant_details;
  const role = user?.role; // admin, manager, accountant

  const menuItems = [
    { name: "Dashboard", icon: <LayoutDashboard size={20} />, path: "/dashboard" },
    { name: "Transactions", icon: <ReceiptText size={20} />, path: "/transactions" },
    { name: "Add", icon: <PlusCircle size={20} />, path: "/add" },
    { name: "Budgets", icon: <PieChart size={20} />, path: "/budgets" },
    { name: "AI Insights", icon: <Lightbulb size={20} />, path: "/insights" },

    // ✅ Multi-Tenant Role Specific Pages
    ...(isCompany && (role === "admin" || role === "manager")
      ? [
          {
            name: "Approvals",
            icon: <MessageSquare size={20} />,
            path: "/approvals",
          },
        ]
      : []),

    ...(isCompany && role === "admin"
      ? [
          {
            name: "Organization",
            icon: <Building2 size={20} />,
            path: "/organization",
          },
        ]
      : []),
  ];


  return (
    <aside
      onMouseEnter={() => setCollapsed(false)}
      onMouseLeave={() => setCollapsed(true)}
      className={`fixed top-0 left-0 h-full bg-[var(--bg-sidebar)] border-r border-[var(--border)]
      transition-all duration-300 z-50
      ${collapsed ? "w-[80px]" : "w-[260px]"}`}
    >
      {/* LOGO */}
      <Link to="/dashboard" className="flex items-center gap-3 px-4 py-5 hover:opacity-80 transition cursor-pointer">
        <div className="w-9 h-9 bg-[var(--color-primary)] text-white flex items-center justify-center rounded-lg font-bold">
          F
        </div>
        {!collapsed && (
          <span className="font-semibold text-lg text-white transition-colors">FinAI</span>
        )}
      </Link>

      {/* WORKSPACE */}
      <div className="px-4 mb-6">
        <div className="flex items-center gap-3 p-2 rounded-xl bg-[var(--bg-main)]/50 border border-[var(--border)] transition-colors">

          <div className="w-9 h-9 flex items-center justify-center rounded-lg bg-green-500 text-white shadow-lg shadow-green-500/10">
            {isCompany ? <Building2 size={18} /> : <UserIcon size={18} />}
          </div>

          {!collapsed && (
            <div className="overflow-hidden">
              <p className="text-sm font-semibold truncate text-[var(--text-main)]">
                {isCompany ? user.tenant_details.name : "Personal Workspace"}
              </p>
              <p className="text-xs text-[var(--text-secondary)]">
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
              `flex items-center gap-3 p-3 rounded-xl transition-all ${isActive
                ? "bg-green-500/10 text-green-500 font-bold"
                : "text-[var(--text-secondary)] hover:bg-[var(--bg-main)] hover:text-[var(--text-main)]"
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

      {/* FOOTER / ROLE BADGE */}
      <div className="absolute bottom-4 w-full px-3">
        {!collapsed && (
          <div className="py-2.5 px-3 rounded-xl bg-[var(--bg-main)] border border-[var(--border)] text-center transition-colors">
            <p className="text-[9px] uppercase font-black tracking-widest text-[var(--text-secondary)] mb-0.5">
              Access Level
            </p>
            <p className="text-[11px] font-bold text-green-500 capitalize">
              {user?.role ? (user.role === 'admin' ? 'System Admin' : user.role === 'manager' ? 'Finance Manager' : 'Accountant') : 'Personal Account'}
            </p>
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;