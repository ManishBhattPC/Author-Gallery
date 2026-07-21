import React, { useEffect, useState } from "react";
import { Outlet, useLocation, Navigate } from "react-router-dom";
import Navbar from "./navbar.jsx";
import Footer from "./Footer.jsx";
import { useAuth } from "../AuthContext.jsx";
import CustomCursor from "./CustomCursor.jsx";
import { getPublicSettings } from "../services/adminService.js";
import { ShieldAlert, Volume2, VolumeX } from "lucide-react";

const Layout = () => {
  const location = useLocation();
  const { user } = useAuth();
  
  const [maintenanceMode, setMaintenanceMode] = useState(
    localStorage.getItem("admin_setting_maintenanceMode") === "true"
  );
  const [announcement, setAnnouncement] = useState(
    localStorage.getItem("admin_setting_announcementText") || ""
  );
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    let retryTimeout;
    
    // Sync settings from backend
    const checkSettings = async () => {
      try {
        const data = await getPublicSettings();
        if (data) {
          const isMaint = !!data.maintenanceMode;
          const text = data.announcementText || "";
          
          setMaintenanceMode(isMaint);
          setAnnouncement(text);
          
          localStorage.setItem("admin_setting_maintenanceMode", String(isMaint));
          localStorage.setItem("admin_setting_announcementText", text);
        }
      } catch (err) {
        // If it fails (likely backend cold starting), retry in 5 seconds to catch it as soon as it wakes up
        retryTimeout = setTimeout(checkSettings, 5000);
      }
    };

    checkSettings();
    const interval = setInterval(checkSettings, 30000); // Check every 30 seconds
    
    return () => {
      clearInterval(interval);
      if (retryTimeout) clearTimeout(retryTimeout);
    };
  }, []);

  const handleSpeakAnnouncement = () => {
    if (!("speechSynthesis" in window)) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    } else {
      window.speechSynthesis.cancel();
      const speakText = `Notice: Maintenance Shield Active. Storage server maintenance in progress. Data uploads and publishing are temporarily paused. ${announcement}`;
      const utterance = new SpeechSynthesisUtterance(speakText);
      utterance.rate = 0.95;
      utterance.pitch = 1.0;
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      setIsSpeaking(true);
      window.speechSynthesis.speak(utterance);
    }
  };

  if (user?.role === "admin") {
    return <Navigate to="/admin-dashboard" replace />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <CustomCursor />

      {/* Global Top Banner when Maintenance Shield is Active */}
      {maintenanceMode && (
        <div className="bg-gradient-to-r from-amber-900 via-amber-800 to-amber-900 text-amber-100 px-4 py-2.5 text-xs font-semibold flex flex-wrap items-center justify-center gap-3 border-b border-amber-700/50 shadow-md text-center select-none animate-fade-in">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-amber-400 animate-pulse shrink-0" />
            <span>
              <strong className="text-white">Maintenance Shield Active:</strong> Storage server optimization in progress. Uploads & publishing are paused. Browsing remains open.
            </span>
          </div>

          {announcement && (
            <span className="bg-amber-950/60 px-2 py-0.5 rounded text-[11px] text-amber-200 border border-amber-700/30">
              "{announcement}"
            </span>
          )}

          {/* Interactive Text-to-Speech Button */}
          <button
            type="button"
            onClick={handleSpeakAnnouncement}
            title={isSpeaking ? "Stop Voice Announcement" : "Listen to Announcement"}
            className="px-2 py-1 rounded bg-amber-950/70 hover:bg-amber-950/90 transition cursor-pointer flex items-center gap-1.5 focus:outline-none border border-amber-700/30 active:scale-95 text-[10px] text-amber-200 font-mono shrink-0"
          >
            {isSpeaking ? (
              <VolumeX className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
            ) : (
              <Volume2 className="w-3.5 h-3.5 text-amber-200" />
            )}
            <span>{isSpeaking ? "Stop Voice" : "Listen"}</span>
          </button>
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