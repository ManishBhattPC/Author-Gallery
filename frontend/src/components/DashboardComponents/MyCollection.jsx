import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getMyBooks, updateBook, deleteBook } from "../../services/bookService.js";
import { Eye, Edit3, Trash2, BookOpen, AlertCircle, Loader, X } from "lucide-react";

const MyCollection = ({
  books: providedBooks,
  loading: providedLoading,
  error: providedError,
  skipFetch = false,
}) => {
  const [books, setBooks] = useState(providedBooks || []);
  const [loading, setLoading] = useState(providedLoading ?? !skipFetch);
  const [error, setError] = useState(providedError || null);

  // Modal & Action states
  const [editingBook, setEditingBook] = useState(null);
  const [deletingBook, setDeletingBook] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [modalError, setModalError] = useState(null);
  const [editForm, setEditForm] = useState({ title: "", price: 0, description: "", genres: [] });

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

  const handleEditClick = (book) => {
    setEditingBook(book);
    setEditForm({
      title: book.title || "",
      price: book.price || 0,
      description: book.description || "",
      genres: Array.isArray(book.genres) ? book.genres : (book.genres ? [book.genres] : []),
    });
    setModalError(null);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setModalError(null);
    setSubmitting(true);

    try {
      const updated = await updateBook(editingBook._id, editForm);
      setBooks((prev) => prev.map((b) => (b._id === editingBook._id ? { ...b, ...updated } : b)));
      setEditingBook(null);
    } catch (err) {
      setModalError(err.message || "Failed to update book. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteClick = (book) => {
    setDeletingBook(book);
    setModalError(null);
  };

  const handleDeleteConfirm = async () => {
    setModalError(null);
    setSubmitting(true);

    try {
      await deleteBook(deletingBook._id);
      setBooks((prev) => prev.filter((b) => b._id !== deletingBook._id));
      setDeletingBook(null);
    } catch (err) {
      setModalError(err.message || "Failed to delete book. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-[#FDFCF7] border border-[#EADCC9] p-6 rounded-2xl shadow-sm text-center py-12">
        <Loader className="w-8 h-8 text-amber-800 animate-spin mx-auto mb-3" />
        <h3 className="font-bold text-[#2C1E11] text-base">Loading collection</h3>
        <p className="text-xs text-[#8C7B6C] mt-1">Retrieving your published books...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-[#FDFCF7] border border-[#EADCC9] p-6 rounded-2xl shadow-sm text-center py-12">
        <AlertCircle className="w-8 h-8 text-red-650 mx-auto mb-3" />
        <h3 className="font-bold text-[#2C1E11] text-base">Failed to load</h3>
        <p className="text-xs text-red-500 mt-1">{error}</p>
      </div>
    );
  }

  return (
    <div className="bg-[#FDFCF7] border border-[#EADCC9] p-6 sm:p-8 rounded-2xl shadow-sm text-left">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-bold font-serif text-[#2C1E11] flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-amber-800" />
            My Collection
          </h2>
          <p className="text-xs text-[#8C7B6C] mt-1 font-semibold">Manage and track your published literary works.</p>
        </div>
      </div>

      {books.length > 0 ? (
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
          {books.map((book) => (
            <div key={book._id} className="group border border-[#EADCC9]/80 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 bg-[#FAF6F0]/20 flex flex-col h-full text-left">
              <div className="relative overflow-hidden aspect-[4/3] bg-[#FAF6F0]">
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
                  <span className="absolute top-3 left-3 text-[9px] font-bold uppercase tracking-wider bg-[#FAF6F0]/95 backdrop-blur-sm text-amber-900 border border-[#EADCC9]/45 px-2.5 py-1 rounded-full shadow-sm">
                    {Array.isArray(book.genres) ? book.genres.join(", ") : book.genres}
                  </span>
                )}
              </div>

              <div className="p-4 flex flex-col flex-grow justify-between">
                <div>
                  <h3 className="font-bold font-serif text-[#2C1E11] line-clamp-1">{book.title}</h3>
                  <p className="text-sm font-bold text-amber-800 mt-1">₹{Number(book.price).toFixed(2)}</p>
                </div>

                <div className="flex items-center gap-2 mt-4 pt-3 border-t border-[#EADCC9]/50 text-xs font-bold">
                  <Link 
                    to={`/books/${book._id}`} 
                    className="flex-1 flex items-center justify-center gap-1 py-1.5 border border-[#EADCC9] hover:bg-[#FAF6F0] text-[#5C4E40] rounded-lg transition-colors active:scale-[0.97]"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    View
                  </Link>

                  <button 
                    onClick={() => handleEditClick(book)}
                    className="flex-1 flex items-center justify-center gap-1 py-1.5 border border-[#EADCC9] hover:bg-amber-50 hover:text-amber-800 text-[#5C4E40] rounded-lg transition-colors cursor-pointer active:scale-[0.97]"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    Edit
                  </button>

                  <button 
                    onClick={() => handleDeleteClick(book)}
                    className="p-2 border border-[#EADCC9] hover:bg-red-50 hover:text-red-600 text-[#5C4E40] rounded-lg transition-colors cursor-pointer active:scale-[0.97]"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 border border-dashed border-[#EADCC9] rounded-xl bg-[#FAF6F0]/20">
          <BookOpen className="w-8 h-8 text-[#8C7B6C] mx-auto mb-3 opacity-60" />
          <h3 className="font-bold text-[#5C4E40]">No books found</h3>
          <p className="text-xs text-[#8C7B6C] mt-1 font-semibold">Get started by uploading your first literary piece.</p>
        </div>
      )}      {/* Edit Book Modal */}
      {editingBook && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-[#FDFCF7] rounded-3xl border border-[#EADCC9] shadow-2xl w-full max-w-lg overflow-hidden text-left flex flex-col max-h-[90vh]">
            <div className="flex justify-between items-center px-6 py-5 border-b border-[#EADCC9]/50 bg-[#FAF6F0]/40">
              <h3 className="text-lg font-bold font-serif text-[#2C1E11] flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-amber-800" />
                Edit Book Details
              </h3>
              <button 
                onClick={() => setEditingBook(null)}
                className="text-slate-400 hover:text-[#2C1E11] transition-colors p-1.5 rounded-full hover:bg-[#FAF6F0] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="flex-grow overflow-y-auto p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#5C4E40] mb-1.5">Book Title</label>
                <input
                  type="text"
                  required
                  value={editForm.title}
                  onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                  className="w-full rounded-2xl border border-[#EADCC9] bg-[#FAF6F0] focus:bg-[#FCFBF7] px-4 py-3 text-sm text-[#2C1E11] outline-none transition focus:border-amber-700 focus:ring-4 focus:ring-amber-100/30"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#5C4E40] mb-1.5">Price (₹)</label>
                <input
                  type="number"
                  required
                  min="0"
                  step="0.01"
                  value={editForm.price}
                  onChange={(e) => setEditForm({ ...editForm, price: parseFloat(e.target.value) || 0 })}
                  className="w-full rounded-2xl border border-[#EADCC9] bg-[#FAF6F0] focus:bg-[#FCFBF7] px-4 py-3 text-sm text-[#2C1E11] outline-none transition focus:border-amber-700 focus:ring-4 focus:ring-amber-100/30"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#5C4E40] mb-1.5">Genres</label>
                <select
                  multiple
                  required
                  value={editForm.genres}
                  onChange={(e) => {
                    const selected = Array.from(e.target.selectedOptions, (option) => option.value);
                    setEditForm({ ...editForm, genres: selected });
                  }}
                  className="w-full rounded-2xl border border-[#EADCC9] bg-[#FAF6F0] focus:bg-[#FCFBF7] px-4 py-3 text-sm text-[#2C1E11] outline-none transition focus:border-amber-700 focus:ring-4 focus:ring-amber-100/30 min-h-[120px] text-xs font-semibold"
                >
                  {["Novel", "Fiction", "Non-Fiction", "Romance", "Thriller", "Mystery", "Fantasy", "Science Fiction", "Biography", "History", "Poetry", "Spiritual", "Self-Help", "Education", "Business", "Technology", "Children", "Other"].map((genre) => (
                    <option key={genre} value={genre}>{genre}</option>
                  ))}
                </select>
                <p className="text-[10px] text-[#8C7B6C] mt-1 font-bold">Hold Ctrl (or Cmd) to select multiple genres.</p>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#5C4E40] mb-1.5">Description</label>
                <textarea
                  required
                  rows="4"
                  value={editForm.description}
                  onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                  className="w-full rounded-2xl border border-[#EADCC9] bg-[#FAF6F0] focus:bg-[#FCFBF7] px-4 py-3 text-sm text-[#2C1E11] outline-none transition focus:border-amber-700 focus:ring-4 focus:ring-amber-100/30 resize-none leading-relaxed"
                />
              </div>

              {modalError && (
                <div className="flex items-center gap-2 text-red-750 text-xs font-bold">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{modalError}</span>
                </div>
              )}

              <div className="flex justify-end gap-3 pt-4 border-t border-[#EADCC9]/40">
                <button
                  type="button"
                  onClick={() => setEditingBook(null)}
                  disabled={submitting}
                  className="px-5 py-2.5 border border-[#EADCC9] hover:bg-[#FAF6F0] text-[#5C4E40] rounded-full text-xs font-bold transition-colors cursor-pointer disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2.5 bg-amber-800 hover:bg-amber-900 text-white rounded-full text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 disabled:opacity-50 shadow-md active:scale-[0.98]"
                >
                  {submitting ? (
                    <>
                      <Loader className="w-3.5 h-3.5 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingBook && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-[#FDFCF7] rounded-3xl border border-[#EADCC9] shadow-2xl w-full max-w-md overflow-hidden text-left p-6 space-y-4">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-[#FAF1E6] text-amber-850 rounded-2xl shrink-0">
                <Trash2 className="w-6 h-6" />
              </div>
              <div className="text-left">
                <h3 className="text-lg font-bold font-serif text-[#2C1E11]">Delete Book</h3>
                <p className="text-sm text-[#5C4E40] mt-1.5 leading-relaxed font-semibold">
                  Are you sure you want to delete <strong>{deletingBook.title}</strong>? This action is permanent and cannot be undone.
                </p>
              </div>
            </div>

            {modalError && (
              <div className="flex items-center gap-2 text-red-750 text-xs font-bold">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{modalError}</span>
              </div>
            )}

            <div className="flex justify-end gap-3 pt-3 border-t border-[#EADCC9]/40">
              <button
                type="button"
                onClick={() => setDeletingBook(null)}
                disabled={submitting}
                className="px-5 py-2.5 border border-[#EADCC9] hover:bg-[#FAF6F0] text-[#5C4E40] rounded-full text-xs font-bold transition-colors cursor-pointer disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteConfirm}
                disabled={submitting}
                className="px-5 py-2.5 bg-red-650 hover:bg-red-700 text-white rounded-full text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 disabled:opacity-50 shadow-md active:scale-[0.98]"
              >
                {submitting ? (
                  <>
                    <Loader className="w-3.5 h-3.5 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  "Delete Book"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyCollection;
