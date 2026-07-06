import React, { useEffect, useState, useRef } from "react";
import AuthorCard from "./AuthorCard";
import { fetchAuthors } from "../../services/authorService.js";
import { ChevronLeft, ChevronRight } from "lucide-react";

const AuthorsGrid = ({ search = "" }) => {
  const [authors, setAuthors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // If search query changes, reset page to 1
  const prevSearchRef = useRef(search);
  if (prevSearchRef.current !== search) {
    prevSearchRef.current = search;
    setPage(1);
  }

  useEffect(() => {
    const loadAuthors = async () => {
      setLoading(true);
      setError(null);

      try {
        const params = { page, limit: 4 };
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

    loadAuthors();
  }, [search, page]);

  // Helper to render pagination page numbers
  const getPageNumbers = () => {
    const maxButtons = 5;
    let startPage = Math.max(1, page - 2);
    let endPage = Math.min(totalPages, startPage + maxButtons - 1);
    if (endPage - startPage < maxButtons - 1) {
      startPage = Math.max(1, endPage - maxButtons + 1);
    }
    const pageNums = [];
    for (let i = startPage; i <= endPage; i++) {
      pageNums.push(i);
    }
    return pageNums;
  };

  return (
    <section className="max-w-7xl mx-auto px-6 py-14">
      <h2 className="text-3xl font-bold text-slate-900 mb-8">All Authors</h2>

      {error ? (
        <div className="rounded-3xl border border-rose-200 bg-rose-50 px-6 py-16 text-center text-rose-700 shadow-sm">
          {error}
        </div>
      ) : (
        <div className="min-h-[400px] flex flex-col justify-between">
          <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
            {loading ? (
              [1, 2, 3, 4].map((n) => (
                <div key={n} className="animate-pulse bg-white rounded-2xl p-4 border border-slate-200/50 space-y-4 shadow-sm">
                  <div className="aspect-square w-full bg-slate-105 rounded-xl animate-pulse" />
                  <div className="space-y-2">
                    <div className="h-4 bg-slate-105 rounded w-3/4" />
                    <div className="h-3 bg-slate-105 rounded w-1/2" />
                  </div>
                </div>
              ))
            ) : authors.length === 0 ? (
              <div className="col-span-full rounded-3xl border border-slate-200 bg-white px-6 py-16 text-center text-slate-500 shadow-sm dark:bg-slate-100 dark:border-slate-200 dark:text-slate-400">
                No authors found for "{search}".
              </div>
            ) : (
              authors.map((author) => (
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
              ))
            )}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-200 pt-6">
              <span className="text-sm text-slate-500">
                Showing page <span className="font-semibold text-slate-800">{page}</span> of {totalPages}
              </span>
              <div className="flex gap-1.5 items-center">
                <button
                  onClick={() => {
                    if (!loading) {
                      setPage(prev => Math.max(1, prev - 1));
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }
                  }}
                  disabled={page === 1 || loading}
                  className="p-2 border border-slate-350 bg-white rounded-xl text-slate-600 disabled:opacity-40 cursor-pointer hover:bg-slate-50 transition flex items-center justify-center shadow-sm"
                >
                  <ChevronLeft size={16} />
                </button>
                {getPageNumbers().map((pageNum) => (
                  <button
                    key={pageNum}
                    onClick={() => {
                      if (!loading) {
                        setPage(pageNum);
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }
                    }}
                    disabled={loading}
                    className={`px-3.5 py-1.5 text-xs font-bold rounded-xl cursor-pointer transition ${
                      page === pageNum
                        ? "bg-amber-800 text-white shadow-sm shadow-amber-800/20"
                        : "border border-slate-350 bg-white text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    {pageNum}
                  </button>
                ))}
                <button
                  onClick={() => {
                    if (!loading) {
                      setPage(prev => Math.min(totalPages, prev + 1));
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }
                  }}
                  disabled={page === totalPages || loading}
                  className="p-2 border border-slate-350 bg-white rounded-xl text-slate-600 disabled:opacity-40 cursor-pointer hover:bg-slate-50 transition flex items-center justify-center shadow-sm"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </section>
  );
};

export default AuthorsGrid;