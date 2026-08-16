import React, { createContext, useContext, useState, useEffect, useRef } from "react";

const AudioContext = createContext(null);

export const AudioProvider = ({ children }) => {
  const [activeAudiobook, setActiveAudiobook] = useState(null);
  const [activeChapterIndex, setActiveChapterIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [volume, setVolume] = useState(1);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [sleepTimer, setSleepTimerState] = useState(null); // minutes
  const [voices, setVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState(null);

  const utteranceRef = useRef(null);
  const timerIntervalRef = useRef(null);
  const sleepTimeoutRef = useRef(null);

  // Initialize Web Speech API Voices
  useEffect(() => {
    const updateVoices = () => {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        const availableVoices = window.speechSynthesis.getVoices();
        setVoices(availableVoices);
        if (availableVoices.length > 0 && !selectedVoice) {
          // Default to an English voice if available
          const defaultVoice = availableVoices.find(v => v.lang.includes("en")) || availableVoices[0];
          setSelectedVoice(defaultVoice);
        }
      }
    };

    updateVoices();
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.onvoiceschanged = updateVoices;
    }
  }, []);

  // Cleanup speech synthesis on unmount
  useEffect(() => {
    return () => {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      if (sleepTimeoutRef.current) clearTimeout(sleepTimeoutRef.current);
    };
  }, []);

  // Timer interval for playback progress simulation when speech is active
  useEffect(() => {
    if (isPlaying) {
      timerIntervalRef.current = setInterval(() => {
        setCurrentTime((prev) => {
          if (prev >= duration && duration > 0) {
            handleNextChapter();
            return 0;
          }
          return prev + 1;
        });
      }, 1000 / playbackRate);
    } else {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    }

    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, [isPlaying, duration, playbackRate]);

  // Handle Sleep Timer
  const setSleepTimer = (minutes) => {
    setSleepTimerState(minutes);
    if (sleepTimeoutRef.current) clearTimeout(sleepTimeoutRef.current);

    if (minutes) {
      sleepTimeoutRef.current = setTimeout(() => {
        pauseAudio();
        setSleepTimerState(null);
      }, minutes * 60 * 1000);
    }
  };

  const playAudiobook = (book, chapterIdx = 0) => {
    setActiveAudiobook(book);
    setActiveChapterIndex(chapterIdx);

    const chapters = book.chapters || [
      { title: "Chapter 1: The Beginning", duration: 321, text: book.description || book.content || "Welcome to " + book.title },
    ];

    const currentChapter = chapters[chapterIdx] || chapters[0];
    const estimatedDuration = currentChapter.duration || 300;
    setDuration(estimatedDuration);
    setCurrentTime(0);

    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();

      const textToSpeak = currentChapter.text || `${book.title}. ${currentChapter.title}. ${book.description || ""}`;
      const utterance = new SpeechSynthesisUtterance(textToSpeak);

      if (selectedVoice) utterance.voice = selectedVoice;
      utterance.rate = playbackRate;
      utterance.volume = volume;

      utterance.onend = () => {
        if (chapterIdx < chapters.length - 1) {
          playAudiobook(book, chapterIdx + 1);
        } else {
          setIsPlaying(false);
          setCurrentTime(0);
        }
      };

      utteranceRef.current = utterance;
      window.speechSynthesis.speak(utterance);
    }

    setIsPlaying(true);
  };

  const pauseAudio = () => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.pause();
    }
    setIsPlaying(false);
  };

  const resumeAudio = () => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
      } else if (activeAudiobook) {
        playAudiobook(activeAudiobook, activeChapterIndex);
      }
    }
    setIsPlaying(true);
  };

  const stopAudio = () => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    setIsPlaying(false);
    setCurrentTime(0);
  };

  const seekTo = (seconds) => {
    setCurrentTime(seconds);
  };

  const handleNextChapter = () => {
    if (!activeAudiobook) return;
    const chapters = activeAudiobook.chapters || [];
    if (activeChapterIndex < chapters.length - 1) {
      playAudiobook(activeAudiobook, activeChapterIndex + 1);
    } else {
      stopAudio();
    }
  };

  const handlePrevChapter = () => {
    if (!activeAudiobook) return;
    if (activeChapterIndex > 0) {
      playAudiobook(activeAudiobook, activeChapterIndex - 1);
    } else {
      seekTo(0);
    }
  };

  const updateRate = (newRate) => {
    setPlaybackRate(newRate);
    if (utteranceRef.current && isPlaying) {
      // Re-trigger speech with updated rate
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
        utteranceRef.current.rate = newRate;
        window.speechSynthesis.speak(utteranceRef.current);
      }
    }
  };

  return (
    <AudioContext.Provider
      value={{
        activeAudiobook,
        activeChapterIndex,
        isPlaying,
        playbackRate,
        volume,
        currentTime,
        duration,
        isDrawerOpen,
        sleepTimer,
        voices,
        selectedVoice,
        setSelectedVoice,
        setPlaybackRate: updateRate,
        setVolume,
        playAudiobook,
        pauseAudio,
        resumeAudio,
        stopAudio,
        seekTo,
        handleNextChapter,
        handlePrevChapter,
        toggleDrawer: () => setIsDrawerOpen((prev) => !prev),
        closeDrawer: () => setIsDrawerOpen(false),
        openDrawer: () => setIsDrawerOpen(true),
        setSleepTimer,
      }}
    >
      {children}
    </AudioContext.Provider>
  );
};

export const useAudio = () => {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error("useAudio must be used within an AudioProvider");
  }
  return context;
};
