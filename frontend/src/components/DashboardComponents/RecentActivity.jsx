import React from "react";
import { Clock, PlusCircle } from "lucide-react";

const RecentActivity = ({ books = [], loading = false }) => {
  return (
    <div className="bg-white border border-slate-200/60 p-6 rounded-2xl shadow-sm">
      <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
        <Clock className="w-5 h-5 text-slate-500" />
        Recent Activity
      </h2>

      {loading ? (
        <div className="space-y-3">
          <div className="h-10 bg-slate-100 animate-pulse rounded-lg"></div>
          <div className="h-10 bg-slate-100 animate-pulse rounded-lg"></div>
        </div>
      ) : books.length > 0 ? (
        <div className="relative border-l border-slate-100 pl-4 ml-2 space-y-6">
          {books.map((book) => (
            <div key={book._id} className="relative">
              <div className="absolute -left-6 top-1.5 bg-amber-100 text-amber-700 rounded-full p-1 ring-4 ring-white">
                <PlusCircle className="w-3.5 h-3.5" />
              </div>
              <div>
                <span className="text-xs font-semibold text-slate-400">
                  {book.publishDate ? new Date(book.publishDate).toLocaleDateString() : "Just now"}
                </span>
                <p className="text-sm font-medium text-slate-800 mt-0.5">
                  Published <span className="font-semibold text-amber-900">{book.title}</span>
                </p>
                {book.genres && (
                  <span className="inline-block text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full mt-1">
                    {book.genres}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-6">
          <p className="text-sm text-slate-400 font-medium">No recent activity</p>
          <p className="text-xs text-slate-400 mt-1">Published books will appear here.</p>
        </div>
      )}
    </div>
  );
};

export default RecentActivity;
