import React from "react";
import { Link } from "react-router-dom";

const AuthorCard = ({ id, image, name, genre, works, averageRating = 0, ratingCount = 0 }) => {
  const avatarUrl =
    image && image !== "/default-avatar.png"
      ? image
      : `https://ui-avatars.com/api/?name=${encodeURIComponent(
          name || "Author"
        )}&background=8C4E35&color=FAF6F0&bold=true&size=256`;

  return (
    <div className="border border-slate-200/50 dark:border-slate-300 hover:border-amber-600/35 hover:-translate-y-1 bg-white dark:bg-slate-100 rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300">
      <img
        src={avatarUrl}
        alt={name}
        className="w-full aspect-square sm:h-64 object-cover"
      />

      <div className="p-4 sm:p-5">
        <h3 className="text-base sm:text-xl font-serif font-bold text-slate-900 line-clamp-1">{name}</h3>

        <p className="text-slate-500 mt-1 sm:mt-1.5 text-[10px] sm:text-xs font-semibold uppercase tracking-wider line-clamp-1">{genre}</p>

        {/* Rating Section */}
        <div className="flex items-center gap-1.5 mt-2 select-none">
          <div className="flex text-amber-500 text-sm">
            {[...Array(5)].map((_, i) => (
              <span key={i}>{i < Math.round(averageRating) ? "★" : "☆"}</span>
            ))}
          </div>
          <span className="text-xs text-slate-505 font-bold">
            {ratingCount > 0 ? `${averageRating.toFixed(1)} (${ratingCount})` : "0.0 (0)"}
          </span>
        </div>

        <p className="text-xs sm:text-sm text-slate-600 mt-2 sm:mt-3 font-medium">{works} Published Works</p>

        {id ? (
          <Link
            to={`/authors/${id}`}
            className="mt-3 sm:mt-4 inline-block text-amber-700 font-bold hover:text-amber-900 transition-colors text-xs sm:text-sm"
          >
            View Profile →
          </Link>
        ) : (
          <span className="mt-3 sm:mt-4 inline-block text-amber-700 font-bold text-xs sm:text-sm">
            View Profile →
          </span>
        )}
      </div>
    </div>
  );
};

export default AuthorCard;