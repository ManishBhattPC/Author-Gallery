import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAudio } from "../context/AudioContext.jsx";
import { getMyBooks } from "../services/bookService.js";
import {
  Headphones,
  Mic,
  Play,
  Pause,
  Upload,
  Sparkles,
  BookOpen,
  CheckCircle2,
  Volume2,
  FileText,
  Sliders,
  ArrowRight,
  Loader2
} from "lucide-react";

const NARRATION_VOICES = [
  { id: "voice-1", name: "Alexander (Warm British Male)", accent: "en-GB", gender: "Male", desc: "Warm, rich, authoritative tone ideal for fiction and drama." },
  { id: "voice-2", name: "Serena (Clear American Female)", accent: "en-US", gender: "Female", desc: "Crisp, expressive, modern voice perfect for contemporary novels." },
  { id: "voice-3", name: "Ethan (Narrator Deep Tone)", accent: "en-US", gender: "Male", desc: "Deep, soothing storytelling voice for mystery and non-fiction." },
  { id: "voice-4", name: "Browser Speech Engine (System Default)", accent: "en-US", gender: "Dynamic", desc: "Uses native Web Speech API synthesis automatically." },
];

const CreateAudiobook = () => {
  const navigate = useNavigate();
  const { playAudiobook, isPlaying, pauseAudio } = useAudio();

  const [myBooks, setMyBooks] = useState([]);
  const [selectedBookId, setSelectedBookId] = useState("");
  const [creationMode, setCreationMode] = useState("tts"); // 'tts' (AI Text-to-Speech) or 'upload' (Audio File)
  const [title, setTitle] = useState("");
  const [selectedVoice, setSelectedVoice] = useState("voice-1");
  const [narrationSpeed, setNarrationSpeed] = useState("1.0");
  const [chapterText, setChapterText] = useState("");
  const [audioFile, setAudioFile] = useState(null);
  const [isPreviewing, setIsPreviewing] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishedSuccess, setPublishedSuccess] = useState(false);

  useEffect(() => {
    const fetchAuthorBooks = async () => {
      try {
        const data = await getMyBooks();
        const books = Array.isArray(data) ? data : (data?.books || []);
        setMyBooks(books);
        if (books.length > 0) {
          setSelectedBookId(books[0]._id);
          setTitle(books[0].title + " (Audio Edition)");
          setChapterText(books[0].description || books[0].content || "");
        }
      } catch (err) {
        console.error("Failed to load author books:", err);
      }
    };
    fetchAuthorBooks();
  }, []);

  const handleBookChange = (e) => {
    const bookId = e.target.value;
    setSelectedBookId(bookId);
    const found = myBooks.find((b) => b._id === bookId);
    if (found) {
      setTitle(found.title + " (Audio Edition)");
      setChapterText(found.description || found.content || "");
    }
  };

  const handlePreviewNarration = () => {
    if (!chapterText.trim()) return;

    if (isPlaying) {
      pauseAudio();
      setIsPreviewing(false);
    } else {
      const mockBook = {
        title: title || "Sample Audiobook",
        author: { name: "Author Studio Preview" },
        coverImage: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80",
        chapters: [{ title: "Chapter 1 Preview", duration: 180, text: chapterText }]
      };
      playAudiobook(mockBook, 0);
      setIsPreviewing(true);
    }
  };

  const handlePublishAudiobook = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      setIsPublishing(true);
      // Simulate API publishing delay
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setPublishedSuccess(true);
      setTimeout(() => {
        navigate("/audiobooks");
      }, 2000);
    } catch (err) {
      console.error("Publishing error:", err);
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 px-4 py-10 sm:px-6 lg:px-8 animate-fade-in">
      <div className="mx-auto max-w-4xl space-y-8">

        {/* Header Banner */}
        <div className="bg-gradient-to-r from-amber-900 via-amber-800 to-amber-950 rounded-3xl p-6 sm:p-8 text-amber-50 shadow-xl border border-amber-800/40 relative overflow-hidden">
          <div className="relative z-10 space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-700/30 border border-amber-600/30 rounded-full text-xs font-bold uppercase tracking-wider text-amber-200">
              <Mic size={14} className="text-amber-400" />
              <span>Author Audio Studio</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-serif font-bold text-white tracking-tight">
              Create & Publish Your Audiobook
            </h1>
            <p className="text-xs sm:text-sm text-amber-200/90 max-w-2xl">
              Turn your published books and chapters into immersive audiobooks using AI Text-to-Speech voice synthesis or upload your custom recorded MP3/M4A narrations.
            </p>
          </div>
          <Headphones size={180} className="absolute -right-10 -bottom-10 opacity-10 text-white pointer-events-none" />
        </div>

        {/* Success Alert */}
        {publishedSuccess && (
          <div className="rounded-2xl border border-emerald-300 bg-emerald-50 p-4 text-emerald-800 flex items-center gap-3 animate-fade-in">
            <CheckCircle2 size={24} className="text-emerald-600 shrink-0" />
            <div>
              <p className="font-bold text-sm">Audiobook Published Successfully!</p>
              <p className="text-xs text-emerald-700">Redirecting to the public Audiobook catalog...</p>
            </div>
          </div>
        )}

        {/* Form Container */}
        <form onSubmit={handlePublishAudiobook} className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/70 shadow-sm space-y-8">
          
          {/* Section 1: Book Selection */}
          <div className="space-y-4">
            <h2 className="text-lg font-serif font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
              <BookOpen size={20} className="text-amber-800" />
              <span>1. Select Book & Details</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Select Existing Work
                </label>
                <select
                  value={selectedBookId}
                  onChange={handleBookChange}
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-800/30"
                >
                  <option value="">-- Create Standalone Audiobook --</option>
                  {myBooks.map((b) => (
                    <option key={b._id} value={b._id}>
                      {b.title} ({b.genres ? b.genres.join(", ") : "Book"})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Audiobook Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. The Silent River (Audio Edition)"
                  required
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-800/30"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Creation Mode Selector */}
          <div className="space-y-4">
            <h2 className="text-lg font-serif font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
              <Sparkles size={20} className="text-amber-800" />
              <span>2. Audio Creation Method</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setCreationMode("tts")}
                className={`p-5 rounded-2xl border text-left transition flex flex-col justify-between space-y-3 cursor-pointer ${
                  creationMode === "tts"
                    ? "bg-amber-800/10 border-amber-800 text-amber-900 shadow-sm"
                    : "bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-300"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="p-2 bg-amber-800 text-white rounded-xl">
                    <Sparkles size={20} />
                  </span>
                  {creationMode === "tts" && <CheckCircle2 size={20} className="text-amber-800" />}
                </div>
                <div>
                  <h3 className="font-bold text-sm">AI Text-to-Speech Engine</h3>
                  <p className="text-xs text-slate-500 mt-1">Convert your written chapter text automatically into spoken audio narration.</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setCreationMode("upload")}
                className={`p-5 rounded-2xl border text-left transition flex flex-col justify-between space-y-3 cursor-pointer ${
                  creationMode === "upload"
                    ? "bg-amber-800/10 border-amber-800 text-amber-900 shadow-sm"
                    : "bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-300"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="p-2 bg-slate-800 text-white rounded-xl">
                    <Upload size={20} />
                  </span>
                  {creationMode === "upload" && <CheckCircle2 size={20} className="text-amber-800" />}
                </div>
                <div>
                  <h3 className="font-bold text-sm">Upload Pre-recorded Audio</h3>
                  <p className="text-xs text-slate-500 mt-1">Upload high-quality MP3, M4A, or WAV audio files recorded in studio.</p>
                </div>
              </button>
            </div>
          </div>

          {/* Section 3: Engine Config or Upload */}
          {creationMode === "tts" ? (
            <div className="space-y-5 bg-slate-50 p-6 rounded-2xl border border-slate-200/70">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Sliders size={16} className="text-amber-800" />
                  <span>Configure AI Voice & Narrator</span>
                </h3>
                <span className="text-xs font-semibold text-amber-800 bg-amber-100 px-2.5 py-1 rounded-full">
                  Speech Engine Active
                </span>
              </div>

              {/* Voice Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {NARRATION_VOICES.map((v) => (
                  <button
                    key={v.id}
                    type="button"
                    onClick={() => setSelectedVoice(v.id)}
                    className={`p-3.5 rounded-xl border text-left transition text-xs space-y-1 cursor-pointer ${
                      selectedVoice === v.id
                        ? "bg-white border-amber-800 text-amber-900 font-bold shadow-sm"
                        : "bg-white border-slate-200 text-slate-700 hover:border-slate-300"
                    }`}
                  >
                    <p className="font-bold">{v.name}</p>
                    <p className="text-[11px] text-slate-500 font-normal">{v.desc}</p>
                  </button>
                ))}
              </div>

              {/* Text Area */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Chapter Text / Script for Narration
                </label>
                <textarea
                  rows={6}
                  value={chapterText}
                  onChange={(e) => setChapterText(e.target.value)}
                  placeholder="Paste or write your book chapter text here..."
                  className="w-full p-4 rounded-xl bg-white border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-800/30 leading-relaxed font-sans"
                />
              </div>

              {/* Preview Button */}
              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={handlePreviewNarration}
                  className="flex items-center gap-2 bg-amber-800/10 hover:bg-amber-800/20 text-amber-900 font-bold px-5 py-2.5 rounded-xl text-xs transition cursor-pointer"
                >
                  {isPlaying ? <Pause size={16} /> : <Play size={16} className="fill-amber-900" />}
                  <span>{isPlaying ? "Stop Voice Preview" : "Preview Voice Narration"}</span>
                </button>
                <span className="text-xs text-slate-400 font-mono">
                  {chapterText.split(/\s+/).filter(Boolean).length} words
                </span>
              </div>
            </div>
          ) : (
            <div className="space-y-4 bg-slate-50 p-6 rounded-2xl border border-slate-200/70 text-center">
              <Upload size={36} className="mx-auto text-amber-800" />
              <div>
                <h3 className="font-bold text-sm text-slate-900">Upload Audio File</h3>
                <p className="text-xs text-slate-500 mt-1">Supported formats: MP3, M4A, WAV (Max size: 100MB)</p>
              </div>
              <input
                type="file"
                accept="audio/*"
                onChange={(e) => setAudioFile(e.target.files[0])}
                className="block w-full text-xs text-slate-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-amber-800 file:text-white hover:file:bg-amber-900 cursor-pointer"
              />
            </div>
          )}

          {/* Submit Button */}
          <div className="pt-4 flex items-center justify-end gap-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => navigate("/author-dashboard")}
              className="px-6 py-3 rounded-xl border border-slate-300 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPublishing}
              className="flex items-center gap-2 bg-amber-800 hover:bg-amber-900 text-white font-bold px-8 py-3.5 rounded-xl shadow-lg transition-transform active:scale-95 text-sm cursor-pointer disabled:opacity-50"
            >
              {isPublishing ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  <span>Publishing...</span>
                </>
              ) : (
                <>
                  <span>Publish Audiobook</span>
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};

export default CreateAudiobook;
