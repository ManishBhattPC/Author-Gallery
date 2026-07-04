import React from "react";

const CategoryCard = ({ title, description, icon }) => {
  return (
    <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm hover:shadow-lg hover:-translate-y-1 transition duration-300 cursor-pointer border border-gray-100 h-full flex flex-col justify-start text-left">
      
      <div className="text-3xl sm:text-4xl mb-2 sm:mb-4">
        {icon}
      </div>

      <h3 className="text-base sm:text-xl font-semibold text-slate-900 mb-1 sm:mb-2 line-clamp-1">
        {title}
      </h3>

      <p className="text-slate-600 text-xs sm:text-sm line-clamp-3 leading-relaxed">
        {description}
      </p>

    </div>
  );
};

export default CategoryCard;