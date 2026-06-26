import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { fetchBookById } from "../../services/bookService.js";
import { useAuth } from "../../AuthContext.jsx";
import { Flag } from "lucide-react";
import ReviewSection from "../ReviewSection.jsx";
import ReportModal from "../ReportModal.jsx";
import {
  FaDownload,
  FaArrowLeft,
  FaBook,
  FaCalendar,
  FaUser,
  FaBookOpen,
  FaInfoCircle,
  FaExpand,
  FaQuestionCircle,
} from "react-icons/fa";

const BookDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [readerOpen, setReaderOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth > 768);

  useEffect(() => {
    const loadBook = async () => {
      try {
        setLoading(true);
        setError(null);

        const data = await fetchBookById(id);

        setBook(data);
      } catch (err) {
        setError(err.message || "Unable to load book details.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadBook();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h2 className="text-xl font-semibold">
          Loading book...
        </h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-red-600 text-xl font-semibold mb-4">
            {error}
          </h2>

          <button
            onClick={() => navigate(-1)}
            className="bg-black text-white px-4 py-2 rounded-lg"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const cover =
    book?.coverImage ||
    "https://via.placeholder.com/400x600?text=No+Cover";

  const authorName =
    book?.author?.name ||
    "Unknown Author";

  const formattedDate =
    book?.publishDate
      ? new Date(book.publishDate).toLocaleDateString()
      : "N/A";

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4">
      <div className="max-w-6xl mx-auto">

        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 mb-6 text-slate-700 hover:text-black"
        >
          <FaArrowLeft />
          Back
        </button>

        <div className="bg-white rounded-3xl shadow-xl overflow-hidden grid lg:grid-cols-2 gap-8">

          {/* Cover */}
          <div>
            <div className="relative aspect-[3/4] bg-slate-200 overflow-hidden">

              {!imageLoaded && !imageError && (
                <div className="absolute inset-0 animate-pulse bg-slate-300" />
              )}

              {!imageError ? (
                <img
                  src={cover}
                  alt={book?.title}
                  onLoad={() => setImageLoaded(true)}
                  onError={() => setImageError(true)}
                  className={`w-full h-full object-cover ${
                    imageLoaded ? "opacity-100" : "opacity-0"
                  }`}
                />
              ) : (
                <div className="h-full flex items-center justify-center">
                  <FaBook className="text-6xl text-slate-400" />
                </div>
              )}
            </div>

            <div className="m-6 flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => setReaderOpen(true)}
                className="flex-1 flex items-center justify-center gap-2 bg-amber-700 hover:bg-amber-800 text-white px-6 py-4 rounded-xl font-bold transition duration-200 cursor-pointer shadow-md shadow-amber-800/10 active:scale-[0.98]"
              >
                <FaBookOpen />
                Start Reading
              </button>

              {book?.pdfFile && (
                <a
                  href={book.pdfFile}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 border-2 border-slate-200 hover:border-slate-300 text-slate-700 bg-slate-50 hover:bg-slate-100 px-6 py-3 rounded-xl font-semibold transition duration-200"
                >
                  <FaDownload />
                  Download PDF
                </a>
              )}
            </div>
          </div>

          {/* Details */}
          <div className="p-8 space-y-6">

            <div>
              <div className="flex justify-between items-center mb-4">
                <span className="inline-block bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-sm font-semibold">
                  {book?.genres?.[0] || "Book"}
                </span>

                {user && (
                  <button
                    type="button"
                    onClick={() => setReportModalOpen(true)}
                    className="flex items-center gap-1 text-xs font-semibold text-rose-600 hover:text-rose-800 cursor-pointer"
                  >
                    <Flag size={13} />
                    Report
                  </button>
                )}
              </div>

              <h1 className="text-4xl font-bold mb-3">
                {book?.title}
              </h1>

              <p className="flex items-center gap-2 text-lg text-slate-700">
                <FaUser />
                {book?.author?._id ? (
                  <Link to={`/authors/${book.author._id}`} className="hover:text-amber-800 hover:underline transition-colors duration-200">
                    {authorName}
                  </Link>
                ) : (
                  authorName
                )}
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4">

              <div className="bg-slate-100 rounded-xl p-4">
                <p className="text-sm text-slate-500">
                  Genre
                </p>

                <p className="font-semibold">
                  {book?.genres?.join(", ")}
                </p>
              </div>

              <div className="bg-slate-100 rounded-xl p-4">
                <p className="text-sm text-slate-500">
                  Price
                </p>

                <p className="font-semibold">
                  ₹{book?.price}
                </p>
              </div>

            </div>

            {/* Description */}
            <div>
              <h2 className="text-xl font-bold mb-3 flex items-center gap-2">
                <FaBook />
                Description
              </h2>

              <p className="text-slate-700 leading-relaxed">
                {book?.description}
              </p>
            </div>

            {/* Publish Date */}
            <div className="border-t pt-4">

              <p className="text-sm text-slate-500 mb-2">
                Published Date
              </p>

              <p className="flex items-center gap-2 font-medium">
                <FaCalendar />
                {formattedDate}
              </p>

            </div>

          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-10">
          <ReviewSection bookId={id} />
        </div>

        {/* Report Modal */}
        <ReportModal
          isOpen={reportModalOpen}
          onClose={() => setReportModalOpen(false)}
          bookId={id}
        />
      </div>

      {/* Immersive Fullscreen E-Reader Overlay */}
      {readerOpen && (
        <div className="fixed inset-0 z-50 flex flex-col bg-[#120F0D] text-slate-100 font-sans">
          
          {/* Header Bar */}
          <header className="bg-[#1C1613] border-b border-[#2C211D] px-6 py-4 flex items-center justify-between shadow-md shrink-0">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setReaderOpen(false)}
                className="p-2 rounded-lg hover:bg-slate-800 transition text-slate-400 hover:text-white cursor-pointer"
                title="Exit Reader"
              >
                <FaArrowLeft className="text-lg" />
              </button>
              <div className="border-l border-slate-700 h-6 hidden sm:block" />
              <div>
                <h3 className="font-serif font-bold text-base sm:text-lg text-slate-100 truncate max-w-xs sm:max-w-md">
                  {book?.title}
                </h3>
                <p className="text-xs text-amber-500/80 font-medium">
                  by {authorName}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className={`p-2.5 rounded-xl transition cursor-pointer flex items-center gap-2 border text-sm font-semibold ${
                  sidebarOpen 
                    ? "bg-amber-800/10 border-amber-800/35 text-amber-500 hover:bg-amber-900/20" 
                    : "border-slate-700 text-slate-300 hover:bg-slate-800"
                }`}
                title="Toggle Book Details Panel"
              >
                <FaInfoCircle />
                <span className="hidden sm:inline">Info Panel</span>
              </button>

              <a
                href={book?.pdfFile}
                target="_blank"
                rel="noreferrer"
                className="bg-amber-700 hover:bg-amber-800 text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition flex items-center gap-2"
                title="Open PDF directly"
              >
                <FaExpand className="text-xs" />
                <span className="hidden sm:inline">External Tab</span>
              </a>
            </div>
          </header>

          {/* Main workspace */}
          <div className="flex-1 flex overflow-hidden relative">
            
            {/* Vintage Parchment Collapsible Sidebar */}
            {sidebarOpen && (
              <aside className="w-80 bg-[#FDF8F3] text-[#3E3024] flex flex-col shrink-0 shadow-2xl z-20 transition-all duration-300 overflow-y-auto fixed md:relative top-[73px] md:top-0 bottom-0 left-0 md:h-full border-r border-[#DFD5C6]">
                <div className="p-6 space-y-6">
                  {/* Book Cover mockup inside sidebar */}
                  <div className="aspect-[3/4] w-48 mx-auto bg-slate-200 border-4 border-[#38231B] rounded-xl shadow-lg overflow-hidden relative">
                    <img src={cover} alt={book?.title} className="w-full h-full object-cover" />
                  </div>

                  <div>
                    <span className="inline-block bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-2">
                      {book?.genres?.[0] || "Book"}
                    </span>
                    <h2 className="font-serif text-2xl font-bold text-[#2C1F15] leading-tight">
                      {book?.title}
                    </h2>
                    <p className="text-sm font-medium text-amber-700 mt-1">
                      by {authorName}
                    </p>
                  </div>

                  <div className="border-t border-[#DFD5C6] pt-4">
                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                      Synopsis
                    </h4>
                    <p className="text-sm leading-relaxed text-slate-700 line-clamp-6" title={book?.description}>
                      {book?.description}
                    </p>
                  </div>

                  <div className="border-t border-[#DFD5C6] pt-4 space-y-3 text-xs text-slate-500">
                    <div className="flex justify-between">
                      <span className="font-semibold">Published Date</span>
                      <span className="font-bold text-slate-700">{formattedDate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-semibold">Price/Tier</span>
                      <span className="font-bold text-slate-700">₹{book?.price}</span>
                    </div>
                  </div>

                  {/* Quick Reader Help Guidelines */}
                  <div className="border-t border-[#DFD5C6] pt-4">
                    <div className="bg-amber-50 border border-amber-200/50 rounded-xl p-3.5 flex gap-2.5">
                      <FaQuestionCircle className="text-amber-700 shrink-0 text-sm mt-0.5" />
                      <div className="text-[11px] text-amber-800 leading-normal">
                        <p className="font-bold mb-1">E-Reader Tips:</p>
                        <ul className="list-disc pl-3.5 space-y-1">
                          <li>Use your cursor to scroll page by page.</li>
                          <li>Hover overlay bottom tools for zoom options.</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </aside>
            )}

            {/* Simulated Desktop Mahogany desk & Hardcover book binder container */}
            <main className="flex-1 bg-gradient-to-br from-[#1C1512] via-[#120F0D] to-[#0A0706] p-4 sm:p-8 flex items-center justify-center overflow-hidden relative">
              
              {/* Outer Hardcover leather binder mockup - Responsive */}
              <div className="w-full max-w-5xl h-full flex items-stretch md:bg-[#38231B] md:border-4 md:border-[#2A1812] md:shadow-[0_20px_50px_rgba(0,0,0,0.85)] md:rounded-[32px] md:p-4 relative overflow-hidden bg-white dark:bg-slate-900">
                
                {/* Styled e-Reader Iframe */}
                <iframe
                  src={`${book?.pdfFile}#toolbar=0`}
                  title={book?.title}
                  className="w-full h-full rounded-2xl bg-white border border-[#DFD5C6] shadow-[inset_0_2px_8px_rgba(0,0,0,0.12)] z-0"
                />
              </div>

            </main>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookDetails;