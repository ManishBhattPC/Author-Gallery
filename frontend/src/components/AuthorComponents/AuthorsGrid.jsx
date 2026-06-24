import React, { useEffect, useState } from "react";
import AuthorCard from "./AuthorCard";
import { fetchAuthors } from "../../services/authorService.js";

const AuthorsGrid = ({ search = "" }) => {
  const [authors, setAuthors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadAuthors = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await fetchAuthors(search);
        const list = Array.isArray(data.authors) ? data.authors : [];
        setAuthors(list);
      } catch (err) {
        setError(err.message || "Unable to load authors.");
      } finally {
        setLoading(false);
      }
    };

    loadAuthors();
  }, [search]);

  return (
    <section className="max-w-7xl mx-auto px-6 py-14">
      <h2 className="text-3xl font-bold mb-8">All Authors</h2>

      {loading ? (
        <div className="rounded-3xl border border-slate-200 bg-white px-6 py-16 text-center text-slate-500 shadow-sm">
          Loading authors…
        </div>
      ) : error ? (
        <div className="rounded-3xl border border-rose-200 bg-rose-50 px-6 py-16 text-center text-rose-700 shadow-sm">
          {error}
        </div>
      ) : authors.length === 0 ? (
        <div className="rounded-3xl border border-slate-200 bg-white px-6 py-16 text-center text-slate-500 shadow-sm">
          No authors found for "{search}".
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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
    </section>
  );
};

export default AuthorsGrid;