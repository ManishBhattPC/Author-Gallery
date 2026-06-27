import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { FaBookOpen } from "react-icons/fa";
import gsap from "gsap";

const BookCard = ({ book }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const cardRef = useRef(null);

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    const handleMouseMove = (e) => {
      const { left, top, width, height } = card.getBoundingClientRect();
      const x = e.clientX - left - width / 2;
      const y = e.clientY - top - height / 2;
      
      const rotateX = -(y / (height / 2)) * 6; // Max 6 degrees tilt
      const rotateY = (x / (width / 2)) * 6;

      gsap.to(card, {
        rotateX,
        rotateY,
        transformPerspective: 800,
        z: 6,
        boxShadow: "0 20px 30px -10px rgba(0,0,0,0.18), 0 10px 15px -3px rgba(140,78,53,0.06)",
        borderColor: "rgba(140,78,53,0.2)",
        duration: 0.45,
        ease: "power2.out"
      });
    };

    const handleMouseLeave = () => {
      gsap.to(card, {
        rotateX: 0,
        rotateY: 0,
        z: 0,
        boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)",
        borderColor: "rgba(226, 232, 240, 0.5)",
        duration: 0.6,
        ease: "power3.out"
      });
    };

    card.addEventListener("mousemove", handleMouseMove);
    card.addEventListener("mouseleave", handleMouseLeave);
    return () => {
      card.removeEventListener("mousemove", handleMouseMove);
      card.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

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
      ref={cardRef}
      style={{ transformStyle: "preserve-3d" }}
      className="group border border-slate-200/50 bg-white rounded-2xl shadow-md overflow-hidden flex flex-col"
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