import React, { useState } from "react";
import SearchBar from "../components/SearchBar";
import TrendingWorks from "../components/TrendingWorks";
import AuthorFeatured from "../components/AuthorComponents/FeaturedAuthors"
import CategoryCard from "../components/CategoryCard";

import {
  BookOpen,
  GraduationCap,
  PenTool,
  ScrollText,
  Sparkles,
  Heart,
  FlaskConical,
  Laptop,
} from "lucide-react";

const categories = [
  {
    title: "Education",
    description: "Learn through insightful educational content.",
    icon: <GraduationCap size={32} />,
  },
  {
    title: "Literature",
    description: "Classic and modern literary works.",
    icon: <BookOpen size={32} />,
  },
  {
    title: "Fiction",
    description: "Explore imaginative stories and worlds.",
    icon: <Sparkles size={32} />,
  },
  {
    title: "Poetry",
    description: "Beautiful verses and poetic expressions.",
    icon: <PenTool size={32} />,
  },
  {
    title: "Shayari",
    description: "Emotional and expressive shayari collections.",
    icon: <ScrollText size={32} />,
  },
  {
    title: "Romance",
    description: "Heartwarming stories and relationships.",
    icon: <Heart size={32} />,
  },
  {
    title: "Science",
    description: "Discover scientific knowledge and ideas.",
    icon: <FlaskConical size={32} />,
  },
  {
    title: "Technology",
    description: "Latest insights from the tech world.",
    icon: <Laptop size={32} />,
  },
];

const Explore = () => {
  const [search, setSearch] = useState("");

  const handleSearch = (event) => {
    event.preventDefault();
    // TODO: wire search results to backend search endpoint
  };

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Hero Section */}
      <section className="py-16 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <SearchBar placeholder="Search authors, stories, poems, books, or topics..." />
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h2 className="text-3xl font-semibold text-slate-900">Explore Categories</h2>
          <p className="mt-2 text-slate-600">Browse content based on your interests.</p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((category) => (
            <CategoryCard
              key={category.title}
              title={category.title}
              description={category.description}
              icon={category.icon}
            />
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-14 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-3xl font-semibold text-slate-900">Trending Works</h2>
            <p className="mt-2 text-slate-600">Discover the most popular stories, books, poems and articles.</p>
          </div>
          <button className="self-start rounded-full bg-amber-700 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-amber-800 md:self-auto">
            View All
          </button>
        </div>

        <TrendingWorks />
      </section>

      <section className="max-w-7xl mx-auto px-4 py-14 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-3xl font-semibold text-slate-900">Featured Authors</h2>
            <p className="mt-2 text-slate-600">Meet talented creators shaping the community.</p>
          </div>
          <button className="self-start rounded-full bg-amber-700 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-amber-800 md:self-auto">
            View All
          </button>
        </div>

        <AuthorFeatured />
      </section>
    </div>
  );
};

export default Explore