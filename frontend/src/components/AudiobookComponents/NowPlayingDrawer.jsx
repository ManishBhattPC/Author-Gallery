import React, { useState } from "react";
import { useAudio } from "../../context/AudioContext.jsx";
import {
  X,
  Play,
  Pause,
  RotateCcw,
  RotateCw,
  SkipBack,
  SkipForward,
  Heart,
  Download,
  Share2,
  ListMusic,
  Clock,
  Volume2,
  VolumeX,
  ChevronRight,
  Headphones
} from "lucide-react";

const SPEED_OPTIONS = [0.75, 1, 1.25, 1.5, 2];
const SLEEP_OPTIONS = [
  { label: "Off", value: null },
  { label: "15 min", value: 15 },
  { label: "30 min", value: 30 },
  { label: "45 min", value: 45 },
  { label: "60 min", value: 60 },
];

const formatTime = (seconds) => {
  if (!seconds || isNaN(seconds)) return "00:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins < 10 ? "0" : ""}${mins}:${secs < 10 ? "0" : ""}${secs}`;
};

const NowPlayingDrawer = () => {
  const {
    activeAudiobook,
    activeChapterIndex,
    isPlaying,
    playbackRate,
    currentTime,
    duration,
    isDrawerOpen,
    closeDrawer,
    pauseAudio,
    resumeAudio,
    playAudiobook,
    setPlaybackRate,
    seekTo,
    handleNextChapter,
    handlePrevChapter,
    sleepTimer,
    setSleepTimer,
  } = useAudio();

  const [activeTab, setActiveTab] = useState("chapters");
  const [isLiked, setIsLiked] = useState(false);

  if (!isDrawerOpen || !activeAudiobook) return null;

  const chapters = activeAudiobook.chapters || [
    { title: "Chapter 1: The Beginning", duration: 321 },
    { title: "Chapter 2: A New Path", duration: 431 },
    { title: "Chapter 3: The Valley", duration: 407 },
    { title: "Chapter 4: Lost and Found", duration: 513 },
    { title: "Chapter 5: The Storm", duration: 542 },
    { title: "Chapter 6: Letters Unspoken", duration: 359 },
    { title: "Chapter 7: The Silence", duration: 378 },
    { title: "Chapter 8: The Journey", duration: 523 },
    { title: "Chapter 9: The Truth", duration: 442 },
    { title: "Chapter 10: Letting Go", duration: 391 },
    { title: "Chapter 11: The Return", duration: 368 },
    { title: "Chapter 12: Home", duration: 347 },
  ];

  const currentChapter = chapters[activeChapterIndex] || chapters[0];

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 transition-opacity"
        onClick={closeDrawer}
      />

      {/* Slide-out Drawer */}
      <div className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-slate-50 border-l border-slate-200/60 shadow-2xl z-50 flex flex-col overflow-y-auto animate-fade-in text-slate-900">
        
        {/* Top Bar */}
        <div className="sticky top-0 bg-slate-50/90 backdrop-blur-md px-6 py-4 border-b border-slate-200/60 flex items-center justify-between z-10">
          <button
            onClick={closeDrawer}
            className="p-2 rounded-full hover:bg-slate-200/60 text-slate-600 transition"
            aria-label="Close panel"
          >
            <X size={20} />
          </button>
          <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-amber-800">
            <Headphones size={14} />
            <span>Now Playing</span>
          </div>
          <div className="w-8" />
        </div>

        {/* Main Content */}
        <div className="p-6 flex-1 flex flex-col items-center">
          
          {/* Cover Art Display */}
          <div className="relative w-56 h-72 rounded-2xl overflow-hidden shadow-xl border border-slate-200/60 group mb-6">
            <img
              src={activeAudiobook.coverImage || "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80"}
              alt={activeAudiobook.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent" />
            <div className="absolute bottom-3 right-3 bg-slate-900/80 backdrop-blur-md text-amber-400 p-2 rounded-full shadow-lg">
              <Headphones size={16} />
            </div>
          </div>

          {/* Book Info */}
          <div className="text-center w-full mb-4">
            <h2 className="text-xl font-serif font-bold text-slate-900 truncate">
              {activeAudiobook.title}
            </h2>
            <p className="text-sm font-semibold text-amber-800 mt-0.5">
              by {activeAudiobook.author?.name || activeAudiobook.author || "Unknown Author"}
            </p>
            <p className="text-xs text-slate-500 mt-1 truncate">
              {currentChapter.title}
            </p>
          </div>

          {/* Action Icons */}
          <div className="flex items-center justify-center gap-6 mb-6 text-slate-500">
            <button
              onClick={() => setIsLiked(!isLiked)}
              className={`p-2 rounded-full transition ${
                isLiked ? "text-rose-500 bg-rose-50" : "hover:text-amber-800 hover:bg-slate-200/50"
              }`}
            >
              <Heart size={20} className={isLiked ? "fill-rose-500" : ""} />
            </button>
            <button className="p-2 rounded-full hover:text-amber-800 hover:bg-slate-200/50 transition">
              <Download size={20} />
            </button>
            <button className="p-2 rounded-full hover:text-amber-800 hover:bg-slate-200/50 transition">
              <Share2 size={20} />
            </button>
          </div>

          {/* Scrubber & Progress */}
          <div className="w-full space-y-2 mb-6">
            <input
              type="range"
              min="0"
              max={duration || 100}
              value={currentTime}
              onChange={(e) => seekTo(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-amber-800"
            />
            <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* Audio Controls Grid */}
          <div className="flex items-center justify-center gap-4 mb-6">
            <button
              onClick={() => seekTo(Math.max(0, currentTime - 15))}
              className="p-2.5 rounded-full hover:bg-slate-200/60 text-slate-600 transition"
              title="Rewind 15 seconds"
            >
              <RotateCcw size={20} />
            </button>

            <button
              onClick={handlePrevChapter}
              className="p-2.5 rounded-full hover:bg-slate-200/60 text-slate-700 transition"
              title="Previous Chapter"
            >
              <SkipBack size={22} />
            </button>

            <button
              onClick={isPlaying ? pauseAudio : resumeAudio}
              className="w-14 h-14 rounded-full bg-amber-800 hover:bg-amber-900 text-white flex items-center justify-center shadow-lg transition-transform hover:scale-105 active:scale-95"
            >
              {isPlaying ? <Pause size={26} className="fill-white" /> : <Play size={26} className="fill-white ml-1" />}
            </button>

            <button
              onClick={handleNextChapter}
              className="p-2.5 rounded-full hover:bg-slate-200/60 text-slate-700 transition"
              title="Next Chapter"
            >
              <SkipForward size={22} />
            </button>

            <button
              onClick={() => seekTo(Math.min(duration, currentTime + 15))}
              className="p-2.5 rounded-full hover:bg-slate-200/60 text-slate-600 transition"
              title="Skip 15 seconds"
            >
              <RotateCw size={20} />
            </button>
          </div>

          {/* Speed Selector Pills */}
          <div className="flex items-center justify-center gap-1.5 bg-slate-200/50 p-1.5 rounded-2xl w-full max-w-xs mb-6">
            {SPEED_OPTIONS.map((rate) => (
              <button
                key={rate}
                onClick={() => setPlaybackRate(rate)}
                className={`flex-1 py-1 text-xs font-bold rounded-xl transition ${
                  playbackRate === rate
                    ? "bg-amber-800 text-white shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {rate}x
              </button>
            ))}
          </div>

          {/* Tabs: Chapters / Sleep Timer */}
          <div className="w-full border-t border-slate-200/60 pt-4">
            <div className="flex border-b border-slate-200/60 mb-4">
              <button
                onClick={() => setActiveTab("chapters")}
                className={`flex items-center gap-2 pb-2 px-4 text-sm font-semibold border-b-2 transition ${
                  activeTab === "chapters"
                    ? "border-amber-800 text-amber-800"
                    : "border-transparent text-slate-500 hover:text-slate-800"
                }`}
              >
                <ListMusic size={16} />
                <span>Chapters</span>
                <span className="text-xs bg-slate-200 px-1.5 py-0.5 rounded-full font-bold">
                  {chapters.length}
                </span>
              </button>

              <button
                onClick={() => setActiveTab("timer")}
                className={`flex items-center gap-2 pb-2 px-4 text-sm font-semibold border-b-2 transition ${
                  activeTab === "timer"
                    ? "border-amber-800 text-amber-800"
                    : "border-transparent text-slate-500 hover:text-slate-800"
                }`}
              >
                <Clock size={16} />
                <span>Sleep Timer</span>
                {sleepTimer && (
                  <span className="text-xs bg-amber-800 text-white px-1.5 py-0.5 rounded-full font-bold">
                    {sleepTimer}m
                  </span>
                )}
              </button>
            </div>

            {/* Chapters Tab Content */}
            {activeTab === "chapters" && (
              <div className="space-y-1 max-h-56 overflow-y-auto pr-1">
                {chapters.map((ch, idx) => {
                  const isActive = idx === activeChapterIndex;
                  return (
                    <button
                      key={idx}
                      onClick={() => playAudiobook(activeAudiobook, idx)}
                      className={`w-full flex items-center justify-between p-3 rounded-xl text-left transition ${
                        isActive
                          ? "bg-amber-800/10 text-amber-900 font-bold border border-amber-800/20"
                          : "hover:bg-slate-100 text-slate-700 font-medium"
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <span className={`text-xs w-5 text-right font-mono ${isActive ? "text-amber-800" : "text-slate-400"}`}>
                          {idx + 1}.
                        </span>
                        <span className="text-xs truncate">{ch.title}</span>
                      </div>
                      <span className="text-[11px] text-slate-400 shrink-0 font-mono ml-2">
                        {formatTime(ch.duration)}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}

            {/* Sleep Timer Tab Content */}
            {activeTab === "timer" && (
              <div className="grid grid-cols-2 gap-2 py-2">
                {SLEEP_OPTIONS.map((opt) => (
                  <button
                    key={opt.label}
                    onClick={() => setSleepTimer(opt.value)}
                    className={`py-2.5 px-4 rounded-xl text-xs font-bold border transition ${
                      sleepTimer === opt.value
                        ? "bg-amber-800 text-white border-amber-800 shadow-sm"
                        : "bg-white border-slate-200 text-slate-700 hover:border-amber-800/40"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            )}

          </div>

        </div>
      </div>
    </>
  );
};

export default NowPlayingDrawer;
