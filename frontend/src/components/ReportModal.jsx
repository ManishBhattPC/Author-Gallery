import React, { useState } from "react";
import { X, AlertTriangle } from "lucide-react";
import { submitReport } from "../services/reportService.js";

const REPORT_REASONS = [
  "Inappropriate Content",
  "Copyright Violation",
  "Spam / Advertising",
  "Harassment or Abuse",
  "Misleading Info",
  "Other"
];

const ReportModal = ({ isOpen, onClose, bookId, authorId }) => {
  const [reason, setReason] = useState(REPORT_REASONS[0]);
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    setLoading(true);
    try {
      const reportData = {
        reason,
        description: description.trim(),
      };
      if (bookId) reportData.book = bookId;
      if (authorId) reportData.author = authorId;

      await submitReport(reportData);
      setSuccess("Content successfully flagged. Thank you for making the community safe!");
      setDescription("");
      setTimeout(() => {
        setSuccess("");
        onClose();
      }, 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to submit report. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-white w-full max-w-md rounded-3xl p-6 sm:p-8 shadow-2xl relative border border-slate-200/50 text-left">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-650 p-1.5 rounded-full hover:bg-slate-100 transition duration-150 cursor-pointer"
        >
          <X size={18} />
        </button>

        <div className="flex items-center gap-2 text-rose-700 border-b border-slate-100 pb-4 mb-6">
          <AlertTriangle size={22} className="shrink-0" />
          <h3 className="text-lg font-bold">Report Content</h3>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-sm">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Reason for Report *</label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 focus:bg-white focus:ring-4 focus:ring-amber-50/50 focus:border-amber-600 rounded-xl text-slate-800 outline-none transition-all"
            >
              {REPORT_REASONS.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Description / Details (optional)</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide more context or links to help us evaluate the content..."
              rows={4}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 focus:bg-white focus:ring-4 focus:ring-amber-50/50 focus:border-amber-600 rounded-xl text-slate-800 outline-none transition-all placeholder-slate-400 text-xs"
            />
          </div>

          {error && <p className="text-xs text-rose-600 font-semibold">{error}</p>}
          {success && <p className="text-xs text-emerald-700 font-semibold bg-emerald-50 border border-emerald-100 p-3 rounded-xl">{success}</p>}

          <div className="flex gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-full font-semibold text-xs transition duration-150 cursor-pointer text-center"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || success}
              className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-full font-semibold text-xs transition duration-150 disabled:opacity-50 cursor-pointer text-center"
            >
              {loading ? "Submitting..." : "Submit Report"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReportModal;
