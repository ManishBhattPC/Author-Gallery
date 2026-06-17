import React from "react";

const AuthorCard = ({ image, name, genre, works }) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-lg transition duration-300">
      <img
        src={image}
        alt={name}
        className="w-full h-64 object-cover"
      />

      <div className="p-5">
        <h3 className="text-xl font-semibold text-gray-900">
          {name}
        </h3>

        <p className="text-gray-500 mt-1">
          {genre}
        </p>

        <p className="text-sm text-gray-600 mt-3">
          {works} Published Works
        </p>

        <button className="mt-4 text-[#A05A3A] font-medium">
          View Profile →
        </button>
      </div>
    </div>
  );
};

export default AuthorCard;