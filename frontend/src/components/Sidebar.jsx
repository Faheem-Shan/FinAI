// import { NavLink } from 'react-router-dom';
// import { LayoutDashboard, ReceiptText, PlusCircle, PieChart, Lightbulb } from 'lucide-react';

// const Sidebar = () => {
//   const menuItems = [
//     { name: 'Dashboard', icon: <LayoutDashboard className="w-[18px] h-[18px]" />, path: '/dashboard' },
//     { name: 'Transactions', icon: <ReceiptText className="w-[18px] h-[18px]" />, path: '/transactions' },
//     { name: 'Add Transaction', icon: <PlusCircle className="w-[18px] h-[18px]" />, path: '/add' },
//     { name: 'Budgets', icon: <PieChart className="w-[18px] h-[18px]" />, path: '/budgets' },
//     { name: 'AI Insights', icon: <Lightbulb className="w-[18px] h-[18px]" />, path: '/insights' },
//   ];

//   return (
//     <aside className="fixed inset-y-0 left-0 z-50 w-60 bg-white border-r border-gray-100 flex flex-col transition-all duration-300 transform lg:translate-x-0 -translate-x-full lg:static">
//       <div className="flex items-center gap-2.5 px-6 py-7 cursor-pointer group" onClick={() => window.location.href = '/'}>
//         <div className="w-9 h-9 bg-primary text-white rounded-xl flex items-center justify-center font-black text-lg shadow-lg shadow-primary/20 group-hover:rotate-6 transition-transform">
//           F
//         </div>
//         <span className="font-outfit text-xl font-bold tracking-tight text-text-main">FinAI</span>
//       </div>

//       <nav className="flex-1 px-4 mt-2 space-y-1">
//         <p className="px-4 text-[10px] font-black text-text-secondary uppercase tracking-[0.2em] mb-4 opacity-50">Menu</p>
        
//         {menuItems.map((item) => (
//           <NavLink 
//             key={item.name} 
//             to={item.path} 
//             className={({ isActive }) => 
//               `flex items-center gap-3 px-4 py-2.5 rounded-xl text-[13px] font-bold transition-all duration-200 ${
//                 isActive 
//                   ? 'bg-primary/5 text-primary shadow-sm shadow-primary/5' 
//                   : 'text-text-secondary hover:bg-gray-50 hover:text-text-main'
//               }`
//             }
//           >
//             {item.icon}
//             <span>{item.name}</span>
//           </NavLink>
//         ))}
//       </nav>

//       <div className="p-4 mt-auto">
//         <div className="p-4 bg-gray-50/50 rounded-2xl border border-gray-100/50">
//           <p className="text-[10px] font-black text-text-secondary uppercase tracking-widest mb-1 opacity-50">Status</p>
//           <div className="flex items-center justify-between">
//             <span className="text-[12px] font-bold text-primary">Pro Member</span>
//             <div className="w-2 h-2 bg-primary rounded-full animate-pulse shadow-[0_0_8px_rgba(21,204,129,0.5)]"></div>
//           </div>
//         </div>
//       </div>
//     </aside>
//   );
// };

// export default Sidebar;


import { NavLink } from 'react-router-dom';
import { LayoutDashboard, ReceiptText, PlusCircle, PieChart, Lightbulb } from 'lucide-react';

const Sidebar = () => {
  const menuItems = [
    { name: 'Dashboard', icon: <LayoutDashboard size={22} />, path: '/dashboard' },
    { name: 'Transactions', icon: <ReceiptText size={22} />, path: '/transactions' },
    { name: 'Add Transaction', icon: <PlusCircle size={22} />, path: '/add' },
    { name: 'Budgets', icon: <PieChart size={22} />, path: '/budgets' },
    { name: 'AI Insights', icon: <Lightbulb size={22} />, path: '/insights' },
  ];

  return (
    <aside className="w-56 min-h-screen p-5 bg-[var(--bg-card)] border-r border-[var(--border)]">

      {/* LOGO */}
      <div className="flex items-center gap-2 mb-8">
        <div className="w-8 h-8 bg-[var(--color-primary)] text-white flex items-center justify-center rounded-lg">
          F
        </div>
        <span className="font-bold text-main">FinAI</span>
      </div>

      {/* MENU */}
      <nav className="space-y-2">
        {menuItems.map(item => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 p-3 rounded-xl text-[15px] ${
                isActive
                  ? "bg-[rgba(21,204,129,0.1)] text-[var(--color-primary)]"
                  : "text-secondary hover:bg-[rgba(0,0,0,0.05)] dark:hover:bg-[rgba(255,255,255,0.05)]"
              }`
            }
          >
            {item.icon}
            {item.name}
          </NavLink>
        ))}
      </nav>

    </aside>
  );
};

export default Sidebar;