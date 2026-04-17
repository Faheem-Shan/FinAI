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
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  
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
  }, [location.pathname]); 


   useEffect(() => {
    // ✅ Create WebSocket connection
    const token = localStorage.getItem("access");
    if (!token || token === "null") {
      console.log(" No token, skipping WebSocket");
      return;
    }
    const socket = new WebSocket(  `ws://localhost:8000/ws/notifications/?token=${token}`);

    //  When connected
    socket.onopen = () => {
      console.log("WebSocket Connected");
    };

    //  When message received (IMPORTANT)
    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);

      console.log("🔔 Notification:", data.message);

      // EMP: show alert (later we replace with UI dropdown)
      setNotifications(prev => [data.message, ...prev]);
    };

    // Error handling
    socket.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    //  When disconnected
    socket.onclose = () => {
      console.log(" WebSocket disconnected");
    };

    // Cleanup 
    return () => socket.close();

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
    // localStorage.removeItem('token');
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
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
    <header className="sticky top-0 z-40 bg-[var(--bg-card)]/80 backdrop-blur-xl border-b border-[var(--border)] px-8 py-5 transition-colors duration-500">

      <div className="max-w-7xl mx-auto flex items-center justify-between">

        {/* LEFT */}
        <div>
          <h1 className="text-xl font-black text-[var(--text-main)] tracking-tight">
            {getPageTitle()}
          </h1>
          <p className="text-[10px] text-[var(--text-secondary)] font-black uppercase tracking-widest mt-1">
            {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </p>
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-5 relative">

          {/* 🔔 NOTIFICATIONS */}
          <button
            onClick={() => setNotificationOpen(!notificationOpen)}
            className="relative p-2.5 rounded-xl bg-[var(--bg-main)] border border-[var(--border)] text-[var(--text-secondary)] hover:text-green-500 hover:border-green-500/30 transition-all group"
          >
            <Bell size={18} />
          </button>

          {/* 🔔 DROPDOWN */}
          {notificationOpen && (
            <div className="absolute right-0 top-14 w-72 bg-white border rounded-xl shadow-lg p-4 z-50">
              
              <p className="text-sm font-bold mb-2">Notifications</p>

              {notifications.length === 0 ? (
                <p className="text-xs text-gray-500">No notifications</p>
              ) : (
                notifications.map((n, i) => (
                  <div key={i} className="text-sm py-1 border-b">
                    {n}
                  </div>
                ))
              )}
            </div>
          )}

          {/* USER PROFILE DROPDOWN */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-3 bg-[var(--bg-card)] px-3 py-1.5 rounded-2xl border border-[var(--border)] hover:bg-[var(--bg-main)] transition-all shadow-sm group"
            >
              <div className="w-9 h-9 bg-green-500 text-slate-950 rounded-xl flex items-center justify-center font-black text-sm shadow-lg shadow-green-500/20 overflow-hidden">
                {user?.profile_picture ? (
                   <img 
                      src={user.profile_picture.startsWith('http') ? user.profile_picture : `http://127.0.0.1:8000${user.profile_picture}`} 
                      alt="P" 
                      className="w-full h-full object-cover"
                   />
                ) : (
                  displayName[0]
                )}
              </div>

              <div className="hidden md:block text-left">
                <p className="text-xs font-black text-[var(--text-main)] leading-none tracking-tight">
                  {displayName}
                </p>
                <p className="text-[10px] text-green-500 font-bold mt-1 uppercase tracking-widest opacity-80">
                  {user?.role ? user.role : 'Member'}
                </p>
              </div>

              <ChevronDown size={14} className={`text-[var(--text-secondary)] transition-transform duration-300 ${dropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* DROPDOWN MENU */}
            {dropdownOpen && (
              <div className="absolute right-0 mt-3 w-64 bg-[var(--bg-card)] border border-[var(--border)] rounded-[24px] shadow-2xl py-2 animate-in fade-in slide-in-from-top-2 duration-200 z-[100]">

                <div className="px-5 py-4 border-b border-[var(--border)]">
                  <p className="text-sm font-medium">{displayName}</p>
                  <p className="text-[11px] text-[var(--text-secondary)] font-medium truncate mt-0.5">{user?.email}</p>
                </div>

                <div className="p-2 space-y-1">
                  <Link
                    to="/profile"
                    className="flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-[var(--bg-main)] text-[var(--text-main)] text-xs font-bold transition-all"
                  >
                    <User size={16} className="text-[var(--text-secondary)]" /> My Profile
                  </Link>

                  <Link
                    to="/settings"
                    className="flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-[var(--bg-main)] text-[var(--text-main)] text-xs font-bold transition-all"
                  >
                    <Settings size={16} className="text-[var(--text-secondary)]" /> Preferences
                  </Link>
                </div>

                <div className="p-2 border-t border-[var(--border)]">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-rose-500 hover:bg-rose-500/10 rounded-xl text-xs font-bold transition-all"
                  >
                    <LogOut size={16} />  Logout
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