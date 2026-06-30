import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { fetchBookById, incrementBookDownloads } from "../../services/bookService.js";
import { useAuth } from "../../AuthContext.jsx";
import { createPortal } from "react-dom";
import { Flag, Info } from "lucide-react";
import ReviewSection from "../ReviewSection.jsx";
import ReportModal from "../ReportModal.jsx";
import { requestOfflinePayment, createPaymentOrder, verifyPaymentSignature } from "../../services/paymentService.js";
import {
  FaDownload,
  FaArrowLeft,
  FaBook,
  FaCalendar,
  FaUser,
  FaBookOpen,
  FaInfoCircle,
  FaExpand,
  FaQuestionCircle,
  FaTimes,
  FaPlay,
  FaPause,
  FaBookmark,
  FaStar,
  FaRegStar,
  FaVolumeUp,
  FaVolumeMute,
  FaCog,
  FaSun,
  FaMoon,
  FaChevronDown,
  FaChevronUp,
  FaCreditCard,
  FaClock,
} from "react-icons/fa";

const BookDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();

  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [toast, setToast] = useState(null);
  const [purchasing, setPurchasing] = useState(false);
  
  const [purchaseModalOpen, setPurchaseModalOpen] = useState(false);
  const [whatsapp, setWhatsapp] = useState("");
  const [address, setAddress] = useState("");
  const [note, setNote] = useState("");

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleBuyBook = () => {
    if (!user) {
      showToast("Please log in to purchase this book", "error");
      navigate("/login");
      return;
    }
    setPurchaseModalOpen(true);
  };

  const handleConfirmPurchase = async (e) => {
    e.preventDefault();
    if (!whatsapp || !address) {
      showToast("WhatsApp and Address details are required.", "error");
      return;
    }

    try {
      setPurchasing(true);
      const data = await requestOfflinePayment(book._id, whatsapp, address, note);

      if (data.success) {
        showToast("Purchase request sent! Arrange payment offline with the author.", "success");
        setBook((prev) => ({
          ...prev,
          isPendingApproval: true,
        }));
        setPurchaseModalOpen(false);
      }
    } catch (err) {
      console.error("Offline request failed:", err);
      showToast(err.message || "Could not submit purchase request.", "error");
    } finally {
      setPurchasing(false);
    }
  };

  const isAuthor = book && user && (book.author?._id === user._id || book.author === user._id);
  const isAdmin = user && user.role === "admin";
  const isAlreadyPurchased = book?.isPurchased || (user && user.purchasedBooks && user.purchasedBooks.includes(book._id));
  const hasAccess = !book || book.price === 0 || isAuthor || isAdmin || isAlreadyPurchased;

  // Immersive E-Reader States
  const [readerOpen, setReaderOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth > 768);
  const [activeChapterIndex, setActiveChapterIndex] = useState(0);
  const [fontSize, setFontSize] = useState(() => {
    return Number(localStorage.getItem("reader_font_size")) || 18;
  });
  const [fontFamily, setFontFamily] = useState(() => {
    return localStorage.getItem("reader_font_family") || "serif";
  });
  const [readerTheme, setReaderTheme] = useState(() => {
    return localStorage.getItem("reader_theme") || "cream";
  });
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [bookmarks, setBookmarks] = useState([]);
  const [notes, setNotes] = useState("");
  const [chapterRatings, setChapterRatings] = useState({});
  const [controlsOpen, setControlsOpen] = useState(false);
  
  // Collapsible accordion states inside sidebar
  const [chaptersExpanded, setChaptersExpanded] = useState(true);
  const [bookmarksExpanded, setBookmarksExpanded] = useState(false);
  const [notesExpanded, setNotesExpanded] = useState(false);

  const bookSidebarRef = useRef(null);

  useEffect(() => {
    const sidebar = bookSidebarRef.current;
    if (!sidebar) return;

    const handleWheel = (e) => {
      const el = sidebar;
      const scrollTop = el.scrollTop;
      const scrollHeight = el.scrollHeight;
      const clientHeight = el.clientHeight;
      
      if (scrollHeight <= clientHeight) {
        e.preventDefault();
        return;
      }
      
      const delta = e.deltaY;
      if (delta < 0 && scrollTop <= 0) {
        e.preventDefault();
      } else if (delta > 0 && scrollTop + clientHeight >= scrollHeight) {
        e.preventDefault();
      }
    };

    let touchStartY = 0;
    const handleTouchStart = (e) => {
      touchStartY = e.touches[0].clientY;
    };

    const handleTouchMove = (e) => {
      const el = sidebar;
      const scrollTop = el.scrollTop;
      const scrollHeight = el.scrollHeight;
      const clientHeight = el.clientHeight;
      
      if (scrollHeight <= clientHeight) {
        e.preventDefault();
        return;
      }
      
      const touchY = e.touches[0].clientY;
      const deltaY = touchStartY - touchY;
      
      if (deltaY < 0 && scrollTop <= 0) {
        e.preventDefault();
      } else if (deltaY > 0 && scrollTop + clientHeight >= scrollHeight) {
        e.preventDefault();
      }
    };

    sidebar.addEventListener("wheel", handleWheel, { passive: false });
    sidebar.addEventListener("touchstart", handleTouchStart, { passive: true });
    sidebar.addEventListener("touchmove", handleTouchMove, { passive: false });

    return () => {
      sidebar.removeEventListener("wheel", handleWheel);
      sidebar.removeEventListener("touchstart", handleTouchStart);
      sidebar.removeEventListener("touchmove", handleTouchMove);
    };
  }, [sidebarOpen]);

  // Helper to parse chapters dynamically from editor content
  const parseChapters = (text) => {
    if (!text || !text.trim()) return [];
    
    // Split on markers like "Chapter X" or "# Chapter X" or "## Chapter X" or "Ch. X"
    const parts = text.split(/(?:^|\r?\n)(?=(?:#\s*Chapter|##\s*Chapter|Chapter|CHAPTER|Ch\.)\s*(?:\d+|[IVXLCDM]+)?\b)/i);
    
    const chaptersList = [];
    
    parts.forEach((part, idx) => {
      const trimmed = part.trim();
      if (!trimmed) return;
      
      const lines = trimmed.split(/\r?\n/);
      const firstLine = lines[0];
      
      // Match "Chapter [Number] [Optional Title]"
      const isHeader = /^(?:#\s*Chapter|##\s*Chapter|Chapter|CHAPTER|Ch\.)/i.test(firstLine);
      
      if (isHeader) {
        const title = firstLine.replace(/^(?:#\s*Chapter|##\s*Chapter|Chapter|CHAPTER|Ch\.)\s*(?:\d+|[IVXLCDM]+)?[:.-]?\s*/i, "").trim();
        const headerPrefix = firstLine.match(/^(?:#\s*Chapter|##\s*Chapter|Chapter|CHAPTER|Ch\.)\s*(?:\d+|[IVXLCDM]+)?/i)[0].replace(/[#\s]/g, "");
        const bodyText = lines.slice(1).join("\n").trim();
        
        chaptersList.push({
          title: title ? `${headerPrefix}: ${title}` : headerPrefix,
          content: bodyText,
        });
      } else {
        // Text block before the first chapter (Introduction/Prologue)
        chaptersList.push({
          title: idx === 0 ? "Introduction" : `Section ${idx + 1}`,
          content: trimmed,
        });
      }
    });
    
    return chaptersList.length > 0 ? chaptersList : [{ title: "Full Text", content: text }];
  };

  const chapters = parseChapters(book?.content || "");
  const activeChapter = chapters[activeChapterIndex] || null;

  // Load/save reader preferences and bookmarks from localStorage
  useEffect(() => {
    if (readerOpen && id) {
      // Load bookmark position
      const savedBookmark = localStorage.getItem(`bookmark_${id}`);
      if (savedBookmark !== null) {
        setActiveChapterIndex(parseInt(savedBookmark, 10));
      }
      
      // Load bookmarks list
      const savedBookmarksList = localStorage.getItem(`bookmarks_${id}`);
      if (savedBookmarksList) {
        setBookmarks(JSON.parse(savedBookmarksList));
      }
      
      // Load notes
      const savedNotes = localStorage.getItem(`notes_${id}`);
      if (savedNotes) {
        setNotes(savedNotes);
      }
      
      // Load ratings
      const savedRatings = localStorage.getItem(`ratings_${id}`);
      if (savedRatings) {
        setChapterRatings(JSON.parse(savedRatings));
      }
    }
  }, [readerOpen, id]);

  const handleDownloadClick = async () => {
    try {
      if (book) {
        await incrementBookDownloads(book._id || book.id);
      }
    } catch (err) {
      console.error("Failed to increment book downloads count:", err);
    }
  };

  const handleSaveNotes = (val) => {
    setNotes(val);
    localStorage.setItem(`notes_${id}`, val);
  };

  const handleToggleBookmark = (chapIdx) => {
    let updated;
    if (bookmarks.includes(chapIdx)) {
      updated = bookmarks.filter((b) => b !== chapIdx);
    } else {
      updated = [...bookmarks, chapIdx].sort((a, b) => a - b);
    }
    setBookmarks(updated);
    localStorage.setItem(`bookmarks_${id}`, JSON.stringify(updated));
  };

  const handleRateChapter = (rating) => {
    const updated = { ...chapterRatings, [activeChapterIndex]: rating };
    setChapterRatings(updated);
    localStorage.setItem(`ratings_${id}`, JSON.stringify(updated));
  };

  // Text-To-Speech Playback
  const speakText = (text) => {
    if (!window.speechSynthesis) return;

    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      return;
    }

    window.speechSynthesis.cancel();
    
    // Remove markup/formatting before speaking
    const cleanText = text.replace(/<[^>]*>/g, "").trim();
    if (!cleanText) return;

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.onend = () => setIsPlaying(false);
    utterance.onerror = () => setIsPlaying(false);

    setIsPlaying(true);
    window.speechSynthesis.speak(utterance);
  };

  useEffect(() => {
    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => console.error(err));
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  // Track if fullscreen is closed manually via ESC key
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  // Prevent background scroll when E-Reader is open
  useEffect(() => {
    if (readerOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [readerOpen]);

  // Persist font size changes
  useEffect(() => {
    localStorage.setItem("reader_font_size", fontSize);
  }, [fontSize]);

  // Persist font family changes
  useEffect(() => {
    localStorage.setItem("reader_font_family", fontFamily);
  }, [fontFamily]);

  // Persist theme changes
  useEffect(() => {
    localStorage.setItem("reader_theme", readerTheme);
  }, [readerTheme]);

  // Load and save reading progress for this specific book
  useEffect(() => {
    if (book?._id) {
      const savedProgress = localStorage.getItem(`reader_progress_${book._id}`);
      if (savedProgress !== null) {
        setActiveChapterIndex(Number(savedProgress));
      }
    }
  }, [book?._id]);

  useEffect(() => {
    if (book?._id) {
      localStorage.setItem(`reader_progress_${book._id}`, activeChapterIndex);
    }
  }, [activeChapterIndex, book?._id]);

  // Keyboard navigation for page turning (Left/Right arrow keys)
  useEffect(() => {
    if (!readerOpen) return;
    const handleKeyDown = (e) => {
      if (document.activeElement.tagName === "INPUT" || document.activeElement.tagName === "TEXTAREA") {
        return;
      }
      if (e.key === "ArrowRight") {
        if (activeChapterIndex < chapters.length - 1) {
          setActiveChapterIndex((prev) => prev + 1);
        }
      } else if (e.key === "ArrowLeft") {
        if (activeChapterIndex > 0) {
          setActiveChapterIndex((prev) => prev - 1);
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [readerOpen, activeChapterIndex, chapters.length]);

  const THEME_STYLES = {
    cream: {
      bg: "bg-[#FDF8F3]",
      text: "text-[#2C1F15]",
      border: "border-[#E2D7C8]",
      title: "text-[#2C1F15]",
      tag: "text-[#8C4E35]",
      divider: "border-[#E2D7C8]"
    },
    dark: {
      bg: "bg-[#12100F]",
      text: "text-[#E5DED4]",
      border: "border-[#2C2522]",
      title: "text-[#E5DED4]",
      tag: "text-[#D87F4A]",
      divider: "border-[#2C2522]"
    },
    sepia: {
      bg: "bg-[#F4ECCF]",
      text: "text-[#433422]",
      border: "border-[#DED2B2]",
      title: "text-[#433422]",
      tag: "text-[#A05A3A]",
      divider: "border-[#DED2B2]"
    }
  };

  const hasTextContent = book?.content && book.content.trim().length > 0;

  useEffect(() => {
    const loadBook = async () => {
      try {
        setLoading(true);
        setError(null);

        const data = await fetchBookById(id);

        setBook(data);
      } catch (err) {
        setError(err.message || "Unable to load book details.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadBook();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h2 className="text-xl font-semibold">
          Loading book...
        </h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-red-600 text-xl font-semibold mb-4">
            {error}
          </h2>

          <button
            onClick={() => navigate(-1)}
            className="bg-black text-white px-4 py-2 rounded-lg"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const cover =
    book?.coverImage ||
    "https://via.placeholder.com/400x600?text=No+Cover";

  const authorName =
    book?.author?.name ||
    "Unknown Author";

  const formattedDate =
    book?.publishDate
      ? new Date(book.publishDate).toLocaleDateString()
      : "N/A";

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4">
      <div className="max-w-6xl mx-auto">

        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 mb-6 text-slate-700 hover:text-black"
        >
          <FaArrowLeft />
          Back
        </button>

        <div className="bg-white rounded-3xl shadow-xl overflow-hidden grid lg:grid-cols-2 gap-8">

          {/* Cover */}
          <div>
            <div className="relative aspect-[3/4] bg-slate-200 overflow-hidden">

              {!imageLoaded && !imageError && (
                <div className="absolute inset-0 animate-pulse bg-slate-300" />
              )}

              {!imageError ? (
                <img
                  src={cover}
                  alt={book?.title}
                  onLoad={() => setImageLoaded(true)}
                  onError={() => setImageError(true)}
                  className={`w-full h-full object-cover ${
                    imageLoaded ? "opacity-100" : "opacity-0"
                  }`}
                />
              ) : (
                <div className="h-full flex items-center justify-center">
                  <FaBook className="text-6xl text-slate-400" />
                </div>
              )}
            </div>

            <div className="m-6 flex flex-col gap-4">
              {hasAccess ? (
                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    onClick={() => setReaderOpen(true)}
                    className="flex-1 flex items-center justify-center gap-2 bg-amber-700 hover:bg-amber-800 text-white px-6 py-4 rounded-xl font-bold transition duration-200 cursor-pointer shadow-md shadow-amber-800/10 active:scale-[0.98]"
                  >
                    <FaBookOpen />
                    Start Reading
                  </button>

                  {book?.pdfFile && (
                    <a
                      href={book.pdfFile}
                      target="_blank"
                      rel="noreferrer"
                      onClick={handleDownloadClick}
                      className="flex-1 flex items-center justify-center gap-2 border-2 border-slate-200 hover:border-slate-300 text-slate-700 bg-slate-50 hover:bg-slate-100 px-6 py-3 rounded-xl font-semibold transition duration-200"
                    >
                      <FaDownload />
                      Download PDF
                    </a>
                  )}
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  {book?.isPendingApproval ? (
                    <>
                      <p className="text-sm font-semibold text-amber-800 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-center flex items-center justify-center gap-1.5">
                        <FaInfoCircle />
                        Purchase request is pending. Arrange payment offline with the author ({book?.author?.email || "author"}).
                      </p>
                      <button
                        disabled
                        className="w-full flex items-center justify-center gap-2 bg-slate-100 border-2 border-dashed border-slate-300 text-slate-500 px-6 py-4 rounded-xl font-bold cursor-not-allowed opacity-75"
                      >
                        <FaClock className="text-slate-400" />
                        Pending Author Approval
                      </button>
                    </>
                  ) : (
                    <>
                      <p className="text-sm font-semibold text-amber-800 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-center flex items-center justify-center gap-1.5">
                        <FaInfoCircle />
                        This is a premium eBook. Request purchase to complete payment offline.
                      </p>
                      <button
                        onClick={handleBuyBook}
                        disabled={purchasing}
                        className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white px-6 py-4 rounded-xl font-bold transition duration-200 cursor-pointer shadow-lg shadow-amber-800/20 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <FaCreditCard />
                        {purchasing ? "Sending Request..." : `Request Purchase - ₹${book?.price}`}
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Details */}
          <div className="p-8 space-y-6">

            <div>
              <div className="flex justify-between items-center mb-4">
                <span className="inline-block bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-sm font-semibold">
                  {book?.genres?.[0] || "Book"}
                </span>

                {user && (
                  <button
                    type="button"
                    onClick={() => setReportModalOpen(true)}
                    className="flex items-center gap-1 text-xs font-semibold text-rose-600 hover:text-rose-800 cursor-pointer"
                  >
                    <Flag size={13} />
                    Report
                  </button>
                )}
              </div>

              <h1 className="text-4xl font-bold mb-3">
                {book?.title}
              </h1>

              <p className="flex items-center gap-2 text-lg text-slate-700">
                <FaUser />
                {book?.author?._id ? (
                  <Link to={`/authors/${book.author._id}`} className="hover:text-amber-800 hover:underline transition-colors duration-200">
                    {authorName}
                  </Link>
                ) : (
                  authorName
                )}
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4">

              <div className="bg-slate-100 rounded-xl p-4">
                <p className="text-sm text-slate-500">
                  Genre
                </p>

                <p className="font-semibold">
                  {book?.genres?.join(", ")}
                </p>
              </div>

              <div className="bg-slate-100 rounded-xl p-4">
                <p className="text-sm text-slate-500">
                  Price
                </p>

                <p className="font-semibold">
                  ₹{book?.price}
                </p>
              </div>

            </div>

            {/* Description */}
            <div>
              <h2 className="text-xl font-bold mb-3 flex items-center gap-2">
                <FaBook />
                Description
              </h2>

              <p className="text-slate-700 leading-relaxed">
                {book?.description}
              </p>
            </div>

            {/* Publish Date */}
            <div className="border-t pt-4">

              <p className="text-sm text-slate-500 mb-2">
                Published Date
              </p>

              <p className="flex items-center gap-2 font-medium">
                <FaCalendar />
                {formattedDate}
              </p>

            </div>

          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-10">
          <ReviewSection bookId={id} />
        </div>

        {/* Report Modal */}
        <ReportModal
          isOpen={reportModalOpen}
          onClose={() => setReportModalOpen(false)}
          bookId={id}
        />

        {/* Direct Purchase Details Form Modal */}
        {purchaseModalOpen && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-md shadow-2xl p-6 sm:p-8 animate-in fade-in zoom-in duration-200 text-left">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-extrabold text-slate-800 font-serif">
                  Request Purchase
                </h3>
                <button
                  onClick={() => setPurchaseModalOpen(false)}
                  className="p-1.5 hover:bg-slate-100 text-slate-400 hover:text-slate-600 rounded-full transition cursor-pointer"
                >
                  <FaTimes size={16} />
                </button>
              </div>

              <form onSubmit={handleConfirmPurchase} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                    WhatsApp Number <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 text-slate-800"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                    Delivery / Contact Address <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Provide your city, state, pincode or contact address details..."
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 text-slate-800 resize-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                    Additional Note (Optional)
                  </label>
                  <textarea
                    rows={2}
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Preferred contact hours, payment query, etc."
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 text-slate-800 resize-none"
                  />
                </div>

                <div className="flex gap-3 pt-3">
                  <button
                    type="button"
                    onClick={() => setPurchaseModalOpen(false)}
                    className="flex-1 px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-bold rounded-xl transition cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={purchasing}
                    className="flex-1 px-4 py-3 bg-amber-700 hover:bg-amber-800 text-white text-sm font-bold rounded-xl transition disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-amber-800/10 cursor-pointer"
                  >
                    {purchasing ? "Sending..." : "Submit Request"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>

      {/* Immersive Fullscreen E-Reader Overlay */}
      {readerOpen && createPortal(
        <div className="fixed inset-0 z-[9999] flex flex-col bg-[#120F0D] text-zinc-100 font-sans">
          
          {/* Header Bar */}
          <header className="bg-[#1C1613] border-b border-[#2C211D] px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between shadow-md shrink-0 gap-4">
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <button
                onClick={() => {
                  setReaderOpen(false);
                  if (window.speechSynthesis) window.speechSynthesis.cancel();
                  setIsPlaying(false);
                }}
                className="p-2 rounded-lg hover:bg-zinc-800 transition text-zinc-400 hover:text-white cursor-pointer shrink-0"
                title="Exit Reader"
              >
                <FaArrowLeft className="text-lg" />
              </button>
              <div className="border-l border-zinc-700 h-6 hidden sm:block shrink-0" />
              <div className="min-w-0 flex-1">
                <h3 className="font-serif font-bold text-sm sm:text-lg text-zinc-100 truncate">
                  {book?.title}
                </h3>
                <p className="text-[10px] sm:text-xs text-[#D87F4A] font-medium truncate">
                  by {authorName}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className={`p-2 sm:p-2.5 rounded-xl transition cursor-pointer flex items-center gap-2 border text-xs sm:text-sm font-semibold ${
                  sidebarOpen 
                    ? "bg-[#D87F4A]/10 border-[#D87F4A]/30 text-[#D87F4A] hover:bg-[#D87F4A]/20" 
                    : "border-zinc-700 text-zinc-300 hover:bg-zinc-800"
                }`}
                title="Toggle Book Details Panel"
              >
                <FaInfoCircle />
                <span className="hidden sm:inline">Info Panel</span>
              </button>

              {/* Settings Toggle Icon */}
              {hasTextContent && (
                <button
                  onClick={() => setControlsOpen(!controlsOpen)}
                  className={`p-2 sm:p-2.5 rounded-xl transition cursor-pointer flex items-center gap-2 border text-xs sm:text-sm font-semibold ${
                    controlsOpen 
                      ? "bg-[#D87F4A]/10 border-[#D87F4A]/30 text-[#D87F4A] hover:bg-[#D87F4A]/20" 
                      : "border-zinc-700 text-zinc-300 hover:bg-zinc-800"
                  }`}
                  title="Reader Preferences"
                >
                  <FaCog />
                  <span className="hidden sm:inline">Settings</span>
                </button>
              )}

              <a
                href={book?.pdfFile}
                target="_blank"
                rel="noreferrer"
                className="bg-[#A05A3A] hover:bg-[#8C4E35] text-white px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition flex items-center gap-2"
                title="Open PDF directly"
              >
                <FaExpand className="text-xs" />
                <span className="hidden sm:inline">External Tab</span>
              </a>
            </div>
          </header>

          {/* Main workspace */}
          <div className="flex-1 flex overflow-hidden relative">
            
            {/* Mobile Backdrop scrim for collapsible sidebar */}
            {sidebarOpen && (
              <div 
                onClick={() => setSidebarOpen(false)}
                className="absolute inset-0 bg-black/60 z-10 md:hidden transition-opacity duration-300"
              />
            )}

            {/* Vintage Parchment Collapsible Sidebar */}
            {sidebarOpen && (
               <aside 
                 ref={bookSidebarRef}
                 className="w-72 sm:w-80 bg-[#FDF8F3] text-[#3E3024] flex flex-col shrink-0 shadow-2xl z-20 transition-all duration-300 overflow-y-auto absolute md:relative top-0 bottom-0 left-0 h-full border-r border-[#DFD5C6]"
                 style={{ overscrollBehavior: "contain" }}
               >
                <div className="p-5 sm:p-6 space-y-5 sm:space-y-6">
                  {/* Mobile Close Button inside sidebar header */}
                  <div className="flex justify-between items-center md:hidden">
                    <span className="text-xs font-bold text-[#8C7B67] uppercase tracking-wider">Book Details</span>
                    <button
                      onClick={() => setSidebarOpen(false)}
                      className="p-1.5 rounded-lg hover:bg-[#DFD5C6]/60 text-[#6D5E4D] hover:text-[#2C1F15] cursor-pointer transition"
                    >
                      <FaTimes className="text-sm" />
                    </button>
                  </div>

                  {/* Book Cover mockup inside sidebar */}
                  <div className="aspect-[3/4] w-36 sm:w-40 mx-auto bg-slate-200 border-4 border-[#38231B] rounded-xl shadow-lg overflow-hidden relative">
                    <img src={cover} alt={book?.title} className="w-full h-full object-cover" />
                  </div>

                  <div>
                    <span className="inline-block bg-[#FBF0E4] text-[#8C4E35] px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-2">
                      {book?.genres?.[0] || "Book"}
                    </span>
                    <h2 className="font-serif text-lg sm:text-xl font-bold text-[#2C1F15] leading-tight">
                      {book?.title}
                    </h2>
                    <p className="text-xs sm:text-sm font-medium text-[#A05A3A] mt-1">
                      by {authorName}
                    </p>
                  </div>

                  {/* Sidebar Accordions */}
                  <div className="border-t border-[#DFD5C6] pt-4 space-y-4">
                    
                    {/* Chapters Accordion */}
                    {hasTextContent && (
                      <div className="border-b border-[#DFD5C6]/60 pb-3">
                        <button 
                          onClick={() => setChaptersExpanded(!chaptersExpanded)}
                          className="w-full flex items-center justify-between text-xs font-bold text-[#544436] uppercase tracking-wider py-1.5 text-left cursor-pointer"
                        >
                          <span>Chapters ({chapters.length})</span>
                          {chaptersExpanded ? <FaChevronUp /> : <FaChevronDown />}
                        </button>
                        
                        {chaptersExpanded && (
                          <div className="mt-2 max-h-52 overflow-y-auto space-y-1.5 pr-1">
                            {chapters.map((chap, idx) => {
                              const isActive = idx === activeChapterIndex;
                              const isBookmarked = bookmarks.includes(idx);
                              return (
                                <button
                                  key={idx}
                                  onClick={() => {
                                    setActiveChapterIndex(idx);
                                    if (window.speechSynthesis) window.speechSynthesis.cancel();
                                    setIsPlaying(false);
                                    // auto-close sidebar on mobile
                                    if (window.innerWidth < 768) setSidebarOpen(false);
                                  }}
                                  className={`w-full text-left px-3 py-2 rounded-lg text-xs transition cursor-pointer flex items-center justify-between ${
                                    isActive 
                                      ? "bg-[#8C4E35]/10 text-[#5C3220] border-l-4 border-[#8C4E35] font-bold" 
                                      : "text-[#544436] hover:bg-[#DFD5C6]/60"
                                  }`}
                                >
                                  <span className="truncate pr-2">{chap.title}</span>
                                  {isBookmarked && <FaBookmark className="text-amber-700 shrink-0 text-[10px]" />}
                                </button>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Bookmarks Accordion */}
                    {hasTextContent && (
                      <div className="border-b border-[#DFD5C6]/60 pb-3">
                        <button 
                          onClick={() => setBookmarksExpanded(!bookmarksExpanded)}
                          className="w-full flex items-center justify-between text-xs font-bold text-[#544436] uppercase tracking-wider py-1.5 text-left cursor-pointer"
                        >
                          <span>Bookmarks ({bookmarks.length})</span>
                          {bookmarksExpanded ? <FaChevronUp /> : <FaChevronDown />}
                        </button>
                        
                        {bookmarksExpanded && (
                          <div className="mt-2 space-y-1.5">
                            {bookmarks.length === 0 ? (
                              <p className="text-[11px] text-[#8C7B67] italic px-2">No bookmarks saved.</p>
                            ) : (
                              bookmarks.map((chapIdx) => (
                                <button
                                  key={chapIdx}
                                  onClick={() => {
                                    setActiveChapterIndex(chapIdx);
                                    if (window.speechSynthesis) window.speechSynthesis.cancel();
                                    setIsPlaying(false);
                                    if (window.innerWidth < 768) setSidebarOpen(false);
                                  }}
                                  className="w-full text-left px-3 py-1.5 rounded-lg text-xs text-[#544436] hover:bg-[#DFD5C6]/60 transition cursor-pointer flex items-center gap-2"
                                >
                                  <FaBookmark className="text-amber-700 text-[10px]" />
                                  <span className="truncate">{chapters[chapIdx]?.title || `Chapter ${chapIdx + 1}`}</span>
                                </button>
                              ))
                            )}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Reader Notes Accordion */}
                    {hasTextContent && (
                      <div className="border-b border-[#DFD5C6]/60 pb-3">
                        <button 
                          onClick={() => setNotesExpanded(!notesExpanded)}
                          className="w-full flex items-center justify-between text-xs font-bold text-[#544436] uppercase tracking-wider py-1.5 text-left cursor-pointer"
                        >
                          <span>Reader Notes</span>
                          {notesExpanded ? <FaChevronUp /> : <FaChevronDown />}
                        </button>
                        
                        {notesExpanded && (
                          <div className="mt-2">
                            <textarea
                              value={notes}
                              onChange={(e) => handleSaveNotes(e.target.value)}
                              placeholder="Write notes while reading..."
                              rows={4}
                              className="w-full text-xs p-2.5 rounded-lg border border-[#DFD5C6] bg-[#FAF5EE] text-[#2C1F15] focus:outline-none focus:border-[#A05A3A]/50 resize-none font-sans"
                            />
                            <p className="text-[9px] text-[#8C7B67] mt-1 italic">Auto-saves to browser storage</p>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Synopsis (Fallback / Info) */}
                    <div className="pt-2">
                      <h4 className="text-xs font-bold text-[#8C7B67] uppercase tracking-wider mb-2">
                        Synopsis
                      </h4>
                      <p className="text-xs leading-relaxed text-[#544436] line-clamp-6" title={book?.description}>
                        {book?.description}
                      </p>
                    </div>

                  </div>
                </div>
              </aside>
            )}

            {/* MAIN READER WORKSPACE PANEL */}
            {hasTextContent ? (
              // Immersive HTML Text E-Reader
              <div className={`flex-1 flex flex-col overflow-y-auto overflow-x-hidden relative ${THEME_STYLES[readerTheme].bg} transition-colors duration-300`}>
                
                {/* Desktop Floating Settings Panel / Mobile bottom sheet */}
                {controlsOpen && (
                  <>
                    {/* Backdrop for closing overlay on click outside */}
                    <div 
                      onClick={() => setControlsOpen(false)}
                      className="absolute inset-0 bg-transparent z-30"
                    />

                    {/* Floating Settings Card */}
                    <div className="absolute md:right-6 md:top-6 fixed bottom-0 left-0 right-0 z-40 bg-[#1C1613] border-t border-[#2C211D] md:border md:rounded-2xl p-5 shadow-2xl md:w-72 text-zinc-100 flex flex-col gap-4 rounded-t-3xl md:rounded-2xl">
                      <div className="flex justify-between items-center border-b border-[#2C211D] pb-3">
                        <span className="text-sm font-bold font-serif text-[#D87F4A]">Reader Options</span>
                        <button 
                          onClick={() => setControlsOpen(false)}
                          className="text-zinc-400 hover:text-white p-1 cursor-pointer"
                        >
                          <FaTimes size={14} />
                        </button>
                      </div>

                      {/* Font size control */}
                      <div className="flex flex-col gap-2">
                        <span className="text-xs text-zinc-400 font-semibold">Font Size</span>
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => setFontSize(Math.max(14, fontSize - 1))}
                            disabled={fontSize <= 14}
                            className="flex-1 bg-zinc-800 hover:bg-zinc-700 disabled:opacity-30 px-3 py-2 rounded-xl text-xs font-bold transition cursor-pointer"
                          >
                            A-
                          </button>
                          <span className="text-xs font-bold text-center w-8">{fontSize}px</span>
                          <button
                            onClick={() => setFontSize(Math.min(28, fontSize + 1))}
                            disabled={fontSize >= 28}
                            className="flex-1 bg-zinc-800 hover:bg-zinc-700 disabled:opacity-30 px-3 py-2 rounded-xl text-xs font-bold transition cursor-pointer"
                          >
                            A+
                          </button>
                        </div>
                      </div>

                      {/* Font Family control */}
                      <div className="flex flex-col gap-2">
                        <span className="text-xs text-zinc-400 font-semibold">Typography style</span>
                        <div className="flex gap-2">
                          <button
                            onClick={() => setFontFamily("serif")}
                            className={`flex-1 px-3 py-2 rounded-xl text-xs font-serif font-bold transition cursor-pointer border ${
                              fontFamily === "serif" 
                                ? "bg-[#8C4E35] border-[#D87F4A] text-white" 
                                : "bg-zinc-800 border-transparent text-zinc-300 hover:bg-zinc-700"
                            }`}
                          >
                            Classic Serif
                          </button>
                          <button
                            onClick={() => setFontFamily("sans")}
                            className={`flex-1 px-3 py-2 rounded-xl text-xs font-sans font-bold transition cursor-pointer border ${
                              fontFamily === "sans" 
                                ? "bg-[#8C4E35] border-[#D87F4A] text-white" 
                                : "bg-zinc-800 border-transparent text-zinc-300 hover:bg-zinc-700"
                            }`}
                          >
                            Modern Sans
                          </button>
                        </div>
                      </div>

                      {/* Page Theme controls */}
                      <div className="flex flex-col gap-2">
                        <span className="text-xs text-zinc-400 font-semibold">Reading Themes</span>
                        <div className="grid grid-cols-3 gap-2">
                          <button
                            onClick={() => setReaderTheme("cream")}
                            className={`px-2 py-2 rounded-xl text-[11px] font-semibold border transition cursor-pointer bg-[#FDF8F3] text-[#2C1F15] ${
                              readerTheme === "cream" ? "border-[#D87F4A] ring-2 ring-[#D87F4A]/30" : "border-zinc-700"
                            }`}
                          >
                            Parchment
                          </button>
                          <button
                            onClick={() => setReaderTheme("sepia")}
                            className={`px-2 py-2 rounded-xl text-[11px] font-semibold border transition cursor-pointer bg-[#F4ECCF] text-[#433422] ${
                              readerTheme === "sepia" ? "border-[#D87F4A] ring-2 ring-[#D87F4A]/30" : "border-zinc-700"
                            }`}
                          >
                            Sepia
                          </button>
                          <button
                            onClick={() => setReaderTheme("dark")}
                            className={`px-2 py-2 rounded-xl text-[11px] font-semibold border transition cursor-pointer bg-[#12100F] text-[#E5DED4] ${
                              readerTheme === "dark" ? "border-[#D87F4A] ring-2 ring-[#D87F4A]/30" : "border-zinc-700"
                            }`}
                          >
                            Dark Mode
                          </button>
                        </div>
                      </div>

                      {/* Text to Speech controls */}
                      <div className="flex flex-col gap-2 border-t border-[#2C211D] pt-3">
                        <span className="text-xs text-zinc-400 font-semibold flex items-center gap-1.5">
                          <FaVolumeUp />
                          Voice Read Aloud
                        </span>
                        <button
                          onClick={() => speakText(activeChapter?.content || "")}
                          className={`w-full py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
                            isPlaying 
                              ? "bg-rose-950/60 border border-rose-800 text-rose-300 hover:bg-rose-900/60" 
                              : "bg-[#8C4E35] hover:bg-[#5C3220] text-white"
                          }`}
                        >
                          {isPlaying ? (
                            <>
                              <FaPause /> Stop Voice
                            </>
                          ) : (
                            <>
                              <FaPlay /> Speak Chapter
                            </>
                          )}
                        </button>
                      </div>

                      {/* Fullscreen control */}
                      <button
                        onClick={toggleFullscreen}
                        className="w-full border border-zinc-700 hover:bg-zinc-800 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer mt-1"
                      >
                        <FaExpand size={11} />
                        {isFullscreen ? "Exit Fullscreen" : "Fullscreen Mode"}
                      </button>
                    </div>
                  </>
                )}

                {/* Centered Book Pages Canvas */}
                <div className="flex-1 overflow-y-auto px-4 sm:px-8 py-6 sm:py-12 flex justify-center">
                  <div className={`w-full max-w-3xl h-fit min-h-full rounded-2xl shadow-lg border p-6 sm:p-12 transition-all duration-300 ${THEME_STYLES[readerTheme].bg} ${THEME_STYLES[readerTheme].text} ${THEME_STYLES[readerTheme].border} flex flex-col justify-between`}>
                    
                    {/* Visual Reading Progress Bar */}
                    {chapters.length > 0 && (
                      <div className="w-full h-1 bg-amber-900/10 rounded-full overflow-hidden mb-6 shrink-0">
                        <div 
                          style={{ width: `${((activeChapterIndex + 1) / chapters.length) * 100}%` }}
                          className="h-full bg-gradient-to-r from-amber-600 to-amber-800 transition-all duration-300"
                        />
                      </div>
                    )}

                    {/* Chapter Header Typography */}
                    <div className={`border-b ${THEME_STYLES[readerTheme].divider} pb-4 mb-6 sm:mb-8 text-center`}>
                      <span className={`font-serif font-bold uppercase tracking-wider text-xs ${THEME_STYLES[readerTheme].tag}`}>
                        {activeChapter?.title?.split(":")[0] || `Chapter ${activeChapterIndex + 1}`}
                      </span>
                      <h1 className={`font-serif font-bold text-2xl sm:text-3xl mt-1 leading-tight ${THEME_STYLES[readerTheme].title}`}>
                        {activeChapter?.title?.split(":")[1]?.trim() || activeChapter?.title || "Story Section"}
                      </h1>
                    </div>

                    {/* Styled Reading Text Area */}
                    <div className="flex-1 select-text">
                      {activeChapter?.content ? (
                        (() => {
                          const paragraphs = activeChapter.content
                            .split(/\n+/)
                            .map(p => p.trim())
                            .filter(p => p.length > 0);
                            
                          if (paragraphs.length === 0) return null;
                          
                          const firstPara = paragraphs[0];
                          const firstLetter = firstPara.charAt(0);
                          const restOfFirstPara = firstPara.slice(1);
                          
                          return (
                            <div 
                              style={{ fontSize: `${fontSize}px` }} 
                              className={`leading-relaxed text-justify select-text space-y-5 break-words ${
                                fontFamily === "serif" ? "font-serif" : "font-sans"
                              }`}
                            >
                              <p>
                                <span className="float-left text-5xl sm:text-6xl font-serif font-bold text-[#8C4E35] mr-3 mt-1.5 leading-none">
                                  {firstLetter}
                                </span>
                                {restOfFirstPara}
                              </p>
                              {paragraphs.slice(1).map((para, idx) => (
                                <p key={idx} className="indent-6 sm:indent-8">
                                  {para}
                                </p>
                              ))}
                            </div>
                          );
                        })()
                      ) : (
                        <p className="text-slate-400 italic text-center py-10">This chapter contains no text content.</p>
                      )}
                    </div>

                    {/* Book page Footer Navigation Flow */}
                    <div className={`border-t ${THEME_STYLES[readerTheme].divider} pt-8 mt-12 space-y-6`}>
                      
                      {/* Navigation Chapter Buttons */}
                      <div className="flex flex-wrap items-center justify-between gap-4">
                        
                        {/* Prev button */}
                        <button
                          onClick={() => {
                            if (activeChapterIndex > 0) {
                              setActiveChapterIndex(activeChapterIndex - 1);
                              localStorage.setItem(`bookmark_${id}`, activeChapterIndex - 1);
                              if (window.speechSynthesis) window.speechSynthesis.cancel();
                              setIsPlaying(false);
                            }
                          }}
                          disabled={activeChapterIndex === 0}
                          className="bg-[#722F37] hover:bg-[#5C242B] disabled:opacity-30 disabled:hover:bg-[#722F37] text-white border border-[#5C242B] px-4 py-2.5 rounded-xl flex flex-col items-start cursor-pointer transition select-none min-w-[120px] max-w-[160px] flex-1 disabled:cursor-not-allowed"
                        >
                          <span className="text-[10px] text-amber-300 font-bold uppercase">Previous</span>
                          <span className="text-xs truncate w-full font-serif font-semibold text-zinc-100">
                            {activeChapterIndex > 0 ? chapters[activeChapterIndex - 1]?.title?.split(":")[0] || `Ch. ${activeChapterIndex}` : "At Start"}
                          </span>
                        </button>

                        {/* Continue reading Bookmark btn */}
                        <button
                          onClick={() => {
                            handleToggleBookmark(activeChapterIndex);
                            showToast("Bookmark Saved! 🔖 Progress saved to this chapter.");
                          }}
                          className="bg-[#722F37] hover:bg-[#5C242B] text-white px-5 py-3.5 rounded-xl font-bold cursor-pointer transition shadow-md flex items-center gap-2 select-none text-xs tracking-wide flex-1 justify-center sm:flex-initial"
                        >
                          <FaBookmark className="text-amber-300 text-xs" />
                          <span>Bookmark Progress</span>
                        </button>

                        {/* Next button */}
                        <button
                          onClick={() => {
                            if (activeChapterIndex < chapters.length - 1) {
                              setActiveChapterIndex(activeChapterIndex + 1);
                              localStorage.setItem(`bookmark_${id}`, activeChapterIndex + 1);
                              if (window.speechSynthesis) window.speechSynthesis.cancel();
                              setIsPlaying(false);
                            }
                          }}
                          disabled={activeChapterIndex === chapters.length - 1}
                          className="bg-[#722F37] hover:bg-[#5C242B] disabled:opacity-30 disabled:hover:bg-[#722F37] text-white border border-[#5C242B] px-4 py-2.5 rounded-xl flex flex-col items-end cursor-pointer transition select-none min-w-[120px] max-w-[160px] flex-1 disabled:cursor-not-allowed"
                        >
                          <span className="text-[10px] text-amber-300 font-bold uppercase">Next Chapter</span>
                          <span className="text-xs truncate w-full font-serif font-semibold text-zinc-100 text-right">
                            {activeChapterIndex < chapters.length - 1 ? chapters[activeChapterIndex + 1]?.title?.split(":")[0] || `Ch. ${activeChapterIndex + 2}` : "End of Book"}
                          </span>
                        </button>

                      </div>

                      {/* Chapter rating widget */}
                      <div className={`flex flex-col sm:flex-row items-center justify-between border-t ${THEME_STYLES[readerTheme].divider} pt-6 gap-2`}>
                        <span className={`text-xs ${THEME_STYLES[readerTheme].text} opacity-70 font-medium font-serif italic`}>Rate this chapter:</span>
                        <div className="flex items-center gap-1.5">
                          {[1, 2, 3, 4, 5].map((star) => {
                            const activeRating = chapterRatings[activeChapterIndex] || 0;
                            const isSelected = star <= activeRating;
                            return (
                              <button
                                key={star}
                                onClick={() => handleRateChapter(star)}
                                className="text-lg cursor-pointer transition transform hover:scale-110"
                              >
                                {isSelected ? (
                                  <FaStar className="text-amber-500" />
                                ) : (
                                  <FaRegStar className={`${THEME_STYLES[readerTheme].text} opacity-40 hover:opacity-100 hover:text-[#D87F4A]`} />
                                )}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                    </div>

                  </div>
                </div>

              </div>
            ) : (
              // PDF Iframe Reader Fallback (For uploaded PDF books that lack raw content text)
              <>
                {/* Simulated Desktop Mahogany desk & Hardcover book binder container */}
                <main className="flex-1 bg-gradient-to-br from-[#1C1512] via-[#120F0D] to-[#0A0706] p-2 sm:p-6 md:p-8 flex items-center justify-center overflow-hidden relative">
                  
                  {/* Outer Hardcover leather binder mockup - Responsive */}
                  <div className="w-full max-w-5xl h-full flex items-stretch bg-[#221713] border border-[#2C1F1B] md:border-4 md:border-[#2A1812] md:bg-[#38231B] md:shadow-[0_20px_50px_rgba(0,0,0,0.85)] rounded-xl md:rounded-[32px] p-1 sm:p-2 md:p-4 relative overflow-hidden">
                    
                    {/* Styled e-Reader Iframe */}
                    <iframe
                      src={`${book?.pdfFile}#toolbar=0`}
                      title={book?.title}
                      className="w-full h-full rounded-lg md:rounded-2xl bg-white border border-[#DFD5C6] shadow-[inset_0_2px_8px_rgba(0,0,0,0.12)] z-0"
                    />
                  </div>

                </main>
              </>
            )}
          </div>
        </div>,
        document.body
      )}
      {/* Toast notifications */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-[200000] max-w-sm animate-fade-in text-left">
          <div className={`p-4 rounded-2xl shadow-xl flex items-start gap-3 border ${
            toast.type === "success" 
              ? "bg-[#FAF6F0] text-[#722F37] border-[#722F37]/20" 
              : "bg-red-50 text-red-950 border-red-200"
          }`}>
            <Info size={18} className={`shrink-0 mt-0.5 ${toast.type === "success" ? "text-amber-800" : "text-red-700"}`} />
            <div>
              <p className="text-xs font-bold leading-normal">{toast.message}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookDetails;