import React, { useEffect, useState } from "react";
import { Outlet, useLocation, Navigate } from "react-router-dom";
import Navbar from "./navbar.jsx";
import Footer from "./Footer.jsx";
import { useAuth } from "../AuthContext.jsx";
import CustomCursor from "./CustomCursor.jsx";
import { getPublicSettings } from "../services/adminService.js";
import { ShieldAlert, AlertTriangle } from "lucide-react";

const Layout = () => {
  const location = useLocation();
  const { user } = useAuth();
  const [maintenanceMode, setMaintenanceMode] = useState(
    localStorage.getItem("admin_setting_maintenanceMode") === "true"
  );
  const [announcement, setAnnouncement] = useState(
    localStorage.getItem("admin_setting_announcementText") || ""
  );

  useEffect(() => {
    // Sync settings from backend
    const checkSettings = async () => {
      try {
        const data = await getPublicSettings();
        setMaintenanceMode(!!data.maintenanceMode);
        setAnnouncement(data.announcementText || "");
        localStorage.setItem("admin_setting_maintenanceMode", String(!!data.maintenanceMode));
        localStorage.setItem("admin_setting_announcementText", data.announcementText || "");
      } catch (err) {
        console.error("Failed to sync public settings:", err);
      }
    };

    checkSettings();
    const interval = setInterval(checkSettings, 15000); // Poll every 15 seconds
    return () => clearInterval(interval);
  }, []);

  if (user?.role === "admin") {
    return <Navigate to="/admin-dashboard" replace />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <CustomCursor />

      {/* Global Top Banner when Maintenance Shield is Active */}
      {maintenanceMode && (
        <div className="bg-gradient-to-r from-amber-900 via-amber-800 to-amber-900 text-amber-100 px-4 py-2.5 text-xs font-semibold flex flex-wrap items-center justify-center gap-2 border-b border-amber-700/50 shadow-md text-center">
          <ShieldAlert className="w-4 h-4 text-amber-400 animate-pulse shrink-0" />
          <span>
            <strong className="text-white">Maintenance Shield Active:</strong> Storage server maintenance in progress. Data uploads & book publishing are temporarily paused. Site browsing remains open.
          </span>
          {announcement && (
            <span className="hidden md:inline bg-amber-950/60 px-2 py-0.5 rounded text-[11px] text-amber-200 border border-amber-700/30">
              "{announcement}"
            </span>
          )}
        </div>
      )}

      <Navbar />
      <main className="flex-grow overflow-hidden">
        <div key={location.pathname} className="animate-fade-in">
          <Outlet />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Layout;