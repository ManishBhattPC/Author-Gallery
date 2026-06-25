import React from "react";
import { Clock, PlusCircle } from "lucide-react";

const RecentActivity = ({ books = [], loading = false }) => {
  return (
    <div className="bg-[#FDFCF7] border border-[#EADCC9] p-6 rounded-2xl shadow-sm text-left">
      <h2 className="text-lg font-bold font-serif text-[#2C1E11] mb-4 flex items-center gap-2">
        <Clock className="w-5 h-5 text-amber-800" />
        Recent Activity
      </h2>

      {loading ? (
        <div className="space-y-3">
          <div className="h-10 bg-[#FAF6F0] animate-pulse rounded-lg"></div>
          <div className="h-10 bg-[#FAF6F0] animate-pulse rounded-lg"></div>
        </div>
      ) : books.length > 0 ? (
        <div className="relative border-l border-[#EADCC9]/60 pl-4 ml-2 space-y-6">
          {books.map((book) => (
            <div key={book._id} className="relative text-left">
              <div className="absolute -left-6 top-1.5 bg-[#FAF1E6] text-amber-850 rounded-full p-1 ring-4 ring-[#FDFCF7]">
                <PlusCircle className="w-3.5 h-3.5" />
              </div>
              <div>
                <span className="text-xs font-bold text-[#8C7B6C]">
                  {book.publishDate ? new Date(book.publishDate).toLocaleDateString() : "Just now"}
                </span>
                <p className="text-sm font-bold text-[#5C4E40] mt-0.5">
                  Published <span className="font-bold text-amber-900 font-serif">{book.title}</span>
                </p>
                {book.genres && (
                  <span className="inline-block text-[9px] font-bold uppercase tracking-wider bg-[#FAF6F0] text-[#5C4E40] border border-[#EADCC9]/50 px-2 py-0.5 rounded-full mt-1.5">
                    {book.genres}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-6">
          <p className="text-sm text-[#8C7B6C] font-semibold">No recent activity</p>
          <p className="text-xs text-[#8C7B6C]/75 mt-1">Published books will appear here.</p>
        </div>
      )}
    </div>
  );
};

export default RecentActivity;
