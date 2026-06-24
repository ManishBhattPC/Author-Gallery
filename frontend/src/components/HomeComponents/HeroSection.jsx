import React from "react";

const HeroSection = () => {
  return (
    <section className="bg-[#F8F5F0] py-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* Left Content */}
          <div>
            {/* Badge */}
            <div className="inline-flex items-center gap-2 border border-gray-300 rounded-full px-4 py-2 text-sm text-gray-600 mb-6">
              <span>✦</span>
              <span>Every great author starts with a single page</span>
            </div>

            {/* Heading */}
            <h1 className="font-serif text-5xl md:text-6xl font-bold text-[#1F1F1F] leading-tight mb-6">
              Where Great Writers
              <br />
              Build Their Legacy
            </h1>

            {/* Description */}
            <p className="text-gray-600 text-lg leading-relaxed mb-8 max-w-xl">
              Author Gallery is the home for writers, poets,
              storytellers, researchers, and educators.
              Publish your work, grow a devoted readership,
              and discover writing worth your time — all in one
              beautifully quiet place to read.
            </p>

            {/* Buttons */}
            <div className="flex flex-wrap gap-4 mb-12">
              <button className="bg-[#A05A3A] text-white px-6 py-3 rounded-full hover:opacity-90 transition">
                Start Writing
              </button>

              <button className="border border-gray-300 px-6 py-3 rounded-full hover:bg-white transition">
                Explore Authors →
              </button>
            </div>

            {/* Stats */}
            <div className="flex gap-12">
              <div>
                <h3 className="text-3xl font-bold text-[#1F1F1F]">
                  2.1M+
                </h3>
                <p className="text-gray-500">
                  Published Works
                </p>
              </div>

              <div>
                <h3 className="text-3xl font-bold text-[#1F1F1F]">
                  47M+
                </h3>
                <p className="text-gray-500">
                  Reads Each Month
                </p>
              </div>
            </div>
          </div>

          {/* Right Side Image */}
          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1512820790803-83ca734da794?w=1200"
              alt="Books"
              className="w-full h-[500px] object-cover rounded-3xl"
            />

            {/* Top Card */}
            <div className="absolute top-6 right-6 bg-white rounded-2xl shadow-lg px-4 py-3">
              <p className="text-xs text-gray-500">
                New trending
              </p>
              <h4 className="font-semibold">
                Poetry & Prose
              </h4>
            </div>

            {/* Bottom Card */}
            <div className="absolute bottom-6 left-6 bg-white rounded-2xl shadow-lg px-4 py-3">
              <h4 className="font-semibold">
                Daily Read
              </h4>
              <p className="text-xs text-gray-500">
                Curated for you every morning
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default HeroSection;