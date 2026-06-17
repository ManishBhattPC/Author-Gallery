import DashboardHeader from "../components/DashboardComponents/DashboardHeader";
import CreateWork from "../components/DashboardComponents/CreateWork";
import QuickUpload from "../components/DashboardComponents/QuickUpload";
import AuthorStats from "../components/DashboardComponents/AuthorStats";
import MyCollection from "../components/DashboardComponents/MyCollection";
import RecentActivity from "../components/DashboardComponents/RecentActivity";

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-slate-50 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-7xl space-y-8">
        <DashboardHeader />

        <div className="grid gap-6 xl:grid-cols-4">
          <div className="xl:col-span-3 space-y-6">
            <div className="grid gap-6 md:grid-cols-3">
              <div className="md:col-span-2">
                <CreateWork />
              </div>
              <QuickUpload />
            </div>

            <MyCollection />
          </div>

          <div className="space-y-6">
            <AuthorStats />
            <RecentActivity />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;