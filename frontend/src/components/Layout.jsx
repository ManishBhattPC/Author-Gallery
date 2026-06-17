import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./navbar.jsx";
import Footer from "./Footer.jsx";

const Layout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <Navbar />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;