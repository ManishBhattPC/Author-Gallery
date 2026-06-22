const AuthorStats = () => {
  return (
    <div className="bg-white p-5 rounded-lg shadow">
      <h2 className="font-bold mb-4">
        Author Stats
      </h2>

      <div className="grid grid-cols-2 gap-4">

        <div>
          <h3 className="text-xl font-bold">—</h3>
          <p>Followers</p>
        </div>

        <div>
          <h3 className="text-xl font-bold">—</h3>
          <p>Views</p>
        </div>

        <div>
          <h3 className="text-xl font-bold">—</h3>
          <p>Likes</p>
        </div>

        <div>
          <h3 className="text-xl font-bold">—</h3>
          <p>Downloads</p>
        </div>

      </div>

      <p className="text-xs text-gray-500 mt-4">
        Analytics will appear here when the analytics module is implemented.
      </p>
    </div>
  );
};

export default AuthorStats;