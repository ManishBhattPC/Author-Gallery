import React, { useEffect, useState, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import SearchBar from "../components/SearchBar";
import BookCard from "../components/BookComponents/BookCard";
import { getBooks } from "../services/bookService.js";
import { ChevronLeft, ChevronRight } from "lucide-react";

const Books = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const searchParam = searchParams.get("search") || "";
  const genreParam = searchParams.get("genre") || "";

  const [books, setBooks] = useState([]);
  const [search, setSearch] = useState(searchParam || genreParam || "");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // If search query parameters change, reset page to 1 immediately
  const prevParamsRef = useRef({ searchParam, genreParam });
  if (
    prevParamsRef.current.searchParam !== searchParam ||
    prevParamsRef.current.genreParam !== genreParam
  ) {
    prevParamsRef.current = { searchParam, genreParam };
    setPage(1);
  }

  useEffect(() => {
    const loadBooksData = async () => {
      setLoading(true);
      setError(null);

      try {
        const params = { page, limit: 8 };
        if (searchParam.trim()) params.search = searchParam.trim();
        if (genreParam.trim()) params.genre = genreParam.trim();

        const data = await getBooks(params);
        setBooks(data.books || []);
        setTotalPages(data.totalPages || 1);
      } catch (err) {
        setError(err.message || "Unable to load books.");
      } finally {
        setLoading(false);
      }
    };

    loadBooksData();
  }, [searchParam, genreParam, page]);

  useEffect(() => {
    setSearch(searchParam || genreParam || "");
  }, [searchParam, genreParam]);

  useEffect(() => {
    if (search === "") {
      setSearchParams({});
    }
  }, [search, setSearchParams]);

  const onSubmit = (e) => {
    e.preventDefault();
    if (search.trim()) {
      setSearchParams({ search: search.trim() });
    } else {
      setSearchParams({});
    }
  };

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
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="space-y-4 text-center">
          <h1 className="font-serif text-4xl font-semibold text-slate-900">
            Explore Books
          </h1>

          <p className="mx-auto max-w-2xl text-slate-600">
            Discover books published by authors on Author Gallery.
          </p>
        </div>

        <div className="mt-10">
          <SearchBar
            search={search}
            setSearch={setSearch}
            onSearch={onSubmit}
            placeholder="Search books.."
          />
        </div>

        {loading ? (
          <div className="mt-16 text-center text-slate-500">
            Loading books...
          </div>
        ) : error ? (
          <div className="mt-16 text-center text-red-600">
            {error}
          </div>
        ) : (
          <>
            <div className="mt-10 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4">
              {books.length > 0 ? (
                books.map((book) => (
                  <BookCard
                    key={book._id}
                    book={book}
                  />
                ))
              ) : (
                <div className="col-span-full text-center text-slate-500">
                  No books found.
                </div>
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
      </div>
    </div>
  );
};

export default Books;