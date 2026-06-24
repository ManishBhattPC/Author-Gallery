import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../AuthContext.jsx";

const NAV_ITEMS = [
  { label: "Home", to: "/" },
  { label: "Explore", to: "/explore" },
  { label: "Authors", to: "/authors" },
  { label: "Books", to: "/books" },
  { label: "About", to: "/about" },
];

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-40 bg-slate-50/95 border-b border-slate-200/60 backdrop-blur-md shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3.5 sm:px-6">
        <Link to="/" className="flex items-center gap-2.5 text-xl font-serif font-bold text-amber-950">
          <span className="flex items-center justify-center bg-amber-800 text-[#FAF6F0] w-8 h-8 rounded-lg font-serif font-semibold text-sm shadow-sm select-none">
            AG
          </span>
          <span className="tracking-tight hover:text-amber-700 transition">Author Gallery</span>
        </Link>

        <nav className="hidden items-center gap-6 lg:flex">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.label}
              to={item.to}
              className={({ isActive }) =>
                `text-sm font-semibold transition ${
                  isActive ? "text-amber-700 underline underline-offset-4 decoration-2" : "text-slate-600 hover:text-amber-700"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          {!user ? (
            <>
              <Link
                to="/login"
                className="rounded-full border border-amber-800/20 px-5 py-2 text-sm font-semibold text-amber-900 transition hover:border-amber-600 hover:text-amber-700"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="rounded-full bg-amber-700 px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-amber-800"
              >
                Sign Up
              </Link>
            </>
          ) : (
            <div className="flex flex-wrap gap-2 items-center">
              {/* {user.role === "author" && ()} this will be use when we use admin  */}
                <Link
                  to="/author-dashboard"
                  className="rounded-full border border-amber-800/20 px-5 py-2 text-sm font-semibold text-amber-900 transition hover:border-amber-600 hover:text-amber-700"
                >
                  Dashboard
                </Link>
              
              <button
                type="button"
                onClick={logout}
                className="rounded-full bg-rose-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-rose-700"
              >
                Logout
              </button>
            </div>
          )}
        </div>

        <button
          type="button"
          aria-label="Open menu"
          onClick={() => setMenuOpen((prev) => !prev)}
          className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:bg-slate-50 lg:hidden"
        >
          <span className="text-lg">☰</span>
        </button>
      </div>

      {menuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 py-4">
          <div className="space-y-3">
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.label}
                to={item.to}
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) =>
                  `block rounded-2xl px-4 py-3 text-sm font-medium transition ${
                    isActive ? "bg-slate-100 text-amber-700" : "text-slate-700 hover:bg-slate-50"
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </div>

          <div className="mt-4 space-y-3 border-t border-slate-200 pt-4">
            {!user ? (
              <>
                <Link
                  to="/login"
                  onClick={() => setMenuOpen(false)}
                  className="block rounded-2xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  onClick={() => setMenuOpen(false)}
                  className="block rounded-2xl bg-amber-700 px-4 py-3 text-sm font-medium text-white hover:bg-amber-800"
                >
                  Sign Up
                </Link>
              </>
            ) : (
              <>
                {/* {user.role === "author" && ()} this will used when we create role */}
                  <Link
                    to="/author-dashboard"
                    onClick={() => setMenuOpen(false)}
                    className="block rounded-2xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50"
                  >
                    Dashboard
                  </Link>
                
                <button
                  type="button"
                  onClick={() => {
                    logout();
                    setMenuOpen(false);
                  }}
                  className="w-full rounded-2xl bg-rose-600 px-4 py-3 text-sm font-medium text-white hover:bg-rose-700"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;