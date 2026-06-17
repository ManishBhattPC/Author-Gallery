import AuthorCard from "./AuthorCard";

const authors = [
  {
    id: 1,
    name: "Sarah Bennett",
    genre: "Fiction",
    works: 24,
    image: "/author1.jpg",
  },
  {
    id: 2,
    name: "David Wilson",
    genre: "Poetry",
    works: 18,
    image: "/author2.jpg",
  },
];

const AuthorsGrid = () => {
  return (
    <section className="max-w-7xl mx-auto px-6 py-14">
      <h2 className="text-3xl font-bold mb-8">
        All Authors
      </h2>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
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
    </section>
  );
};

export default AuthorsGrid;