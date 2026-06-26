import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import SearchBar from "../components/SearchBar";
import BookCard from "../components/BookComponents/BookCard";
import { getBooks } from "../services/bookService.js";

const Books = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const searchParam = searchParams.get("search") || "";
  const genreParam = searchParams.get("genre") || "";

  const [books, setBooks] = useState([]);
  const [search, setSearch] = useState(searchParam || genreParam || "");
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);

  const loadInitialBooks = async () => {
    setLoading(true);
    setError(null);
    setPage(1);

    try {
      const params = { page: 1, limit: 8 }; // Smaller page sizes for faster initial paints
      if (searchParam.trim()) params.search = searchParam.trim();
      if (genreParam.trim()) params.genre = genreParam.trim();

      const data = await getBooks(params);
      setBooks(data.books || []);
      setHasMore(data.currentPage < data.totalPages);
    } catch (err) {
      setError(err.message || "Unable to load books.");
    } finally {
      setLoading(false);
    }
  };

  const loadMoreBooks = async (nextPage) => {
    if (loadingMore) return;
    setLoadingMore(true);

    try {
      const params = { page: nextPage, limit: 8 };
      if (searchParam.trim()) params.search = searchParam.trim();
      if (genreParam.trim()) params.genre = genreParam.trim();

      const data = await getBooks(params);
      setBooks((prev) => [...prev, ...(data.books || [])]);
      setHasMore(data.currentPage < data.totalPages);
    } catch (err) {
      console.error("Error loading more books:", err);
    } finally {
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    loadInitialBooks();
  }, [searchParam, genreParam]);

  useEffect(() => {
    if (page > 1) {
      loadMoreBooks(page);
    }
  }, [page]);

  // Set up IntersectionObserver for automated infinite scroll
  useEffect(() => {
    if (loading || !hasMore || loadingMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setPage((prev) => prev + 1);
        }
      },
      { threshold: 0.1 }
    );

    const sentinel = document.getElementById("infinite-scroll-sentinel");
    if (sentinel) observer.observe(sentinel);

    return () => {
      if (sentinel) observer.unobserve(sentinel);
    };
  }, [loading, hasMore, loadingMore]);

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
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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

            {/* Infinite scroll sentinel & manual Load More button */}
            {books.length > 0 && hasMore && (
              <div id="infinite-scroll-sentinel" className="mt-12 flex justify-center py-4">
                <button
                  type="button"
                  onClick={() => setPage((prev) => prev + 1)}
                  disabled={loadingMore}
                  className="px-6 py-2.5 rounded-full border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 text-sm font-semibold transition cursor-pointer disabled:opacity-50 flex items-center gap-2"
                >
                  {loadingMore ? (
                    <>
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-amber-600 border-t-transparent" />
                      <span>Loading more...</span>
                    </>
                  ) : (
                    <span>Load More Books</span>
                  )}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Books;