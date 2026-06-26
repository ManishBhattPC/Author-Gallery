import React, { useState, useEffect } from "react"
import SearchBar from "../components/SearchBar"
import FeaturedAuthors from "../components/AuthorComponents/FeaturedAuthors"
import AuthorsGrid from "../components/AuthorComponents/AuthorsGrid"

const Authors = () => {
  const [search, setSearch] = useState("")
  const [searchQuery, setSearchQuery] = useState("")

  const handleSearch = (event) => {
    event.preventDefault();
    setSearchQuery(search);
  };

  useEffect(() => {
    if (search === "") {
      setSearchQuery("");
    }
  }, [search]);

  return (
    <div className="bg-slate-50 min-h-screen">
      <section className="border-b border-slate-200 bg-white py-16 px-4 sm:px-6 lg:px-8 dark:bg-slate-100 dark:border-slate-200">
        <div className="mx-auto max-w-5xl text-center">
          <h1 className="font-serif text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl">
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
            {["Fiction", "Poetry", "Shayari", "Education", "Fantasy", "History"].map((tag, idx, arr) => (
              <React.Fragment key={tag}>
                <button
                  type="button"
                  onClick={() => {
                    const nextVal = search === tag ? "" : tag;
                    setSearch(nextVal);
                    setSearchQuery(nextVal);
                  }}
                  className={`hover:text-amber-700 dark:hover:text-amber-500 transition font-medium ${search === tag ? "text-amber-700 dark:text-amber-500 underline" : ""}`}
                >
                  {tag}
                </button>
                {idx < arr.length - 1 && <span>•</span>}
              </React.Fragment>
            ))}
          </div>
        </div>
      </section>

      <FeaturedAuthors />
      <AuthorsGrid search={searchQuery} />
    </div>
  );
}

export default Authors