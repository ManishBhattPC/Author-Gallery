import React, { useEffect, useState } from "react";
import AuthorCard from "./AuthorCard";
import { fetchTopAuthors } from "../../services/authorService.js";

const FeaturedAuthors = () => {
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
        <div className="text-center mb-12">
          <p className="text-amber-700 font-semibold uppercase tracking-[0.3em] text-sm">
            Featured Authors
          </p>
          <h2 className="font-serif mt-4 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
            Discover Remarkable Writers
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm text-slate-600 sm:text-base">
            Explore talented authors, poets, storytellers, and creators sharing meaningful work with readers.
          </p>
        </div>

        {loading ? (
          <div className="rounded-3xl border border-slate-200 bg-white px-6 py-16 text-center text-slate-500 shadow-sm">
            Loading featured authors…
          </div>
        ) : error ? (
          <div className="rounded-3xl border border-rose-200 bg-rose-50 px-6 py-16 text-center text-rose-700 shadow-sm">
            {error}
          </div>
        ) : authors.length === 0 ? (
          <div className="rounded-3xl border border-slate-200 bg-white px-6 py-16 text-center text-slate-500 shadow-sm">
            No featured authors found.
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {authors.map((author) => (
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
        )}
      </div>
    </section>
  );
};

export default FeaturedAuthors;