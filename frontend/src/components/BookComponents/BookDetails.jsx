import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
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

            <a
              href={book?.pdfFile}
              target="_blank"
              rel="noreferrer"
              className="m-6 flex items-center justify-center gap-2 bg-amber-700 hover:bg-amber-800 text-white px-6 py-3 rounded-xl font-semibold"
            >
              <FaDownload />
              Read PDF
            </a>
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
                {authorName}
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
    </div>
  );
};

export default BookDetails;