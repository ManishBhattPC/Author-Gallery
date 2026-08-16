import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAudio } from "../context/AudioContext.jsx";
import { getBooks } from "../services/bookService.js";
import {
  Headphones,
  Play,
  Heart,
  Star,
  Clock,
  Sparkles,
  Search,
  BookOpen,
  ChevronRight,
  BookmarkPlus,
  Flame,
  Mic
} from "lucide-react";

// Mock featured audiobook data if backend books do not have full chapters yet
const FEATURED_AUDIOBOOK = {
  _id: "featured-1",
  title: "The Silent River",
  author: { name: "Arjun Sharma" },
  rating: 4.8,
  reviewsCount: 320,
  duration: "6h 32m",
  chaptersCount: 12,
  description:
    "A heartbreaking tale of love, loss and courage set in the misty valleys of the Himalayas. Listen to the story that has moved thousands of hearts.",
  coverImage: "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=800&q=80",
  chapters: [
    { title: "Chapter 1: The Beginning", duration: 321, text: "A heartbreaking tale of love, loss and courage set in the misty valleys of the Himalayas." },
    { title: "Chapter 2: A New Path", duration: 431, text: "The journey begins as Arjun ventures into the mysterious valley of shadows." },
    { title: "Chapter 3: The Valley", duration: 407, text: "Secrets of the ancient river begin to surface under the moonlight." },
    { title: "Chapter 4: Lost and Found", duration: 513 },
    { title: "Chapter 5: The Storm", duration: 542 },
    { title: "Chapter 6: Letters Unspoken", duration: 359 },
    { title: "Chapter 7: The Silence", duration: 378 },
    { title: "Chapter 8: The Journey", duration: 523 },
    { title: "Chapter 9: The Truth", duration: 442 },
    { title: "Chapter 10: Letting Go", duration: 391 },
    { title: "Chapter 11: The Return", duration: 368 },
    { title: "Chapter 12: Home", duration: 347 },
  ],
};

const CONTINUE_LISTENING = [
  {
    _id: "featured-1",
    title: "The Silent River",
    chapter: "Chapter 8",
    progress: 64,
    coverImage: "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=800&q=80",
    author: { name: "Arjun Sharma" },
    chapters: FEATURED_AUDIOBOOK.chapters,
  },
  {
    _id: "cont-2",
    title: "Whispers of the Past",
    chapter: "Chapter 3",
    progress: 28,
    coverImage: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80",
    author: { name: "Kabir Malhotra" },
    chapters: [
      { title: "Chapter 1: Forgotten Tales", duration: 310 },
      { title: "Chapter 2: Shadows of Old", duration: 420 },
      { title: "Chapter 3: Whispers in the Wind", duration: 390 },
    ]
  },
  {
    _id: "cont-3",
    title: "Letters to the Wind",
    chapter: "Chapter 5",
    progress: 49,
    coverImage: "https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&w=800&q=80",
    author: { name: "Rohan Dev" },
    chapters: [
      { title: "Chapter 1: The Sealed Letter", duration: 280 },
      { title: "Chapter 5: Sent Across Oceans", duration: 450 },
    ]
  },
];

const GENRES = ["All", "Poetry", "Romance", "Mystery", "Fantasy", "Drama", "Self Growth", "History"];

