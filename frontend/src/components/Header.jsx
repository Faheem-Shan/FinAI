// import { useState, useEffect, useRef } from 'react';
// import { useNavigate, Link, useLocation } from 'react-router-dom';
// import { User, Settings, LogOut, ChevronDown, Bell } from 'lucide-react';
// import api from '../api/axios';

// const Header = () => {
//   const [user, setUser] = useState(null);
//   const [dropdownOpen, setDropdownOpen] = useState(false);
//   const dropdownRef = useRef(null);
//   const navigate = useNavigate();
//   const location = useLocation();

//   useEffect(() => {
//     const fetchUser = async () => {
//       try {
//         const response = await api.get('accounts/profile/');
//         setUser(response.data);
//       } catch (error) {
//         console.error("Error fetching user for header", error);
//       }
//     };
//     fetchUser();
//   }, []);

//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
//         setDropdownOpen(false);
//       }
//     };
//     document.addEventListener('mousedown', handleClickOutside);
//     return () => document.removeEventListener('mousedown', handleClickOutside);
//   }, []);

//   const handleLogout = () => {
//     localStorage.removeItem('token');
//     window.location.href = '/';
//   };

//   const getPageTitle = () => {
//     const path = location.pathname;
//     const titles = {
//       '/dashboard': 'Overview',
//       '/transactions': 'Transactions',
//       '/add': 'New Entry',
//       '/budgets': 'Budgets',
//       '/insights': 'Analysis',
//       '/settings': 'Settings',
//       '/profile': 'Profile'
//     };
//     return titles[path] || 'FinAI';
//   };

//   const displayName = user ? (user.first_name ? `${user.first_name} ${user.last_name || ''}` : user.username) : 'User';

//   return (
//     <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-100 px-6 py-2.5">
//       <div className="max-w-7xl mx-auto flex items-center justify-between">
//         <div>
//           <h1 className="font-outfit text-xl font-bold text-text-main tracking-tight">
//             {getPageTitle()}
//           </h1>
//           <p className="text-[10px] text-text-secondary font-bold uppercase tracking-widest mt-0.5 opacity-60">
//             {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
//           </p>
//         </div>
        
//         <div className="flex items-center gap-3">
//           <button className="relative p-2 text-text-secondary hover:text-primary hover:bg-primary/5 rounded-xl transition-colors group">
//             <Bell size={18} />
//             <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-red-500 border-2 border-white rounded-full"></span>
//           </button>

//           <div className="h-6 w-[1px] bg-gray-100 mx-1"></div>

//           <div className="relative" ref={dropdownRef}>
//             <button 
//               className="flex items-center gap-2 p-1 hover:bg-gray-50 rounded-xl transition-all duration-200"
//               onClick={() => setDropdownOpen(!dropdownOpen)}
//             >
//               <div className="w-8 h-8 bg-primary text-white rounded-lg flex items-center justify-center font-black text-xs shadow-sm">
//                 {user?.first_name ? user.first_name[0] : (user?.username ? user.username[0] : 'U')}
//               </div>
//               <div className="hidden md:block text-left px-1">
//                 <p className="text-[12px] font-black text-text-main leading-none">{displayName}</p>
//                 <p className="text-[9px] text-text-secondary font-bold mt-1 opacity-50 uppercase tracking-tighter">Verified</p>
//               </div>
//               <ChevronDown size={12} className={`text-text-secondary transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
//             </button>

//             {dropdownOpen && (
//               <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 py-1 animate-in fade-in slide-in-from-top-1 duration-200">
//                 <div className="px-4 py-3 border-b border-gray-50">
//                   <p className="text-[12px] font-black text-text-main truncate">{displayName}</p>
//                   <p className="text-[10px] text-text-secondary truncate mt-0.5 font-medium">{user?.email}</p>
//                 </div>
                
