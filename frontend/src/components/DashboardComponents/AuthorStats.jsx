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
      bg: "#FAF1E6",
      color: "#8C4E35",
      icon: Users,
    },
    {
      label: "Published",
      value: statValue(stats?.published),
      bg: "#E8F3EE",
      color: "#1E5E42",
      icon: BookOpen,
    },
    {
      label: "Genres",
      value: statValue(stats?.totalGenres),
      bg: "#FCF4E7",
      color: "#A2621C",
      icon: Tag,
    },
    {
      label: "Total Value",
      value: totalValue,
      bg: "#FAF1E6",
      color: "#544335",
      icon: IndianRupee,
    },
  ];

  return (
    <div className="bg-slate-50 border border-slate-300 p-6 rounded-2xl shadow-sm text-left">
      <h2 className="text-lg font-bold font-serif text-slate-900 mb-4 flex items-center gap-2">
        Author Metrics
      </h2>

      <div className="grid grid-cols-2 gap-4">
        {cards.map((card, idx) => {
          const IconComponent = card.icon;
          return (
            <div key={idx} className="p-4 rounded-xl border border-slate-300/60 hover:border-slate-300 transition-colors bg-white text-left shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-700">{card.label}</span>
                <div 
                  style={{ backgroundColor: card.bg, color: card.color }}
                  className="p-2 rounded-lg"
                >
                  <IconComponent className="w-4 h-4" />
                </div>
              </div>
              <h3 className="text-lg font-bold text-slate-900 truncate">{card.value}</h3>
            </div>
          );
        })}
      </div>

      {stats?.lastPublished && (
        <p className="text-xs text-slate-700 mt-4 text-center border-t border-slate-300/65 pt-3 font-semibold">
          Last published on {new Date(stats.lastPublished).toLocaleDateString()}
        </p>
      )}
    </div>
  );
};

export default AuthorStats;
