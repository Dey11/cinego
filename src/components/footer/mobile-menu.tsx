"use client";

import { useTheme } from "next-themes";
import {
  Bitcoin,
  Clock,
  Bookmark,
  HelpCircle,
  Smartphone,
  X,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { DISCORD_URL } from "@/lib/constants";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const menuItems = [
  { name: "History", href: "/history", icon: Clock },
  { name: "Watchlist", href: "/watchlist", icon: Bookmark },
  { name: "FAQs", href: "/faqs", icon: HelpCircle },
  { name: "Donate", href: "/donate", icon: Bitcoin },
  { name: "Android APK", href: "/android-movies-apk", icon: Smartphone },
];

export default function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const { theme } = useTheme();

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Menu */}
      <div className="fixed bottom-20 right-4 z-50 w-44 rounded-lg border border-gray-200 bg-white p-2 shadow-lg dark:border-gray-800 dark:bg-black">
        {/* <div className="flex items-center justify-between pb-4">
          <h3 className="text-lg font-semibold">Menu</h3>
        </div> */}

        <div className="space-y-3">
          {menuItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="flex items-center gap-3 rounded-md px-2 py-1 transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
              onClick={onClose}
            >
              <item.icon className="h-5 w-5" />
              <span>{item.name}</span>
            </Link>
          ))}

          <a
            href={DISCORD_URL}
            className="flex items-center gap-3 rounded-md px-3 py-2 transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
            target="_blank"
            rel="noopener noreferrer"
            onClick={onClose}
          >
            <Image
              src="/discord.svg"
              alt="Discord"
              width={20}
              height={20}
              className={theme === "dark" ? "brightness-0 invert" : ""}
            />
            <span>Discord</span>
          </a>
        </div>
      </div>
    </>
  );
}
