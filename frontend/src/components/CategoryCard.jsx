import React from "react";

const CategoryCard = ({ title, description, icon }) => {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg hover:-translate-y-1 transition duration-300 cursor-pointer border border-gray-100">
      
      <div className="text-4xl mb-4">
        {icon}
      </div>

      <h3 className="text-xl font-semibold text-gray-900 mb-2">
        {title}
      </h3>

      <p className="text-gray-600 text-sm">
        {description}
      </p>

    </div>
  );
};

export default CategoryCard;