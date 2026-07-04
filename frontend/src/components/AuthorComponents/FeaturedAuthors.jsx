import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AuthorCard from "./AuthorCard";
import { fetchTopAuthors } from "../../services/authorService.js";

const FeaturedAuthors = ({ limit }) => {
  const [authors, setAuthors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
          {limit && authors.length > limit && (
            <Link 
              to="/authors" 
              className="inline-flex items-center gap-1.5 text-amber-800 font-bold hover:text-amber-900 transition-colors text-xs sm:text-sm uppercase tracking-wider shrink-0 hover:underline"
            >
              View All Authors →
            </Link>
          )}
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
          <>
            <div className="grid grid-cols-2 gap-4 sm:gap-6 xl:grid-cols-3">
              {(limit ? authors.slice(0, limit) : authors).map((author) => (
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
                />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default FeaturedAuthors;