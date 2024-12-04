"use client";
import { useRouter, usePathname } from "next/navigation";
import {
  ArrowLeft,
  Book,
  Clapperboard,
  Clock,
  Home,
  List,
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
import Image from "next/image";
import { cn } from "@/lib/utils";
import { SignInButton, UserButton, useUser } from "@clerk/nextjs";

const options = [
  { name: "Home", href: "/", icon: Home },
  { name: "Movies", href: "/search?type=movie", icon: Clapperboard },
  { name: "Series", href: "/search?type=tv", icon: Tv },
  { name: "History", href: "/history", icon: Clock },
  { name: "Watchlist", href: "/watchlist", icon: List },
];

const Header = () => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useUser();

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
      {pathname.split("/")[1] === "movie" ||
      pathname.split("/")[1] === "tv" ||
      pathname.split("/")[1] === "watch" ||
      pathname.split("/")[1] === "" ||
      pathname.split("/")[1] === "search" ||
      pathname.split("/")[1] === "history" ||
      pathname.split("/")[1] === "watchlist" ||
      pathname.split("/")[1] === "anime" ? (
        <>
          <div className="w-[150px]">
            <button className="" onClick={() => router.back()}>
              {pathname.split("/")[1] !== "" && (
                <ArrowLeft
                  className={cn(
                    "text-2xl font-bold text-white hover:scale-110 hover:transform",
                    pathname.split("/")[1] === "search" &&
                      "text-black hover:text-black dark:text-white dark:hover:text-white",
                  )}
                />
              )}
            </button>
          </div>
        </>
      ) : (
        <>
          <Link className="text-2xl font-bold text-red-500" href={"/"}>
            <Image src={"/logo.png"} alt="logo" width={150} height={100} />
          </Link>
          {pathname.split("/")[1] !== "search" && (
            <div className="hidden md:block">
              <Search />
            </div>
          )}
        </>
      )}
      <div className="flex items-center gap-x-5">
        <Button
          // variant="ghost"
          size="icon"
          onClick={toggleTheme}
          className="bg-transparent"
        >
          {theme === "dark" ? (
            <Sun
              className={cn(
                "h-5 w-5 text-white",
                (pathname.split("/")[1] === "search" ||
                  pathname.split("/")[1] === "history") &&
                  "text-black hover:text-black dark:text-white dark:hover:text-white",
              )}
            />
          ) : (
            <Moon
              className={cn(
                "h-5 w-5 text-white",
                (pathname.split("/")[1] === "search" ||
                  pathname.split("/")[1] === "history") &&
                  "text-black dark:text-white",
              )}
            />
          )}
        </Button>
        <MenuOps />
        {user ? (
          <UserButton />
        ) : (
          <SignInButton mode="modal">
            <User
              className={cn(
                "text-white",
                (pathname.split("/")[1] === "search" ||
                  pathname.split("/")[1] === "history") &&
                  "text-black dark:text-white",
              )}
            />
          </SignInButton>
        )}
      </div>
    </header>
  );
};

export default Header;

const MenuOps = () => {
  const pathname = usePathname();

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Menu
          className={cn(
            "text-white",
            (pathname.split("/")[1] === "search" ||
              pathname.split("/")[1] === "history") &&
              "text-black dark:text-white",
          )}
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {options.map((option) => (
          <Link href={option.href} key={option.name}>
            <DropdownMenuItem id={option.name}>
              <div className="flex items-center gap-2">
                <option.icon size={"16px"} />
                <p>{option.name}</p>
              </div>
            </DropdownMenuItem>
          </Link>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
