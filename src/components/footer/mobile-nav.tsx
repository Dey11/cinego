"use client";

import { Home, Search, PlayCircle, Layers, Settings } from "lucide-react";
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
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-gray-900/70 px-4 py-2 md:hidden">
        <ul className="flex items-center justify-between">
          <li>
            <Link href="/home" className="flex flex-col items-center">
              <Home className="h-6 w-6 text-red-500" />
              <span className="mt-1 text-xs text-gray-400">Home</span>
            </Link>
          </li>
          <li>
            <button
              onClick={() => setShowSearch(!showSearch)}
              className="flex flex-col items-center"
            >
              <Search className="h-6 w-6 text-red-500" />
              <span className="mt-1 text-xs text-gray-400">Search</span>
            </button>
          </li>
          <li>
            <a href="#" className="flex flex-col items-center">
              <PlayCircle className="h-6 w-6 text-red-500" />
              <span className="mt-1 text-xs text-gray-400">Watch</span>
            </a>
          </li>
          <li>
            <a href="#" className="flex flex-col items-center">
              <Layers className="h-6 w-6 text-red-500" />
              <span className="mt-1 text-xs text-gray-400">Library</span>
            </a>
          </li>
          <li>
            <a href="#" className="flex flex-col items-center">
              <Settings className="h-6 w-6 text-red-500" />
              <span className="mt-1 text-xs text-gray-400">Settings</span>
            </a>
          </li>
        </ul>
      </nav>
    </>
  );
}
