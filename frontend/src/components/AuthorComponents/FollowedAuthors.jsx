import React from "react";

const followedAuthors = [
  {
    id: 1,
    name: "Sarah Bennett",
    genre: "Fiction",
    image: "https://via.placeholder.com/80",
  },
  {
    id: 2,
    name: "James Carter",
    genre: "Poetry",
    image: "https://via.placeholder.com/80",
  },
  {
    id: 3,
    name: "Emma Wilson",
    genre: "Education",
    image: "https://via.placeholder.com/80",
  },
  {
    id: 4,
    name: "David Moore",
    genre: "History",
    image: "https://via.placeholder.com/80",
  },
];

const FollowedAuthors = () => {
  return (
    <section className="max-w-7xl mx-auto px-6 py-12">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-[#5c4b3d]">
          Followed Authors
        </h2>

        <button className="text-amber-700 font-medium">
          View All
        </button>
      </div>

      <div className="grid md:grid-cols-4 gap-6">
        {followedAuthors.map((author) => (
          <div
            key={author.id}
            className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-lg transition"
          >
            <img
              src={author.image}
              alt={author.name}
              className="w-16 h-16 rounded-full mx-auto object-cover"
            />

            <h3 className="text-center font-semibold mt-4">
              {author.name}
            </h3>

            <p className="text-center text-gray-500 text-sm">
              {author.genre}
            </p>

            <button className="w-full mt-4 bg-[#5c4b3d] text-white py-2 rounded-lg">
              Following
            </button>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FollowedAuthors;