//                 <div className="p-1.5 space-y-0.5">
//                   <Link 
//                     to="/profile" 
//                     className="flex items-center gap-2.5 px-3 py-2 text-[12px] font-bold text-text-secondary hover:text-text-main hover:bg-gray-50 rounded-xl transition-colors"
//                     onClick={() => setDropdownOpen(false)}
//                   >
//                     <User size={14} /> Profile Settings
//                   </Link>
//                   <Link 
//                     to="/settings" 
//                     className="flex items-center gap-2.5 px-3 py-2 text-[12px] font-bold text-text-secondary hover:text-text-main hover:bg-gray-50 rounded-xl transition-colors"
//                     onClick={() => setDropdownOpen(false)}
//                   >
//                     <Settings size={14} /> Preferences
//                   </Link>
//                 </div>

//                 <div className="p-1.5 border-t border-gray-50">
//                   <button 
//                     onClick={handleLogout} 
//                     className="w-full flex items-center gap-2.5 px-3 py-2 text-[12px] font-bold text-red-500 hover:bg-red-50 rounded-xl transition-colors"
//                   >
//                     <LogOut size={14} /> Log Out
//                   </button>
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </header>
//   );
// };

// export default Header;

import { useState, useEffect, useRef } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { User, Settings, LogOut, ChevronDown, Bell } from 'lucide-react';
import api from '../api/axios';

const Header = () => {
  const [user, setUser] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get('accounts/profile/');
        setUser(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/';
  };

  const getPageTitle = () => {
    const map = {
      '/dashboard': 'Overview',
      '/transactions': 'Transactions',
      '/add': 'New Entry',
      '/budgets': 'Budgets',
      '/insights': 'AI Insights',
      '/settings': 'Settings',
      '/profile': 'Profile'
    };
    return map[location.pathname] || 'FinAI';
  };

  const displayName = user
    ? user.first_name
      ? `${user.first_name} ${user.last_name || ''}`
      : user.username
    : 'User';

  return (
    <header className="sticky top-0 z-40 bg-[var(--bg-card)] border-b border-[var(--border)] px-6 py-3">

      <div className="max-w-[1200px] mx-auto flex items-center justify-between">

        {/* LEFT */}
        <div>
          <h1 className="text-2xl font-bold text-main">
            {getPageTitle()}
          </h1>
          <p className="text-xs text-secondary mt-1">
            {new Date().toLocaleDateString()}
          </p>
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-4">

          {/* 🔔 BELL */}
          <button className="relative p-3 rounded-xl bg-[rgba(0,0,0,0.05)] dark:bg-[rgba(255,255,255,0.05)] hover:scale-105 transition">
            <Bell size={20} className="text-main" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-[var(--bg-card)]"></span>
          </button>

          {/* USER */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-3 bg-[var(--bg-card)] px-4 py-2 rounded-xl shadow-sm border border-[var(--border)] hover:shadow-md transition"
            >
              <div className="w-10 h-10 bg-[var(--color-primary)] text-white rounded-xl flex items-center justify-center font-bold">
                {displayName[0]}
              </div>

              <div className="hidden md:block text-left">
                <p className="text-sm font-bold text-main">
                  {displayName}
                </p>
                <p className="text-[11px] text-secondary">
                  Verified
                </p>
              </div>

              <ChevronDown size={16} className={`transition ${dropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* DROPDOWN */}
            {dropdownOpen && (
              <div className="absolute right-0 mt-3 w-60 bg-[var(--bg-card)] rounded-2xl shadow-xl border border-[var(--border)] py-2">

                <div className="px-4 py-3 border-b border-[var(--border)]">
                  <p className="text-sm font-bold text-main">{displayName}</p>
                  <p className="text-xs text-secondary">{user?.email}</p>
                </div>

                <div className="p-2 space-y-1">
                  <Link
                    to="/profile"
                    className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-[rgba(0,0,0,0.05)] dark:hover:bg-[rgba(255,255,255,0.05)]"
                  >
                    <User size={16} /> Profile
                  </Link>

                  <Link
                    to="/settings"
                    className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-[rgba(0,0,0,0.05)] dark:hover:bg-[rgba(255,255,255,0.05)]"
                  >
                    <Settings size={16} /> Settings
                  </Link>
                </div>

                <div className="p-2 border-t border-[var(--border)]">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-3 py-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl"
                  >
                    <LogOut size={16} /> Logout
                  </button>
                </div>

              </div>
            )}
          </div>

        </div>
      </div>
    </header>
  );
};

export default Header;