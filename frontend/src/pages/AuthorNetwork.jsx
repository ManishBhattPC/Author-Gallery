import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { fetchMyFollowers, fetchMyFollowing, followAuthor, unfollowAuthor } from "../services/authorService.js";
import { Search, UserMinus, UserPlus, Users, ArrowLeft, Star, Info } from "lucide-react";

const AuthorNetwork = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get("tab") === "following" ? "following" : "followers";

  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [actionLoadingId, setActionLoadingId] = useState(null);
  const [toast, setToast] = useState(null);

  // Pagination states
  const [followersPage, setFollowersPage] = useState(1);
  const [followersTotalPages, setFollowersTotalPages] = useState(1);
  const [followersTotal, setFollowersTotal] = useState(0);

  const [followingPage, setFollowingPage] = useState(1);
  const [followingTotalPages, setFollowingTotalPages] = useState(1);
  const [followingTotal, setFollowingTotal] = useState(0);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const loadTabInitial = async () => {
    try {
      setLoading(true);
      setError("");
      if (activeTab === "followers") {
        setFollowersPage(1);
        const data = await fetchMyFollowers({ page: 1, limit: 6 });
        setFollowers(data.followers || []);
        setFollowersTotalPages(data.totalPages || 1);
        setFollowersTotal(data.totalFollowers || 0);
      } else {
        setFollowingPage(1);
        const data = await fetchMyFollowing({ page: 1, limit: 6 });
        setFollowing(data.following || []);
        setFollowingTotalPages(data.totalPages || 1);
        setFollowingTotal(data.totalFollowing || 0);
      }
    } catch (err) {
      console.error("Error loading network tab:", err);
      setError(err.message || "Failed to load network lists.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTabInitial();
  }, [activeTab]);

  const loadMore = async () => {
    if (loadingMore) return;
    setLoadingMore(true);
    try {
      if (activeTab === "followers") {
        const nextPage = followersPage + 1;
        const data = await fetchMyFollowers({ page: nextPage, limit: 6 });
        setFollowers((prev) => [...prev, ...(data.followers || [])]);
        setFollowersPage(nextPage);
        setFollowersTotalPages(data.totalPages || 1);
      } else {
        const nextPage = followingPage + 1;
        const data = await fetchMyFollowing({ page: nextPage, limit: 6 });
        setFollowing((prev) => [...prev, ...(data.following || [])]);
        setFollowingPage(nextPage);
        setFollowingTotalPages(data.totalPages || 1);
      }
    } catch (err) {
      console.error("Error loading more tab data:", err);
    } finally {
      setLoadingMore(false);
    }
  };

  const handleFollowAction = async (targetUserId, currentlyFollowing) => {
    setActionLoadingId(targetUserId);
    try {
      if (currentlyFollowing) {
        // Unfollow action
        await unfollowAuthor(targetUserId);
        // Remove from following list
        setFollowing((prev) => prev.filter((user) => user._id !== targetUserId));
        setFollowingTotal((prev) => Math.max(0, prev - 1));
      } else {
        // Follow action
        await followAuthor(targetUserId);
        // Add to following list (find in followers list if they followed us)
        const newFollowingUser = followers.find((user) => user._id === targetUserId);
        if (newFollowingUser) {
          setFollowing((prev) => [...prev, newFollowingUser]);
          setFollowingTotal((prev) => prev + 1);
        } else {
          // Refresh
          loadTabInitial();
        }
      }
    } catch (err) {
      console.error("Error updating follow state:", err);
      showToast(err.message || "Action failed.", "error");
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleTabChange = (tab) => {
    setSearchParams({ tab });
    setSearchQuery("");
  };

  // Filter lists based on search query
  const filteredFollowers = followers.filter((u) =>
    (u.name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
    (u.email || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredFollowing = following.filter((u) =>
    (u.name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
    (u.email || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  const isUserFollowed = (userId) => {
    return following.some((u) => u._id === userId);
  };

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-4xl space-y-6">
        
        {/* Back navigation */}
        <div className="flex items-center gap-2">
          <Link
            to="/author-dashboard"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-800 hover:text-amber-900 transition-colors uppercase tracking-wider"
          >
            <ArrowLeft size={14} /> Back to Dashboard
          </Link>
        </div>

        {/* Header Title */}
        <div className="text-left space-y-1">
          <h1 className="text-3xl font-bold font-serif text-slate-900 flex items-center gap-2">
            <Users className="text-amber-800" size={28} /> Your Network
          </h1>
          <p className="text-xs font-medium text-slate-550">
            Build and manage your author connections, co-authors, and readers.
          </p>
        </div>

        {/* Tab switchers */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 gap-6">
          <button
            type="button"
            onClick={() => handleTabChange("followers")}
            className={`pb-3 text-sm font-bold tracking-wide transition-all border-b-2 cursor-pointer flex items-center gap-1.5 ${
              activeTab === "followers"
                ? "border-amber-800 text-amber-800 dark:border-amber-600 dark:text-amber-500"
                : "border-transparent text-slate-500 hover:text-slate-700"
            }`}
          >
            Followers <span className="px-2 py-0.5 text-[10px] bg-slate-200/60 dark:bg-slate-800 text-slate-700 dark:text-slate-355 rounded-full">{followersTotal}</span>
          </button>
          <button
            type="button"
            onClick={() => handleTabChange("following")}
            className={`pb-3 text-sm font-bold tracking-wide transition-all border-b-2 cursor-pointer flex items-center gap-1.5 ${
              activeTab === "following"
                ? "border-amber-800 text-amber-800 dark:border-amber-600 dark:text-amber-500"
                : "border-transparent text-slate-500 hover:text-slate-700"
            }`}
          >
            Following <span className="px-2 py-0.5 text-[10px] bg-slate-200/60 dark:bg-slate-800 text-slate-700 dark:text-slate-355 rounded-full">{followingTotal}</span>
          </button>
        </div>

        {/* Search bar */}
        <div className="relative">
          <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search size={16} />
          </span>
          <input
            type="text"
            placeholder={activeTab === "followers" ? "Search followers..." : "Search followed authors..."}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-650 transition-all dark:bg-slate-900 dark:border-slate-800"
          />
        </div>

        {/* Error State */}
        {error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* List Content */}
        {loading ? (
          <div className="rounded-3xl border border-slate-200 bg-white px-6 py-16 text-center text-slate-500 shadow-sm dark:bg-slate-900 dark:border-slate-800">
            Loading your network details...
          </div>
        ) : (
          <div className="space-y-4">
            {activeTab === "followers" && (
              filteredFollowers.length > 0 ? (
                <>
                  <div className="grid gap-4 sm:grid-cols-2">
                    {filteredFollowers.map((follower) => {
                      const followsBack = isUserFollowed(follower._id);
                      return (
                        <div
                          key={follower._id}
                          className="p-5 bg-white border border-slate-200 rounded-3xl flex items-center justify-between gap-4 shadow-sm hover:shadow-md transition-shadow dark:bg-slate-900 dark:border-slate-800"
                        >
                          <Link
                            to={`/authors/${follower._id}`}
                            className="flex items-center gap-3.5 min-w-0 hover:opacity-85 transition-opacity group"
                          >
                            <img
                              src={
                                follower.profileImage && follower.profileImage !== "/default-avatar.png"
                                  ? follower.profileImage
                                  : `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                      follower.name || "Author"
                                    )}&background=8C4E35&color=FAF6F0&bold=true&size=128`
                              }
                              alt={follower.name}
                              className="h-12 w-12 rounded-full object-cover ring-2 ring-slate-100 dark:ring-slate-800 group-hover:scale-105 transition-transform"
                            />
                            <div className="text-left min-w-0">
                              <h3 className="text-sm font-bold text-slate-900 group-hover:text-amber-800 transition-colors truncate">
                                {follower.name}
                              </h3>
                              <p className="text-xs text-slate-550 truncate">{follower.email}</p>
                              {follower.bio && (
                                <p className="text-[10px] text-slate-600 dark:text-slate-400 mt-1 line-clamp-1 italic">
                                  "{follower.bio}"
                                </p>
                              )}
                            </div>
                          </Link>

                          <button
                            type="button"
                            disabled={actionLoadingId === follower._id}
                            onClick={() => handleFollowAction(follower._id, followsBack)}
                            className={`px-3 py-1.5 rounded-xl font-bold text-xs shadow-sm transition-all cursor-pointer shrink-0 flex items-center gap-1 ${
                              followsBack
                                ? "bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 dark:text-slate-350 dark:border-slate-700"
                                : "bg-amber-800 hover:bg-amber-900 text-white dark:bg-amber-700 dark:hover:bg-amber-600"
                            }`}
                          >
                            {actionLoadingId === follower._id ? (
                              <span className="h-3 w-3 animate-spin rounded-full border-2 border-current border-t-transparent" />
                            ) : followsBack ? (
                              "Following"
                            ) : (
                              <>
                                <UserPlus size={11} /> Follow Back
                              </>
                            )}
                          </button>
                        </div>
                      );
                    })}
                  </div>

                  {/* Load More Button for Followers */}
                  {followers.length > 0 && followersPage < followersTotalPages && (
                    <div className="mt-8 flex justify-center py-4">
                      <button
                        type="button"
                        onClick={loadMore}
                        disabled={loadingMore}
                        className="px-6 py-2.5 rounded-full border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 text-sm font-semibold transition cursor-pointer disabled:opacity-50 flex items-center gap-2"
                      >
                        {loadingMore ? (
                          <>
                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-amber-600 border-t-transparent" />
                            <span>Loading more...</span>
                          </>
                        ) : (
                          <span>Load More Followers</span>
                        )}
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <div className="rounded-3xl border border-slate-200 bg-white px-6 py-20 text-center text-slate-500 shadow-sm dark:bg-slate-900 dark:border-slate-800">
                  <div className="mx-auto w-12 h-12 bg-amber-50 rounded-full flex items-center justify-center text-amber-700 mb-4 dark:bg-slate-800 dark:text-amber-550">
                    <Users size={20} />
                  </div>
                  <h3 className="text-base font-bold text-slate-900">No followers found</h3>
                  <p className="text-xs text-slate-550 mt-1 max-w-sm mx-auto">
                    {searchQuery ? "Try refining your search terms." : "Publish great stories and books online to attract loyal followers!"}
                  </p>
                </div>
              )
            )}

            {activeTab === "following" && (
              filteredFollowing.length > 0 ? (
                <>
                  <div className="grid gap-4 sm:grid-cols-2">
                    {filteredFollowing.map((followed) => (
                      <div
                        key={followed._id}
                        className="p-5 bg-white border border-slate-200 rounded-3xl flex items-center justify-between gap-4 shadow-sm hover:shadow-md transition-shadow dark:bg-slate-900 dark:border-slate-800"
                      >
                        <Link
                          to={`/authors/${followed._id}`}
                          className="flex items-center gap-3.5 min-w-0 hover:opacity-85 transition-opacity group"
                        >
                          <img
                            src={
                              followed.profileImage && followed.profileImage !== "/default-avatar.png"
                                ? followed.profileImage
                                : `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                    followed.name || "Author"
                                  )}&background=8C4E35&color=FAF6F0&bold=true&size=128`
                            }
                            alt={followed.name}
                            className="h-12 w-12 rounded-full object-cover ring-2 ring-slate-100 dark:ring-slate-800 group-hover:scale-105 transition-transform"
                          />
                          <div className="text-left min-w-0">
                            <h3 className="text-sm font-bold text-slate-900 group-hover:text-amber-800 transition-colors truncate">
                              {followed.name}
                            </h3>
                            <p className="text-xs text-slate-550 truncate">{followed.email}</p>
                            {followed.bio && (
                              <p className="text-[10px] text-slate-600 dark:text-slate-400 mt-1 line-clamp-1 italic">
                                "{followed.bio}"
                              </p>
                            )}
                          </div>
                        </Link>

                        <button
                          type="button"
                          disabled={actionLoadingId === followed._id}
                          onClick={() => handleFollowAction(followed._id, true)}
                          className="px-3 py-1.5 rounded-xl font-bold text-xs border border-rose-200 hover:border-rose-300 bg-rose-50 hover:bg-rose-100 text-rose-700 dark:bg-rose-950/20 dark:border-rose-900/30 dark:hover:bg-rose-900/40 dark:text-rose-450 cursor-pointer shrink-0 flex items-center gap-1 shadow-sm transition-all"
                        >
                          {actionLoadingId === followed._id ? (
                            <span className="h-3 w-3 animate-spin rounded-full border-2 border-current border-t-transparent" />
                          ) : (
                            <>
                              <UserMinus size={11} /> Unfollow
                            </>
                          )}
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Load More Button for Following */}
                  {following.length > 0 && followingPage < followingTotalPages && (
                    <div className="mt-8 flex justify-center py-4">
                      <button
                        type="button"
                        onClick={loadMore}
                        disabled={loadingMore}
                        className="px-6 py-2.5 rounded-full border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 text-sm font-semibold transition cursor-pointer disabled:opacity-50 flex items-center gap-2"
                      >
                        {loadingMore ? (
                          <>
                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-amber-600 border-t-transparent" />
                            <span>Loading more...</span>
                          </>
                        ) : (
                          <span>Load More Following</span>
                        )}
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <div className="rounded-3xl border border-slate-200 bg-white px-6 py-20 text-center text-slate-500 shadow-sm dark:bg-slate-900 dark:border-slate-800">
                  <div className="mx-auto w-12 h-12 bg-amber-50 rounded-full flex items-center justify-center text-amber-700 mb-4 dark:bg-slate-800 dark:text-amber-550">
                    <Star size={20} />
                  </div>
                  <h3 className="text-base font-bold text-slate-900">Not following anyone yet</h3>
                  <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                    {searchQuery ? "Try refining your search terms." : "Explore and follow other creative minds to grow your community network!"}
                  </p>
                </div>
              )
            )}
          </div>
        )}

      {/* Toast notifications */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-[200000] max-w-sm animate-fade-in text-left">
          <div className={`p-4 rounded-2xl shadow-xl flex items-start gap-3 border ${
            toast.type === "success" 
              ? "bg-[#FAF6F0] text-[#722F37] border-[#722F37]/20" 
              : "bg-red-50 text-red-950 border-red-200"
          }`}>
            <Info size={18} className={`shrink-0 mt-0.5 ${toast.type === "success" ? "text-amber-800" : "text-red-700"}`} />
            <div>
              <p className="text-xs font-bold leading-normal">{toast.message}</p>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  );
};

export default AuthorNetwork;
