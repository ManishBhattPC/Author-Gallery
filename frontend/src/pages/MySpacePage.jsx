import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BookOpen, Users, Bookmark, Trash2, Library, Clock, ArrowRight, Heart, Plus, BookMarked, User, ChevronLeft, ChevronRight } from "lucide-react";
import { fetchMyFollowing } from "../services/authorService.js";

const MySpacePage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("history"); // history, authors, libraries
  
  // States for Recently Read, Followed Authors, Libraries
  const [recentlyRead, setRecentlyRead] = useState([]);
  const [followedAuthors, setFollowedAuthors] = useState([]);
  const [libraries, setLibraries] = useState([]);
  const [loadingAuthors, setLoadingAuthors] = useState(false);
  const [error, setError] = useState(null);

  // New Library Form state
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newLibName, setNewLibName] = useState("");
  const [newLibDesc, setNewLibDesc] = useState("");

  // Library preview details state
  const [selectedLibrary, setSelectedLibrary] = useState(null);

  // Pagination states
  const [historyPage, setHistoryPage] = useState(1);
  const [librariesPage, setLibrariesPage] = useState(1);
  const [selectedLibraryPage, setSelectedLibraryPage] = useState(1);
  const [authorsPage, setAuthorsPage] = useState(1);
  
  const itemsPerPage = 2;

  useEffect(() => {
    setHistoryPage(1);
    setLibrariesPage(1);
    setSelectedLibraryPage(1);
    setAuthorsPage(1);
  }, [activeTab, selectedLibrary]);

  // Load state from localStorage on mount
  useEffect(() => {
    const loadedHistory = JSON.parse(localStorage.getItem("recently_read_books") || "[]");
    setRecentlyRead(loadedHistory);

    const loadedLibraries = JSON.parse(localStorage.getItem("my_libraries") || "[]");
    setLibraries(loadedLibraries);
    
    // Fetch followed authors from backend API
    const loadFollowing = async () => {
      try {
        setLoadingAuthors(true);
        const data = await fetchMyFollowing({ page: 1, limit: 100 });
        setFollowedAuthors(data.following || []);
      } catch (err) {
        console.error("Failed to load followed authors:", err);
      } finally {
        setLoadingAuthors(false);
      }
    };
    loadFollowing();
  }, []);

  const handleClearHistory = () => {
    localStorage.removeItem("recently_read_books");
    setRecentlyRead([]);
  };

  const handleCreateLibrary = (e) => {
    e.preventDefault();
    if (!newLibName.trim()) return;

    const newLib = {
      id: Date.now().toString(),
      name: newLibName.trim(),
      description: newLibDesc.trim(),
      bookIds: [], // initially empty
      books: []    // stored book summaries
    };

    const updatedLibs = [...libraries, newLib];
    localStorage.setItem("my_libraries", JSON.stringify(updatedLibs));
    setLibraries(updatedLibs);
    setNewLibName("");
    setNewLibDesc("");
    setShowCreateForm(false);
  };

  const handleDeleteLibrary = (libId, e) => {
    e.stopPropagation();
    const updatedLibs = libraries.filter(lib => lib.id !== libId);
    localStorage.setItem("my_libraries", JSON.stringify(updatedLibs));
    setLibraries(updatedLibs);
    if (selectedLibrary?.id === libId) {
      setSelectedLibrary(null);
    }
  };

  const handleRemoveFromLibrary = (libId, bookId, e) => {
    e.stopPropagation();
    const updatedLibs = libraries.map(lib => {
      if (lib.id === libId) {
        const filteredBookIds = lib.bookIds.filter(id => id !== bookId);
        const filteredBooks = (lib.books || []).filter(b => b._id !== bookId);
        return { ...lib, bookIds: filteredBookIds, books: filteredBooks };
      }
      return lib;
    });

    localStorage.setItem("my_libraries", JSON.stringify(updatedLibs));
    setLibraries(updatedLibs);
    
    // Update active preview
    const activeLib = updatedLibs.find(l => l.id === libId);
    if (activeLib) {
      setSelectedLibrary(activeLib);
    }
  };

  // Paginated Lists
  const totalHistoryPages = Math.ceil(recentlyRead.length / itemsPerPage);
  const currentHistoryItems = recentlyRead.slice(
    (historyPage - 1) * itemsPerPage,
    historyPage * itemsPerPage
  );

  const totalLibrariesPages = Math.ceil(libraries.length / itemsPerPage);
  const currentLibrariesItems = libraries.slice(
    (librariesPage - 1) * itemsPerPage,
    librariesPage * itemsPerPage
  );

  const selectedLibBooks = selectedLibrary?.books || [];
  const totalSelectedLibPages = Math.ceil(selectedLibBooks.length / itemsPerPage);
  const currentSelectedLibItems = selectedLibBooks.slice(
    (selectedLibraryPage - 1) * itemsPerPage,
    selectedLibraryPage * itemsPerPage
  );

  const totalAuthorsPages = Math.ceil(followedAuthors.length / itemsPerPage);
  const currentAuthorsItems = followedAuthors.slice(
    (authorsPage - 1) * itemsPerPage,
    authorsPage * itemsPerPage
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 py-10 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-200 pb-6 animate-fade-in">
          <div className="text-left">
            <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 flex items-center gap-3">
              <Library className="text-amber-800 w-8 h-8 sm:w-10 sm:h-10" /> My Space
            </h1>
            <p className="mt-2 text-sm sm:text-base text-slate-600">
              Manage your personal reading collection, custom libraries, history, and followed authors.
            </p>
          </div>
          <button
            onClick={() => setShowCreateForm(true)}
            className="flex items-center justify-center gap-2 bg-amber-700 hover:bg-amber-800 text-white px-5 py-3 rounded-xl font-bold transition duration-200 cursor-pointer shadow-md hover:scale-[1.01] active:scale-[0.99] self-start md:self-auto text-sm"
          >
            <Plus size={16} /> Create Library
          </button>
        </div>

        {/* Create Library Overlay Modal */}
        {showCreateForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-fade-in backdrop-blur-sm">
            <div className="bg-white border border-slate-200 rounded-2xl p-6 w-full max-w-md shadow-2xl animate-scale-up text-left">
              <h3 className="text-lg font-bold text-slate-900 font-serif flex items-center gap-2 mb-2">
                <BookMarked className="text-amber-700 w-5 h-5" /> New Library
              </h3>
              <p className="text-xs text-slate-500 mb-4">Create a custom bookshelf playlist to organize your eBooks.</p>
              
              <form onSubmit={handleCreateLibrary} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Library Name</label>
                  <input
                    type="text"
                    value={newLibName}
                    onChange={(e) => setNewLibName(e.target.value)}
                    required
                    placeholder="e.g. Classics, Weekend Reads, References"
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500/20 focus:border-amber-700 outline-none transition"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Description (Optional)</label>
                  <textarea
                    value={newLibDesc}
                    onChange={(e) => setNewLibDesc(e.target.value)}
                    placeholder="Provide a short description..."
                    rows={3}
                    className="w-full px-3 py-2 text-sm border border-slate-355 rounded-xl focus:ring-2 focus:ring-amber-500/20 focus:border-amber-700 outline-none transition resize-none"
                  />
                </div>
                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowCreateForm(false)}
                    className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl border border-slate-200 transition cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 bg-amber-700 hover:bg-amber-800 text-white text-xs font-bold rounded-xl transition cursor-pointer shadow-sm shadow-amber-800/10"
                  >
                    Create Library
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* YouTube-style Metrics / Stats Summary Banner */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div 
            onClick={() => { setActiveTab("history"); setSelectedLibrary(null); }}
            className={`bg-[#FAF1E6] border p-5 rounded-2xl shadow-sm text-left flex items-center gap-4 hover:shadow-md transition-all duration-200 cursor-pointer hover:scale-[1.01] active:scale-[0.99] select-none ${
              activeTab === "history" ? "border-amber-700/50 ring-2 ring-amber-700/20" : "border-[#ECD9C6]"
            }`}
          >
            <div className="p-3 bg-[#EEDCC7] text-[#8C4E35] rounded-xl shrink-0">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-slate-900 leading-tight">{recentlyRead.length}</h3>
              <p className="text-xs font-semibold text-[#8C4E35] mt-0.5">Recently Read Books</p>
            </div>
          </div>

          <div 
            onClick={() => { setActiveTab("libraries"); setSelectedLibrary(null); }}
            className={`bg-[#FCF4E7] border p-5 rounded-2xl shadow-sm text-left flex items-center gap-4 hover:shadow-md transition-all duration-200 cursor-pointer hover:scale-[1.01] active:scale-[0.99] select-none ${
              activeTab === "libraries" ? "border-amber-600/50 ring-2 ring-amber-600/20" : "border-[#F4E3C8]"
            }`}
          >
            <div className="p-3 bg-[#F6ECC0]/80 text-[#A2621C] rounded-xl shrink-0">
              <Library className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-slate-900 leading-tight">{libraries.length}</h3>
              <p className="text-xs font-semibold text-[#A2621C] mt-0.5">Custom Libraries</p>
            </div>
          </div>

          <div 
            onClick={() => { setActiveTab("authors"); setSelectedLibrary(null); }}
            className={`bg-[#E8F3EE] border p-5 rounded-2xl shadow-sm text-left flex items-center gap-4 hover:shadow-md transition-all duration-200 cursor-pointer hover:scale-[1.01] active:scale-[0.99] select-none ${
              activeTab === "authors" ? "border-emerald-700/50 ring-2 ring-emerald-700/20" : "border-[#D0E6DC]"
            }`}
          >
            <div className="p-3 bg-[#D4EAE0] text-[#1E5E42] rounded-xl shrink-0">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-slate-900 leading-tight">{followedAuthors.length}</h3>
              <p className="text-xs font-semibold text-[#1E5E42] mt-0.5">Followed Authors</p>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 gap-1.5 scrollbar-none overflow-x-auto">
          {[
            { id: "history", label: "Reading History", icon: Clock },
            { id: "libraries", label: "My Libraries", icon: Bookmark },
            { id: "authors", label: "Followed Authors", icon: Users }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setSelectedLibrary(null);
                }}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold border-b-2 transition duration-200 cursor-pointer whitespace-nowrap ${
                  activeTab === tab.id
                    ? "border-amber-700 text-amber-850"
                    : "border-transparent text-slate-500 hover:text-slate-900 hover:border-slate-300"
                }`}
              >
                <Icon size={16} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab Content Panels */}
        <div className="min-h-[400px]">
          
          {/* A. READING HISTORY TAB */}
          {activeTab === "history" && (
            <div className="space-y-6 text-left">
              {recentlyRead.length > 0 ? (
                <>
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-bold text-slate-900 font-serif">Recently Read</h3>
                    <button
                      onClick={handleClearHistory}
                      className="text-xs font-bold text-rose-700 hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <Trash2 size={13} /> Clear History
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {currentHistoryItems.map((book) => (
                      <div
                        key={book._id}
                        onClick={() => navigate(`/books/${book._id}`)}
                        className="group relative bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col h-full"
                      >
                        <div className="relative aspect-[3/4] bg-slate-100 overflow-hidden shrink-0">
                          {book.coverImage ? (
                            <img
                              src={book.coverImage}
                              alt={book.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          ) : (
                            <div className="h-full flex items-center justify-center text-slate-350">
                              <BookOpen size={40} />
                            </div>
                          )}
                          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <span className="text-white text-xs font-bold bg-[#8C4E35]/90 px-3 py-1.5 rounded-full flex items-center gap-1">
                              Resume Reading <ArrowRight size={12} />
                            </span>
                          </div>
                        </div>
                        <div className="p-4 flex flex-col justify-between flex-grow">
                          <div>
                            <h4 className="font-serif font-bold text-slate-900 text-sm line-clamp-1 group-hover:text-amber-800 transition-colors">
                              {book.title}
                            </h4>
                            <p className="text-xs text-slate-500 mt-1 truncate">
                              By {book.author?.name || book.author || "Unknown"}
                            </p>
                          </div>
                          <div className="flex justify-between items-center mt-3 pt-2 border-t border-slate-100 text-xs">
                            <span className="font-bold text-[#8C4E35]">
                              {book.price === 0 ? "Free" : `₹${book.price}`}
                            </span>
                            {book.rating > 0 && (
                              <span className="flex items-center gap-0.5 text-amber-500 font-semibold">
                                ★ {Number(book.rating).toFixed(1)}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* History Pagination */}
                  {totalHistoryPages > 1 && (
                    <div className="flex justify-center items-center gap-1.5 mt-8 border-t border-slate-200 pt-6">
                      <button
                        onClick={() => setHistoryPage((p) => Math.max(1, p - 1))}
                        disabled={historyPage === 1}
                        className="p-2 rounded-xl border border-slate-300 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent text-slate-700 transition cursor-pointer"
                      >
                        <ChevronLeft size={16} />
                      </button>
                      
                      {Array.from({ length: totalHistoryPages }, (_, i) => i + 1).map((pageNum) => (
                        <button
                          key={pageNum}
                          onClick={() => setHistoryPage(pageNum)}
                          className={`w-9 h-9 rounded-xl border text-sm font-semibold transition cursor-pointer ${
                            historyPage === pageNum
                              ? "bg-amber-800 border-amber-800 text-white shadow-sm"
                              : "border-slate-300 hover:bg-slate-100 text-slate-700"
                          }`}
                        >
                          {pageNum}
                        </button>
                      ))}

                      <button
                        onClick={() => setHistoryPage((p) => Math.min(totalHistoryPages, p + 1))}
                        disabled={historyPage === totalHistoryPages}
                        className="p-2 rounded-xl border border-slate-300 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent text-slate-700 transition cursor-pointer"
                      >
                        <ChevronRight size={16} />
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <div className="py-20 text-center border border-dashed border-slate-300 bg-white rounded-3xl p-6 shadow-sm">
                  <Clock className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                  <h4 className="text-base font-bold text-slate-800 font-serif">No reading history yet</h4>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1.5">
                    Your recently opened books will appear here, making it quick and easy to resume where you left off.
                  </p>
                  <Link
                    to="/books"
                    className="inline-flex items-center justify-center mt-5 bg-amber-700 hover:bg-amber-800 text-white px-5 py-2.5 rounded-xl text-xs font-bold transition shadow-sm"
                  >
                    Browse Books Catalog
                  </Link>
                </div>
              )}
            </div>
          )}

          {/* B. MY LIBRARIES TAB */}
          {activeTab === "libraries" && (
            <div className="space-y-6 text-left">
              {/* Detailed Library Preview View */}
              {selectedLibrary ? (
                <div className="space-y-6 animate-fade-in">
                  <div className="flex items-center justify-between gap-4 border-b border-slate-200 pb-4">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setSelectedLibrary(null)}
                        className="text-xs font-bold text-amber-800 hover:underline flex items-center gap-1 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg border border-slate-200 transition cursor-pointer"
                      >
                        ← Back to Libraries
                      </button>
                      <h3 className="text-xl font-bold font-serif text-slate-900">
                        {selectedLibrary.name}
                      </h3>
                      <span className="text-xs bg-[#FAF1E6] border border-[#ECD9C6] text-[#8C4E35] font-bold px-2 py-0.5 rounded-md">
                        {(selectedLibrary.books || []).length} works
                      </span>
                    </div>
                    <button
                      onClick={(e) => handleDeleteLibrary(selectedLibrary.id, e)}
                      className="text-xs font-bold text-rose-700 hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <Trash2 size={13} /> Delete Library
                    </button>
                  </div>
                  
                  {selectedLibrary.description && (
                    <p className="text-sm text-slate-600 bg-slate-100/50 p-4 rounded-xl border border-slate-200/50">
                      {selectedLibrary.description}
                    </p>
                  )}

                  {currentSelectedLibItems.length > 0 ? (
                    <>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {currentSelectedLibItems.map((book) => (
                          <div
                            key={book._id}
                            className="group relative bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 flex flex-col h-full cursor-pointer"
                            onClick={() => navigate(`/books/${book._id}`)}
                          >
                            <div className="relative aspect-[3/4] bg-slate-100 overflow-hidden shrink-0">
                              {book.coverImage ? (
                                <img
                                  src={book.coverImage}
                                  alt={book.title}
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                              ) : (
                                <div className="h-full flex items-center justify-center text-slate-350">
                                  <BookOpen size={40} />
                                </div>
                              )}
                              {/* Remove button overlay */}
                              <button
                                onClick={(e) => handleRemoveFromLibrary(selectedLibrary.id, book._id, e)}
                                className="absolute top-2 right-2 p-1.5 rounded-xl bg-black/60 hover:bg-rose-900 text-white hover:text-rose-100 opacity-0 group-hover:opacity-100 transition-opacity z-10 cursor-pointer shadow-md"
                                title="Remove from library"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                            <div className="p-4 flex flex-col justify-between flex-grow">
                              <div>
                                <h4 className="font-serif font-bold text-slate-900 text-sm line-clamp-1 group-hover:text-amber-800 transition-colors">
                                  {book.title}
                                </h4>
                                <p className="text-xs text-slate-500 mt-1 truncate">
                                  By {book.author?.name || book.author || "Unknown"}
                                </p>
                              </div>
                              <div className="flex justify-between items-center mt-3 pt-2 border-t border-slate-100 text-xs">
                                <span className="font-bold text-[#8C4E35]">
                                  {book.price === 0 ? "Free" : `₹${book.price}`}
                                </span>
                                {book.rating > 0 && (
                                  <span className="flex items-center gap-0.5 text-amber-500 font-semibold">
                                    ★ {Number(book.rating).toFixed(1)}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Selected Library Pagination */}
                      {totalSelectedLibPages > 1 && (
                        <div className="flex justify-center items-center gap-1.5 mt-8 border-t border-slate-200 pt-6">
                          <button
                            onClick={() => setSelectedLibraryPage((p) => Math.max(1, p - 1))}
                            disabled={selectedLibraryPage === 1}
                            className="p-2 rounded-xl border border-slate-300 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent text-slate-700 transition cursor-pointer"
                          >
                            <ChevronLeft size={16} />
                          </button>
                          
                          {Array.from({ length: totalSelectedLibPages }, (_, i) => i + 1).map((pageNum) => (
                            <button
                              key={pageNum}
                              onClick={() => setSelectedLibraryPage(pageNum)}
                              className={`w-9 h-9 rounded-xl border text-sm font-semibold transition cursor-pointer ${
                                selectedLibraryPage === pageNum
                                  ? "bg-amber-800 border-amber-800 text-white shadow-sm"
                                  : "border-slate-300 hover:bg-slate-100 text-slate-700"
                              }`}
                            >
                              {pageNum}
                            </button>
                          ))}

                          <button
                            onClick={() => setSelectedLibraryPage((p) => Math.min(totalSelectedLibPages, p + 1))}
                            disabled={selectedLibraryPage === totalSelectedLibPages}
                            className="p-2 rounded-xl border border-slate-300 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent text-slate-700 transition cursor-pointer"
                          >
                            <ChevronRight size={16} />
                          </button>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="py-16 text-center bg-white rounded-3xl border border-slate-200 border-dashed p-6">
                      <BookOpen className="w-10 h-10 text-slate-400 mx-auto mb-3" />
                      <p className="text-sm font-bold text-slate-800">No books in this library yet</p>
                      <p className="text-xs text-slate-500 mt-1">Explore our catalogue and add books directly from their details page.</p>
                      <Link
                        to="/books"
                        className="inline-flex items-center justify-center mt-4 bg-amber-700 hover:bg-amber-800 text-white px-5 py-2 rounded-xl text-xs font-bold transition shadow-sm"
                      >
                        Add Books
                      </Link>
                    </div>
                  )}
                </div>
              ) : (
                // Library Lists view (Grid of libraries matching YouTube playlists layout)
                <>
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-bold text-slate-900 font-serif">Playlists / Libraries</h3>
                  </div>

                  {currentLibrariesItems.length > 0 ? (
                    <>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {currentLibrariesItems.map((lib) => {
                          const booksInLib = lib.books || [];
                          const firstBook = booksInLib[0];
                          return (
                            <div
                              key={lib.id}
                              onClick={() => setSelectedLibrary(lib)}
                              className="group relative bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col h-full"
                            >
                              {/* YouTube styled Playlist Cover overlay */}
                              <div className="relative aspect-[3/4] bg-slate-100 overflow-hidden shrink-0">
                                {firstBook?.coverImage ? (
                                  <img
                                    src={firstBook.coverImage}
                                    alt={lib.name}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                  />
                                ) : (
                                  <div className="h-full flex items-center justify-center bg-slate-100 text-slate-350">
                                    <Library size={48} />
                                  </div>
                                )}
                                {/* YouTube-like overlay showing number of books */}
                                <div className="absolute inset-y-0 right-0 w-2/5 bg-slate-950/80 backdrop-blur-[2px] flex flex-col justify-center items-center text-white p-3 border-l border-slate-800/40">
                                  <Library size={24} className="mb-2 text-amber-400" />
                                  <span className="text-lg font-bold">{booksInLib.length}</span>
                                  <span className="text-[10px] uppercase font-bold tracking-wider text-slate-300 mt-0.5">Books</span>
                                </div>
                              </div>
                              
                              <div className="p-4 flex flex-col justify-between flex-grow text-left">
                                <div>
                                  <h4 className="font-serif font-bold text-slate-900 text-sm line-clamp-1 group-hover:text-amber-800 transition-colors">
                                    {lib.name}
                                  </h4>
                                  <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                                    {lib.description || "Custom shelf collection."}
                                  </p>
                                </div>
                                <div className="flex justify-between items-center mt-4 pt-2 border-t border-slate-100">
                                  <span className="text-[10px] text-slate-400 font-semibold">
                                    Created bookshelf
                                  </span>
                                  <button
                                    onClick={(e) => handleDeleteLibrary(lib.id, e)}
                                    className="p-1 rounded-lg text-slate-400 hover:text-rose-700 hover:bg-rose-50 transition cursor-pointer"
                                    title="Delete library"
                                  >
                                    <Trash2 size={13} />
                                  </button>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* Libraries Grid Pagination */}
                      {totalLibrariesPages > 1 && (
                        <div className="flex justify-center items-center gap-1.5 mt-8 border-t border-slate-200 pt-6">
                          <button
                            onClick={() => setLibrariesPage((p) => Math.max(1, p - 1))}
                            disabled={librariesPage === 1}
                            className="p-2 rounded-xl border border-slate-300 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent text-slate-700 transition cursor-pointer"
                          >
                            <ChevronLeft size={16} />
                          </button>
                          
                          {Array.from({ length: totalLibrariesPages }, (_, i) => i + 1).map((pageNum) => (
                            <button
                              key={pageNum}
                              onClick={() => setLibrariesPage(pageNum)}
                              className={`w-9 h-9 rounded-xl border text-sm font-semibold transition cursor-pointer ${
                                librariesPage === pageNum
                                  ? "bg-amber-800 border-amber-800 text-white shadow-sm"
                                  : "border-slate-300 hover:bg-slate-100 text-slate-700"
                              }`}
                            >
                              {pageNum}
                            </button>
                          ))}

                          <button
                            onClick={() => setLibrariesPage((p) => Math.min(totalLibrariesPages, p + 1))}
                            disabled={librariesPage === totalLibrariesPages}
                            className="p-2 rounded-xl border border-slate-300 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent text-slate-700 transition cursor-pointer"
                          >
                            <ChevronRight size={16} />
                          </button>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="py-20 text-center border border-dashed border-slate-300 bg-white rounded-3xl p-6 shadow-sm">
                      <Bookmark className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                      <h4 className="text-base font-bold text-slate-800 font-serif">No libraries created yet</h4>
                      <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1.5">
                        Group your favorite eBooks and author works into playlist-like shelves for organized reading.
                      </p>
                      <button
                        onClick={() => setShowCreateForm(true)}
                        className="inline-flex items-center justify-center mt-5 bg-amber-700 hover:bg-amber-800 text-white px-5 py-2.5 rounded-xl text-xs font-bold transition shadow-sm cursor-pointer"
                      >
                        Create Your First Library
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {/* C. FOLLOWED AUTHORS TAB */}
          {activeTab === "authors" && (
            <div className="space-y-6 text-left">
              <h3 className="text-lg font-bold text-slate-900 font-serif">Followed Authors</h3>
              
              {loadingAuthors ? (
                <div className="text-center py-10 text-slate-500">Loading authors...</div>
              ) : currentAuthorsItems.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {currentAuthorsItems.map((author) => (
                      <div
                        key={author._id}
                        onClick={() => navigate(`/authors/${author._id}`)}
                        className="group relative bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col items-center text-center"
                      >
                        <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-slate-200 group-hover:border-amber-700/60 transition-colors shrink-0 mb-3 bg-slate-100">
                          {author.profileImage ? (
                            <img
                              src={author.profileImage}
                              alt={author.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-amber-700 font-bold bg-amber-50">
                              {author.name?.charAt(0)}
                            </div>
                          )}
                        </div>
                        <h4 className="font-serif font-bold text-slate-900 text-sm group-hover:text-amber-800 transition-colors">
                          {author.name}
                        </h4>
                        <p className="text-[10px] font-bold text-amber-800 uppercase tracking-wide mt-1">
                          {Array.isArray(author.genres) && author.genres.length > 0
                            ? author.genres.join(", ")
                            : "Writers & Authors"}
                        </p>
                        <p className="text-xs text-slate-500 mt-2 line-clamp-2">
                          {author.bio || "No biography available."}
                        </p>
                        <span className="mt-4 text-xs font-bold text-amber-700 hover:text-amber-850 flex items-center gap-0.5">
                          View Author Space <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Followed Authors Pagination */}
                  {totalAuthorsPages > 1 && (
                    <div className="flex justify-center items-center gap-1.5 mt-8 border-t border-slate-200 pt-6">
                      <button
                        onClick={() => setAuthorsPage((p) => Math.max(1, p - 1))}
                        disabled={authorsPage === 1}
                        className="p-2 rounded-xl border border-slate-300 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent text-slate-700 transition cursor-pointer"
                      >
                        <ChevronLeft size={16} />
                      </button>
                      
                      {Array.from({ length: totalAuthorsPages }, (_, i) => i + 1).map((pageNum) => (
                        <button
                          key={pageNum}
                          onClick={() => setAuthorsPage(pageNum)}
                          className={`w-9 h-9 rounded-xl border text-sm font-semibold transition cursor-pointer ${
                            authorsPage === pageNum
                              ? "bg-amber-800 border-amber-800 text-white shadow-sm"
                              : "border-slate-300 hover:bg-slate-100 text-slate-700"
                          }`}
                        >
                          {pageNum}
                        </button>
                      ))}

                      <button
                        onClick={() => setAuthorsPage((p) => Math.min(totalAuthorsPages, p + 1))}
                        disabled={authorsPage === totalAuthorsPages}
                        className="p-2 rounded-xl border border-slate-300 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent text-slate-700 transition cursor-pointer"
                      >
                        <ChevronRight size={16} />
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <div className="py-20 text-center border border-dashed border-slate-300 bg-white rounded-3xl p-6 shadow-sm">
                  <Users className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                  <h4 className="text-base font-bold text-slate-800 font-serif">Not following any authors yet</h4>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1.5">
                    Follow writers to receive updates when they publish new books or post updates on Author Gallery.
                  </p>
                  <Link
                    to="/authors"
                    className="inline-flex items-center justify-center mt-5 bg-amber-700 hover:bg-amber-800 text-white px-5 py-2.5 rounded-xl text-xs font-bold transition shadow-sm"
                  >
                    Explore Authors Directory
                  </Link>
                </div>
              )}
            </div>
          )}

        </div>

      </div>
    </div>
  );
};

export default MySpacePage;
