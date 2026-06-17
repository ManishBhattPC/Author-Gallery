import React from "react";
import { Link } from "react-router-dom";

const BookCard = ({ book }) => {
  const coverUrl =
    book.formats["image/jpeg"] ||
    "https://via.placeholder.com/300x450";

  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-lg transition duration-300">
      <img
        src={coverUrl}
        alt={book.title}
        className="w-full h-80 object-cover"
      />

      <div className="p-5">
        <h2 className="font-bold text-lg line-clamp-2 mb-2">
          {book.title}
        </h2>

        <p className="text-gray-500 text-sm mb-2">
          {book.authors?.map((author) => author.name).join(", ") ||
            "Unknown Author"}
        </p>

        <p className="text-xs text-gray-400 mb-4">
          {book.download_count.toLocaleString()} downloads
        </p>

        <Link
          to={`/books/${book.id}`}
          className="block w-full text-center bg-black text-white py-2 rounded-xl hover:bg-gray-800 transition"
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

export default BookCard;