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
    <div className="bg-white/80 backdrop-blur-md border border-slate-200/60 p-6 sm:p-8 rounded-2xl shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={() => navigate("/dashboard/author-profile")}
          aria-label="Open author profile details"
          className="relative inline-flex h-16 w-16 items-center justify-center overflow-hidden rounded-full bg-slate-100 ring-4 ring-amber-100 hover:ring-amber-200 transition-all duration-300"
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
            <User className="h-8 w-8 text-slate-400" />
          )}
        </button>
        <div>
          <span className="text-xs font-semibold text-amber-700 uppercase tracking-wider">Welcome Back</span>
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            {user?.name || "Author"}
          </h2>
          <p className="text-sm text-slate-500">{user?.email}</p>
        </div>
      </div>

      <div className="flex items-center gap-6 sm:gap-8 w-full sm:w-auto border-t sm:border-t-0 pt-4 sm:pt-0 border-slate-100">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-amber-50 rounded-xl text-amber-600">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-800 leading-none">{statValue(stats?.followers)}</h3>
            <p className="text-xs text-slate-500 mt-1">Followers</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-3 bg-blue-50 rounded-xl text-blue-600">
            <Star className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-800 leading-none">{statValue(stats?.following)}</h3>
            <p className="text-xs text-slate-500 mt-1">Following</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-3 bg-emerald-50 rounded-xl text-emerald-600">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-800 leading-none">{statValue(stats?.published)}</h3>
            <p className="text-xs text-slate-500 mt-1">Published</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;
