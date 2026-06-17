import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchBookById } from "../services/bookService.js";

const BookDetails = () => {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadBook = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await fetchBookById(id);
        setBook(data.book || data);
      } catch (err) {
        setError(err.message || "Unable to load book details.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadBook();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 py-12">
        <div className="rounded-3xl border border-slate-200 bg-white px-6 py-14 text-slate-600 shadow-sm">
          Loading book details...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 py-12">
        <div className="rounded-3xl border border-rose-200 bg-rose-50 px-6 py-14 text-rose-700 shadow-sm">
          {error}
        </div>
      </div>
    );
  }

  const cover = book.formats?.["image/jpeg"] || "https://via.placeholder.com/400x600";
  const readLink =
    book.formats?.["text/html"] ||
    book.formats?.["text/html; charset=utf-8"] ||
    book.formats?.["application/epub+zip"] ||
    book.formats?.["text/plain; charset=utf-8"];

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-10 rounded-3xl bg-white p-6 shadow-xl md:grid-cols-[1.1fr_1fr] lg:p-10">
          <div className="mx-auto w-full max-w-md overflow-hidden rounded-3xl border border-slate-200 shadow-sm">
            <img src={cover} alt={book.title} className="h-full w-full object-cover" />
          </div>
          <div className="space-y-6">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-amber-700">Book Details</p>
              <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
                {book.title}
              </h1>
              <p className="mt-3 text-base text-slate-600">
                {book.authors?.map((author) => author.name).join(", ") || "Unknown author"}
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-3xl bg-slate-50 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Downloads</p>
                <p className="mt-2 text-xl font-semibold text-slate-900">{book.download_count?.toLocaleString() || "N/A"}</p>
              </div>
              <div className="rounded-3xl bg-slate-50 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Languages</p>
                <p className="mt-2 text-base text-slate-700">{book.languages?.join(", ").toUpperCase() || "Unknown"}</p>
              </div>
            </div>

            <div className="space-y-3">
              <h2 className="text-lg font-semibold text-slate-900">Subjects</h2>
              <div className="flex flex-wrap gap-2">
                {(book.subjects || []).slice(0, 8).map((subject, index) => (
                  <span key={index} className="rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-900">
                    {subject}
                  </span>
                ))}
              </div>
            </div>

            {readLink && (
              <a
                href={readLink}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center rounded-full bg-amber-700 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-amber-800"
              >
                Read Book
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDetails;