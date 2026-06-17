const AuthorStats = () => {
  return (
    <div className="bg-white p-5 rounded-lg shadow">

      <h2 className="font-bold mb-4">
        Author Stats
      </h2>

      <div className="grid grid-cols-2 gap-4">

        <div>
          <h3 className="text-xl font-bold">1.4K</h3>
          <p>Followers</p>
        </div>

        <div>
          <h3 className="text-xl font-bold">12.5K</h3>
          <p>Views</p>
        </div>

        <div>
          <h3 className="text-xl font-bold">9.8K</h3>
          <p>Likes</p>
        </div>

        <div>
          <h3 className="text-xl font-bold">6.1K</h3>
          <p>Downloads</p>
        </div>

      </div>
    </div>
  );
};

export default AuthorStats;