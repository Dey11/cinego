"use client";

import Link from "next/link";
import React from "react";
import { useMediaQuery } from "react-responsive";

export default function Footer() {
  const isMobile = useMediaQuery({ maxWidth: 500 });

  return (
    <footer className="p-4 pb-16 text-white md:p-8 md:pb-4">
      <div className="mx-auto">
        <div
          className={`flex ${isMobile ? "flex-col" : "flex-row justify-between"} mb-6`}
        >
          <h2 className="mb-4 text-2xl font-bold text-red-500">Cinego</h2>
          <div
            className={`grid ${isMobile ? "grid-cols-2" : "grid-cols-3"} gap-4`}
          >
            <div>
              <Link href="#" className="block text-red-500 hover:text-red-400">
                Movies
              </Link>
              <Link href="#" className="block text-red-500 hover:text-red-400">
                TV-Shows
              </Link>
            </div>
            <div>
              <a href="#" className="block text-red-500 hover:text-red-400">
                Request
              </a>
              <a href="#" className="block text-red-500 hover:text-red-400">
                Contact
              </a>
            </div>
            <div>
              <a href="#" className="block text-red-500 hover:text-red-400">
                FAQs
              </a>
              <a href="#" className="block text-red-500 hover:text-red-400">
                Policy
              </a>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-700 pt-6">
          <p className="mx-auto mb-4 max-w-6xl text-center text-sm">
            Cinego is a free streaming website, where you can watch movies
            online without registration.
          </p>
          <p className="mb-4 text-center text-sm text-red-500">
            This site does not store any files on our server, we only link to
            the media which is hosted on 3rd party services.
          </p>
          <p className="text-center text-xs text-gray-500">
            Cinego © 2024. All Rights Reserved
          </p>
        </div>
      </div>
    </footer>
  );
}
