import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Search, BookOpen, User, Tag } from "lucide-react";
import { getBooks } from "../services/bookService.js";
import { fetchAuthors } from "../services/authorService.js";

const CATEGORIES = [
  "Education",
  "Literature",
  "Fiction",
  "Poetry",
  "Shayari",
  "Romance",
  "Science",
  "Technology",
  "Thriller",
  "Mystery",
  "Fantasy",
  "Science Fiction",
  "Biography",
  "History",
  "Spiritual",
  "Self-Help",
  "Business",
  "Children"
];

const SearchBar = ({ search = "", setSearch, onSearch, placeholder = "Search books, authors, or topics..." }) => {
  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  
  const [debouncedSearch, setDebouncedSearch] = useState(search);
  const [suggestions, setSuggestions] = useState({ books: [], authors: [], categories: [] });
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(false);

  // Debounce the input search term
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 250);

    return () => clearTimeout(handler);
  }, [search]);

  // Fetch search suggestions
  useEffect(() => {
    if (!debouncedSearch || debouncedSearch.trim().length < 2) {
      setSuggestions({ books: [], authors: [], categories: [] });
      return;
    }

    const query = debouncedSearch.trim();
    let isMounted = true;

    const getSuggestions = async () => {
      setLoading(true);
      try {
        const [booksRes, authorsRes] = await Promise.all([
          getBooks({ search: query, limit: 5 }),
          fetchAuthors(query)
        ]);

        if (!isMounted) return;

        const books = Array.isArray(booksRes?.books) ? booksRes.books : [];
        const authors = Array.isArray(authorsRes?.authors) ? authorsRes.authors : [];

        // Match categories locally
        const categories = CATEGORIES.filter(cat =>
          cat.toLowerCase().includes(query.toLowerCase())
        );

        setSuggestions({ books, authors, categories });
      } catch (err) {
        console.error("Suggestions fetch error:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    getSuggestions();

    return () => {
      isMounted = false;
    };
  }, [debouncedSearch]);

  // Handle clicking outside the dropdown to close it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSuggestionClick = (path) => {
    setShowDropdown(false);
    setSearch?.(""); // clear search bar on click
    navigate(path);
  };

  const hasSuggestions = 
    suggestions.books.length > 0 || 
    suggestions.authors.length > 0 || 
    suggestions.categories.length > 0;

  return (
    <div className="relative w-full max-w-3xl mx-auto" ref={dropdownRef}>
      <form onSubmit={(e) => {
        onSearch?.(e);
        setShowDropdown(false);
      }} className="relative">
        <Search
          className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
          size={20}
        />

        <input
          type="text"
          value={search}
          name="search"
          onChange={(e) => {
            setSearch?.(e.target.value);
            setShowDropdown(true);
          }}
          onFocus={() => setShowDropdown(true)}
          placeholder={placeholder}
          className="w-full rounded-full border border-slate-300 bg-white px-4 pl-12 py-4 text-sm text-slate-900 shadow-sm outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-100 dark:border-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:focus:border-amber-400 dark:focus:ring-amber-950/30"
        />
        
        {loading && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center justify-center">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-amber-600 border-t-transparent" />
          </div>
        )}
      </form>

      {/* Autocomplete Suggestions Overlay */}
      {showDropdown && hasSuggestions && (
        <div className="absolute left-0 right-0 mt-2 bg-white border border-slate-200/80 rounded-3xl shadow-xl z-50 max-h-96 overflow-y-auto p-4 space-y-4 text-left dark:bg-slate-100 dark:border-slate-800">
          
          {/* Categories / Genres */}
          {suggestions.categories.length > 0 && (
            <div>
              <h4 className="text-[10px] font-bold text-amber-700 dark:text-amber-500 uppercase tracking-widest mb-1.5 px-3">
                Categories
              </h4>
              <div className="space-y-0.5">
                {suggestions.categories.slice(0, 3).map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => handleSuggestionClick(`/books?genre=${encodeURIComponent(cat)}`)}
                    className="w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-slate-100 hover:text-amber-800 rounded-xl transition duration-150 flex items-center gap-2 cursor-pointer"
                  >
                    <Tag size={14} className="text-slate-400 dark:text-slate-500" />
                    <span>{cat}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Books */}
          {suggestions.books.length > 0 && (
            <div>
              <h4 className="text-[10px] font-bold text-amber-700 dark:text-amber-500 uppercase tracking-widest mb-1.5 px-3">
                Books
              </h4>
              <div className="space-y-0.5">
                {suggestions.books.map((book) => (
                  <button
                    key={book._id}
                    type="button"
                    onClick={() => handleSuggestionClick(`/books/${book._id}`)}
                    className="w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-slate-100 hover:text-amber-800 rounded-xl transition duration-150 flex items-center justify-between cursor-pointer"
                  >
                    <div className="flex items-center gap-2 max-w-[70%]">
                      <BookOpen size={14} className="text-slate-400 dark:text-slate-500 shrink-0" />
                      <span className="font-medium truncate">{book.title}</span>
                    </div>
                    <span className="text-xs text-slate-400 dark:text-slate-500 truncate max-w-[25%]">
                      by {book.author?.name || "Author"}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Authors */}
          {suggestions.authors.length > 0 && (
            <div>
              <h4 className="text-[10px] font-bold text-amber-700 dark:text-amber-500 uppercase tracking-widest mb-1.5 px-3">
                Authors
              </h4>
              <div className="space-y-0.5">
                {suggestions.authors.map((author) => (
                  <button
                    key={author._id}
                    type="button"
                    onClick={() => handleSuggestionClick(`/authors/${author._id}`)}
                    className="w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-slate-100 hover:text-amber-800 rounded-xl transition duration-150 flex items-center gap-2 cursor-pointer"
                  >
                    <User size={14} className="text-slate-400 dark:text-slate-500" />
                    <span className="font-medium">{author.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;