import React, { useState, useEffect } from "react";
import { useAuth } from "../AuthContext.jsx";
import { addReview, getBookReviews, getAuthorReviews } from "../services/reviewService.js";
import { Star, MessageSquare, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

const ReviewSection = ({ bookId, authorId }) => {
  const { user } = useAuth();
  
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const loadReviews = async () => {
    try {
      setLoading(true);
      let data = [];
      if (bookId) {
        data = await getBookReviews(bookId);
      } else if (authorId) {
        data = await getAuthorReviews(authorId);
      }
      setReviews(data);
    } catch (err) {
      console.error("Error loading reviews:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReviews();
  }, [bookId, authorId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!comment.trim()) {
      setError("Please write a comment.");
      return;
    }

    setSubmitting(true);
    try {
      const reviewData = {
        rating,
        comment: comment.trim(),
      };
      if (bookId) reviewData.book = bookId;
      if (authorId) reviewData.author = authorId;

      await addReview(reviewData);
      setSuccess("Review submitted successfully! 🎉");
      setComment("");
      setRating(5);
      // Reload reviews list
      loadReviews();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to submit review.");
    } finally {
      setSubmitting(false);
    }
  };

  // Calculate average rating
  const avgRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : null;

  const renderStars = (count, size = 16, interactive = false, onSelect = null) => {
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((starValue) => {
          const filled = starValue <= count;
          return (
            <Star
              key={starValue}
              size={size}
              onClick={() => interactive && onSelect?.(starValue)}
              className={`${
                filled ? "text-amber-500 fill-amber-500" : "text-slate-300"
              } ${interactive ? "cursor-pointer hover:scale-110 transition-transform" : ""}`}
            />
          );
        })}
      </div>
    );
  };

  return (
    <div className="space-y-8 bg-white border border-slate-200/60 p-6 sm:p-8 rounded-3xl shadow-sm text-left">
      <div className="flex justify-between items-center border-b border-slate-100 pb-5">
        <div>
          <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-amber-700" />
            Reviews & Ratings
          </h3>
          <p className="text-xs text-slate-500 mt-1">Read reviews or share your thoughts.</p>
        </div>
        {avgRating && (
          <div className="flex items-center gap-2 bg-amber-50 px-3 py-1.5 rounded-full border border-amber-100/50">
            {renderStars(Math.round(Number(avgRating)), 14)}
            <span className="text-xs font-bold text-amber-900">{avgRating} / 5</span>
            <span className="text-[10px] text-amber-700">({reviews.length})</span>
          </div>
        )}
      </div>

      {/* Review Submission Form */}
      {user ? (
        <form onSubmit={handleSubmit} className="bg-slate-50/50 border border-slate-100 p-5 rounded-2xl space-y-4">
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-slate-600">Your Rating:</span>
            {renderStars(rating, 22, true, setRating)}
          </div>
          
          <div>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Write your review here..."
              rows={3}
              required
              className="w-full px-4 py-3 bg-white border border-slate-200 focus:ring-4 focus:ring-amber-50/50 focus:border-amber-600 rounded-xl text-slate-800 text-sm outline-none transition-all placeholder-slate-400"
            />
          </div>

          {error && <p className="text-xs text-rose-600 font-semibold">{error}</p>}
          {success && <p className="text-xs text-emerald-600 font-semibold">{success}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="px-5 py-2.5 bg-amber-800 hover:bg-amber-900 text-white rounded-xl font-semibold text-xs transition duration-200 disabled:opacity-50 flex items-center gap-1.5 cursor-pointer"
          >
            <Sparkles size={14} />
            {submitting ? "Submitting..." : "Submit Review"}
          </button>
        </form>
      ) : (
        <div className="text-center py-6 border border-dashed border-slate-200 rounded-2xl bg-slate-50/30">
          <p className="text-sm text-slate-500">
            Please <Link to="/login" className="text-amber-800 font-bold hover:underline">Log in</Link> to share a review or rate this.
          </p>
        </div>
      )}

      {/* Reviews List */}
      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-6 text-slate-400 text-sm">Loading reviews...</div>
        ) : reviews.length === 0 ? (
          <div className="text-center py-8 text-slate-400 text-sm">
            No reviews yet. Be the first to share your thoughts!
          </div>
        ) : (
          <div className="space-y-4 divide-y divide-slate-100">
            {reviews.map((rev, idx) => (
              <div key={rev._id} className={`pt-4 ${idx === 0 ? "pt-0" : ""}`}>
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <h5 className="font-bold text-slate-800 text-sm">
                      {rev.reviewer?.name || "Anonymous User"}
                    </h5>
                    <div className="flex items-center gap-2 mt-1">
                      {renderStars(rev.rating, 12)}
                      <span className="text-[10px] text-slate-400">
                        {new Date(rev.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
                <p className="text-slate-600 text-sm mt-2.5 leading-relaxed bg-slate-50/30 p-3 rounded-xl border border-slate-50/80">
                  {rev.comment}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewSection;
