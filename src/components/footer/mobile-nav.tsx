"use client";

import {
  Home,
  Search,
  PlayCircle,
  Layers,
  Settings,
  Clapperboard,
  Tv,
  Sword,
} from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";

const SearchComponent = dynamic(() => import("../header/search"), {
  ssr: false,
});

export default function MobileNav() {
  const [showSearch, setShowSearch] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <>
      {mounted && pathname !== "/search" && (
        <div className="fixed left-0 right-0 top-[70px] z-50">
          <div className={showSearch ? "block md:hidden" : "hidden"}>
            <SearchComponent isMobile />
          </div>
        </div>
      )}
      {pathname !== "/" && (
        <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white px-4 py-2 text-black dark:bg-black dark:text-white md:hidden">
          <ul className="flex items-center justify-between">
            <li>
              <Link href="/" className="flex flex-col items-center">
                <Home className="h-6 w-6" />
                <span className="mt-1 text-xs">Home</span>
              </Link>
            </li>
            <li>
              <button
                onClick={() => setShowSearch(!showSearch)}
                className="flex flex-col items-center"
              >
                <Search className="h-6 w-6" />
                <span className="mt-1 text-xs">Search</span>
              </button>
            </li>
            <li>
              <Link
                href="/search?type=movie"
                className="flex flex-col items-center"
              >
                <Clapperboard className="h-6 w-6" />
                <span className="mt-1 text-xs">Movies</span>
              </Link>
            </li>
            <li>
              <Link
                href="/search?type=tv"
                className="flex flex-col items-center"
              >
                <Tv className="h-6 w-6" />
                <span className="mt-1 text-xs">Series</span>
              </Link>
            </li>
            <li>
              <Link href="/search/anime" className="flex flex-col items-center">
                <Sword className="h-6 w-6" />
                <span className="mt-1 text-xs">Anime</span>
              </Link>
            </li>
          </ul>
        </nav>
      )}
    </>
  );
}
