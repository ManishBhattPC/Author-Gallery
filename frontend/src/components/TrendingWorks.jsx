import React from "react";

const trendingWorks = [
  {
    id: 1,
    title: "The Silent Horizon",
    author: "Emma Carter",
    category: "Novel",
    image: "https://images.unsplash.com/photo-1512820790803-83ca734da794",
  },
  {
    id: 2,
    title: "Whispers of Rain",
    author: "James Wilson",
    category: "Poetry",
    image: "https://images.unsplash.com/photo-1495446815901-a7297e633e8d",
  },
  {
    id: 3,
    title: "Beyond the Stars",
    author: "Sophia Reed",
    category: "Sci-Fi",
    image: "https://images.unsplash.com/photo-1541963463532-d68292c34b19",
  },
  {
    id: 4,
    title: "Fragments of Time",
    author: "Michael Brooks",
    category: "Story",
    image: "https://images.unsplash.com/photo-1516979187457-637abb4f9353",
  },
];

const TrendingWorks = () => {
  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10 sm:mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
            Trending Works
          </h2>
          <p className="text-gray-600 mt-3 max-w-2xl mx-auto text-sm sm:text-base">
            Discover stories, poems, and books gaining attention from readers.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {trendingWorks.map((work) => (
            <div
              key={work.id}
              className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-lg transition duration-300"
            >
              <img
                src={work.image}
                alt={work.title}
                className="w-full h-56 sm:h-64 md:h-72 object-cover"
              />

              <div className="p-4 sm:p-5">
                <span className="text-xs sm:text-sm text-indigo-600 font-semibold uppercase tracking-wide">
                  {work.category}
                </span>

                <h3 className="text-lg sm:text-xl font-semibold mt-3 text-gray-900 leading-tight">
                  {work.title}
                </h3>

                <p className="text-gray-600 mt-2 text-sm sm:text-base">
                  by {work.author}
                </p>

                <button className="mt-4 inline-flex items-center text-indigo-600 font-medium hover:text-indigo-800 text-sm sm:text-base">
                  Read More →
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrendingWorks;