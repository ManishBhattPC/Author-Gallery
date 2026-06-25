import React, { useEffect, useState } from "react";
import { 
  getAdminDashboardData, 
  deleteBookByAdmin, 
  deleteAuthorByAdmin, 
  dismissReportByAdmin, 
  deleteReviewByAdmin 
} from "../services/adminService.js";
import { 
  BookOpen, 
  Users, 
  AlertTriangle, 
  MessageSquare, 
  Trash2, 
  CheckCircle, 
  ExternalLink,
  Shield,
  Loader
} from "lucide-react";
import { Link } from "react-router-dom";

const AdminDashboard = () => {
  const [data, setData] = useState({ books: [], authors: [], reports: [], reviews: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [activeTab, setActiveTab] = useState("books"); // books, authors, reports, reviews

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await getAdminDashboardData();
      setData(res);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load dashboard data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const showNotification = (msg) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(""), 3000);
  };

  const handleDeleteBook = async (bookId) => {
    if (!window.confirm("Are you sure you want to delete this book? This will also delete all associated reports and reviews.")) return;
    try {
      await deleteBookByAdmin(bookId);
      showNotification("Book deleted successfully.");
      loadDashboardData();
    } catch (err) {
      setError("Failed to delete book.");
    }
  };

  const handleDeleteAuthor = async (authorId) => {
    if (!window.confirm("Are you sure you want to block this author? This will delete their account, profile, and all their books.")) return;
    try {
      await deleteAuthorByAdmin(authorId);
      showNotification("Author account and books deleted successfully.");
      loadDashboardData();
    } catch (err) {
      setError("Failed to delete author.");
    }
  };

  const handleDismissReport = async (reportId) => {
    try {
      await dismissReportByAdmin(reportId);
      showNotification("Report dismissed successfully.");
      loadDashboardData();
    } catch (err) {
      setError("Failed to dismiss report.");
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm("Are you sure you want to delete this review?")) return;
    try {
      await deleteReviewByAdmin(reviewId);
      showNotification("Review deleted successfully.");
      loadDashboardData();
    } catch (err) {
      setError("Failed to delete review.");
    }
  };

  const renderStars = (rating) => {
    return (
      <div className="flex gap-0.5 text-amber-500 fill-amber-500">
        {[1, 2, 3, 4, 5].map((val) => (
          <span key={val} className={val <= rating ? "★" : "☆"} />
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF6F0] flex flex-col items-center justify-center py-20">
        <Loader className="w-10 h-10 text-amber-800 animate-spin mb-3" />
        <h3 className="font-bold text-slate-800 text-lg">Loading Admin Panel</h3>
        <p className="text-sm text-slate-500 mt-1">Fetching records and reports...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF6F0] py-10 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-7xl space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white border border-slate-200/60 p-6 rounded-3xl shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-amber-50 rounded-2xl text-amber-800 shadow-inner">
              <Shield className="w-7 h-7" />
            </div>
            <div>
              <span className="text-xs font-bold text-amber-800 uppercase tracking-widest">Moderation Center</span>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900">Admin Dashboard</h2>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 bg-slate-50 px-4 py-2 rounded-full border border-slate-100">
            <span>Server Online</span>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          </div>
        </div>

        {/* Notifications */}
        {error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 font-semibold">
            {error}
          </div>
        )}
        {successMsg && (
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800 font-semibold">
            {successMsg}
          </div>
        )}

        {/* Tab Selection */}
        <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-px">
          {[
            { id: "books", label: "Books", icon: <BookOpen size={16} />, count: data.books?.length },
            { id: "authors", label: "Authors / Users", icon: <Users size={16} />, count: data.authors?.length },
            { id: "reports", label: "Reports", icon: <AlertTriangle size={16} />, count: data.reports?.filter(r => r.status === "pending").length },
            { id: "reviews", label: "Reviews", icon: <MessageSquare size={16} />, count: data.reviews?.length }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-3 rounded-t-2xl text-sm font-bold border-t border-x transition cursor-pointer ${
                activeTab === tab.id
                  ? "bg-white border-slate-200 text-amber-800 translate-y-px"
                  : "border-transparent text-slate-500 hover:text-slate-700 bg-slate-50/50"
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                  tab.id === "reports" && tab.count > 0 
                    ? "bg-rose-100 text-rose-700" 
                    : "bg-slate-100 text-slate-600"
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Tab Contents */}
        <div className="bg-white border border-slate-200/60 p-6 sm:p-8 rounded-3xl shadow-sm text-left min-h-[400px]">
          
          {/* BOOKS TAB */}
          {activeTab === "books" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center border-b border-slate-100 pb-4">
                <h3 className="text-xl font-bold text-slate-800">All Published Books</h3>
                <p className="text-xs text-slate-500">{data.books?.length} books active</p>
              </div>

              {data.books?.length === 0 ? (
                <p className="text-center text-slate-400 py-12 text-sm">No books found.</p>
              ) : (
                <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {data.books?.map((book) => (
                    <div key={book._id} className="border border-slate-100 rounded-2xl overflow-hidden shadow-sm bg-slate-50/10 flex flex-col justify-between">
                      <div className="aspect-[3/4] bg-slate-100 relative">
                        <img
                          src={book.coverImage}
                          alt={book.title}
                          onError={(e) => {
                            e.currentTarget.src = "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=500";
                            e.currentTarget.onerror = null;
                          }}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="p-4 space-y-3 flex-grow flex flex-col justify-between">
                        <div>
                          <h4 className="font-bold text-slate-850 line-clamp-2 text-sm" title={book.title}>
                            {book.title}
                          </h4>
                          <p className="text-xs text-slate-500 mt-1">
                            by {book.author?.name || "Deleted Author"}
                          </p>
                        </div>
                        <div className="flex items-center gap-1.5 pt-3 border-t border-slate-100 mt-2">
                          <Link
                            to={`/books/${book._id}`}
                            className="flex-1 py-1.5 border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-lg text-xs font-semibold text-center flex items-center justify-center gap-1"
                          >
                            <ExternalLink size={12} />
                            View
                          </Link>
                          <button
                            onClick={() => handleDeleteBook(book._id)}
                            className="p-1.5 border border-slate-200 hover:bg-rose-50 hover:text-rose-600 text-slate-500 rounded-lg cursor-pointer"
                            title="Delete Book"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* AUTHORS TAB */}
          {activeTab === "authors" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center border-b border-slate-100 pb-4">
                <h3 className="text-xl font-bold text-slate-800">Platform Authors / Users</h3>
                <p className="text-xs text-slate-500">{data.authors?.length} accounts</p>
              </div>

              {data.authors?.length === 0 ? (
                <p className="text-center text-slate-400 py-12 text-sm">No authors found.</p>
              ) : (
                <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {data.authors?.map((author) => {
                    const fallbackAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(author.name)}&background=8C4E35&color=FAF6F0&bold=true`;
                    return (
                      <div key={author._id} className="border border-slate-150 rounded-2xl p-5 shadow-sm bg-slate-50/10 flex flex-col justify-between items-center text-center space-y-4">
                        <img
                          src={author.profileImage || fallbackAvatar}
                          alt={author.name}
                          onError={(e) => {
                            e.currentTarget.src = fallbackAvatar;
                            e.currentTarget.onerror = null;
                          }}
                          className="w-16 h-16 rounded-full object-cover border border-slate-200"
                        />
                        <div>
                          <h4 className="font-bold text-slate-850 text-sm line-clamp-1">{author.name}</h4>
                          <p className="text-xs text-slate-500 truncate max-w-[180px]">{author.email}</p>
                          <span className="inline-block mt-2 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-100/50">
                            {author.works} Published Works
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 w-full pt-3 border-t border-slate-100">
                          <Link
                            to={`/authors/${author._id}`}
                            className="flex-1 py-1.5 border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-lg text-xs font-semibold text-center flex items-center justify-center gap-1"
                          >
                            <ExternalLink size={12} />
                            Profile
                          </Link>
                          <button
                            onClick={() => handleDeleteAuthor(author._id)}
                            className="p-1.5 border border-slate-200 hover:bg-rose-50 hover:text-rose-600 text-slate-500 rounded-lg cursor-pointer"
                            title="Block / Delete Author"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* REPORTS TAB */}
          {activeTab === "reports" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center border-b border-slate-100 pb-4">
                <h3 className="text-xl font-bold text-slate-800">Content Reports</h3>
                <p className="text-xs text-slate-500">
                  {data.reports?.filter(r => r.status === "pending").length} pending reports
                </p>
              </div>

              {data.reports?.length === 0 ? (
                <p className="text-center text-slate-400 py-12 text-sm">No reports submitted.</p>
              ) : (
                <div className="space-y-4 divide-y divide-slate-100">
                  {data.reports?.map((report, idx) => (
                    <div key={report._id} className={`pt-4 flex flex-col md:flex-row md:items-center justify-between gap-6 ${idx === 0 ? "pt-0" : ""}`}>
                      <div className="space-y-2">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="inline-flex items-center gap-1 bg-rose-50 text-rose-700 px-2.5 py-0.5 rounded-full text-xs font-bold border border-rose-100">
                            <AlertTriangle size={12} />
                            {report.reason}
                          </span>
                          <span className="text-xs text-slate-400">
                            Reported by: <span className="font-semibold text-slate-700">{report.reporter?.name || "User"}</span> ({report.reporter?.email})
                          </span>
                        </div>
                        
                        <div>
                          {report.book ? (
                            <p className="text-sm font-semibold text-slate-800">
                              Target Book:{" "}
                              <Link to={`/books/${report.book._id}`} className="text-amber-800 hover:underline inline-flex items-center gap-1">
                                {report.book.title}
                                <ExternalLink size={12} />
                              </Link>
                              <span className="text-xs text-slate-450 font-normal"> (by {report.book.author?.name || "Unknown"})</span>
                            </p>
                          ) : report.author ? (
                            <p className="text-sm font-semibold text-slate-800">
                              Target Author Profile:{" "}
                              <Link to={`/authors/${report.author._id}`} className="text-amber-800 hover:underline inline-flex items-center gap-1">
                                {report.author.name}
                                <ExternalLink size={12} />
                              </Link>
                            </p>
                          ) : (
                            <p className="text-sm font-semibold text-slate-800">
                              General Support & Helpdesk Request
                            </p>
                          )}
                        </div>

                        {report.description && (
                          <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100 max-w-2xl leading-relaxed">
                            {report.description}
                          </p>
                        )}
                      </div>

                      <div className="flex gap-2 shrink-0 md:self-center">
                        <button
                          onClick={() => handleDismissReport(report._id)}
                          className="flex items-center justify-center gap-1.5 px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-650 rounded-xl text-xs font-semibold transition cursor-pointer"
                        >
                          <CheckCircle size={14} className="text-emerald-600" />
                          Dismiss
                        </button>

                        {report.book && (
                          <button
                            onClick={() => handleDeleteBook(report.book._id)}
                            className="flex items-center justify-center gap-1.5 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-semibold transition cursor-pointer"
                          >
                            <Trash2 size={14} />
                            Delete Book
                          </button>
                        )}

                        {report.author && (
                          <button
                            onClick={() => handleDeleteAuthor(report.author._id)}
                            className="flex items-center justify-center gap-1.5 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-semibold transition cursor-pointer"
                          >
                            <Trash2 size={14} />
                            Delete Author
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* REVIEWS TAB */}
          {activeTab === "reviews" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center border-b border-slate-100 pb-4">
                <h3 className="text-xl font-bold text-slate-800">All Reviews & Ratings</h3>
                <p className="text-xs text-slate-500">{data.reviews?.length} reviews active</p>
              </div>

              {data.reviews?.length === 0 ? (
                <p className="text-center text-slate-400 py-12 text-sm">No reviews found.</p>
              ) : (
                <div className="space-y-4 divide-y divide-slate-100">
                  {data.reviews?.map((rev, idx) => (
                    <div key={rev._id} className={`pt-4 flex justify-between items-start gap-4 ${idx === 0 ? "pt-0" : ""}`}>
                      <div className="space-y-1.5 flex-grow">
                        <div className="flex flex-wrap items-center gap-2 text-xs">
                          <span className="font-bold text-slate-800">{rev.reviewer?.name || "Anonymous User"}</span>
                          <span className="text-slate-300">•</span>
                          {renderStars(rev.rating)}
                          <span className="text-slate-300">•</span>
                          <span className="text-slate-450">{new Date(rev.createdAt).toLocaleDateString()}</span>
                        </div>
                        <div>
                          {rev.book ? (
                            <span className="text-xs text-slate-500">
                              Reviewed Book:{" "}
                              <Link to={`/books/${rev.book._id}`} className="font-semibold text-slate-650 hover:underline">
                                {rev.book.title}
                              </Link>
                            </span>
                          ) : rev.author ? (
                            <span className="text-xs text-slate-500">
                              Reviewed Author:{" "}
                              <Link to={`/authors/${rev.author._id}`} className="font-semibold text-slate-650 hover:underline">
                                {rev.author.name}
                              </Link>
                            </span>
                          ) : (
                            <span className="text-xs text-slate-400 italic">Target deleted.</span>
                          )}
                        </div>
                        <p className="text-sm text-slate-600 leading-relaxed bg-slate-50/20 p-3 rounded-xl border border-slate-100/50 mt-1 max-w-3xl">
                          {rev.comment}
                        </p>
                      </div>
                      
                      <button
                        onClick={() => handleDeleteReview(rev._id)}
                        className="p-2 border border-slate-200 hover:bg-rose-50 hover:text-rose-600 text-slate-450 rounded-xl cursor-pointer mt-1 shrink-0"
                        title="Delete Review"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
