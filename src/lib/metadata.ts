import { Metadata } from "next";

export const defaultMetadata: Metadata = {
  title: {
    default: "FlixHQ - Your Ultimate Streaming Guide",
    template: "%s | FlixHQ",
  },
  description:
    "Discover and track your favorite movies and TV shows across all streaming platforms. Get personalized recommendations, trending content, and streaming availability information.",
  keywords: [
    "streaming",
    "movies",
    "TV shows",
    "Netflix",
    "Amazon Prime",
    "Disney+",
    "HBO Max",
    "watch guide",
  ],
  authors: [{ name: "FlixHQ" }],
  creator: "FlixHQ",
  publisher: "FlixHQ",
  robots: "index, follow",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://test.flixhq.lol",
    siteName: "FlixHQ",
    title: "FlixHQ - Your Ultimate Streaming Guide",
    description:
      "Discover and track your favorite movies and TV shows across all streaming platforms.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "FlixHQ Preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "FlixHQ - Your Ultimate Streaming Guide",
    description:
      "Discover and track your favorite movies and TV shows across all streaming platforms.",
    images: ["/og-image.jpg"],
    creator: "@flixhq",
  },
};
