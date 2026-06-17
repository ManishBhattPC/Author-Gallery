import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaBookOpen, FaDownload, FaStar } from "react-icons/fa";

const BookCard = ({ book = {} }) => {
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const coverUrl = book?.formats?.["image/jpeg"];
  const title = book?.title || "Untitled Book";
  const authors =
    book?.authors?.map((a) => a.name).join(", ") || "Unknown Author";
  const downloads = book?.download_count
    ? book.download_count.toLocaleString()
    : "0";
  const rating = book?.rating || Math.floor(Math.random() * 3) + 3;

  const handleImageLoad = () => {
    setIsImageLoaded(true);
  };

  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <div className="group h-full bg-white rounded-xl md:rounded-2xl shadow-md hover:shadow-2xl overflow-hidden transition-all duration-300 transform hover:-translate-y-2 cursor-pointer flex flex-col">
      
      {/* Cover Section */}
      <div className="relative w-full aspect-[3/4] md:aspect-[3/4] bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center overflow-hidden">
        
        {coverUrl && !imageError ? (
          <>
            {!isImageLoaded && (
              <div className="absolute inset-0 bg-gray-300 animate-pulse" />
            )}
            <img
              src={coverUrl}
              alt={title}
              onLoad={handleImageLoad}
              onError={handleImageError}
              className={`w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 ${
                isImageLoaded ? "opacity-100" : "opacity-0"
              }`}
            />
          </>
        ) : (
          <div className="flex flex-col items-center gap-2 text-gray-400">
            <FaBookOpen className="text-4xl md:text-6xl" />
            <span className="text-xs md:text-sm font-medium">No Cover</span>
          </div>
        )}

        {/* Overlay Badge */}
        <div className="absolute top-3 right-3 bg-black bg-opacity-70 text-white px-3 py-1 rounded-full text-xs md:text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          ⭐ {rating.toFixed(1)}
        </div>

        {/* Download Count Badge */}
        <div className="absolute bottom-3 left-3 bg-black bg-opacity-70 text-white px-3 py-1 rounded-lg text-xs md:text-sm font-medium flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <FaDownload className="text-sm" />
          <span>{downloads}</span>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-3 md:p-5 flex-1 flex flex-col">
        
        {/* Title */}
        <h2 className="font-bold text-sm md:text-lg line-clamp-2 mb-2 group-hover:text-black transition-colors duration-200">
          {title}
        </h2>

        {/* Authors */}
        <p className="text-gray-500 text-xs md:text-sm line-clamp-1 mb-3 flex-shrink-0">
          {authors}
        </p>

        {/* Stats */}
        <div className="flex items-center gap-3 text-xs md:text-sm text-gray-600 mb-3 md:mb-4 flex-shrink-0">
          <span className="flex items-center gap-1">
            <FaStar className="text-yellow-400" />
            {rating.toFixed(1)}
          </span>
          <span className="flex items-center gap-1">
            <FaDownload className="text-blue-500" />
            {downloads}
          </span>
        </div>

        {/* Button */}
        <Link
          to={`/books/${book?.id}`}
          className="mt-auto block w-full text-center bg-gradient-to-r from-black to-gray-800 text-white py-2 md:py-3 px-3 md:px-4 rounded-lg md:rounded-xl font-semibold text-xs md:text-sm hover:from-gray-800 hover:to-black transition-all duration-300 transform hover:scale-105 active:scale-95"
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

export default BookCard;











































// import React from "react";
// import { Link } from "react-router-dom";

// const BookCard = ({ book }) => {
//   const coverUrl =
//     book.formats["image/jpeg"] ||
//     "https://via.placeholder.com/300x450";

//   return (
//     <div className="bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-lg transition duration-300">
//       <img
//         src={coverUrl}
//         alt={book.title}
//         className="w-full h-80 object-cover"
//       />

//       <div className="p-5">
//         <h2 className="font-bold text-lg line-clamp-2 mb-2">
//           {book.title}
//         </h2>

//         <p className="text-gray-500 text-sm mb-2">
//           {book.authors?.map((author) => author.name).join(", ") ||
//             "Unknown Author"}
//         </p>

//         <p className="text-xs text-gray-400 mb-4">
//           {book.download_count.toLocaleString()} downloads
//         </p>

//         <Link
//           to={`/books/${book.id}`}
//           className="block w-full text-center bg-black text-white py-2 rounded-xl hover:bg-gray-800 transition"
//         >
//           View Details
//         </Link>
//       </div>
//     </div>
//   );
// };

// export default BookCard;