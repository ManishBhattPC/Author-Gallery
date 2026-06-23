import React from "react";
import { Search } from "lucide-react";

const SearchBar = ({ search = "", setSearch, onSearch, placeholder = "Search books, authors, or topics..." }) => {
  return (
    <form onSubmit={onSearch} className="relative w-full max-w-3xl mx-auto">
      <Search
        className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
        size={20}
      />

      <input
        type="text"
        value={search}
        name="search"
        onChange={(e) => setSearch?.(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-full border border-slate-300 bg-white px-4 pl-12 py-4 text-sm text-slate-900 shadow-sm outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-100"
      />
    </form>
  );
};

export default SearchBar;