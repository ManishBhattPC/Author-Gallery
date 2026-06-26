import React from "react";
import { Outlet, useLocation, Navigate } from "react-router-dom";
import Navbar from "./navbar.jsx";
import Footer from "./Footer.jsx";
import { useAuth } from "../AuthContext.jsx";

const Layout = () => {
  const location = useLocation();
  const { user } = useAuth();

  if (user?.role === "admin") {
    return <Navigate to="/admin-dashboard" replace />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
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