import React from "react";
import { useAudio } from "../../context/AudioContext.jsx";
import { Play, Pause, SkipBack, SkipForward, Headphones, ListMusic, Maximize2 } from "lucide-react";

const formatTime = (seconds) => {
  if (!seconds || isNaN(seconds)) return "00:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins < 10 ? "0" : ""}${mins}:${secs < 10 ? "0" : ""}${secs}`;
};

const AudioPlayerBar = () => {
  const {
    activeAudiobook,
    activeChapterIndex,
    isPlaying,
    currentTime,
    duration,
    pauseAudio,
    resumeAudio,
    handleNextChapter,
    handlePrevChapter,
    seekTo,
    openDrawer,
  } = useAudio();

  if (!activeAudiobook) return null;

  const chapters = activeAudiobook.chapters || [{ title: "Chapter 1" }];
  const currentChapter = chapters[activeChapterIndex] || chapters[0];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-slate-900/95 backdrop-blur-md border-t border-slate-800 text-slate-100 py-2.5 px-4 sm:px-8 shadow-2xl transition-transform animate-fade-in">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        
        {/* Left: Book Cover & Details */}
        <div
          onClick={openDrawer}
          className="flex items-center gap-3 cursor-pointer group min-w-0 max-w-[220px] sm:max-w-xs"
        >
          <img
            src={activeAudiobook.coverImage || "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80"}
            alt={activeAudiobook.title}
            className="w-11 h-14 object-cover rounded-lg shadow-md border border-slate-700 shrink-0 group-hover:scale-105 transition-transform"
          />
          <div className="min-w-0">
            <h4 className="text-xs font-bold text-white truncate group-hover:text-amber-400 transition">
              {activeAudiobook.title}
            </h4>
            <p className="text-[11px] text-slate-400 truncate">
              {currentChapter.title}
            </p>
          </div>
        </div>

        {/* Center: Controls & Scrubber */}
        <div className="flex-1 max-w-xl flex flex-col items-center gap-1.5">
          <div className="flex items-center gap-3">
            <button
              onClick={handlePrevChapter}
              className="p-1.5 text-slate-400 hover:text-white transition"
              title="Previous Chapter"
            >
              <SkipBack size={18} />
            </button>

            <button
              onClick={isPlaying ? pauseAudio : resumeAudio}
              className="w-9 h-9 rounded-full bg-amber-600 hover:bg-amber-500 text-white flex items-center justify-center shadow-md transition-transform active:scale-95"
            >
              {isPlaying ? <Pause size={18} className="fill-white" /> : <Play size={18} className="fill-white ml-0.5" />}
            </button>

            <button
              onClick={handleNextChapter}
              className="p-1.5 text-slate-400 hover:text-white transition"
              title="Next Chapter"
            >
              <SkipForward size={18} />
            </button>
          </div>

          {/* Timeline bar */}
          <div className="w-full flex items-center gap-2">
            <span className="text-[10px] font-mono text-slate-400 shrink-0">
              {formatTime(currentTime)}
            </span>
            <input
              type="range"
              min="0"
              max={duration || 100}
              value={currentTime}
              onChange={(e) => seekTo(Number(e.target.value))}
              className="w-full h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-amber-500"
            />
            <span className="text-[10px] font-mono text-slate-400 shrink-0">
              {formatTime(duration)}
            </span>
          </div>
        </div>

        {/* Right: Expand Drawer Button */}
        <div className="flex items-center gap-2">
          <button
            onClick={openDrawer}
            className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-amber-400 text-xs font-semibold px-3 py-1.5 rounded-full transition shadow-sm border border-slate-700"
          >
            <ListMusic size={15} />
            <span className="hidden sm:inline">Now Playing</span>
            <Maximize2 size={13} className="ml-1" />
          </button>
        </div>

      </div>
    </div>
  );
};

export default AudioPlayerBar;
