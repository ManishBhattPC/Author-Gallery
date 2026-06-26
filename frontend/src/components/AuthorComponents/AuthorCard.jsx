import React from "react";
import { Link } from "react-router-dom";

const AuthorCard = ({ id, image, name, genre, works }) => {
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
        className="w-full h-64 object-cover"
      />

      <div className="p-5">
        <h3 className="text-xl font-serif font-bold text-slate-900">{name}</h3>

        <p className="text-slate-500 mt-1.5 text-xs font-semibold uppercase tracking-wider">{genre}</p>

        <p className="text-sm text-slate-600 mt-3 font-medium">{works} Published Works</p>

        {id ? (
          <Link
            to={`/authors/${id}`}
            className="mt-4 inline-block text-amber-700 font-bold hover:text-amber-900 transition-colors text-sm"
          >
            View Profile →
          </Link>
        ) : (
          <span className="mt-4 inline-block text-amber-700 font-bold text-sm">
            View Profile →
          </span>
        )}
      </div>
    </div>
  );
};

export default AuthorCard;