import React, { useEffect, useState } from "react";
import AuthorCard from "./AuthorCard";
import { fetchTopAuthors } from "../../services/authorService.js";

const fallbackAuthors = [
  {
    id: 1,
    name: "Emma Johnson",
    genre: "Poetry & Literature",
    works: 42,
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600",
  },
  {
    id: 2,
    name: "Michael Carter",
    genre: "Story Writer",
    works: 28,
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600",
  },
  {
    id: 3,
    name: "Sophia Williams",
    genre: "Book Author",
    works: 35,
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=600",
  },
];

const FeaturedAuthors = () => {
  const [authors, setAuthors] = useState(fallbackAuthors);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadAuthors = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await fetchTopAuthors();
        if (Array.isArray(data.authors)) {
          setAuthors(data.authors);
        }
      } catch (err) {
        setError(err.message || "Unable to load authors.");
      } finally {
        setLoading(false);
      }
    };

    loadAuthors();
  }, []);

  return (
    <section className="bg-slate-50 py-20">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <p className="text-amber-700 font-semibold uppercase tracking-[0.3em] text-sm">
            Featured Authors
          </p>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
            Discover Remarkable Writers
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm text-slate-600 sm:text-base">
            Explore talented authors, poets, storytellers, and creators sharing meaningful work with readers.
          </p>
        </div>

        {loading ? (
          <div className="rounded-3xl border border-slate-200 bg-white px-6 py-16 text-center text-slate-500 shadow-sm">
            Loading featured authors…
          </div>
        ) : error ? (
          <div className="rounded-3xl border border-rose-200 bg-rose-50 px-6 py-16 text-center text-rose-700 shadow-sm">
            {error}
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {authors.map((author) => (
              <AuthorCard
                key={author.id}
                image={author.image}
                name={author.name}
                genre={author.genre}
                works={author.works}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedAuthors;