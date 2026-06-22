const RecentActivity = () => {
  return (
    <div className="bg-white p-5 rounded-lg shadow">
      <h2 className="font-bold mb-4">
        Recent Activity
      </h2>

      <div className="text-gray-500 text-sm">
        No recent activity available.
      </div>

      <p className="text-xs text-gray-400 mt-4">
        Activity tracking will be added in a future update.
      </p>
    </div>
  );
};

export default RecentActivity;