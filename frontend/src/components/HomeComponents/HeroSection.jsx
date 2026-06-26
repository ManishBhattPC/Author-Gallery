import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getPublicSummaryStats } from "../../services/dashboardService.js";
import { Sparkles } from "lucide-react";

const HERO_IMAGES = [
  "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=1200&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=1200&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=1200&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=1200&auto=format&fit=crop&q=80"
];

// Helper hook for counting up animation
const useCountUp = (target, duration = 1500) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (target <= 0) {
      setCount(0);
      return;
    }
    let start = 0;
    const end = target;
    const totalFrames = 60; // ~60fps for 1 second
    const increment = Math.ceil(end / totalFrames);
    let currentFrame = 0;

    const timer = setInterval(() => {
      currentFrame++;
      setCount((prev) => {
        const next = currentFrame * increment;
        if (next >= end) {
          clearInterval(timer);
          return end;
        }
        return next;
      });
    }, duration / totalFrames);

    return () => clearInterval(timer);
  }, [target, duration]);

  return count;
};

const HeroSection = () => {
  const [currentImageIdx, setCurrentImageIdx] = useState(0);
  const [dbBooksCount, setDbBooksCount] = useState(0);
  const [dbUsersCount, setDbUsersCount] = useState(0);

  // Fetch actual counts from database summary on mount
  useEffect(() => {
    getPublicSummaryStats()
      .then((data) => {
        if (data) {
          setDbBooksCount(data.totalBooks || 0);
          setDbUsersCount(data.totalAuthors || 0);
        }
      })
      .catch((err) => console.error("Error loading summary stats:", err));
  }, []);

  // Set up dynamic animated targets
  const animatedWorks = useCountUp(dbBooksCount);
  const animatedUsers = useCountUp(dbUsersCount);

  // Auto-play slideshow every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIdx((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  // Format large numbers with commas
  const formatNumber = (num) => {
    return num.toLocaleString();
  };

  return (
    <section className="bg-transparent py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">

          {/* Left Content */}
          <div className="space-y-6">
            {/* Badge */}
            <div className="inline-flex items-center gap-2.5 border border-amber-800/15 bg-amber-50/50 dark:bg-amber-950/20 backdrop-blur-sm rounded-full pl-1.5 pr-4 py-1.5 text-xs font-bold text-amber-900 shadow-sm transition duration-300 hover:scale-[1.02] cursor-default select-none">
              <span className="flex items-center justify-center bg-gradient-to-tr from-amber-700 to-amber-900 text-[#FAF6F0] w-6 h-6 rounded-full shadow-sm">
                <Sparkles size={11} className="animate-pulse text-amber-100" />
              </span>
              <span className="tracking-wide">Every great author starts with a single page</span>
            </div>

            {/* Heading */}
            <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-bold text-slate-900 leading-tight">
              Where Great Writers
              <br />
              <span className="text-amber-800">Build Their Legacy</span>
            </h1>

            {/* Description */}
            <p className="text-slate-600 text-base sm:text-lg leading-relaxed max-w-xl">
              Author Gallery is the home for writers, poets,
              storytellers, researchers, and educators.
              Publish your work, grow a devoted readership,
              and discover writing worth your time — all in one
              beautifully quiet place to read.
            </p>

            {/* Buttons */}
            <div className="flex flex-wrap gap-4 pt-2">
              <Link to="/author-dashboard" className="bg-amber-800 text-white px-7 py-3 rounded-full font-semibold shadow-md hover:bg-amber-900 transition duration-300 text-center">
                Start Writing
              </Link>

              <Link to="/authors" className="border border-slate-300 bg-white px-7 py-3 rounded-full font-semibold text-slate-700 shadow-sm hover:bg-slate-50 transition duration-300 text-center">
                Explore Authors →
              </Link>
            </div>

            {/* Stats */}
            <div className="flex gap-12 pt-6 border-t border-slate-200/60">
              <div>
                <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 tabular-nums">
                  {formatNumber(animatedWorks)}
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 font-medium">
                  Published Works
                </p>
              </div>

              <div>
                <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 tabular-nums">
                  {formatNumber(animatedUsers)}
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 font-medium">
                  Users this Month
                </p>
              </div>
            </div>
          </div>

          {/* Right Side Image (Dynamic Cross-fade Slideshow) */}
          <div className="relative h-[320px] sm:h-[420px] md:h-[500px] rounded-3xl overflow-hidden shadow-lg group">
            {HERO_IMAGES.map((img, idx) => (
              <img
                key={img}
                src={img}
                alt={`Slide ${idx + 1}`}
                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out ${
                  idx === currentImageIdx ? "opacity-100 z-10" : "opacity-0 z-0"
                }`}
              />
            ))}

            {/* Subtle Gradient Overlay for contrast */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent z-20 pointer-events-none" />

            {/* Top Card */}
            <div className="absolute top-6 right-6 bg-white/95 backdrop-blur-sm rounded-2xl shadow-md px-4 py-3 z-30 transition-transform duration-300 group-hover:-translate-y-1">
              <p className="text-[9px] uppercase font-bold tracking-widest text-amber-800">
                New trending
              </p>
              <h4 className="font-bold text-slate-800 text-xs mt-0.5">
                Poetry & Prose
              </h4>
            </div>

            {/* Bottom Card */}
            <div className="absolute bottom-6 left-6 bg-white/95 backdrop-blur-sm rounded-2xl shadow-md px-4 py-3 z-30 transition-transform duration-300 group-hover:translate-y-1">
              <h4 className="font-bold text-slate-800 text-xs">
                Daily Read
              </h4>
              <p className="text-[9px] text-slate-500 mt-0.5">
                Curated for you every morning
              </p>
            </div>

            {/* Navigation Dots */}
            <div className="absolute bottom-6 right-6 flex gap-1.5 z-30">
              {HERO_IMAGES.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentImageIdx(idx)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 cursor-pointer ${
                    idx === currentImageIdx 
                      ? "bg-amber-800 w-4" 
                      : "bg-white/60 hover:bg-white"
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default HeroSection;