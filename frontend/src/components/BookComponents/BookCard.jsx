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
    <div className="group flex flex-col justify-end pt-8 pb-3 select-none">
      
      {/* 3D Standing Book Container */}
      <div className="relative mx-auto w-[85%] sm:w-[88%] aspect-[3/4] z-20 transition-all duration-300 ease-out transform group-hover:-translate-y-4 group-hover:rotate-2 group-hover:scale-[1.03] origin-bottom">
        
        {/* Soft realistic drop shadow cast behind the book cover */}
        <div className="absolute inset-0 bg-black/25 blur-md rounded-r-md rounded-l-sm group-hover:blur-lg group-hover:scale-y-[1.02] group-hover:translate-x-1.5 transition-all duration-300" />
        
        {/* Actual Book Block */}
        <div className="relative w-full h-full rounded-r-md rounded-l-sm overflow-hidden bg-stone-200 shadow-[2px_4px_10px_rgba(0,0,0,0.2)]">
          {coverUrl && !imageError ? (
            <>
              {!imageLoaded && (
                <div className="absolute inset-0 animate-pulse bg-stone-300" />
              )}

              <img
                src={coverUrl}
                alt={title}
                onLoad={() => setImageLoaded(true)}
                onError={() => setImageError(true)}
                className={`w-full h-full object-cover transition duration-300 ${
                  imageLoaded ? "opacity-100" : "opacity-0"
                }`}
              />
            </>
          ) : (
            <div className="flex h-full items-center justify-center">
              <FaBookOpen className="text-6xl text-stone-400" />
            </div>
          )}

          {/* 3D Spine Crease Gradient Shading (Left edge) */}
          <div className="absolute inset-y-0 left-0 w-3.5 bg-gradient-to-r from-black/40 via-black/15 to-transparent z-20" />
          
          {/* Subtle spine edge reflection */}
          <div className="absolute inset-y-0 left-[3px] w-[1px] bg-white/20 z-20" />
          
          {/* Subtle page edges shadow (Right edge) */}
          <div className="absolute inset-y-0 right-0 w-[2px] bg-black/15 z-20" />
        </div>
      </div>

      {/* Book Metadata Plaque sitting directly on the shelf */}
      <div className="relative z-10 -mt-2 bg-stone-50/95 border border-stone-200/80 rounded-2xl p-4 shadow-[0_2px_8px_rgba(0,0,0,0.05)] text-left flex flex-col flex-1 min-h-[170px] mx-1">
        <span className="text-[10px] text-amber-800 font-bold uppercase tracking-wider mb-1.5">
          {genre}
        </span>

        <h2 className="font-serif font-bold text-sm sm:text-base text-stone-900 line-clamp-2 mb-1.5 flex-1 leading-snug">
          {title}
        </h2>

        <p className="text-xs text-stone-500 mb-2 font-medium truncate">
          {book?.author?._id ? (
            <Link to={`/authors/${book.author._id}`} className="hover:text-amber-800 hover:underline transition-colors duration-200">
              {authorName}
            </Link>
          ) : (
            authorName
          )}
        </p>

        <div className="flex items-center justify-between mt-auto pt-2 border-t border-stone-200/40">
          <span className="font-bold text-emerald-800 text-sm">
            {price}
          </span>
          <Link
            to={`/books/${book._id}`}
            className="bg-amber-800 hover:bg-amber-900 text-white px-3.5 py-1.5 rounded-xl font-bold text-[10px] tracking-wide transition duration-200 shadow-sm hover:shadow"
          >
            View Details
          </Link>
        </div>
      </div>

      {/* 3D Wooden Shelf Ledge Base */}
      <div className="w-full h-3 bg-gradient-to-b from-[#8C5E3C] via-[#704625] to-[#543015] rounded-b-lg shadow-[0_4px_6px_rgba(0,0,0,0.15)] border-t border-white/10" />
      
      {/* Soft shelf drop-shadow cast onto elements below */}
      <div className="w-full h-1 bg-black/10 blur-[1px] -mt-0.5 rounded-full mx-auto w-[98%]" />
    </div>
  );
};

export default BookCard;