import React, { useEffect, useState } from "react";
import AuthorCard from "./AuthorCard";
import { fetchAuthors } from "../../services/authorService.js";

const AuthorsGrid = ({ search = "" }) => {
  const [authors, setAuthors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Initial load when search changes
  useEffect(() => {
    const loadInitialAuthors = async () => {
      setLoading(true);
      setError(null);
      setPage(1);

      try {
        const params = { page: 1, limit: 8 };
        if (search.trim()) params.search = search.trim();

        const data = await fetchAuthors(params);
        setAuthors(data.authors || []);
        setTotalPages(data.totalPages || 1);
      } catch (err) {
        setError(err.message || "Unable to load authors.");
      } finally {
        setLoading(false);
      }
    };

    loadInitialAuthors();
  }, [search]);

  // Load next page
  const loadMoreAuthors = async () => {
    if (loadingMore || page >= totalPages) return;
    setLoadingMore(true);
    const nextPage = page + 1;

    try {
      const params = { page: nextPage, limit: 8 };
      if (search.trim()) params.search = search.trim();

      const data = await fetchAuthors(params);
      setAuthors((prev) => [...prev, ...(data.authors || [])]);
      setPage(nextPage);
      setTotalPages(data.totalPages || 1);
    } catch (err) {
      console.error("Error loading more authors:", err);
    } finally {
      setLoadingMore(false);
    }
  };

  return (
    <section className="max-w-7xl mx-auto px-6 py-14">
      <h2 className="text-3xl font-bold text-slate-900 mb-8">All Authors</h2>

      {loading ? (
        <div className="rounded-3xl border border-slate-200 bg-white px-6 py-16 text-center text-slate-500 shadow-sm dark:bg-slate-100 dark:border-slate-200 dark:text-slate-400">
          Loading authors…
        </div>
      ) : error ? (
        <div className="rounded-3xl border border-rose-200 bg-rose-50 px-6 py-16 text-center text-rose-700 shadow-sm">
          {error}
        </div>
      ) : authors.length === 0 ? (
        <div className="rounded-3xl border border-slate-200 bg-white px-6 py-16 text-center text-slate-500 shadow-sm dark:bg-slate-100 dark:border-slate-200 dark:text-slate-400">
          No authors found for "{search}".
        </div>
      ) : (
        <>
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

          {/* Load More Button */}
          {authors.length > 0 && page < totalPages && (
            <div className="mt-12 flex justify-center py-4">
              <button
                type="button"
                onClick={loadMoreAuthors}
                disabled={loadingMore}
                className="px-6 py-2.5 rounded-full border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 text-sm font-semibold transition cursor-pointer disabled:opacity-50 flex items-center gap-2"
              >
                {loadingMore ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-amber-600 border-t-transparent" />
                    <span>Loading more...</span>
                  </>
                ) : (
                  <span>Load More Authors</span>
                )}
              </button>
            </div>
          )}
        </>
      )}
    </section>
  );
};

export default AuthorsGrid;