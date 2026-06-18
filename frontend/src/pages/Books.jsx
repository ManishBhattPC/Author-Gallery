import React, { useEffect, useState } from "react"
import SearchBar from "../components/SearchBar"
import BookCard from "../components/BookComponents/BookCard"
import { searchBooks } from "../services/bookService.js"


const Books = () => {
  const [books, setBooks] = useState([]);
  const [search, setSearch] = useState("fiction")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const handleSearch = async (query) => {
    setError(null)
    setLoading(true)

    try {
      const data = await searchBooks(query);
      setBooks(data.results || []);
    } catch (err) {
      setError(err.message || "Unable to load books.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    handleSearch(search);
  }, []);

  const onSubmit = (e) => {
    e.preventDefault();
    if (!search.trim()) return;
    handleSearch(search);
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="space-y-4 text-center sm:space-y-6">
          <h1 className="text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl">
            Explore Books
          </h1>
          <p className="mx-auto max-w-2xl text-sm text-slate-600 sm:text-base">
            Discover feature-rich books, stories, and original works powered by your backend.
          </p>
        </div>

        <div className="mt-10">
          <SearchBar
            search={search}
            setSearch={setSearch}
            onSearch={onSubmit}
            placeholder="Search books, authors, or genres..."
          />
        </div>

        {loading ? (
          <div className="mt-16 rounded-3xl border border-slate-200 bg-white px-6 py-14 text-center text-slate-500 shadow-sm">
            Loading books...
          </div>
        ) : error ? (
          <div className="mt-16 rounded-3xl border border-rose-200 bg-rose-50 px-6 py-14 text-center text-rose-700 shadow-sm">
            {error}
          </div>
        ) : (
          <div className="mt-10 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
            {books.length > 0 ? (
              books.map((book) => <BookCard key={book.id} book={book} />)
            ) : (
              <div className="col-span-full rounded-3xl border border-slate-200 bg-white px-6 py-14 text-center text-slate-500 shadow-sm">
                No books found for "{search}".
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default Books

