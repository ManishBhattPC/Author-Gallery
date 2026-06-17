const books = [
  {
    id: 1,
    title: "Whispers of the Wind",
    image: "https://picsum.photos/300/200?1",
  },
  {
    id: 2,
    title: "Silent Woods",
    image: "https://picsum.photos/300/200?2",
  },
  {
    id: 3,
    title: "Crimson Tide",
    image: "https://picsum.photos/300/200?3",
  },
];

const MyCollection = () => {
  return (
    <div className="bg-white p-5 rounded-lg shadow">

      <h2 className="font-bold text-xl mb-4">
        My Collection
      </h2>

      <div className="grid md:grid-cols-3 gap-4">

        {books.map((book) => (
          <div
            key={book.id}
            className="border rounded-lg overflow-hidden"
          >
            <img
              src={book.image}
              alt={book.title}
              className="h-40 w-full object-cover"
            />

            <div className="p-3">
              <h3 className="font-semibold">
                {book.title}
              </h3>

              <div className="flex gap-2 mt-3">
                <button className="text-blue-500">
                  Edit
                </button>

                <button className="text-red-500">
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}

      </div>

    </div>
  );
};

export default MyCollection;