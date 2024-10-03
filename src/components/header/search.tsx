"use client";

import { Filter, SearchIcon } from "lucide-react";
import { Input } from "../ui/input";

const Search = () => {
  return (
    <div className="relative hidden lg:block">
      <Input
        className="h-8 w-48 rounded-3xl border-0 bg-slate-800/80 font-semibold capitalize placeholder:text-center placeholder:text-gray-500 focus:pl-[85px] focus:placeholder:opacity-0 sm:h-10 sm:w-64 md:w-72 lg:w-96"
        placeholder="Search"
      />

      <button className="absolute left-2 top-[6px] flex items-center gap-x-2 rounded-xl bg-black px-2 py-1">
        <Filter className="h-3 w-3" />
        <span className="text-sm text-gray-500">Filter</span>
      </button>

      <SearchIcon className="absolute right-2 top-2 h-6 w-6 text-gray-500" />
    </div>
  );
};

export default Search;
