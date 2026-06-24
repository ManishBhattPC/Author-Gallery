import React, { useState, useEffect, useRef } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext.jsx";
import { getMyAuthorProfile } from "../services/authorProfileService.js";
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
  Settings
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

  return (
    <header className="sticky top-0 z-40 bg-[#FAF6F0]/90 border-b border-slate-200/50 backdrop-blur-md shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        
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
                    <Link
                      to="/author-dashboard"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-amber-800 transition"
                    >
                      <LayoutDashboard size={16} className="text-slate-400" />
                      <span>Author Dashboard</span>
                    </Link>
                    <Link
                      to="/dashboard/author-profile"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-amber-800 transition"
                    >
                      <User size={16} className="text-slate-400" />
                      <span>Edit Profile</span>
                    </Link>
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

      {/* Mobile Drawer Overlay */}
      {menuOpen && (
        <div className="lg:hidden fixed inset-0 top-[60px] bg-slate-900/20 backdrop-blur-sm z-30 transition-opacity" onClick={() => setMenuOpen(false)}>
          <div 
            className="absolute right-0 top-0 bottom-0 w-72 bg-[#FAF6F0] border-l border-slate-200/50 p-6 flex flex-col justify-between shadow-2xl transition-transform"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="space-y-6">
              {/* User Profile Card (Mobile) */}
              {user && (
                <div className="flex items-center gap-3 bg-white p-4 rounded-2xl shadow-sm border border-slate-200/40">
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
                  <Link
                    to="/author-dashboard"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-3 text-sm font-semibold text-slate-700 rounded-xl hover:bg-slate-100 transition"
                  >
                    <LayoutDashboard size={18} className="text-slate-400" />
                    <span>Author Dashboard</span>
                  </Link>
                  <Link
                    to="/dashboard/author-profile"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-3 text-sm font-semibold text-slate-700 rounded-xl hover:bg-slate-100 transition"
                  >
                    <Settings size={18} className="text-slate-400" />
                    <span>Profile Settings</span>
                  </Link>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2.5 px-4 py-3 text-sm font-semibold text-rose-600 rounded-xl hover:bg-rose-50 transition mt-2 cursor-pointer"
                  >
                    <LogOut size={18} />
                    <span>Sign Out</span>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;