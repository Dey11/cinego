import { Suspense } from "react";
import AnimeSearchContent from "./AnimeSearchContent";

export default function AnimeSearchPage() {
  return (
    <Suspense fallback={<div className="">Loading...</div>}>
      <AnimeSearchContent />
    </Suspense>
  );
}
