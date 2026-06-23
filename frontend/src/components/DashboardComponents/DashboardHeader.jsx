import React, { useState } from "react";
import { useAuth } from "../../AuthContext.jsx";
import { useNavigate } from "react-router-dom";

const DashboardHeader = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [imgFailed, setImgFailed] = useState(false);

  return (
    <div className="bg-white p-4 rounded-lg shadow flex justify-between items-center">
      <div>
        <h2 className="text-2xl font-bold flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate("/dashboard/author-profile")}
            aria-label="Open author profile details"
            className="inline-flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-slate-100 hover:bg-slate-200"
          >
            {user?.profileImage && !imgFailed ? (
              <img
                src={user.profileImage}
                alt={user?.name || "Author"}
                className="h-full w-full object-cover"
                onError={(e) => {
                  // mark failed so we fall back to inline SVG without toggling src
                  setImgFailed(true);
                  e.currentTarget.onerror = null;
                }}
              />
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                className="h-6 w-6 text-slate-600"
              >
                <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.5" />
                <path d="M4 20c1.333-3.333 4-5 8-5s6.667 1.667 8 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </button>
          {user?.name || "Author"}!
        </h2>

        <p className="text-gray-500">
          {user?.email}
        </p>
      </div>

      <div className="flex gap-8">
        <div>
          <h3 className="font-bold">—</h3>
          <p>Followers</p>
        </div>

        <div>
          <h3 className="font-bold">—</h3>
          <p>Following</p>
        </div>

        <div>
          <h3 className="font-bold">—</h3>
          <p>Published</p>
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;