"use client";

import {
  Book,
  Clapperboard,
  Home,
  Menu,
  Moon,
  Sun,
  Sword,
  Tv,
  User,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import Search from "./search";
import Link from "next/link";
import { useTheme } from "next-themes";
import { Button } from "../ui/button";
import { useEffect, useState } from "react";

const options = [
  { name: "Home", href: "/", icon: Home },
  { name: "Movies", href: "/movies", icon: Clapperboard },
  { name: "Series", href: "/series", icon: Tv },
  { name: "Anime", href: "/anime", icon: Sword },
  { name: "Manga", href: "/manga", icon: Book },
];

const Header = () => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // UseEffect to set the initial theme to dark
  useEffect(() => {
    setTheme("dark");
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  if (!mounted) return null;

  return (
    <header className="absolute top-0 z-20 mt-5 flex w-full items-center justify-between px-5 md:px-10">
      <Link className="text-2xl font-bold text-red-500" href={"/"}>
        Cinego
      </Link>
      <Search />
      <div className="flex items-center gap-x-5">
        <Button
          // variant="ghost"
          size="icon"
          onClick={toggleTheme}
          className="bg-transparent"
        >
          {theme === "dark" ? (
            <Sun className="h-5 w-5 text-white" />
          ) : (
            <Moon className="h-5 w-5 text-white" />
          )}
        </Button>
        <User className="text-white" />
        <MenuOps />
      </div>
    </header>
  );
};

export default Header;

const MenuOps = () => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Menu className="text-white" />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {options.map((option) => (
          <DropdownMenuItem key={option.name} id={option.name}>
            <div className="flex items-center gap-2">
              <option.icon size={"16px"} />
              <p>{option.name}</p>
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};