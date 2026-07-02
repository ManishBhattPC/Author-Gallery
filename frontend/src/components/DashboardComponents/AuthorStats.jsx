import React from "react";
import { Users, BookOpen, Tag, IndianRupee } from "lucide-react";
import { Link } from "react-router-dom";

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
      link: "/dashboard/network?tab=followers",
    },
    {
      label: "Published",
      value: statValue(stats?.published),
      bg: "#E8F3EE",
      color: "#1E5E42",
      icon: BookOpen,
      link: "/dashboard/my-collection",
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
          const cardContent = (
            <>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-700">{card.label}</span>
                <div 
                  style={{ backgroundColor: card.bg, color: card.color }}
                  className="p-2 rounded-lg transition-transform group-hover:scale-105"
                >
                  <IconComponent className="w-4 h-4" />
                </div>
              </div>
              <h3 className="text-lg font-bold text-slate-900 truncate">{card.value}</h3>
            </>
          );

          return card.link ? (
            <Link
              key={idx}
              to={card.link}
              className="p-4 rounded-xl border border-slate-300/60 hover:border-slate-300 hover:bg-slate-100/50 transition-all duration-200 bg-white text-left shadow-sm group cursor-pointer block"
            >
              {cardContent}
            </Link>
          ) : (
            <div
              key={idx}
              className="p-4 rounded-xl border border-slate-300/60 hover:border-slate-300 transition-colors bg-white text-left shadow-sm"
            >
              {cardContent}
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
