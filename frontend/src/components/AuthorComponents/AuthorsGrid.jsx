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
          <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
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

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-200 pt-6">
              <span className="text-sm text-slate-500">
                Showing page <span className="font-semibold text-slate-800">{page}</span> of {totalPages}
              </span>
              <div className="flex gap-1.5 items-center">
                <button
                  onClick={() => setPage(prev => Math.max(1, prev - 1))}
                  disabled={page === 1}
                  className="p-2 border border-slate-350 bg-white rounded-xl text-slate-600 disabled:opacity-40 cursor-pointer hover:bg-slate-50 transition flex items-center justify-center shadow-sm"
                >
                  <ChevronLeft size={16} />
                </button>
                {getPageNumbers().map((pageNum) => (
                  <button
                    key={pageNum}
                    onClick={() => setPage(pageNum)}
                    className={`px-3.5 py-1.5 text-xs font-bold rounded-xl cursor-pointer transition ${
                      page === pageNum
                        ? "bg-amber-700 text-white border border-amber-700 shadow-sm shadow-amber-900/10"
                        : "border border-slate-350 bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-900 shadow-sm"
                    }`}
                  >
                    {pageNum}
                  </button>
                ))}
                <button
                  onClick={() => setPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={page === totalPages}
                  className="p-2 border border-slate-350 bg-white rounded-xl text-slate-600 disabled:opacity-40 cursor-pointer hover:bg-slate-50 transition flex items-center justify-center shadow-sm"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </section>
  );
};

export default AuthorsGrid;