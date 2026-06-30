import React, { useState, useEffect, useRef } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext.jsx";
import { getMyAuthorProfile } from "../services/authorProfileService.js";
import { fetchAuthorRequests, approvePurchaseRequest, declinePurchaseRequest } from "../services/paymentService.js";
import { 
  LayoutDashboard, 
  User, 
  LogOut, 
  ChevronDown, 
  Menu, 
  X, 
  Home, 
  Compass, 
  BookOpen, 
  Users, 
  Info,
  Settings,
  PenTool,
  Sun,
  Moon,
  Bell,
  Check,
  Clock,
} from "lucide-react";

const NAV_ITEMS = [
  { label: "Home", to: "/", icon: <Home size={18} /> },
  { label: "Explore", to: "/explore", icon: <Compass size={18} /> },
  { label: "Authors", to: "/authors", icon: <Users size={18} /> },
  { label: "Books", to: "/books", icon: <BookOpen size={18} /> },
  { label: "About", to: "/about", icon: <Info size={18} /> },
];

const Navbar = () => {
  const { user, logout, updateUser } = useAuth();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const dropdownRef = useRef(null);

  const [requests, setRequests] = useState([]);
  const [loadingRequests, setLoadingRequests] = useState(false);
  const [requestsOpen, setRequestsOpen] = useState(false);
  const [mobileRequestsOpen, setMobileRequestsOpen] = useState(false);

  const loadPendingRequests = async () => {
    if (!user) return;
    try {
      setLoadingRequests(true);
      const data = await fetchAuthorRequests();
      setRequests(data || []);
    } catch (err) {
      console.error("Failed to load author requests:", err);
    } finally {
      setLoadingRequests(false);
    }
  };

  const handleApprove = async (requestId) => {
    try {
      await approvePurchaseRequest(requestId);
      setRequests((prev) => prev.filter((r) => r._id !== requestId));
    } catch (err) {
      console.error("Approval failed:", err);
    }
  };

  const handleDecline = async (requestId) => {
    try {
      await declinePurchaseRequest(requestId);
      setRequests((prev) => prev.filter((r) => r._id !== requestId));
    } catch (err) {
      console.error("Decline failed:", err);
    }
  };

  useEffect(() => {
    if (user) {
      loadPendingRequests();
      // Poll requests every 30 seconds for live updates
      const intervalId = setInterval(loadPendingRequests, 30000);
      return () => clearInterval(intervalId);
    } else {
      setRequests([]);
    }
  }, [user]);

  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("theme") || "system";
  });

  useEffect(() => {
    const root = document.documentElement;
    const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    
    const applyTheme = (current) => {
      if (current === "dark" || (current === "system" && systemPrefersDark)) {
        root.classList.add("dark");
        root.classList.remove("light");
      } else {
        root.classList.add("light");
        root.classList.remove("dark");
      }
    };

    applyTheme(theme);
    
    if (theme === "system") {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      const handleChange = () => applyTheme("system");
      mediaQuery.addEventListener("change", handleChange);
      return () => mediaQuery.removeEventListener("change", handleChange);
    }
  }, [theme]);

  useEffect(() => {
    const handleThemeChange = () => {
      setTheme(localStorage.getItem("theme") || "system");
    };
    window.addEventListener("theme-change", handleThemeChange);
    window.addEventListener("storage", handleThemeChange);
    return () => {
      window.removeEventListener("theme-change", handleThemeChange);
      window.removeEventListener("storage", handleThemeChange);
    };
  }, []);

  const toggleTheme = () => {
    setTheme((prev) => {
      const currentResolved = prev === "system" 
        ? (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light")
        : prev;
      const nextTheme = currentResolved === "dark" ? "light" : "dark";
      localStorage.setItem("theme", nextTheme);
      window.dispatchEvent(new Event("theme-change"));
      return nextTheme;
    });
  };

  // Sync profile details on login/mount
  useEffect(() => {
    if (user && !user.profileImage) {
      getMyAuthorProfile()
        .then((profile) => {
          if (profile) {
            updateUser({
              profileImage: profile.profileImage || "",
              name: profile.displayName || user.name
            });
          }
        })
        .catch(() => {
          // No profile yet, skip
        });
    }
  }, [user, updateUser]);

  // Click outside listener for dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    setMenuOpen(false);
    navigate("/");
  };

  const userAvatar = user?.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || "User")}&background=8C4E35&color=FAF6F0&bold=true&size=128`;

  const announcementText = localStorage.getItem("admin_setting_announcementText");

  return (
    <div className="w-full flex flex-col">
      {announcementText && (
        <div className="bg-amber-800 text-white py-2.5 px-4 text-center text-[11px] font-bold leading-relaxed border-b border-amber-900 shadow-sm flex items-center justify-center gap-2 select-none animate-fade-in">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 text-amber-200 shrink-0">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z" />
          </svg>
          <span>{announcementText}</span>
        </div>
      )}
      <header className="sticky top-0 z-40 bg-slate-50 border-b border-slate-200/50 shadow-sm">
      <div className="flex w-full items-center justify-between gap-4 px-4 py-3 sm:px-8 md:px-12">
        
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2.5 text-xl font-serif font-bold text-slate-900 group">
          <span className="flex items-center justify-center bg-gradient-to-tr from-amber-800 to-amber-900 text-slate-50 w-9 h-9 rounded-xl font-serif font-bold text-sm shadow-md transition-transform group-hover:scale-105 select-none">
            AG
          </span>
          <span className="tracking-tight hover:text-amber-700 transition duration-300">Author Gallery</span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden items-center gap-1 lg:flex">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.label}
              to={item.to}
              className={({ isActive }) =>
                `relative px-4 py-2 text-sm font-semibold transition-colors duration-300 rounded-lg hover:bg-slate-100/50 ${
                  isActive ? "text-amber-800" : "text-slate-600 hover:text-amber-800"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <span>{item.label}</span>
                  {isActive && (
                    <span className="absolute bottom-1.5 left-4 right-4 h-0.5 bg-amber-800 rounded-full" />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Desktop User Panel */}
        <div className="hidden items-center gap-3 lg:flex">
          {!user ? (
            <>
              <Link
                to="/login"
                className="rounded-full border border-amber-800/20 px-5 py-2 text-sm font-semibold text-amber-900 transition hover:border-amber-600 hover:text-amber-800"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="rounded-full bg-amber-800 px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-amber-900"
              >
                Sign Up
              </Link>
            </>
          ) : (
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setDropdownOpen(prev => !prev)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full hover:bg-slate-100 transition duration-200 border border-slate-200/50 cursor-pointer"
              >
                <img
                  src={userAvatar}
                  alt={user.name}
                  onError={(e) => {
                    e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || "User")}&background=8C4E35&color=FAF6F0&bold=true&size=128`;
                    e.currentTarget.onerror = null;
                  }}
                  className="w-7 h-7 rounded-full object-cover border border-slate-200"
                />
                <span className="text-xs font-semibold text-slate-800 max-w-[100px] truncate">
                  {user.name}
                </span>
                <ChevronDown size={14} className={`text-slate-400 transition-transform ${dropdownOpen ? "rotate-180" : ""}`} />
              </button>

              {/* Profile Dropdown Menu */}
              {dropdownOpen && (
                <div className="absolute right-0 mt-2.5 w-60 bg-white border border-slate-200/80 rounded-2xl shadow-xl py-2 z-50 text-left">
                  <div className="px-4 py-2.5 border-b border-slate-100">
                    <p className="text-xs text-slate-400 font-medium">Signed in as</p>
                    <p className="text-sm font-bold text-slate-800 truncate">{user.name}</p>
                    <p className="text-xs text-slate-500 truncate">{user.email}</p>
                  </div>
                  
                  <div className="py-1">
                    {user.role === "admin" ? (
                      <Link
                        to="/admin-dashboard"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-amber-800 transition font-bold"
                      >
                        <LayoutDashboard size={16} className="text-amber-800" />
                        <span>Admin Panel</span>
                      </Link>
                    ) : (
                      <Link
                        to="/author-dashboard"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-amber-800 transition"
                      >
                        <LayoutDashboard size={16} className="text-slate-400" />
                        <span>Author Dashboard</span>
                      </Link>
                    )}
                    <Link
                      to="/dashboard/write"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-amber-800 transition"
                    >
                      <PenTool size={16} className="text-slate-400" />
                      <span>Write a Book</span>
                    </Link>
                    <Link
                      to="/dashboard/my-collection"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-amber-800 transition"
                    >
                      <BookOpen size={16} className="text-slate-400" />
                      <span>My Collection</span>
                    </Link>
                    <Link
                      to="/dashboard/author-profile"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-amber-800 transition"
                    >
                      <User size={16} className="text-slate-400" />
                      <span>Edit Profile</span>
                    </Link>

                    {/* Collapsible Purchase Requests for Authors */}
                    <div className="border-t border-slate-100/70 border-b border-slate-100/70 my-1 py-0.5">
                      <button
                        type="button"
                        onClick={() => {
                          setRequestsOpen(!requestsOpen);
                          if (!requestsOpen) {
                            loadPendingRequests();
                          }
                        }}
                        className="w-full flex items-center justify-between px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-amber-800 transition text-left cursor-pointer"
                      >
                        <div className="flex items-center gap-2.5">
                          <Bell size={16} className="text-slate-400" />
                          <span>Purchase Requests</span>
                        </div>
                        {requests.length > 0 && (
                          <span className="bg-rose-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                            {requests.length}
                          </span>
                        )}
                      </button>

                      {requestsOpen && (
                        <div className="px-4 py-2 bg-slate-50 border-t border-slate-100 max-h-48 overflow-y-auto">
                          {loadingRequests ? (
                            <p className="text-xs text-slate-400 text-center py-2">Loading requests...</p>
                          ) : requests.length === 0 ? (
                            <p className="text-xs text-slate-400 text-center py-2">No pending requests</p>
                          ) : (
                            <div className="space-y-3.5 py-1">
                              {requests.map((req) => (
                                <div key={req._id} className="text-xs border-b border-slate-200 pb-2 last:border-0 last:pb-0">
                                  <p className="font-bold text-slate-800 truncate">{req.book?.title}</p>
                                  <div className="flex items-center justify-between mt-1 text-[10px] text-slate-500">
                                    <span>From: {req.user?.name}</span>
                                    <span className="font-semibold text-slate-700">₹{req.book?.price}</span>
                                  </div>
                                  
                                  {/* Buyer Contact details */}
                                  <div className="mt-1.5 p-1.5 bg-slate-100 rounded-md text-[10px] text-slate-600 space-y-0.5">
                                    <p><strong>WA:</strong> <a href={`https://wa.me/${req.whatsapp?.replace(/[^0-9]/g, "")}`} target="_blank" rel="noreferrer" className="text-amber-800 hover:underline font-semibold">{req.whatsapp}</a></p>
                                    <p className="line-clamp-2"><strong>Addr:</strong> {req.address}</p>
                                    {req.note && <p className="italic line-clamp-1"><strong>Note:</strong> "{req.note}"</p>}
                                  </div>

                                  <div className="flex gap-1.5 mt-2 justify-end">
                                    <button
                                      type="button"
                                      onClick={() => handleDecline(req._id)}
                                      className="px-2 py-1 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-md font-bold transition flex items-center gap-0.5 text-[10px] cursor-pointer"
                                    >
                                      <X size={10} />
                                      Decline
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => handleApprove(req._id)}
                                      className="px-2 py-1 bg-amber-700 hover:bg-amber-800 text-white rounded-md font-bold transition flex items-center gap-0.5 text-[10px] cursor-pointer"
                                    >
                                      <Check size={10} />
                                      Approve
                                    </button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={toggleTheme}
                      className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-amber-800 transition cursor-pointer text-left font-normal"
                    >
                      {theme === "dark" || (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches) ? (
                        <>
                          <Sun size={16} className="text-amber-500" />
                          <span>Light Mode</span>
                        </>
                      ) : (
                        <>
                          <Moon size={16} className="text-slate-400" />
                          <span>Dark Mode</span>
                        </>
                      )}
                    </button>
                  </div>

                  <div className="border-t border-slate-100 pt-1 mt-1">
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                    >
                      <LogOut size={16} />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Mobile Menu Toggle Button */}
        <button
          type="button"
          aria-label="Open menu"
          onClick={() => setMenuOpen((prev) => !prev)}
          className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:bg-slate-50 lg:hidden cursor-pointer"
        >
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {menuOpen && (
        <>
          {/* Mobile Drawer Overlay Backdrop */}
          <div 
            className="lg:hidden fixed inset-0 top-[60px] bg-slate-900/20 backdrop-blur-sm z-30 transition-opacity" 
            onClick={() => setMenuOpen(false)}
          />
          {/* Mobile Drawer Content */}
          <div 
            className="lg:hidden fixed right-0 top-[60px] bottom-0 w-72 bg-white border-l border-slate-200/50 p-6 flex flex-col justify-between shadow-2xl z-40 transition-transform"
          >
            <div className="space-y-6">
              {/* User Profile Card (Mobile) */}
              {user && (
                <div className="flex items-center gap-3 bg-slate-50 p-4 rounded-2xl shadow-sm border border-slate-200/40">
                  <img
                    src={userAvatar}
                    alt={user.name}
                    onError={(e) => {
                      e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || "User")}&background=8C4E35&color=FAF6F0&bold=true&size=128`;
                      e.currentTarget.onerror = null;
                    }}
                    className="w-10 h-10 rounded-full object-cover border border-slate-200 shrink-0"
                  />
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-slate-800 truncate">{user.name}</p>
                    <p className="text-xs text-slate-500 truncate">{user.email}</p>
                  </div>
                </div>
              )}

              {/* Menu Links */}
              <div className="space-y-1.5">
                {NAV_ITEMS.map((item) => (
                  <NavLink
                    key={item.label}
                    to={item.to}
                    onClick={() => setMenuOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition ${
                        isActive 
                          ? "bg-amber-800 text-white shadow-sm" 
                          : "text-slate-700 hover:bg-slate-100"
                      }`
                    }
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </NavLink>
                ))}

                {user && (
                  <>
                    <div className="h-px bg-slate-200/50 my-2" />
                    <NavLink
                      to={user.role === "admin" ? "/admin-dashboard" : "/author-dashboard"}
                      onClick={() => setMenuOpen(false)}
                      className={({ isActive }) =>
                        `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition ${
                          isActive 
                            ? "bg-amber-800 text-white shadow-sm" 
                            : "text-slate-700 hover:bg-slate-100"
                        }`
                      }
                    >
                      <LayoutDashboard size={18} />
                      <span>{user.role === "admin" ? "Admin Panel" : "Author Dashboard"}</span>
                    </NavLink>
                    <NavLink
                      to="/dashboard/write"
                      onClick={() => setMenuOpen(false)}
                      className={({ isActive }) =>
                        `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition ${
                          isActive 
                            ? "bg-amber-800 text-white shadow-sm" 
                            : "text-slate-700 hover:bg-slate-100"
                        }`
                      }
                    >
                      <PenTool size={18} />
                      <span>Write a Book</span>
                    </NavLink>
                    <NavLink
                      to="/dashboard/my-collection"
                      onClick={() => setMenuOpen(false)}
                      className={({ isActive }) =>
                        `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition ${
                          isActive 
                            ? "bg-amber-800 text-white shadow-sm" 
                            : "text-slate-700 hover:bg-slate-100"
                        }`
                      }
                    >
                      <BookOpen size={18} />
                      <span>My Collection</span>
                    </NavLink>
                    <NavLink
                      to="/dashboard/author-profile"
                      onClick={() => setMenuOpen(false)}
                      className={({ isActive }) =>
                        `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition ${
                          isActive 
                            ? "bg-amber-800 text-white shadow-sm" 
                            : "text-slate-700 hover:bg-slate-100"
                        }`
                      }
                    >
                      <Settings size={18} />
                      <span>Profile Settings</span>
                    </NavLink>

                    {/* Collapsible Purchase Requests (Mobile) */}
                    <div className="border-t border-slate-200/50 mt-2 pt-2">
                      <button
                        type="button"
                        onClick={() => {
                          setMobileRequestsOpen(!mobileRequestsOpen);
                          if (!mobileRequestsOpen) {
                            loadPendingRequests();
                          }
                        }}
                        className="w-full flex items-center justify-between rounded-xl px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-100 transition text-left cursor-pointer"
                      >
                        <div className="flex items-center gap-3">
                          <Bell size={18} className="text-slate-505" />
                          <span>Purchase Requests</span>
                        </div>
                        {requests.length > 0 && (
                          <span className="bg-rose-500 text-white text-xs font-bold px-2 py-0.5 rounded-full shrink-0">
                            {requests.length}
                          </span>
                        )}
                      </button>

                      {mobileRequestsOpen && (
                        <div className="mt-2 ml-4 pl-3 border-l-2 border-amber-800/20 space-y-3.5 max-h-48 overflow-y-auto pr-1">
                          {loadingRequests ? (
                            <p className="text-xs text-slate-400 py-1">Loading requests...</p>
                          ) : requests.length === 0 ? (
                            <p className="text-xs text-slate-400 py-1 font-medium">No pending requests</p>
                          ) : (
                            requests.map((req) => (
                              <div key={req._id} className="text-xs border-b border-slate-100 pb-2 last:border-0 last:pb-0 space-y-1">
                                <p className="font-bold text-slate-800 truncate">{req.book?.title}</p>
                                <div className="flex items-center justify-between text-[10px] text-slate-505">
                                  <span>From: {req.user?.name}</span>
                                  <span className="font-semibold text-slate-705">₹{req.book?.price}</span>
                                </div>
                                <div className="p-1.5 bg-slate-50 border border-slate-200/60 rounded-md text-[10px] text-slate-600 space-y-0.5">
                                  <p><strong>WA:</strong> <a href={`https://wa.me/${req.whatsapp?.replace(/[^0-9]/g, "")}`} target="_blank" rel="noreferrer" className="text-amber-800 hover:underline font-semibold">{req.whatsapp}</a></p>
                                  <p className="line-clamp-2"><strong>Addr:</strong> {req.address}</p>
                                  {req.note && <p className="italic line-clamp-1"><strong>Note:</strong> "{req.note}"</p>}
                                </div>
                                <div className="flex gap-1.5 mt-2 justify-end">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      handleDecline(req._id);
                                    }}
                                    className="px-2.5 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-md font-bold transition flex items-center gap-0.5 text-[10px] cursor-pointer"
                                  >
                                    <X size={10} />
                                    Decline
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      handleApprove(req._id);
                                    }}
                                    className="px-2.5 py-1.5 bg-amber-700 hover:bg-amber-800 text-white rounded-md font-bold transition flex items-center gap-0.5 text-[10px] cursor-pointer"
                                  >
                                    <Check size={10} />
                                    Approve
                                  </button>
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Auth Actions (Mobile Footer) */}
            <div className="space-y-3 pt-6 border-t border-slate-200">
              {!user ? (
                <>
                  <Link
                    to="/login"
                    onClick={() => setMenuOpen(false)}
                    className="flex justify-center items-center w-full rounded-full border border-slate-300 py-3 text-sm font-semibold text-slate-700 bg-white hover:bg-slate-50 transition"
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    onClick={() => setMenuOpen(false)}
                    className="flex justify-center items-center w-full rounded-full bg-amber-800 py-3 text-sm font-semibold text-white hover:bg-amber-900 transition"
                  >
                    Sign Up
                  </Link>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() => {
                      toggleTheme();
                      setMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold text-slate-700 rounded-xl hover:bg-slate-100 transition cursor-pointer text-left"
                  >
                    {theme === "dark" || (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches) ? (
                      <>
                        <Sun size={18} className="text-amber-500" />
                        <span>Light Mode</span>
                      </>
                    ) : (
                      <>
                        <Moon size={18} className="text-slate-600" />
                        <span>Dark Mode</span>
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold text-rose-600 rounded-xl hover:bg-rose-50 transition mt-2 cursor-pointer"
                  >
                    <LogOut size={18} />
                    <span>Sign Out</span>
                  </button>
                </>
              )}
            </div>
          </div>
        </>
      )}
      </header>
    </div>
  );
};

export default Navbar;