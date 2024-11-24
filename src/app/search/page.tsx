"use client";

import { Suspense, memo } from "react";
import SearchContent from "./SearchContent";

const SearchPage = memo(function SearchPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SearchContent />
    </Suspense>
  );
});

export default SearchPage;
