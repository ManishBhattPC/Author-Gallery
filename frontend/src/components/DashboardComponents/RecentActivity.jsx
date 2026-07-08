import React from "react";
import { Clock, PlusCircle } from "lucide-react";

const RecentActivity = ({ books = [], loading = false }) => {
  const formatDate = (dateStr) => {
    if (!dateStr) return "Just now";
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return "Just now";
      
      const today = new Date();
      if (d.toDateString() === today.toDateString()) {
        return "Today";
      }
      
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      if (d.toDateString() === yesterday.toDateString()) {
        return "Yesterday";
      }
      
      return d.toLocaleDateString(undefined, { 
        month: "short", 
        day: "numeric", 
        year: "numeric" 
      });
    } catch (e) {
      return "Just now";
    }
  };

  return (
    <div className="bg-slate-50 border border-slate-300 p-6 rounded-2xl shadow-sm text-left">
      <h2 className="text-lg font-bold font-serif text-slate-900 mb-4 flex items-center gap-2">
        <Clock className="w-5 h-5 text-amber-800" />
        Recent Activity
      </h2>

      {loading ? (
        <div className="space-y-3">
          <div className="h-10 bg-slate-200 animate-pulse rounded-lg"></div>
          <div className="h-10 bg-slate-200 animate-pulse rounded-lg"></div>
        </div>
      ) : books.length > 0 ? (
        <div className="relative border-l border-slate-300 pl-4 ml-2 space-y-6">
          {books.map((book) => {
            const displayGenres = Array.isArray(book.genres) 
              ? book.genres.join(", ") 
              : book.genres;
            return (
              <div key={book._id} className="relative text-left">
                <div 
                  className="absolute -left-6 top-1.5 bg-[#FAF1E6] rounded-full p-1 ring-4 ring-slate-50"
                  style={{ color: "#8C4E35" }}
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-700">
                    {formatDate(book.publishDate || book.createdAt)}
                  </span>
                  <p className="text-sm font-bold text-slate-800 mt-0.5">
                    Published <span className="font-bold text-amber-900 font-serif">{book.title}</span>
                  </p>
                  {displayGenres && (
                    <span className="inline-block text-[9px] font-bold uppercase tracking-wider bg-slate-100 text-slate-800 border border-slate-350 px-2 py-0.5 rounded-full mt-1.5">
                      {displayGenres}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-6">
          <p className="text-sm text-slate-700 font-semibold">No recent activity</p>
          <p className="text-xs text-slate-700/75 mt-1">Published books will appear here.</p>
        </div>
      )}
    </div>
  );
};

export default RecentActivity;
