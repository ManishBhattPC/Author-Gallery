import React, { useState } from "react";
import SearchBar from "../components/SearchBar";
import FollowedAuthors from "../components/FollowedAuthors";
import FeaturedAuthors from "../components/FeaturedAuthors";
import RecentlyExploredAuthors from "../components/RecentlyExploredAuthors";
import AuthorsGrid from "../components/AuthorsGrid";

const Authors = () => {
  const [search, setSearch] = useState("");

  const handleSearch = (event) => {
    event.preventDefault();
    // TODO: wire backend search endpoint for authors.
  };

  return (
    <div className="bg-slate-50 min-h-screen">
      <section className="border-b border-slate-200 bg-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl text-center">
          <h1 className="text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl">
            Discover Remarkable Authors
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-sm text-slate-600 sm:text-base">
            Explore talented writers, poets, educators, and storytellers from around the world.
          </p>

          <div className="mt-10">
            <SearchBar
              search={search}
              setSearch={setSearch}
              onSearch={handleSearch}
              placeholder="Search authors by name, genre, or expertise..."
            />
          </div>

          <div className="mt-6 flex flex-wrap justify-center gap-3 text-sm text-slate-500">
            <span>Fiction</span>
            <span>•</span>
            <span>Poetry</span>
            <span>•</span>
            <span>Shayari</span>
            <span>•</span>
            <span>Education</span>
            <span>•</span>
            <span>Fantasy</span>
            <span>•</span>
            <span>History</span>
          </div>
        </div>
      </section>

      <FollowedAuthors />
      <FeaturedAuthors />
      <RecentlyExploredAuthors />
      <AuthorsGrid />
    </div>
  );
};

export default Authors;