import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 py-12">
      <div className="max-w-2xl w-full bg-white border border-slate-200 rounded-3xl p-10 shadow-lg text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-amber-700">
          Page Not Found
        </p>
        <h1 className="mt-6 text-5xl font-bold text-slate-900">404</h1>
        <p className="mt-4 text-slate-600 leading-relaxed">
          Sorry, we couldn’t find the page you were looking for. It may have moved or never existed.
        </p>
        <Link
          to="/"
          className="inline-flex mt-8 items-center justify-center rounded-full bg-amber-700 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-amber-800 transition"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
