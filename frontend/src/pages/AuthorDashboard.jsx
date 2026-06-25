import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import DashboardHeader from "../components/DashboardComponents/DashboardHeader";
import QuickUpload from "../components/DashboardComponents/QuickUpload";
import AuthorStats from "../components/DashboardComponents/AuthorStats";
import MyCollection from "../components/DashboardComponents/MyCollection";
import RecentActivity from "../components/DashboardComponents/RecentActivity";
import { getAuthorBooks, getAuthorDashboard } from "../services/dashboardService.js";

const Dashboard = () => {
  const [dashboard, setDashboard] = useState({
    stats: null,
    recentBooks: [],
    books: [],
  });
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Load dashboard data
  useEffect(() => {
    let isMounted = true;

    const loadDashboard = async () => {
      try {
        setLoading(true);
        setError("");

        const [dashboardData, books] = await Promise.all([
          getAuthorDashboard(),
          getAuthorBooks(),
        ]);

        if (!isMounted) return;

        setDashboard({
          stats: dashboardData.stats || null,
          recentBooks: dashboardData.recentBooks || [],
          books: Array.isArray(books) ? books : (books?.books || []),
        });
      } catch (err) {
        if (isMounted) {
          setError(err.message || "Unable to load dashboard data.");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadDashboard();

    return () => {
      isMounted = false;
    };
  }, [refreshTrigger]); // Refresh when trigger changes

  // Handle book published
  const handleBookPublished = () => {
    setRefreshTrigger(prev => prev + 1); // Trigger refresh
  };

  return (
    <div className="min-h-screen bg-[#FAF6F0] px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-7xl space-y-8">
        
        {/* Error Message */}
        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Dashboard Header */}
        <DashboardHeader stats={dashboard.stats} loading={loading} />

        {/* Main Grid */}
        <div className="grid gap-6 xl:grid-cols-4">
          
          {/* Left Section (3/4 width) */}
          <div className="xl:col-span-3 space-y-6">
            
            {/* Banner card prompting to write a book using template covers */}
            <div className="bg-gradient-to-r from-amber-800 to-amber-955 rounded-3xl p-6 sm:p-8 text-[#FAF6F0] flex flex-col md:flex-row justify-between items-center gap-6 shadow-md border border-amber-900/30 text-left">
              <div className="space-y-2 text-center md:text-left">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-700/40 border border-amber-600/30 rounded-full text-xs font-bold tracking-wide">
                  ✨ NEW FEATURE
                </span>
                <h2 className="text-xl sm:text-2xl font-serif font-bold">Write Your Masterpiece Online</h2>
                <p className="text-amber-100/70 text-xs sm:text-sm max-w-xl">
                  Use our premium Book Notepad to draft your thoughts, select stunning Canvas cover templates with official Author Gallery attributions, and publish instantly as a formatted PDF!
                </p>
              </div>
              <Link
                to="/dashboard/write"
                className="px-6 py-3 bg-[#FAF6F0] text-amber-900 hover:bg-white rounded-2xl font-bold text-xs sm:text-sm shadow-md transition-all active:scale-[0.98] shrink-0 flex items-center gap-2 group cursor-pointer"
              >
                ✍️ Start Writing Now
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </Link>
            </div>

            {/* Quick Upload (PDF File) */}
            <QuickUpload onPublished={handleBookPublished} />

            {/* My Collection */}
            <MyCollection
              books={dashboard.books}
              loading={loading}
              error={error}
              skipFetch={true}
            />
          </div>

          {/* Right Sidebar (1/4 width) */}
          <div className="space-y-6">
            
            {/* Author Statistics */}
            <AuthorStats stats={dashboard.stats} loading={loading} />
            
            {/* Recent Activity */}
            <RecentActivity books={dashboard.recentBooks} loading={loading} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;





