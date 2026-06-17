import React from "react";

const recentAuthors = [
  {
    id: 1,
    name: "Michael Scott",
    category: "Fiction",
    image: "https://via.placeholder.com/60",
  },
  {
    id: 2,
    name: "Sophia Miller",
    category: "Poetry",
    image: "https://via.placeholder.com/60",
  },
  {
    id: 3,
    name: "Robert Brown",
    category: "Education",
    image: "https://via.placeholder.com/60",
  },
  {
    id: 4,
    name: "Olivia Davis",
    category: "History",
    image: "https://via.placeholder.com/60",
  },
];

const RecentlyExploredAuthors = () => {
  return (
    <section className="max-w-7xl mx-auto px-6 py-12">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-[#5c4b3d]">
          Recently Explored Authors
        </h2>

        <button className="text-amber-700 font-medium">
          View All
        </button>
      </div>

      <div className="grid md:grid-cols-4 gap-6">
        {recentAuthors.map((author) => (
          <div
            key={author.id}
            className="bg-white rounded-xl p-4 shadow-sm flex items-center gap-4 hover:shadow-md transition"
          >
            <img
              src={author.image}
              alt={author.name}
              className="w-12 h-12 rounded-full object-cover"
            />

            <div>
              <h3 className="font-semibold">
                {author.name}
              </h3>

              <p className="text-sm text-gray-500">
                {author.category}
              </p>

              <p className="text-xs text-gray-400">
                Last viewed
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default RecentlyExploredAuthors;
