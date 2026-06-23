import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { fetchAuthorById } from "../services/authorService.js";

const AuthorDetails = () => {
  const { id } = useParams();
  const [author, setAuthor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadAuthor = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchAuthorById(id);
        setAuthor(data.author || data);
      } catch (err) {
        setError(err.message || "Unable to load author.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadAuthor();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="rounded-3xl border border-slate-200 bg-white px-6 py-16 text-center text-slate-500 shadow-sm">
          Loading author details…
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <div className="rounded-3xl border border-rose-200 bg-rose-50 px-6 py-16 text-center text-rose-700 shadow-sm">
          {error}
        </div>
      </div>
    );
  }

  if (!author) {
    return null;
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <Link to="/authors" className="text-amber-700 font-medium hover:underline">
          ← Back to authors
        </Link>
      </div>

      <div className="grid gap-8 lg:grid-cols-[360px_1fr]">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <img
            src={author.profileImage || "/default-avatar.png"}
            alt={author.name}
            className="h-80 w-full rounded-3xl object-cover"
          />
          <div className="mt-6 space-y-4">
            <div>
              <h1 className="text-3xl font-semibold text-slate-900">{author.name}</h1>
              <p className="text-sm text-slate-500 mt-2">{author.email}</p>
            </div>
            <div className="rounded-3xl bg-slate-50 p-4">
              <p className="text-sm text-slate-500">Works</p>
              <p className="text-3xl font-semibold text-slate-900">{author.works}</p>
            </div>
            <div className="rounded-3xl bg-slate-50 p-4">
              <p className="text-sm text-slate-500">Followers</p>
              <p className="text-3xl font-semibold text-slate-900">{author.followers ?? 0}</p>
            </div>
            <div className="rounded-3xl bg-slate-50 p-4">
              <p className="text-sm text-slate-500">Following</p>
              <p className="text-3xl font-semibold text-slate-900">{author.following ?? 0}</p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-semibold text-slate-900">About the Author</h2>
            <p className="mt-4 text-sm text-slate-600">{author.bio || "This author has not added a bio yet."}</p>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-xl font-semibold text-slate-900">Author Books</h3>
            <div className="mt-6 grid gap-4">
              {Array.isArray(author.books) && author.books.length > 0 ? (
                author.books.map((book) => (
                  <div key={book._id || book.id} className="rounded-3xl border border-slate-200 p-4">
                    <h4 className="font-semibold text-slate-900">{book.title}</h4>
                    <p className="text-sm text-slate-500 mt-1">{book.genres?.join(", ")}</p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-slate-500">No books found for this author.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthorDetails;
