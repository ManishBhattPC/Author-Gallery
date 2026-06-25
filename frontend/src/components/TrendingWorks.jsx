import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getBooks } from "../services/bookService.js";

const TrendingWorks = () => {
  const [trendingWorks, setTrendingWorks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTrendingWorks = async () => {
      try {
        setLoading(true);
        const data = await getBooks({ limit: 4 });
        setTrendingWorks(Array.isArray(data.books) ? data.books : data);
        setError(null);
      } catch (err) {
        console.error("Error fetching trending works:", err);
        setError("Failed to load trending works");
        setTrendingWorks([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTrendingWorks();
  }, []);

  if (loading) {
    return (
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-transparent">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10 sm:mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
              Trending Works
            </h2>
            <p className="text-gray-600 mt-3 max-w-2xl mx-auto text-sm sm:text-base">
              Loading stories, poems, and books...
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="bg-white rounded-3xl overflow-hidden shadow-sm animate-pulse"
              >
                <div className="w-full h-56 sm:h-64 md:h-72 bg-gray-200" />
                <div className="p-4 sm:p-5">
                  <div className="h-4 bg-gray-200 rounded w-16" />
                  <div className="h-6 bg-gray-200 rounded mt-3 w-3/4" />
                  <div className="h-4 bg-gray-200 rounded mt-2 w-1/2" />
                  <div className="h-4 bg-gray-200 rounded mt-4 w-20" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8 bg-transparent">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10 sm:mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
            Trending Works
          </h2>
          <p className="text-gray-600 mt-3 max-w-2xl mx-auto text-sm sm:text-base">
            Discover stories, poems, and books gaining attention from readers.
          </p>
        </div>

        {error ? (
          <div className="text-center py-8">
            <p className="text-red-600 font-medium">{error}</p>
          </div>
        ) : trendingWorks.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-600">No trending works available.</p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {trendingWorks.map((work) => (
              <div
                key={work._id || work.id}
                className="border border-slate-200/50 hover:border-amber-600/35 hover:-translate-y-1 bg-white rounded-3xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <Link to={`/books/${work._id || work.id}`}>
                    <img
                      src={work.coverImage || work.image}
                      alt={work.title}
                      className="w-full h-56 sm:h-64 md:h-72 object-cover hover:opacity-95 transition duration-200"
                      onError={(e) => {
                        e.currentTarget.src = "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=500&auto=format&fit=crop&q=60";
                        e.currentTarget.onerror = null;
                      }}
                    />
                  </Link>

                  <div className="p-4 sm:p-5">
                    <span className="text-[10px] sm:text-xs text-amber-700 dark:text-amber-500 font-bold uppercase tracking-widest">
                      {work.category || work.genre || "Book"}
                    </span>

                    <h3 className="text-base sm:text-lg font-serif font-bold mt-2.5 text-slate-900 leading-tight line-clamp-2">
                      {work.title}
                    </h3>

                    <p className="text-slate-500 dark:text-slate-400 mt-1.5 text-xs sm:text-sm">
                      by{" "}
                      {work.author?._id ? (
                        <Link to={`/authors/${work.author._id}`} className="text-slate-700 dark:text-slate-350 hover:text-amber-800 dark:hover:text-amber-450 hover:underline font-semibold">
                          {work.author.name}
                        </Link>
                      ) : (
                        work.author?.name || work.author || "Unknown"
                      )}
                    </p>
                  </div>
                </div>

                <div className="px-4 sm:px-5 pb-4 sm:pb-5">
                  <Link
                    to={`/books/${work._id || work.id}`}
                    className="inline-flex items-center text-amber-700 dark:text-amber-500 font-bold hover:text-amber-900 dark:hover:text-amber-450 transition-colors text-xs sm:text-sm"
                  >
                    Read More →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default TrendingWorks;