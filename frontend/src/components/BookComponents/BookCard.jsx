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
    <div className="group bg-white rounded-2xl shadow-md hover:shadow-xl overflow-hidden transition-all duration-300 flex flex-col">
      
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

        <h2 className="font-bold text-lg line-clamp-2 mb-2">
          {title}
        </h2>

        <p className="text-sm text-slate-500 mb-3">
          {authorName}
        </p>

        <div className="mb-4">
          <span className="font-semibold text-green-700">
            {price}
          </span>
        </div>

        <Link
          to={`/books/${book._id}`}
          className="mt-auto block text-center bg-black text-white py-2 rounded-xl hover:bg-slate-800 transition"
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

export default BookCard;