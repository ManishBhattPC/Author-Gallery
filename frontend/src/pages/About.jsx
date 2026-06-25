import React from "react";
import { Link } from "react-router-dom";
import { Sparkles, Users, BookOpen, Heart, GraduationCap, PenTool } from "lucide-react";

const About = () => {
  return (
    <div className="bg-slate-50 min-h-screen text-slate-800">

      {/* Hero Section */}
      <section className="py-20 md:py-28 px-4 sm:px-6 lg:px-8 text-center bg-gradient-to-b from-amber-50/40 via-transparent to-transparent">
        <div className="max-w-4xl mx-auto space-y-6">
          <p className="text-amber-800 font-bold uppercase tracking-[0.3em] text-xs sm:text-sm">
            Our Purpose
          </p>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif font-bold text-slate-900 leading-tight">
            About Author Gallery
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-slate-600 leading-relaxed max-w-2xl mx-auto">
            A sanctuary where writers, storytellers, poets, researchers, and educators 
            publish their ideas for readers who cherish thoughtful and meaningful content.
          </p>
        </div>
      </section>

      {/* Our Story */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="bg-white rounded-3xl p-6 sm:p-10 md:p-12 shadow-sm border border-slate-200/50 grid md:grid-cols-2 gap-8 md:gap-12 items-center">
          
          <div className="space-y-6">
            <span className="text-amber-800 text-xs font-bold uppercase tracking-widest">Behind the Platform</span>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-slate-900">
              Our Story
            </h2>
            <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
              Every great author starts with a single page. Author Gallery was created to give creators, independent writers, and researchers a dedicated, distraction-free space where their work can be discovered, appreciated, and shared.
            </p>
            <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
              Whether it is a novel, educational guide, poetry collection, shayari, or technical breakdown, every piece of writing holds value. Our mission is to connect these voices with a global community of readers who read to think, learn, and feel.
            </p>
          </div>

          <div className="relative h-[300px] sm:h-[400px] rounded-2xl overflow-hidden shadow-md">
            <img 
              src="https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800&auto=format&fit=crop&q=80" 
              alt="Creative Writing Desk" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-amber-950/10 pointer-events-none" />
          </div>

        </div>
      </section>

      {/* Core Mission Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid md:grid-cols-3 gap-6 sm:gap-8">
          
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200/40 hover:shadow-md hover:-translate-y-1 transition duration-300 space-y-4">
            <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center text-amber-800">
              <Sparkles size={24} />
            </div>
            <h3 className="text-xl font-bold text-slate-900">
              Inspire Creativity
            </h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Empowering writers to present their literary portfolios and self-publish their works in a beautiful, structured format.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200/40 hover:shadow-md hover:-translate-y-1 transition duration-300 space-y-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-700">
              <Users size={24} />
            </div>
            <h3 className="text-xl font-bold text-slate-900">
              Build Community
            </h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Fostering close relationships between readers and authors through profile follows, dynamic libraries, and personal bios.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200/40 hover:shadow-md hover:-translate-y-1 transition duration-300 space-y-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-700">
              <BookOpen size={24} />
            </div>
            <h3 className="text-xl font-bold text-slate-900">
              Share Knowledge
            </h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Making educational resources, poetry, shayaris, and books readily accessible in PDF and e-reader layouts for learners worldwide.
            </p>
          </div>

        </div>
      </section>

      {/* Categories You'll Find */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="bg-white rounded-3xl p-6 sm:p-10 md:p-12 shadow-sm border border-slate-200/50 space-y-8">
          <div>
            <h2 className="text-3xl font-serif font-bold text-slate-900">What You'll Discover</h2>
            <p className="text-slate-500 text-sm mt-1">Explore a rich collection of literary works across diverse tags.</p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { label: "Books & Novels", icon: "📚", genre: "Fiction" },
              { label: "Stories & Essays", icon: "✍️", genre: "Literature" },
              { label: "Poetry & Shayari", icon: "📝", genre: "Poetry" },
              { label: "Educational Content", icon: "🎓", genre: "Education" },
              { label: "Science & Technology", icon: "💡", genre: "Technology" },
              { label: "Global Voices", icon: "🌍", genre: "Other" }
            ].map((item) => (
              <Link 
                key={item.label} 
                to={`/books?genre=${encodeURIComponent(item.genre)}`}
                className="p-5 border border-slate-200/70 rounded-2xl hover:border-amber-700 hover:bg-amber-50/20 flex items-center gap-3 transition-all duration-300"
              >
                <span className="text-2xl">{item.icon}</span>
                <span className="font-semibold text-slate-700 hover:text-amber-800 text-sm">{item.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-24 px-4 sm:px-6 lg:px-8 text-center bg-gradient-to-t from-amber-50/40 via-transparent to-transparent">
        <div className="max-w-3xl mx-auto space-y-6">
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-slate-900 leading-tight">
            Where Meaningful Writing Finds Its Audience
          </h2>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed max-w-xl mx-auto">
            Join a growing community of readers and creators who believe in the power of stories, knowledge, and creative voices.
          </p>
          <div className="flex flex-wrap justify-center gap-4 pt-4">
            <Link to="/authors" className="px-8 py-3.5 bg-amber-800 text-white rounded-full font-semibold shadow-md hover:bg-amber-900 transition duration-300">
              Explore Authors
            </Link>
            <Link to="/author-dashboard" className="px-8 py-3.5 border border-slate-300 bg-white text-slate-700 rounded-full font-semibold shadow-sm hover:bg-slate-50 transition duration-300">
              Start Writing
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};

export default About;