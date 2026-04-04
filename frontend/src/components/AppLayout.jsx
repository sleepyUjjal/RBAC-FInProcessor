import { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Header from "./Header";
import Sidebar from "./Sidebar";

const AppLayout = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <div className="app-shell min-h-screen fade-in-up min-[900px]:flex">
      <Sidebar isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />

      <div className="flex min-h-screen flex-1 flex-col transition-all duration-300 min-w-0">
        <Header onMenuToggle={() => setIsMobileMenuOpen((prev) => !prev)} />
        <main className="flex-1 px-4 pb-12 pt-32 transition-all duration-300 md:px-8 lg:px-10 min-[900px]:pb-8 min-[900px]:pt-28 min-[1200px]:px-10 min-[1200px]:pb-10 min-[1200px]:pt-32">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
