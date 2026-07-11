import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AuthorCard from "./AuthorCard";
import { fetchTopAuthors } from "../../services/authorService.js";
import { ChevronLeft, ChevronRight } from "lucide-react";

const FeaturedAuthors = ({ limit }) => {
  const [authors, setAuthors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const loadAuthors = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await fetchTopAuthors();
        if (Array.isArray(data.authors)) {
          setAuthors(data.authors);
        }
      } catch (err) {
        setError(err.message || "Unable to load authors.");
      } finally {
        setLoading(false);
      }
    };

    loadAuthors();
  }, []);

  // Reset page if screen resize changes items capacity
  const itemsPerPage = windowWidth < 640 ? 1 : (windowWidth < 1280 ? 2 : 3);
  const totalPages = Math.ceil(authors.length / itemsPerPage);

  useEffect(() => {
    if (currentPage >= totalPages && totalPages > 0) {
      setCurrentPage(totalPages - 1);
    }
  }, [totalPages, currentPage]);

  const visibleAuthors = authors.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage);

  return (
    <section className="bg-transparent py-20">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12 pb-6 border-b border-slate-200/60 text-left gap-4">
          <div>
            <p className="text-amber-700 font-semibold uppercase tracking-[0.3em] text-xs sm:text-sm">
              Featured Authors
            </p>
            <h2 className="font-serif mt-2.5 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
              Discover Remarkable Writers
            </h2>
            <p className="mt-3 max-w-2xl text-sm text-slate-600 sm:text-base font-medium">
              Explore talented authors, poets, storytellers, and creators sharing meaningful work with readers.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {totalPages > 1 && (
              <div className="flex items-center gap-1.5 bg-white border border-slate-200/80 rounded-full px-2 py-0.5 shadow-sm select-none">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
                  disabled={currentPage === 0}
                  className="p-1 text-slate-400 hover:text-amber-800 disabled:opacity-30 disabled:hover:text-slate-400 transition cursor-pointer"
                  title="Previous Page"
                >
                  <ChevronLeft size={12} />
                </button>

                {[...Array(totalPages).keys()].map((pIndex) => (
                  <button
                    key={pIndex}
                    onClick={() => setCurrentPage(pIndex)}
                    className={`px-1.5 py-0.5 text-xs font-sans font-bold transition cursor-pointer ${
                      currentPage === pIndex
                        ? "text-amber-800 font-extrabold"
                        : "text-slate-400 hover:text-amber-800"
                    }`}
                  >
                    {pIndex + 1}
                  </button>
                ))}

                <button
                  onClick={() => setCurrentPage(prev => Math.min(totalPages - 1, prev + 1))}
                  disabled={currentPage >= totalPages - 1}
                  className="p-1 text-slate-400 hover:text-amber-800 disabled:opacity-30 disabled:hover:text-slate-400 transition cursor-pointer"
                  title="Next Page"
                >
                  <ChevronRight size={12} />
                </button>
              </div>
            )}

            {limit && authors.length > limit && (
              <Link 
                to="/authors" 
                className="inline-flex items-center gap-1.5 text-amber-800 font-bold hover:text-amber-900 transition-colors text-xs sm:text-sm uppercase tracking-wider shrink-0 hover:underline"
              >
                View All Authors →
              </Link>
            )}
          </div>
        </div>

        {loading ? (
          <div className="rounded-3xl border border-slate-200 bg-white px-6 py-16 text-center text-slate-500 shadow-sm dark:bg-slate-100 dark:border-slate-200 dark:text-slate-400">
            Loading featured authors…
          </div>
        ) : error ? (
          <div className="rounded-3xl border border-rose-200 bg-rose-50 px-6 py-16 text-center text-rose-700 shadow-sm">
            {error}
          </div>
        ) : authors.length === 0 ? (
          <div className="rounded-3xl border border-slate-200 bg-white px-6 py-16 text-center text-slate-500 shadow-sm dark:bg-slate-100 dark:border-slate-200 dark:text-slate-400">
            No featured authors found.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {visibleAuthors.map((author) => (
              <AuthorCard
                key={author._id || author.id}
                id={author._id || author.id}
                image={author.profileImage || author.image || "/default-avatar.png"}
                name={author.name}
                genre={
                  Array.isArray(author.genres) && author.genres.length > 0
                    ? author.genres.join(", ")
                    : (author.role || author.genre || "Author")
                }
                works={author.works ?? 0}
                averageRating={author.averageRating}
                ratingCount={author.ratingCount}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedAuthors;