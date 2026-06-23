import { useEffect, useState } from "react";
import DashboardHeader from "../components/DashboardComponents/DashboardHeader";
import CreateWork from "../components/DashboardComponents/CreateWork";
import QuickUpload from "../components/DashboardComponents/QuickUpload"; // Import separately now
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
  
  const [draftContent, setDraftContent] = useState({ 
    title: "", 
    content: "" 
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
    setDraftContent({ title: "", content: "" }); // Clear draft
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-50/50 to-indigo-50/30 px-4 py-10 sm:px-6 lg:px-8">
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
            
            {/* Create Work (2/3) + Quick Upload (1/3) */}
            <div className="grid gap-6 md:grid-cols-3">
              <div className="md:col-span-2">
                <CreateWork onContentUpdate={setDraftContent} />
              </div>
              <QuickUpload 
                draftContent={draftContent}
                onPublished={handleBookPublished}
              />
            </div>

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







// import { useEffect, useState } from "react";
// import DashboardHeader from "../components/DashboardComponents/DashboardHeader";
// import CreateWork from "../components/DashboardComponents/CreateWork"; // This now includes QuickUpload
// import AuthorStats from "../components/DashboardComponents/AuthorStats";
// import MyCollection from "../components/DashboardComponents/MyCollection";
// import RecentActivity from "../components/DashboardComponents/RecentActivity";
// import { getAuthorBooks, getAuthorDashboard } from "../services/dashboardService.js";

// const Dashboard = () => {
//   const [dashboard, setDashboard] = useState({
//     stats: null,
//     recentBooks: [],
//     books: [],
//   });
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     let isMounted = true;

//     const loadDashboard = async () => {
//       try {
//         setLoading(true);
//         setError("");

//         // Fetch dashboard stats and author books
//         const [dashboardData, books] = await Promise.all([
//           getAuthorDashboard(),
//           getAuthorBooks(),
//         ]);

//         if (!isMounted) {
//           return;
//         }

//         setDashboard({
//           stats: dashboardData.stats || null,
//           recentBooks: dashboardData.recentBooks || [],
//           books: books.books || [], // Get books array from response
//         });
//       } catch (err) {
//         if (isMounted) {
//           setError(err.message || "Unable to load dashboard data.");
//         }
//       } finally {
//         if (isMounted) {
//           setLoading(false);
//         }
//       }
//     };

//     loadDashboard();

//     return () => {
//       isMounted = false;
//     };
//   }, []);

//   return (
//     <div className="min-h-screen bg-slate-50 px-4 py-10 sm:px-6 lg:px-8">
//       <div className="mx-auto w-full max-w-7xl space-y-8">
        
//         {/* Error Message */}
//         {error && (
//           <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
//             {error}
//           </div>
//         )}

//         {/* Dashboard Header */}
//         <DashboardHeader stats={dashboard.stats} loading={loading} />

//         {/* Main Grid */}
//         <div className="grid gap-6 xl:grid-cols-4">
          
//           {/* Left: Create Work + My Collection */}
//           <div className="xl:col-span-3 space-y-6">
            
//             {/* CreateWork component (includes QuickUpload merged) */}
//             <CreateWork />

//             {/* My Collection (author's books) */}
//             <MyCollection
//               books={dashboard.books}
//               loading={loading}
//               error={error}
//             />
//           </div>

//           {/* Right Sidebar: Stats + Activity */}
//           <div className="space-y-6">
            
//             {/* Author Statistics Cards */}
//             <AuthorStats stats={dashboard.stats} loading={loading} />
            
//             {/* Recent Activity */}
//             <RecentActivity books={dashboard.recentBooks} loading={loading} />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Dashboard;