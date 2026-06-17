import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../services/authService.js";

const Signup = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true)
    setError(null)

    try {
      await registerUser({ ...form, role: "author" })
      navigate("/login")
    } catch (err) {
      setError(err.message || "Unable to register. Please try again.")
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-lg">
        <h2 className="text-3xl font-semibold text-slate-900">Create your author account</h2>
        <p className="mt-2 text-sm text-slate-600">Register once and manage your books, profile, and audience.</p>

        <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-slate-700">Full name</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              className="mt-2 w-full rounded-3xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-100"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              className="mt-2 w-full rounded-3xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-100"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700">Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
              className="mt-2 w-full rounded-3xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-100"
            />
          </div>

          {error && <p className="text-sm text-rose-600">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-amber-700 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-amber-800 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? "Creating account..." : "Sign Up"}
          </button>
        </form>
      </div>
    </div>
  )
}

export default Signup