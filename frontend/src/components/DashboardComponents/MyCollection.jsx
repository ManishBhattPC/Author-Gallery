import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getMyBooks } from "../../services/bookService.js";
import { Eye, Edit3, Trash2, BookOpen, AlertCircle, Loader } from "lucide-react";

const MyCollection = ({
  books: providedBooks,
  loading: providedLoading,
  error: providedError,
  skipFetch = false,
}) => {
  const [books, setBooks] = useState(providedBooks || []);
  const [loading, setLoading] = useState(providedLoading ?? !skipFetch);
  const [error, setError] = useState(providedError || null);

  useEffect(() => {
    if (skipFetch) {
      setBooks(providedBooks || []);
      setLoading(Boolean(providedLoading));
      setError(providedError || null);
      return;
    }

    const loadBooks = async () => {
      try {
        setLoading(true);
        setError(null);

        const data = await getMyBooks();
        setBooks(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadBooks();
  }, [skipFetch, providedBooks, providedLoading, providedError]);

  if (loading) {
    return (
      <div className="bg-white border border-slate-200/60 p-6 rounded-2xl shadow-sm text-center py-12">
        <Loader className="w-8 h-8 text-amber-700 animate-spin mx-auto mb-3" />
        <h3 className="font-bold text-slate-800 text-base">Loading collection</h3>
        <p className="text-xs text-slate-400 mt-1">Retrieving your published books...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white border border-slate-200/60 p-6 rounded-2xl shadow-sm text-center py-12">
        <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-3" />
        <h3 className="font-bold text-slate-800 text-base">Failed to load</h3>
        <p className="text-xs text-red-500 mt-1">{error}</p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200/60 p-6 sm:p-8 rounded-2xl shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-amber-700" />
            My Collection
          </h2>
          <p className="text-xs text-slate-500 mt-1">Manage and track your published literary works.</p>
        </div>
      </div>

      {books.length > 0 ? (
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
          {books.map((book) => (
            <div key={book._id} className="group border border-slate-100 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 bg-slate-50/20 flex flex-col h-full">
              <div className="relative overflow-hidden aspect-[4/3] bg-slate-100">
                <img
                  src={book.coverImage}
                  alt={book.title}
                  onError={(e) => {
                    e.currentTarget.src = "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=500&auto=format&fit=crop&q=60";
                    e.currentTarget.onerror = null;
                  }}
                  className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {book.genres && (
                  <span className="absolute top-3 left-3 text-[10px] font-bold uppercase tracking-wider bg-white/95 backdrop-blur-sm text-slate-800 px-2.5 py-1 rounded-full shadow-sm">
                    {book.genres}
                  </span>
                )}
              </div>

              <div className="p-4 flex flex-col flex-grow justify-between">
                <div>
                  <h3 className="font-bold text-slate-800 line-clamp-1">{book.title}</h3>
                  <p className="text-sm font-semibold text-amber-800 mt-1">₹{Number(book.price).toFixed(2)}</p>
                </div>

                <div className="flex items-center gap-2 mt-4 pt-3 border-t border-slate-100 text-xs font-semibold">
                  <Link 
                    to={`/books/${book._id}`} 
                    className="flex-1 flex items-center justify-center gap-1 py-1.5 border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-lg transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    View
                  </Link>

                  <button className="flex-1 flex items-center justify-center gap-1 py-1.5 border border-slate-200 hover:bg-amber-50 hover:text-amber-800 text-slate-600 rounded-lg transition-colors cursor-pointer">
                    <Edit3 className="w-3.5 h-3.5" />
                    Edit
                  </button>

                  <button className="p-2 border border-slate-200 hover:bg-red-50 hover:text-red-600 text-slate-600 rounded-lg transition-colors cursor-pointer">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 border border-dashed border-slate-200 rounded-xl bg-slate-50/30">
          <BookOpen className="w-8 h-8 text-slate-300 mx-auto mb-3" />
          <h3 className="font-semibold text-slate-700">No books found</h3>
          <p className="text-xs text-slate-400 mt-1">Get started by uploading your first literary piece.</p>
        </div>
      )}
    </div>
  );
};

export default MyCollection;
