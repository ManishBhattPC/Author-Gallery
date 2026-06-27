import React from "react";
import { Outlet, useLocation, Navigate } from "react-router-dom";
import Navbar from "./navbar.jsx";
import Footer from "./Footer.jsx";
import { useAuth } from "../AuthContext.jsx";
import CustomCursor from "./CustomCursor.jsx";

const Layout = () => {
  const location = useLocation();
  const { user } = useAuth();

  const isMaintenanceActive = localStorage.getItem("admin_setting_maintenanceMode") === "true";
  const isBypassPath = location.pathname === "/login";

  if (user?.role === "admin") {
    return <Navigate to="/admin-dashboard" replace />;
  }

  if (isMaintenanceActive && !isBypassPath) {
    return (
      <div className="min-h-screen bg-[#0B0B0D] text-zinc-100 flex flex-col items-center justify-center p-6 text-center select-none font-sans">
        <div className="w-16 h-16 rounded-2xl bg-amber-600/10 border border-amber-600/30 flex items-center justify-center text-amber-500 mb-6 animate-pulse">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
            <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17L17.25 21A1.5 1.5 0 0020 20l-5.83-5.83M11.42 15.17l-4.66-4.66m4.66 4.66l5.83-5.83m-10.5 10.5l-2.91-2.91A1.5 1.5 0 013 14.17l5.83-5.83M11.42 9.17l4.66-4.66M11.42 9.17l-5.83 5.83m10.5-10.5L20 3M6.5 17.5l-2.91-2.91" />
          </svg>
        </div>
        <h1 className="font-serif font-black text-2xl tracking-wide text-white sm:text-3xl">Under Scheduled Maintenance</h1>
        <p className="text-xs text-zinc-400 mt-3 max-w-sm leading-relaxed font-semibold">
          Author Gallery is currently undergoing essential system optimization. We will be back online shortly. Thank you for your patience!
        </p>
        <div className="w-32 h-[1px] bg-gradient-to-r from-transparent via-[#d87f4a]/50 to-transparent mt-8" />
        <span className="text-[10px] text-zinc-650 font-bold uppercase tracking-widest mt-6">Author Gallery Core Engine</span>
        
        {/* Bypass link for admins */}
        <a href="/login" className="text-[10px] text-zinc-600 hover:text-zinc-450 transition-colors mt-12 underline">Admin Access Panel</a>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 custom-cursor-active">
      <CustomCursor />
      <Navbar />
      <main className="flex-grow overflow-hidden">
        {/* Keyed div triggers entry animation on pathname change */}
        <div key={location.pathname} className="animate-fade-in">
          <Outlet />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Layout;