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
  const isBrowseMode = !searchParam && !genreParam;

  const [books, setBooks] = useState([]);
  const [search, setSearch] = useState(searchParam || genreParam || "");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [shelfPages, setShelfPages] = useState({});

  // If search query parameters change, reset page to 1 immediately
  const prevParamsRef = useRef({ searchParam, genreParam });
  if (
    prevParamsRef.current.searchParam !== searchParam ||
    prevParamsRef.current.genreParam !== genreParam
  ) {
    prevParamsRef.current = { searchParam, genreParam };
    setPage(1);
  }

  const limit = window.innerWidth < 640 ? 4 : 8;

  useEffect(() => {
    const loadBooksData = async () => {
      setLoading(true);
      setError(null);

      try {
        const params = isBrowseMode 
          ? { page: 1, limit: 80 }
          : { page, limit };
          
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
  }, [searchParam, genreParam, page, isBrowseMode]);

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

        {error ? (
          <div className="mt-16 text-center text-red-650 font-medium">
            {error}
          </div>
        ) : (
          <div className="min-h-[450px] flex flex-col justify-between">
            {isBrowseMode ? (
              /* Library Browse Mode (Shelves Grouping) */
              <div className="space-y-12 mt-10">
                {loading ? (
                  [1, 2, 3].map((sIndex) => (
                    <div key={sIndex} className="space-y-4 text-left">
                      <div className="h-7 bg-slate-200 animate-pulse rounded w-48 mb-6"></div>
                      <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
                        {[1, 2, 3, 4].map((n) => (
                          <div key={n} className="flex flex-col justify-end pt-8 pb-3 animate-pulse">
                            <div className="mx-auto w-[85%] sm:w-[88%] aspect-[3/4] bg-stone-200 rounded-r-md rounded-l-sm shadow-sm" />
                            <div className="bg-stone-50/95 border border-stone-200/80 rounded-2xl p-4 flex flex-col min-h-[170px] mt-2 mx-1 space-y-3">
                              <div className="h-3 bg-stone-200 rounded w-1/4" />
                              <div className="h-5 bg-stone-200 rounded w-3/4" />
                              <div className="h-3.5 bg-stone-200 rounded w-1/2" />
                              <div className="h-8 bg-stone-200 rounded-xl w-full mt-auto" />
                            </div>
                            <div className="w-full h-3 bg-gradient-to-b from-stone-300 via-stone-400 to-stone-500 rounded-b-lg border-t border-stone-200/20" />
                          </div>
                        ))}
                      </div>
                    </div>
                  ))
                ) : (
                  <>
                    {[
                      { title: "Novel Shelf", genres: ["Novel"] },
                      { title: "Fiction Shelf", genres: ["Fiction"] },
                      { title: "Romance Shelf", genres: ["Romance"] },
                      { title: "Thriller & Mystery Shelf", genres: ["Thriller", "Mystery"] },
                      { title: "Poetry & Shayari Shelf", genres: ["Poetry", "Shayari"] }
                    ].map((shelf) => {
                      const shelfBooks = books.filter(book => 
                        book.genres && book.genres.some(g => shelf.genres.includes(g))
                      );

                      if (shelfBooks.length === 0) return null;

                      const shelfItemsCapacity = window.innerWidth < 640 ? 2 : 4;
                      const totalShelfPages = Math.ceil(shelfBooks.length / shelfItemsCapacity);
                      const shelfPage = shelfPages[shelf.title] || 0;
                      const visibleBooks = shelfBooks.slice(shelfPage * shelfItemsCapacity, (shelfPage + 1) * shelfItemsCapacity);

                      return (
                        <div key={shelf.title} className="space-y-4 text-left relative">
                          <h3 className="font-serif text-2xl font-bold text-slate-800 border-b border-slate-200/80 pb-2 flex items-center justify-between">
                            <span>{shelf.title}</span>
                            <div className="flex items-center gap-2">
                              {/* Direct Page Selectors (1 to N) inside Header */}
                              {totalShelfPages > 1 && (
                                <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-full px-2 py-0.5 shadow-sm mr-2 select-none">
                                  <button
                                    onClick={() => {
                                      setShelfPages(prev => ({
                                        ...prev,
                                        [shelf.title]: Math.max(0, shelfPage - 1)
                                      }));
                                    }}
                                    disabled={shelfPage === 0}
                                    className="p-1 text-slate-400 hover:text-amber-800 disabled:opacity-30 disabled:hover:text-slate-400 transition cursor-pointer"
                                    title="Previous Page"
                                  >
                                    <ChevronLeft size={12} />
                                  </button>

                                  {[...Array(totalShelfPages).keys()].map((pIndex) => (
                                    <button
                                      key={pIndex}
                                      onClick={() => {
                                        setShelfPages(prev => ({
                                          ...prev,
                                          [shelf.title]: pIndex
                                        }));
                                      }}
                                      className={`w-5 h-5 flex items-center justify-center text-[10px] font-bold rounded-full transition cursor-pointer ${
                                        shelfPage === pIndex
                                          ? "bg-amber-800 text-white"
                                          : "text-slate-500 hover:bg-slate-100"
                                      }`}
                                    >
                                      {pIndex + 1}
                                    </button>
                                  ))}

                                  <button
                                    onClick={() => {
                                      setShelfPages(prev => ({
                                        ...prev,
                                        [shelf.title]: Math.min(totalShelfPages - 1, shelfPage + 1)
                                      }));
                                    }}
                                    disabled={(shelfPage + 1) >= totalShelfPages}
                                    className="p-1 text-slate-400 hover:text-amber-800 disabled:opacity-30 disabled:hover:text-slate-400 transition cursor-pointer"
                                    title="Next Page"
                                  >
                                    <ChevronRight size={12} />
                                  </button>
                                </div>
                              )}
                              <span className="text-[10px] font-bold text-amber-800 bg-amber-50 border border-amber-250/20 px-3 py-1 rounded-full uppercase tracking-wider">
                                {shelfBooks.length} Total
                              </span>
                            </div>
                          </h3>
                          
                          <div className="relative">
                            <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4 w-full">
                              {visibleBooks.map((book) => (
                                <BookCard key={book._id} book={book} />
                              ))}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                    
                    {/* General / Other Books Shelf */}
                    {(() => {
                      const generalBooks = books.filter(book => 
                        !book.genres || !book.genres.some(g => ["Novel", "Fiction", "Romance", "Thriller", "Mystery", "Poetry", "Shayari"].includes(g))
                      );

                      if (generalBooks.length === 0) return null;

                      const shelfItemsCapacity = window.innerWidth < 640 ? 2 : 4;
                      const totalShelfPages = Math.ceil(generalBooks.length / shelfItemsCapacity);
                      const shelfPage = shelfPages["General Shelf"] || 0;
                      const visibleBooks = generalBooks.slice(shelfPage * shelfItemsCapacity, (shelfPage + 1) * shelfItemsCapacity);

                      return (
                        <div className="space-y-4 text-left relative">
                          <h3 className="font-serif text-2xl font-bold text-slate-800 border-b border-slate-200/80 pb-2 flex items-center justify-between">
                            <span>General Shelf</span>
                            <div className="flex items-center gap-2">
                              {/* Direct Page Selectors (1 to N) inside Header */}
                              {totalShelfPages > 1 && (
                                <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-full px-2 py-0.5 shadow-sm mr-2 select-none">
                                  <button
                                    onClick={() => {
                                      setShelfPages(prev => ({
                                        ...prev,
                                        "General Shelf": Math.max(0, shelfPage - 1)
                                      }));
                                    }}
                                    disabled={shelfPage === 0}
                                    className="p-1 text-slate-400 hover:text-amber-800 disabled:opacity-30 disabled:hover:text-slate-400 transition cursor-pointer"
                                    title="Previous Page"
                                  >
                                    <ChevronLeft size={12} />
                                  </button>

                                  {[...Array(totalShelfPages).keys()].map((pIndex) => (
                                    <button
                                      key={pIndex}
                                      onClick={() => {
                                        setShelfPages(prev => ({
                                          ...prev,
                                          "General Shelf": pIndex
                                        }));
                                      }}
                                      className={`w-5 h-5 flex items-center justify-center text-[10px] font-bold rounded-full transition cursor-pointer ${
                                        shelfPage === pIndex
                                          ? "bg-amber-800 text-white"
                                          : "text-slate-500 hover:bg-slate-100"
                                      }`}
                                    >
                                      {pIndex + 1}
                                    </button>
                                  ))}

                                  <button
                                    onClick={() => {
                                      setShelfPages(prev => ({
                                        ...prev,
                                        "General Shelf": Math.min(totalShelfPages - 1, shelfPage + 1)
                                      }));
                                    }}
                                    disabled={(shelfPage + 1) >= totalShelfPages}
                                    className="p-1 text-slate-400 hover:text-amber-800 disabled:opacity-30 disabled:hover:text-slate-400 transition cursor-pointer"
                                    title="Next Page"
                                  >
                                    <ChevronRight size={12} />
                                  </button>
                                </div>
                              )}
                              <span className="text-[10px] font-bold text-amber-800 bg-amber-50 border border-amber-250/20 px-3 py-1 rounded-full uppercase tracking-wider">
                                {generalBooks.length} Total
                              </span>
                            </div>
                          </h3>
                          
                          <div className="relative">
                            <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4 w-full">
                              {visibleBooks.map((book) => (
                                <BookCard key={book._id} book={book} />
                              ))}
                            </div>
                          </div>
                        </div>
                      );
                    })()}
                  </>
                )}
              </div>
            ) : (
              /* Search/Filter Grid Results Mode */
              <>
                <div key={`${page}-${loading}`} className="mt-10 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4 animate-fade-in text-left">
                  {loading ? (
                    [...Array(limit).keys()].map((n) => (
                      <div key={n} className="flex flex-col justify-end pt-8 pb-3 animate-pulse">
                        <div className="mx-auto w-[85%] sm:w-[88%] aspect-[3/4] bg-stone-200 rounded-r-md rounded-l-sm shadow-sm" />
                        <div className="bg-stone-50/95 border border-stone-200/80 rounded-2xl p-4 flex flex-col min-h-[170px] mt-2 mx-1 space-y-3">
                          <div className="h-3 bg-stone-200 rounded w-1/4" />
                          <div className="h-5 bg-stone-200 rounded w-3/4" />
                          <div className="h-3.5 bg-stone-200 rounded w-1/2" />
                          <div className="h-8 bg-stone-200 rounded-xl w-full mt-auto" />
                        </div>
                        <div className="w-full h-3 bg-gradient-to-b from-stone-300 via-stone-400 to-stone-500 rounded-b-lg border-t border-stone-200/20" />
                      </div>
                    ))
                  ) : books.length > 0 ? (
                    books.map((book) => (
                      <BookCard
                        key={book._id}
                        book={book}
                      />
                    ))
                  ) : (
                    <div className="col-span-full text-center text-slate-500 py-20 bg-white rounded-3xl border border-slate-200/50">
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
                        onClick={() => {
                          if (!loading) {
                            setPage(prev => Math.max(1, prev - 1));
                            window.scrollTo({ top: 0, behavior: "smooth" });
                          }
                        }}
                        disabled={page === 1 || loading}
                        className="p-2 border border-slate-350 bg-white rounded-xl text-slate-600 disabled:opacity-40 cursor-pointer hover:bg-slate-550 transition flex items-center justify-center shadow-sm"
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
                              : "border border-slate-350 bg-white text-slate-600 hover:bg-slate-550"
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
                        className="p-2 border border-slate-350 bg-white rounded-xl text-slate-600 disabled:opacity-40 cursor-pointer hover:bg-slate-555 transition flex items-center justify-center shadow-sm"
                      >
                        <ChevronRight size={16} />
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Books;