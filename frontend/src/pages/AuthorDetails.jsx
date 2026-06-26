import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { fetchAuthorById, followAuthor, unfollowAuthor, checkFollowStatus } from "../services/authorService.js";
import BookCard from "../components/BookComponents/BookCard.jsx";
import { useAuth } from "../AuthContext.jsx";
import { Flag, Info } from "lucide-react";
import ReviewSection from "../components/ReviewSection.jsx";
import ReportModal from "../components/ReportModal.jsx";

const AuthorDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [author, setAuthor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followerCount, setFollowerCount] = useState(0);
  const [followLoading, setFollowLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  console.log("DEBUG AuthorDetails:", {
    user,
    userId: user?._id || user?.id,
    authorId: author?._id || author?.id,
    isFollowing,
    followerCount,
    followLoading,
    shouldShowFollowButton: !user || (user?._id || user?.id) !== (author?._id || author?.id)
  });

  useEffect(() => {
    const loadAuthor = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchAuthorById(id);
        const authObj = data.author || data;
        setAuthor(authObj);
        setFollowerCount(authObj.followers ?? 0);

        const loggedInUserId = user?._id || user?.id;
        if (loggedInUserId && loggedInUserId !== id) {
          try {
            const statusRes = await checkFollowStatus(id);
            setIsFollowing(statusRes.isFollowing);
          } catch (err) {
            console.error("Error checking follow status:", err);
          }
        }
      } catch (err) {
        setError(err.message || "Unable to load author.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadAuthor();
    }
  }, [id, user]);

  const handleFollowToggle = async () => {
    if (!user) {
      navigate("/login");
      return;
    }

    setFollowLoading(true);
    try {
      if (isFollowing) {
        await unfollowAuthor(id);
        setIsFollowing(false);
        setFollowerCount((prev) => Math.max(0, prev - 1));
      } else {
        await followAuthor(id);
        setIsFollowing(true);
        setFollowerCount((prev) => prev + 1);
      }
    } catch (err) {
      console.error("Error toggling follow:", err);
      showToast(err.message || "Failed to perform follow action.", "error");
    } finally {
      setFollowLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="rounded-3xl border border-slate-200 bg-white px-6 py-16 text-center text-slate-500 shadow-sm">
          Loading author details…
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <div className="rounded-3xl border border-rose-200 bg-rose-50 px-6 py-16 text-center text-rose-700 shadow-sm">
          {error}
        </div>
      </div>
    );
  }

  if (!author) {
    return null;
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <Link to="/authors" className="text-amber-700 font-medium hover:underline">
          ← Back to authors
        </Link>
      </div>

      <div className="grid gap-8 lg:grid-cols-[360px_1fr]">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <img
            src={
              author.profileImage && author.profileImage !== "/default-avatar.png"
                ? author.profileImage
                : `https://ui-avatars.com/api/?name=${encodeURIComponent(
                    author.name || "Author"
                  )}&background=8C4E35&color=FAF6F0&bold=true&size=256`
            }
            alt={author.name}
            className="h-80 w-full rounded-3xl object-cover"
          />
          <div className="mt-6 space-y-4">
            <div>
              <div className="flex justify-between items-start gap-2">
                <h1 className="text-3xl font-semibold text-slate-900">{author.name}</h1>
                {user && (
                  <button
                    type="button"
                    onClick={() => setReportModalOpen(true)}
                    className="flex items-center gap-1 text-xs font-semibold text-rose-600 hover:text-rose-800 cursor-pointer pt-1"
                  >
                    <Flag size={12} />
                    Report
                  </button>
                )}
              </div>
              <p className="text-sm text-slate-500 mt-2">{author.email}</p>
            </div>
            {(!user || (user?._id || user?.id) !== (author?._id || author?.id)) ? (
              <button
                type="button"
                disabled={followLoading}
                onClick={handleFollowToggle}
                className={`w-full py-3 rounded-2xl font-semibold text-sm shadow-sm transition-all duration-300 active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2 ${
                  isFollowing
                    ? "bg-slate-200/85 hover:bg-slate-350 text-slate-800 border border-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-200 dark:border-slate-700"
                    : "bg-amber-800 hover:bg-amber-900 text-white dark:bg-amber-700 dark:hover:bg-amber-600"
                }`}
              >
                {followLoading ? (
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                ) : isFollowing ? (
                  "Following"
                ) : (
                  "Follow Author"
                )}
              </button>
            ) : (
              <Link
                to="/dashboard/author-profile"
                className="w-full py-3 rounded-2xl font-semibold text-sm border border-amber-800 text-amber-800 dark:border-amber-600 dark:text-amber-500 hover:bg-amber-50 dark:hover:bg-slate-800 transition-all duration-300 flex items-center justify-center gap-2 text-center"
              >
                ✍️ Edit Your Profile
              </Link>
            )}

            <div className="rounded-3xl bg-slate-50 p-4">
              <p className="text-sm text-slate-500">Works</p>
              <p className="text-3xl font-semibold text-slate-900">{author.works}</p>
            </div>
            <div className="rounded-3xl bg-slate-50 p-4">
              <p className="text-sm text-slate-500">Followers</p>
              <p className="text-3xl font-semibold text-slate-900">{followerCount}</p>
            </div>
            <div className="rounded-3xl bg-slate-50 p-4">
              <p className="text-sm text-slate-500">Following</p>
              <p className="text-3xl font-semibold text-slate-900">{author.following ?? 0}</p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-semibold text-slate-900">About the Author</h2>
            <p className="mt-4 text-sm text-slate-600">{author.bio || "This author has not added a bio yet."}</p>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-xl font-semibold text-slate-900 mb-6">Author Books</h3>
            <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
              {Array.isArray(author.books) && author.books.length > 0 ? (
                author.books.map((book) => (
                  <BookCard
                    key={book._id || book.id}
                    book={{
                      ...book,
                      author: {
                        _id: author._id,
                        name: author.name,
                      },
                    }}
                  />
                ))
              ) : (
                <p className="col-span-full text-sm text-slate-500">No books found for this author.</p>
              )}
            </div>
          </div>

          {/* Reviews Section */}
          <div className="mt-8">
            <ReviewSection authorId={id} />
          </div>
        </div>
      </div>

      <ReportModal
        isOpen={reportModalOpen}
        onClose={() => setReportModalOpen(false)}
        authorId={id}
      />

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
  );
};

export default AuthorDetails;
