"use client";
import { useRouter, usePathname } from "next/navigation";
import {
  ArrowLeft,
  Bitcoin,
  Bookmark,
  Clapperboard,
  Clock,
  Home,
  Menu,
  Moon,
  Smartphone,
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
import { DISCORD_URL, DOWNLOAD_APK } from "@/lib/constants";
import { dark } from "@clerk/themes";

const options = [
  { name: "Home", href: "/", icon: Home },
  { name: "Movies", href: "/search?type=movie", icon: Clapperboard },
  { name: "Series", href: "/search?type=tv", icon: Tv },
  { name: "Anime", href: "/search/anime", icon: Sword },
  { name: "History", href: "/history", icon: Clock },
  { name: "Watchlist", href: "/watchlist", icon: Bookmark },
  { name: "Donate", href: "/donate", icon: Bitcoin },
];

const Header = () => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { user, isLoaded } = useUser();

  // UseEffect to set the initial theme to dark
  useEffect(() => {
    setMounted(true);
    // Only set theme to dark if it hasn't been set before
    if (!localStorage.getItem("theme")) {
      setTheme("dark");
    }
  }, []);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  if (!mounted) return null;

  return (
    <header className="absolute top-0 z-20 flex w-full items-center justify-between px-5 pt-5 md:px-10">
      {[
        "movie",
        "tv",
        "watch",
        "",
        "search",
        "history",
        "watchlist",
        "anime",
        "privacy-policy",
        "terms",
        "donate",
        "contact",
        "android-movies-apk",
        "faqs",
      ].includes(pathname.split("/")[1]) ? (
        <>
          <div className="w-[150px]">
            <button className="" onClick={() => router.back()}>
              {pathname.split("/")[1] !== "" && (
                <ArrowLeft
                  className={cn(
                    "text-2xl font-bold text-white hover:scale-110 hover:transform",
                    [
                      "search",
                      "history",
                      "watchlist",
                      "",
                      "faqs",
                      "android-movies-apk",
                      "contact",
                      "privacy-policy",
                      "terms",
                      "donate",
                    ].includes(pathname.split("/")[1]) &&
                      "text-black hover:text-black dark:text-white dark:hover:text-white",
                  )}
                />
              )}
            </button>
          </div>
        </>
      ) : (
        <>
          <Link className="text-2xl font-bold text-red-500" href={"/home"}>
            <Image src={"/logo.png"} alt="logo" width={150} height={36} />
          </Link>
          {pathname.split("/")[1] !== "search" && (
            <div className="hidden md:block">
              <Search />
            </div>
          )}
        </>
      )}
      <div className="flex items-center gap-x-2">
        {["home", ""].includes(pathname.split("/")[1]) && (
          <Link href={`/android-movies-apk`}>
            <Smartphone
              className={cn(
                "h-5 w-5 text-white",
                [
                  "search",
                  "history",
                  "watchlist",
                  "",
                  "faqs",
                  "android-movies-apk",
                  "contact",
                  "privacy-policy",
                  "terms",
                  "donate",
                ].includes(pathname.split("/")[1]) &&
                  "text-black dark:text-white",
              )}
            />
          </Link>
        )}
        <Button size="icon" onClick={toggleTheme} className="bg-transparent">
          {theme === "dark" ? (
            <Sun
              className={cn(
                "h-5 w-5 text-white",
                [
                  "search",
                  "history",
                  "watchlist",
                  "",
                  "faqs",
                  "android-movies-apk",
                  "contact",
                  "privacy-policy",
                  "terms",
                  "donate",
                ].includes(pathname.split("/")[1]) &&
                  "text-black hover:text-black dark:text-white dark:hover:text-white",
              )}
            />
          ) : (
            <Moon
              className={cn(
                "h-5 w-5 text-white",
                [
                  "search",
                  "history",
                  "watchlist",
                  "",
                  "faqs",
                  "android-movies-apk",
                  "contact",
                  "privacy-policy",
                  "terms",
                  "donate",
                ].includes(pathname.split("/")[1]) &&
                  "text-black dark:text-white",
              )}
            />
          )}
        </Button>
        <MenuOps />
        {!isLoaded && (
          <User
            className={cn(
              "text-white",
              [
                "search",
                "history",
                "watchlist",
                "",
                "faqs",
                "android-movies-apk",
                "contact",
                "privacy-policy",
                "terms",
                "donate",
              ].includes(pathname.split("/")[1]) &&
                "text-black dark:text-white",
            )}
          />
        )}
        {user ? (
          <UserButton appearance={{ baseTheme: dark }} />
        ) : (
          <SignInButton mode="modal">
            <User
              className={cn(
                "text-white",
                [
                  "search",
                  "history",
                  "watchlist",
                  "",
                  "faqs",
                  "android-movies-apk",
                  "contact",
                  "privacy-policy",
                  "terms",
                  "donate",
                ].includes(pathname.split("/")[1]) &&
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
            [
              "search",
              "history",
              "watchlist",
              "",
              "faqs",
              "android-movies-apk",
              "contact",
              "privacy-policy",
              "terms",
              "donate",
            ].includes(pathname.split("/")[1]) && "text-black dark:text-white",
          )}
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="mr-2">
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
        <a href={`${DISCORD_URL}`}>
          <DropdownMenuItem id="discord">
            <div className="flex items-center gap-2">
              <Image
                src={"/discord.svg"}
                alt="discord"
                width={16}
                height={16}
              />
              <p>Discord</p>
            </div>
          </DropdownMenuItem>
        </a>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
