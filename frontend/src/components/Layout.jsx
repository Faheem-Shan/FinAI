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

import { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import api from "../api/axios";

const Layout = ({ children }) => {
  const [collapsed, setCollapsed] = useState(true);
  const [user, setUser] = useState(null);

  // 🔹 Fetch user (for tenant info)
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get("accounts/profile/");
        setUser(res.data);
      } catch (err) {
        console.error("Failed to load user", err);
      }
    };
    fetchUser();
  }, []);

  return (
    <div className="flex min-h-screen bg-cream selection:bg-primary/20">

      {/* ✅ SIDEBAR */}
      <Sidebar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        user={user}
      />

      {/* ✅ MAIN CONTENT */}
      <div
        className={`flex-1 flex flex-col min-w-0 h-screen overflow-hidden transition-all duration-300 
        ${collapsed ? "ml-[72px]" : "ml-[240px]"}`}
      >
        <Header userProfile={user} />

        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 custom-scrollbar">
          <div className="max-w-7xl mx-auto w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;