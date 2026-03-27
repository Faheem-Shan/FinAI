import Sidebar from "./Sidebar";
import Header from "./Header";

const Layout = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-cream selection:bg-primary/20">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 custom-scrollbar">
          <div className="max-w-7xl mx-auto w-full transform origin-top transition-transform duration-500 hover:scale-[1.001]">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
