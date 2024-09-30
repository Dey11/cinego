import { Home, Search, PlayCircle, Layers, Settings } from "lucide-react";

export default function MobileNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-gray-900/70 px-4 py-2 md:hidden">
      <ul className="flex items-center justify-between">
        <li>
          <a href="#" className="flex flex-col items-center">
            <Home className="h-6 w-6 text-red-500" />
            <span className="mt-1 text-xs text-gray-400">Home</span>
          </a>
        </li>
        <li>
          <a href="#" className="flex flex-col items-center">
            <Search className="h-6 w-6 text-red-500" />
            <span className="mt-1 text-xs text-gray-400">Search</span>
          </a>
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
  );
}
