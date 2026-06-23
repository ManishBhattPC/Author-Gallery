import React from "react";
import { Users, BookOpen, Tag, IndianRupee } from "lucide-react";

const AuthorStats = ({ stats, loading = false }) => {
  const statValue = (value) => (loading ? "..." : value ?? 0);
  const totalValue = loading
    ? "..."
    : `₹${Number(stats?.totalValue || 0).toLocaleString("en-IN")}`;

  const cards = [
    {
      label: "Followers",
      value: statValue(stats?.followers),
      color: "from-blue-500 to-indigo-500",
      bg: "bg-blue-50 text-blue-600",
      icon: Users,
    },
    {
      label: "Published",
      value: statValue(stats?.published),
      color: "from-emerald-500 to-teal-500",
      bg: "bg-emerald-50 text-emerald-600",
      icon: BookOpen,
    },
    {
      label: "Genres",
      value: statValue(stats?.totalGenres),
      color: "from-amber-500 to-orange-500",
      bg: "bg-amber-50 text-amber-600",
      icon: Tag,
    },
    {
      label: "Total Value",
      value: totalValue,
      color: "from-purple-500 to-pink-500",
      bg: "bg-purple-50 text-purple-600",
      icon: IndianRupee,
    },
  ];

  return (
    <div className="bg-white border border-slate-200/60 p-6 rounded-2xl shadow-sm">
      <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
        Author Metrics
      </h2>

      <div className="grid grid-cols-2 gap-4">
        {cards.map((card, idx) => {
          const IconComponent = card.icon;
          return (
            <div key={idx} className="p-4 rounded-xl border border-slate-100 hover:border-slate-200 transition-colors bg-slate-50/50">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-slate-500">{card.label}</span>
                <div className={`p-2 rounded-lg ${card.bg}`}>
                  <IconComponent className="w-4 h-4" />
                </div>
              </div>
              <h3 className="text-lg font-bold text-slate-800 truncate">{card.value}</h3>
            </div>
          );
        })}
      </div>

      {stats?.lastPublished && (
        <p className="text-xs text-slate-400 mt-4 text-center border-t border-slate-100 pt-3">
          Last published on {new Date(stats.lastPublished).toLocaleDateString()}
        </p>
      )}
    </div>
  );
};

export default AuthorStats;
