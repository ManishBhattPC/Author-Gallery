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
      bg: "bg-[#FAF1E6] text-amber-850",
      icon: Users,
    },
    {
      label: "Published",
      value: statValue(stats?.published),
      color: "from-emerald-500 to-teal-500",
      bg: "bg-[#E8F3EE] text-emerald-850",
      icon: BookOpen,
    },
    {
      label: "Genres",
      value: statValue(stats?.totalGenres),
      color: "from-amber-500 to-orange-500",
      bg: "bg-[#FCF4E7] text-amber-900",
      icon: Tag,
    },
    {
      label: "Total Value",
      value: totalValue,
      color: "from-purple-500 to-pink-500",
      bg: "bg-[#FAF1E6] text-[#4E3E2F]",
      icon: IndianRupee,
    },
  ];

  return (
    <div className="bg-[#FDFCF7] border border-[#EADCC9] p-6 rounded-2xl shadow-sm text-left">
      <h2 className="text-lg font-bold font-serif text-[#2C1E11] mb-4 flex items-center gap-2">
        Author Metrics
      </h2>

      <div className="grid grid-cols-2 gap-4">
        {cards.map((card, idx) => {
          const IconComponent = card.icon;
          return (
            <div key={idx} className="p-4 rounded-xl border border-[#EADCC9]/55 hover:border-[#EADCC9] transition-colors bg-[#FAF6F0] text-left">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-[#8C7B6C]">{card.label}</span>
                <div className={`p-2 rounded-lg ${card.bg}`}>
                  <IconComponent className="w-4 h-4" />
                </div>
              </div>
              <h3 className="text-lg font-bold text-[#2C1E11] truncate">{card.value}</h3>
            </div>
          );
        })}
      </div>

      {stats?.lastPublished && (
        <p className="text-xs text-[#8C7B6C] mt-4 text-center border-t border-[#EADCC9]/50 pt-3 font-semibold">
          Last published on {new Date(stats.lastPublished).toLocaleDateString()}
        </p>
      )}
    </div>
  );
};

export default AuthorStats;