const Audiobooks = () => {
  const { playAudiobook, openDrawer, activeAudiobook } = useAudio();
  const [selectedGenre, setSelectedGenre] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [booksList, setBooksList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAudiobooks = async () => {
      try {
        setLoading(true);
        const data = await getBooks();
        const extractedBooks = Array.isArray(data) ? data : (data?.books || []);
        setBooksList(extractedBooks);
      } catch (err) {
        console.error("Failed to load audiobooks:", err);
      } finally {
        setLoading(false);
      }
    };
    loadAudiobooks();
  }, []);

  const handleStartListening = (book) => {
    playAudiobook(book);
    openDrawer();
  };

  const safeBooksList = Array.isArray(booksList) ? booksList : [];
  const filteredBooks = safeBooksList.filter((book) => {
    const matchesSearch =
      book.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author?.name?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesGenre =
      selectedGenre === "All" || (book.genres && book.genres.includes(selectedGenre));
    return matchesSearch && matchesGenre;
  });

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-28 animate-fade-in">
      
      {/* Top Hero Banner (Featured Audiobook) */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-100/80 via-slate-50 to-slate-50 pt-8 pb-12 px-4 sm:px-8 md:px-12 border-b border-slate-200/50">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Hero 3D Book Cover */}
          <div className="lg:col-span-4 flex justify-center">
            <div className="relative group cursor-pointer" onClick={() => handleStartListening(FEATURED_AUDIOBOOK)}>
              <div className="w-64 h-88 sm:w-72 sm:h-96 rounded-2xl overflow-hidden shadow-2xl border border-slate-200/80 transition-transform duration-500 group-hover:scale-105 group-hover:-rotate-1">
                <img
                  src={FEATURED_AUDIOBOOK.coverImage}
                  alt={FEATURED_AUDIOBOOK.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white">
                  <span className="text-xs font-bold tracking-widest uppercase bg-slate-900/80 backdrop-blur-md px-3 py-1 rounded-full border border-slate-700">
                    Audio Edition
                  </span>
                  <div className="w-10 h-10 rounded-full bg-amber-800 text-white flex items-center justify-center shadow-lg group-hover:bg-amber-700 transition">
                    <Headphones size={20} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Hero Details */}
          <div className="lg:col-span-8 space-y-5 text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-800/10 border border-amber-800/20 text-amber-900 text-xs font-bold uppercase tracking-wider">
              <Sparkles size={14} className="text-amber-800" />
              <span>Featured Audiobook</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-serif font-bold text-slate-900 tracking-tight leading-tight">
              {FEATURED_AUDIOBOOK.title}
            </h1>

            <p className="text-lg font-semibold text-amber-800">
              by {FEATURED_AUDIOBOOK.author.name}
            </p>

            {/* Metrics */}
            <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-600">
              <div className="flex items-center gap-1 text-amber-500 font-bold">
                <Star size={16} className="fill-amber-400" />
                <span>{FEATURED_AUDIOBOOK.rating}</span>
                <span className="text-slate-400 font-normal">({FEATURED_AUDIOBOOK.reviewsCount} reviews)</span>
              </div>
              <span>•</span>
              <div className="flex items-center gap-1">
                <Clock size={15} />
                <span>{FEATURED_AUDIOBOOK.duration}</span>
              </div>
              <span>•</span>
              <div className="flex items-center gap-1">
                <BookOpen size={15} />
                <span>{FEATURED_AUDIOBOOK.chaptersCount} Chapters</span>
              </div>
            </div>

            <p className="text-sm sm:text-base text-slate-600 max-w-2xl leading-relaxed">
              {FEATURED_AUDIOBOOK.description}
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={() => handleStartListening(FEATURED_AUDIOBOOK)}
                className="flex items-center gap-2.5 bg-amber-800 hover:bg-amber-900 text-white font-bold px-7 py-3.5 rounded-full shadow-lg transition-transform hover:scale-105 active:scale-95 text-sm cursor-pointer"
              >
                <Play size={18} className="fill-white" />
                <span>Start Listening</span>
              </button>

              <button className="flex items-center gap-2 bg-white hover:bg-slate-100 text-slate-800 font-semibold px-6 py-3.5 rounded-full border border-slate-300 shadow-sm transition text-sm cursor-pointer">
                <BookmarkPlus size={18} className="text-slate-500" />
                <span>Add to Library</span>
              </button>
            </div>

            {/* Waveform Graphic */}
            <div className="pt-4 flex items-center gap-1 opacity-70">
              {[40, 65, 30, 85, 95, 50, 70, 45, 90, 60, 35, 75, 55, 80, 40, 65, 90, 30, 85, 50].map((h, i) => (
                <div
                  key={i}
                  className="w-1 bg-amber-800 rounded-full animate-pulse"
                  style={{ height: `${h * 0.3}px`, animationDelay: `${i * 0.1}s` }}
                />
              ))}
            </div>

          </div>

        </div>
      </section>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 md:px-12 space-y-12 pt-10">

        {/* Search & Filter Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200/70 shadow-sm">
          {/* Search Input */}
          <div className="relative w-full md:w-80">
            <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search audiobooks or narrators..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 rounded-xl text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-800/30 border border-slate-200/60"
            />
          </div>

          {/* Genre Pills */}
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
            {GENRES.map((genre) => (
              <button
                key={genre}
                onClick={() => setSelectedGenre(genre)}
                className={`px-4 py-2 rounded-full text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                  selectedGenre === genre
                    ? "bg-amber-800 text-white shadow-sm"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200/60"
                }`}
              >
                {genre}
              </button>
            ))}
          </div>
        </div>

        {/* Continue Listening Section */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-serif font-bold text-slate-900 flex items-center gap-2">
              <Clock size={20} className="text-amber-800" />
              <span>Continue Listening</span>
            </h2>
            <button className="text-xs font-bold text-amber-800 hover:underline flex items-center gap-1">
              <span>View all</span>
              <ChevronRight size={14} />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {CONTINUE_LISTENING.map((item) => (
              <div
                key={item._id}
                className="bg-white p-4 rounded-2xl border border-slate-200/70 shadow-sm hover:shadow-md transition flex items-center gap-4 group"
              >
                <img
                  src={item.coverImage}
                  alt={item.title}
                  className="w-16 h-20 object-cover rounded-xl shadow border border-slate-200/60 shrink-0 group-hover:scale-105 transition-transform"
                />
                <div className="flex-1 min-w-0 space-y-1.5">
                  <h3 className="text-sm font-bold text-slate-900 truncate">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-500">{item.chapter}</p>
                  
                  {/* Progress Bar */}
                  <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="bg-amber-800 h-full rounded-full"
                      style={{ width: `${item.progress}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-[11px] font-semibold text-slate-400">
                    <span>{item.progress}% completed</span>
                    <button
                      onClick={() => handleStartListening(item)}
                      className="text-amber-800 hover:text-amber-900 font-bold flex items-center gap-1"
                    >
                      <Play size={12} className="fill-amber-800" />
                      <span>Continue</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Trending Audiobooks Section */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-serif font-bold text-slate-900 flex items-center gap-2">
              <Flame size={20} className="text-amber-800" />
              <span>Trending Audiobooks</span>
            </h2>
            <Link to="/books" className="text-xs font-bold text-amber-800 hover:underline flex items-center gap-1">
              <span>Explore all</span>
              <ChevronRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
            {(filteredBooks.length > 0 ? filteredBooks : [
              {
                _id: "tb-1",
                title: "The Last Light",
                author: { name: "Neera Iyer" },
                rating: 4.7,
                duration: "7h 12m",
                coverImage: "https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&w=600&q=80",
                chapters: [{ title: "Chapter 1", duration: 340 }]
              },
              {
                _id: "tb-2",
                title: "Before We Forget",
                author: { name: "Kabir Malhotra" },
                rating: 4.6,
                duration: "5h 48m",
                coverImage: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=600&q=80",
                chapters: [{ title: "Chapter 1", duration: 380 }]
              },
              {
                _id: "tb-3",
                title: "Shadows of Time",
                author: { name: "Ishita Verma" },
                rating: 4.9,
                duration: "8h 03m",
                coverImage: "https://images.unsplash.com/photo-1476275466078-4007374efbbe?auto=format&fit=crop&w=600&q=80",
                chapters: [{ title: "Chapter 1", duration: 420 }]
              },
              {
                _id: "tb-4",
                title: "And The Stars Listened",
                author: { name: "Rohan Dev" },
                rating: 4.8,
                duration: "6h 15m",
                coverImage: "https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&w=600&q=80",
                chapters: [{ title: "Chapter 1", duration: 310 }]
              },
              {
                _id: "tb-5",
                title: "The October Junction",
                author: { name: "Arjun Sharma" },
                rating: 4.7,
                duration: "6h 42m",
                coverImage: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80",
                chapters: [{ title: "Chapter 1", duration: 390 }]
              },
            ]).map((book) => (
              <div
                key={book._id}
                className="bg-white rounded-2xl overflow-hidden border border-slate-200/70 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col group"
              >
                <div className="relative aspect-[3/4] overflow-hidden bg-slate-100">
                  <img
                    src={book.coverImage || "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80"}
                    alt={book.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <button
                    onClick={() => handleStartListening(book)}
                    className="absolute bottom-3 right-3 w-10 h-10 rounded-full bg-amber-800 text-white flex items-center justify-center shadow-lg transition-transform group-hover:scale-110"
                  >
                    <Play size={18} className="fill-white ml-0.5" />
                  </button>
                  <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                    <Headphones size={11} className="text-amber-400" />
                    <span>Audio</span>
                  </div>
                </div>

                <div className="p-3.5 flex-1 flex flex-col justify-between space-y-2">
                  <div>
                    <h3 className="text-sm font-serif font-bold text-slate-900 truncate group-hover:text-amber-800 transition">
                      {book.title}
                    </h3>
                    <p className="text-xs text-slate-500 truncate">
                      {book.author?.name || book.author || "Unknown Author"}
                    </p>
                  </div>

                  <div className="flex items-center justify-between text-xs font-semibold text-slate-500 pt-2 border-t border-slate-100">
                    <div className="flex items-center gap-1 text-amber-500">
                      <Star size={13} className="fill-amber-400" />
                      <span>{book.rating || 4.7}</span>
                    </div>
                    <span>{book.duration || "6h 15m"}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* New Voices Section */}
        <section className="space-y-4 pt-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-serif font-bold text-slate-900 flex items-center gap-2">
              <Mic size={20} className="text-amber-800" />
              <span>New Voices & Narrators</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: "Beyond the Horizon", narrator: "Ananya Rao", duration: "4h 33m", cover: "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=600&q=80" },
              { title: "Echoes of Tomorrow", narrator: "Vivaan Sharma", duration: "5h 20m", cover: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80" },
              { title: "Pieces of Us", narrator: "Neha Kulkarni", duration: "3h 58m", cover: "https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?auto=format&fit=crop&w=600&q=80" },
              { title: "The Colour of Memories", narrator: "Arpit Lane", duration: "4h 41m", cover: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=600&q=80" },
            ].map((voice, i) => (
              <div key={i} className="bg-white p-4 rounded-2xl border border-slate-200/70 shadow-sm flex items-center gap-4 group hover:shadow-md transition">
                <img src={voice.cover} alt={voice.title} className="w-14 h-18 object-cover rounded-xl shadow shrink-0" />
                <div className="min-w-0 space-y-1">
                  <h3 className="text-xs font-bold text-slate-900 truncate">{voice.title}</h3>
                  <p className="text-[11px] text-amber-800 font-medium truncate">Narrated by {voice.narrator}</p>
                  <p className="text-[10px] text-slate-400 font-mono">{voice.duration}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
};

export default Audiobooks;
