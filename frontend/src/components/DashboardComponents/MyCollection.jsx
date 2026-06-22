import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getMyBooks } from "../../services/bookService.js";

const MyCollection = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
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
  }, []);

  if (loading) {
    return (
      <div className="bg-white p-5 rounded-lg shadow">
        <h2 className="font-bold text-xl mb-4">
          My Collection
        </h2>

        <p>Loading books...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white p-5 rounded-lg shadow">
        <h2 className="font-bold text-xl mb-4">
          My Collection
        </h2>

        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-5 rounded-lg shadow">
      <h2 className="font-bold text-xl mb-4">
        My Collection
      </h2>

      <div className="grid md:grid-cols-3 gap-4">
        {books.length > 0 ? (
          books.map((book) => (
            <div
              key={book._id}
              className="border rounded-lg overflow-hidden"
            >
              <img
                src={book.coverImage}
                alt={book.title}
                className="h-40 w-full object-cover"
              />

              <div className="p-3">
                <h3 className="font-semibold">
                  {book.title}
                </h3>

                <p className="text-sm text-gray-500 mt-1">
                  ₹{book.price}
                </p>

                <div className="flex gap-3 mt-3">
                  <Link
                    to={`/books/${book._id}`}
                    className="text-blue-500"
                  >
                    View
                  </Link>

                  <button className="text-green-500">
                    Edit
                  </button>

                  <button className="text-red-500">
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>No books found.</p>
        )}
      </div>
    </div>
  );
};

export default MyCollection;