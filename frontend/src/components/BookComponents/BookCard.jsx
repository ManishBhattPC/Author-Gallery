import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaBookOpen } from "react-icons/fa";

const BookCard = ({ book }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const coverUrl = book?.coverImage;
  const title = book?.title || "Untitled Book";

  const authorName =
    book?.author?.name ||
    "Unknown Author";

  const price =
    book?.price !== undefined
      ? `₹${book.price}`
      : "Free";

  const genre =
    book?.genres?.[0] || "General";

  return (
    <div 
      className="group border border-slate-200/50 hover:border-amber-700/20 bg-white rounded-2xl shadow-md hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 ease-out overflow-hidden flex flex-col"
    >
      
      {/* Cover */}
      <div className="relative aspect-[3/4] bg-slate-200 overflow-hidden">
        {coverUrl && !imageError ? (
          <>
            {!imageLoaded && (
              <div className="absolute inset-0 animate-pulse bg-slate-300" />
            )}

            <img
              src={coverUrl}
              alt={title}
              onLoad={() => setImageLoaded(true)}
              onError={() => setImageError(true)}
              className={`w-full h-full object-cover transition duration-300 group-hover:scale-105 ${
                imageLoaded ? "opacity-100" : "opacity-0"
              }`}
            />
          </>
        ) : (
          <div className="flex h-full items-center justify-center">
            <FaBookOpen className="text-6xl text-slate-400" />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        <span className="text-xs text-amber-700 font-semibold uppercase mb-2">
          {genre}
        </span>

        <h2 className="font-serif font-bold text-base sm:text-lg text-slate-900 line-clamp-2 mb-2">
          {title}
        </h2>

        <p className="text-sm text-slate-500 mb-3">
          {book?.author?._id ? (
            <Link to={`/authors/${book.author._id}`} className="hover:text-amber-800 hover:underline transition-colors duration-200">
              {authorName}
            </Link>
          ) : (
            authorName
          )}
        </p>

        <div className="mb-4">
          <span className="font-semibold text-green-700 dark:text-green-500">
            {price}
          </span>
        </div>

        <Link
          to={`/books/${book._id}`}
          className="mt-auto block text-center bg-amber-800 hover:bg-amber-900 text-white py-2 rounded-xl font-bold text-xs transition duration-200 shadow-sm"
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

export default BookCard;