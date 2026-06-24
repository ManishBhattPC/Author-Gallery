import React from "react";
import { Link } from "react-router-dom";

const AuthorCard = ({ id, image, name, genre, works }) => {
  const avatarUrl =
    image && image !== "/default-avatar.png"
      ? image
      : `https://ui-avatars.com/api/?name=${encodeURIComponent(
          name || "Author"
        )}&background=d97706&color=fff&size=256`;

  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-lg transition duration-300">
      <img
        src={avatarUrl}
        alt={name}
        className="w-full h-64 object-cover"
      />

      <div className="p-5">
        <h3 className="text-xl font-semibold text-gray-900">{name}</h3>

        <p className="text-gray-500 mt-1">{genre}</p>

        <p className="text-sm text-gray-600 mt-3">{works} Published Works</p>

        {id ? (
          <Link
            to={`/authors/${id}`}
            className="mt-4 inline-block text-[#A05A3A] font-medium hover:text-amber-700"
          >
            View Profile →
          </Link>
        ) : (
          <span className="mt-4 inline-block text-[#A05A3A] font-medium">
            View Profile →
          </span>
        )}
      </div>
    </div>
  );
};

export default AuthorCard;