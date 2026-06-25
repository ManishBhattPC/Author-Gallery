import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../AuthContext.jsx";
import { Users, BookOpen, Star, User } from "lucide-react";

const DashboardHeader = ({ stats, loading = false }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [imgFailed, setImgFailed] = useState(false);
  const statValue = (value) => (loading ? "..." : value ?? 0);

  return (
    <div className="bg-[#FDFCF7] border border-[#EADCC9] p-6 sm:p-8 rounded-2xl shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={() => navigate("/dashboard/author-profile")}
          aria-label="Open author profile details"
          className="relative inline-flex h-16 w-16 items-center justify-center overflow-hidden rounded-full bg-[#FAF6F0] ring-4 ring-amber-100/60 hover:ring-amber-200 transition-all duration-300 shadow-sm"
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
          <span className="text-[10px] font-bold text-amber-800 uppercase tracking-widest">Welcome Back</span>
          <h2 className="text-2xl font-bold font-serif text-[#2C1E11]">
            {user?.name || "Author"}
          </h2>
          <p className="text-xs font-semibold text-[#8C7B6C]">{user?.email}</p>
        </div>
      </div>

      <div className="flex items-center gap-6 sm:gap-8 w-full sm:w-auto border-t sm:border-t-0 pt-4 sm:pt-0 border-[#EADCC9]/50">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-[#FAF1E6] rounded-xl text-amber-850">
            <Users className="w-5 h-5" />
          </div>
          <div className="text-left">
            <h3 className="text-lg font-bold text-[#2C1E11] leading-none">{statValue(stats?.followers)}</h3>
            <p className="text-xs text-[#8C7B6C] mt-1 font-semibold">Followers</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-3 bg-[#F9ECEB] rounded-xl text-rose-800">
            <Star className="w-5 h-5" />
          </div>
          <div className="text-left">
            <h3 className="text-lg font-bold text-[#2C1E11] leading-none">{statValue(stats?.following)}</h3>
            <p className="text-xs text-[#8C7B6C] mt-1 font-semibold">Following</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-3 bg-[#E8F3EE] rounded-xl text-emerald-850">
            <BookOpen className="w-5 h-5" />
          </div>
          <div className="text-left">
            <h3 className="text-lg font-bold text-[#2C1E11] leading-none">{statValue(stats?.published)}</h3>
            <p className="text-xs text-[#8C7B6C] mt-1 font-semibold">Published</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;
