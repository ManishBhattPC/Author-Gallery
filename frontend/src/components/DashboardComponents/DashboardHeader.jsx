import { useAuth } from "../../AuthContext.jsx";

const DashboardHeader = () => {
  const { user } = useAuth();

  return (
    <div className="bg-white p-4 rounded-lg shadow flex justify-between items-center">
      <div>
        <h2 className="text-2xl font-bold">
          Welcome Back, {user?.name || "Author"}!
        </h2>

        <p className="text-gray-500">
          {user?.email}
        </p>
      </div>

      <div className="flex gap-8">
        <div>
          <h3 className="font-bold">—</h3>
          <p>Followers</p>
        </div>

        <div>
          <h3 className="font-bold">—</h3>
          <p>Following</p>
        </div>

        <div>
          <h3 className="font-bold">—</h3>
          <p>Published</p>
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;