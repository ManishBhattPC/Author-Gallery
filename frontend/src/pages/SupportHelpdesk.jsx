import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../AuthContext.jsx";
import { submitReport } from "../services/reportService.js";
import { HelpCircle, Send, ShieldAlert, LogIn, UserPlus, CheckCircle2 } from "lucide-react";

const SupportHelpdesk = () => {
  const { user } = useAuth();
  const [form, setForm] = useState({ reason: "Account Issue", description: "" });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);

  const reasons = [
    "Account Issue",
    "Writing Notepad Bug",
    "eBook Upload Issue",
    "Review / Rating Dispute",
    "Copyright Infringement",
    "Feature Request",
    "Other Technical Issue",
  ];

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    setError(null);

    try {
      await submitReport({
        reason: form.reason,
        description: form.description,
      });
      setSubmitted(true);
      setForm({ reason: "Account Issue", description: "" });
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // If user is not logged in, show authentication prompt card
  if (!user) {
    return (
      <div className="min-h-screen bg-[#FAF6F0] px-4 py-16 sm:px-6 lg:px-8 flex items-center justify-center">
        <div className="mx-auto max-w-md w-full rounded-3xl bg-white border border-slate-200/60 p-8 shadow-xl text-center space-y-6">
          <div className="flex justify-center">
            <div className="p-4 bg-amber-50 rounded-3xl text-amber-800">
              <ShieldAlert className="w-12 h-12" />
            </div>
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-slate-800">Sign Up Required</h1>
            <p className="text-sm text-slate-500 leading-relaxed">
              To submit a support ticket at our Helpdesk, you must have an account. This helps us track your issue and respond to you directly.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Link
              to="/login"
              className="flex-1 flex items-center justify-center gap-2 rounded-full border border-slate-350 bg-white py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition"
            >
              <LogIn className="w-4.5 h-4.5 text-slate-500" />
              Log In
            </Link>
            <Link
              to="/signup"
              className="flex-1 flex items-center justify-center gap-2 rounded-full bg-amber-800 py-3 text-sm font-semibold text-white hover:bg-amber-900 transition shadow-sm"
            >
              <UserPlus className="w-4.5 h-4.5" />
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF6F0] px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl rounded-3xl bg-white border border-slate-200/60 p-6 sm:p-10 shadow-xl text-left">
        
        {/* Header */}
        <div className="border-b border-slate-100 pb-6 mb-8 flex items-start gap-4">
          <div className="p-3.5 bg-amber-50 rounded-2xl text-amber-800 shadow-inner shrink-0">
            <HelpCircle className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900">Support Helpdesk</h1>
            <p className="mt-1.5 text-xs sm:text-sm text-slate-500 leading-relaxed">
              Facing an issue? Submit a help ticket here, and our administration team will review and resolve it.
            </p>
          </div>
        </div>

        {submitted ? (
          <div className="py-10 text-center space-y-4">
            <div className="flex justify-center">
              <div className="p-3 bg-emerald-50 rounded-full text-emerald-600">
                <CheckCircle2 className="w-12 h-12" />
              </div>
            </div>
            <h2 className="text-xl font-bold text-slate-800">Ticket Submitted Successfully!</h2>
            <p className="text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
              Thank you for contacting us. Your ticket has been logged and sent to the administrator. We will review your case shortly.
            </p>
            <button
              type="button"
              onClick={() => setSubmitted(false)}
              className="mt-6 px-5 py-2.5 rounded-full border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700 transition"
            >
              Submit Another Ticket
            </button>
          </div>
        ) : (
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Your Name</label>
                <input
                  type="text"
                  value={user.name}
                  disabled
                  className="w-full px-4 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-slate-500 outline-none cursor-not-allowed text-xs font-medium"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Your Email</label>
                <input
                  type="email"
                  value={user.email}
                  disabled
                  className="w-full px-4 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-slate-500 outline-none cursor-not-allowed text-xs font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Reason / Category *</label>
              <select
                name="reason"
                value={form.reason}
                onChange={handleChange}
                required
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 focus:bg-white focus:ring-4 focus:ring-amber-50/50 focus:border-amber-600 rounded-xl text-slate-800 outline-none text-xs font-medium transition-all"
              >
                {reasons.map((reason) => (
                  <option key={reason} value={reason}>
                    {reason}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Describe Your Problem *</label>
              <textarea
                name="description"
                rows="6"
                value={form.description}
                onChange={handleChange}
                required
                placeholder="Please describe what is happening in detail, including steps to reproduce if it's a bug."
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 focus:bg-white focus:ring-4 focus:ring-amber-50/50 focus:border-amber-600 rounded-xl text-slate-800 outline-none text-xs transition-all leading-relaxed"
              />
            </div>

            {error && (
              <div className="p-4 rounded-xl text-xs font-semibold bg-red-50 text-red-800 border border-red-100">
                {error}
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center sm:justify-between border-t border-slate-100 pt-6">
              <p className="text-[11px] text-slate-400 font-medium">
                Submitting creates a ticket directly visible to the portal moderators.
              </p>
              <button
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto px-6 py-2.5 bg-amber-700 hover:bg-amber-800 text-white rounded-xl font-bold text-xs transition-all focus:ring-4 focus:ring-amber-100 disabled:opacity-50 flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
              >
                <Send className="w-4 h-4" />
                {loading ? "Submitting Ticket…" : "Submit Support Ticket"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default SupportHelpdesk;
