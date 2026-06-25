import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../AuthContext.jsx";
import { Users, BookOpen, Star, User } from "lucide-react";

const DashboardHeader = ({ stats, loading = false }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [imgFailed, setImgFailed] = useState(false);
  
  const statValue = (value) => (loading ? "..." : value ?? 0);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    if (hour < 22) return "Good evening";
    return "Good night";
  };

  return (
    <div className="bg-slate-50 border border-slate-300 p-6 sm:p-8 rounded-2xl shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={() => navigate("/dashboard/author-profile")}
          aria-label="Open author profile details"
          className="relative inline-flex h-16 w-16 items-center justify-center overflow-hidden rounded-full bg-slate-100 ring-4 ring-amber-100/60 hover:ring-amber-200 transition-all duration-300 shadow-sm"
        >
          {user?.profileImage && !imgFailed ? (
            <img
              src={user.profileImage}
              alt={user?.name || "Author"}
              className="h-full w-full object-cover"
              onError={(e) => {
                setImgFailed(true);
                e.currentTarget.onerror = null;
              }}
            />
          ) : (
            <User className="h-8 w-8 text-amber-700/60" />
          )}
        </button>
        <div className="text-left">
          <span className="text-[10px] font-bold text-amber-850 uppercase tracking-widest flex items-center gap-1 select-none">
            {getGreeting()} <span className="animate-bounce inline-block">✨</span>
          </span>
          <h2 className="text-2xl font-bold font-serif text-slate-900">
            {user?.name || "Author"}
          </h2>
          <p className="text-xs font-semibold text-slate-700">{user?.email}</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 w-full sm:flex sm:items-center sm:gap-8 sm:w-auto border-t sm:border-t-0 pt-4 sm:pt-0 border-slate-300/65">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="p-2 sm:p-3 bg-[#FAF1E6] rounded-xl text-amber-850 shrink-0">
            <Users className="w-4.5 h-4.5 sm:w-5 sm:h-5" />
          </div>
          <div className="text-left min-w-0">
            <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-none">{statValue(stats?.followers)}</h3>
            <p className="text-[10px] sm:text-xs text-slate-700 mt-1 font-semibold truncate">Followers</p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <div className="p-2 sm:p-3 bg-[#F9ECEB] rounded-xl text-rose-800 shrink-0">
            <Star className="w-4.5 h-4.5 sm:w-5 sm:h-5" />
          </div>
          <div className="text-left min-w-0">
            <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-none">{statValue(stats?.following)}</h3>
            <p className="text-[10px] sm:text-xs text-slate-700 mt-1 font-semibold truncate">Following</p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <div className="p-2 sm:p-3 bg-[#E8F3EE] rounded-xl text-emerald-850 shrink-0">
            <BookOpen className="w-4.5 h-4.5 sm:w-5 sm:h-5" />
          </div>
          <div className="text-left min-w-0">
            <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-none">{statValue(stats?.published)}</h3>
            <p className="text-[10px] sm:text-xs text-slate-700 mt-1 font-semibold truncate">Published</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;
