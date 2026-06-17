import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchBookById } from "../services/bookService.js";
import {
  FaDownload,
  FaStar,
  FaArrowLeft,
  FaBook,
  FaCalendar,
  FaUser,
  FaTag,
} from "react-icons/fa";

const BookDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    const loadBook = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await fetchBookById(id);
        setBook(data.book || data);
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

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const handleImageError = () => {
    setImageError(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 px-4 py-12">
        <div className="w-full max-w-md">
          <div className="animate-pulse space-y-4">
            <div className="h-80 bg-slate-300 rounded-2xl"></div>
            <div className="h-8 bg-slate-300 rounded-lg w-3/4"></div>
            <div className="h-6 bg-slate-300 rounded-lg w-1/2"></div>
            <div className="grid grid-cols-2 gap-4">
              <div className="h-24 bg-slate-300 rounded-lg"></div>
              <div className="h-24 bg-slate-300 rounded-lg"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 px-4 py-12">
        <div className="w-full max-w-md">
          <div className="rounded-2xl border border-rose-200 bg-rose-50 px-8 py-12 text-center shadow-lg">
            <FaBook className="mx-auto text-4xl text-rose-600 mb-4" />
            <h2 className="text-xl font-semibold text-rose-900 mb-2">Error Loading Book</h2>
            <p className="text-rose-700 mb-6">{error}</p>
            <button
              onClick={() => navigate(-1)}
              className="inline-flex items-center gap-2 bg-rose-600 hover:bg-rose-700 text-white px-6 py-2 rounded-lg transition-colors"
            >
              <FaArrowLeft /> Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  const cover = book?.coverImage || "https://via.placeholder.com/400x600?text=No+Cover";
  const authors = book?.authorNames?.join(", ") || "Unknown Author";
  const formattedDate = book?.publishedDate
    ? new Date(book.publishedDate).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "N/A";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 py-8 md:py-16 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-8 transition-colors"
        >
          <FaArrowLeft /> Back
        </button>

        {/* Main Content */}
        <div className="grid gap-8 md:gap-12 lg:grid-cols-[1fr_1.5fr] bg-white rounded-3xl shadow-2xl overflow-hidden">
          {/* Left: Book Cover */}
          <div className="h-full flex flex-col justify-start">
            <div className="relative w-full aspect-[3/4] bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center overflow-hidden">
              {!imageLoaded && !imageError && (
                <div className="absolute inset-0 bg-slate-300 animate-pulse" />
              )}

              {!imageError ? (
                <img
                  src={cover}
                  alt={book?.title}
                  onLoad={handleImageLoad}
                  onError={handleImageError}
                  className={`w-full h-full object-cover transition-opacity duration-300 ${
                    imageLoaded ? "opacity-100" : "opacity-0"
                  }`}
                />
              ) : (
                <div className="flex flex-col items-center gap-3 text-slate-400">
                  <FaBook className="text-6xl" />
                  <span className="text-sm font-medium">No Cover Available</span>
                </div>
              )}
            </div>

            {/* Download Button */}
            <button className="m-6 flex items-center justify-center gap-2 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white px-6 py-3 rounded-xl font-semibold transition-all transform hover:scale-105 active:scale-95 shadow-lg">
              <FaDownload /> Download
            </button>
          </div>

          {/* Right: Book Details */}
          <div className="p-6 md:p-8 lg:p-10 space-y-6 flex flex-col justify-between">
            {/* Header */}
            <div>
              <div className="inline-block bg-amber-100 text-amber-800 px-4 py-1 rounded-full text-xs md:text-sm font-semibold mb-4 uppercase tracking-wider">
                {book?.genre || "Book"}
              </div>

              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-3 leading-tight">
                {book?.title}
              </h1>

              <div className="flex items-center gap-2 mb-4">
                <FaStar className="text-yellow-400" />
                <span className="text-xl font-semibold text-slate-800">
                  {book?.rating?.toFixed(1) || "N/A"} / 5
                </span>
              </div>

              <p className="flex items-center gap-2 text-lg text-slate-700 font-medium">
                <FaUser className="text-amber-600" />
                {authors}
              </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-4 md:p-6 border border-blue-200">
                <p className="text-xs uppercase tracking-[0.2em] text-blue-700 font-semibold mb-2">
                  Downloads
                </p>
                <p className="text-2xl md:text-3xl font-bold text-blue-900">
                  {(book?.downloads || 0).toLocaleString()}
                </p>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-4 md:p-6 border border-green-200">
                <p className="text-xs uppercase tracking-[0.2em] text-green-700 font-semibold mb-2">
                  Reads
                </p>
                <p className="text-2xl md:text-3xl font-bold text-green-900">
                  {(book?.readCount || 0).toLocaleString()}
                </p>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-4 md:p-6 border border-purple-200">
                <p className="text-xs uppercase tracking-[0.2em] text-purple-700 font-semibold mb-2">
                  Language
                </p>
                <p className="text-2xl md:text-3xl font-bold text-purple-900">
                  {book?.language || "English"}
                </p>
              </div>
            </div>

            {/* Description */}
            {book?.description && (
              <div>
                <h2 className="text-xl font-bold text-slate-900 mb-3 flex items-center gap-2">
                  <FaBook /> Description
                </h2>
                <p className="text-slate-700 leading-relaxed text-justify">
                  {book.description}
                </p>
              </div>
            )}

            {/* Metadata */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pt-4 border-t border-slate-200">
              <div>
                <p className="text-xs uppercase text-slate-500 font-semibold tracking-wide mb-1">
                  Published
                </p>
                <p className="flex items-center gap-2 text-slate-800 font-medium">
                  <FaCalendar className="text-amber-600" /> {formattedDate}
                </p>
              </div>

              {book?.tags && book.tags.length > 0 && (
                <div className="col-span-2 md:col-span-1">
                  <p className="text-xs uppercase text-slate-500 font-semibold tracking-wide mb-2 flex items-center gap-1">
                    <FaTag /> Tags
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {book.tags.slice(0, 3).map((tag, idx) => (
                      <span
                        key={idx}
                        className="bg-slate-100 text-slate-700 px-2 py-1 rounded text-xs font-medium hover:bg-slate-200 transition-colors"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDetails;