const DashboardHeader = () => {
  return (
    <div className="bg-white p-4 rounded-lg shadow flex justify-between items-center">
      <div>
        <h2 className="text-2xl font-bold">
          Welcome Back, Sarah!
        </h2>

        <p className="text-gray-500">
          Pen Name: Elara Vance
        </p>
      </div>

      <div className="flex gap-8">
        <div>
          <h3 className="font-bold">1.4K</h3>
          <p>Followers</p>
        </div>

        <div>
          <h3 className="font-bold">328</h3>
          <p>Following</p>
        </div>

        <div>
          <h3 className="font-bold">24</h3>
          <p>Published</p>
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;