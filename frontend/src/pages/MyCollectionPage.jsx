import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, BookOpen } from "lucide-react";
import MyCollection from "../components/DashboardComponents/MyCollection.jsx";

const MyCollectionPage = () => {
  return (
    <div className="min-h-screen bg-slate-50 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-4xl space-y-6">
        
        {/* Back navigation */}
        <div className="flex items-center gap-2">
          <Link
            to="/author-dashboard"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-800 hover:text-amber-900 transition-colors uppercase tracking-wider"
          >
            <ArrowLeft size={14} /> Back to Dashboard
          </Link>
        </div>

        {/* Header Title */}
        <div className="text-left space-y-1">
          <h1 className="text-3xl font-bold font-serif text-slate-900 flex items-center gap-2">
            <BookOpen className="text-amber-800" size={28} /> Published Books
          </h1>
          <p className="text-xs font-medium text-[#8C7B67]">
            View, edit, or delete any of your published books and stories.
          </p>
        </div>

        {/* My Collection Details (skipFetch=false so it fetches all books itself) */}
        <MyCollection skipFetch={false} isDashboard={false} />
      </div>
    </div>
  );
};

export default MyCollectionPage;
