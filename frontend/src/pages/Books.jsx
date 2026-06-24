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
  const [error, setError] = useState(null);

  const loadBooks = async () => {
    setLoading(true);
    setError(null);

    try {
      const params = {};
      if (searchParam.trim()) params.search = searchParam.trim();
      if (genreParam.trim()) params.genre = genreParam.trim();

      const data = await getBooks(params);
      setBooks(data.books || []);
    } catch (err) {
      setError(err.message || "Unable to load books.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBooks();
  }, [searchParam, genreParam]);

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
          <div className="mt-16 text-center">
            Loading books...
          </div>
        ) : error ? (
          <div className="mt-16 text-center text-red-600">
            {error}
          </div>
        ) : (
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
        )}
      </div>
    </div>
  );
};

export default Books;