import { Metadata } from "next";
import { Suspense } from "react";
import TopSlider from "@/components/home/top-slider";
import TopWidget from "@/components/home/lists/top-widget";
import PopularWidget from "@/components/home/lists/popular-widget";
import ListRow from "@/components/home/lists/list-item";
import { defaultMetadata } from "@/lib/metadata";

export const metadata: Metadata = {
  ...defaultMetadata,
  alternates: {
    canonical: "https://test.flixhq.lol/explore",
  },
  openGraph: {
    ...defaultMetadata.openGraph,
    title: "FlixHQ - Explore Movies & TV Shows Across All Platforms",
    description:
      "Find trending movies, TV shows, and exclusive content from Netflix, Disney+, Amazon Prime, and more. Your one-stop destination for streaming entertainment.",
  },
};

export const revalidate = 3600;

export default async function ExplorePage() {
  return (
    <main className="bg-white pb-32 text-gray-900 dark:bg-black dark:text-white">
      <Suspense fallback={<div>Loading</div>}>
        <TopSlider />
      </Suspense>
      <div className="mx-auto max-w-[1440px] pt-28">
        <div className="sm:grid sm:grid-cols-12">
          <div className="pt-5 sm:col-span-8">
            <div className="">
              <h1 className="inline-block pl-2 text-lg font-bold text-black dark:bg-gradient-to-r dark:from-red-400 dark:to-red-800 dark:bg-clip-text dark:text-transparent sm:text-2xl lg:px-0">
                Trending Movies
              </h1>
              <ListRow url="https://api.themoviedb.org/3/trending/movie/day?language=en-US" />
            </div>
            <div className="mt-5">
              <h1 className="inline-block pl-2 text-lg font-bold text-black dark:bg-gradient-to-r dark:from-purple-400 dark:to-purple-800 dark:bg-clip-text dark:text-transparent sm:text-2xl lg:px-0">
                Trending TV Shows
              </h1>
              <ListRow url="https://api.themoviedb.org/3/trending/tv/day?language=en-US" />
            </div>
            <div className="mt-5">
              <h1 className="inline-block pl-2 text-lg font-bold text-black dark:bg-gradient-to-r dark:from-red-400 dark:to-red-800 dark:bg-clip-text dark:text-transparent sm:text-2xl lg:px-0">
                Netflix Originals
              </h1>
              <ListRow url="https://api.themoviedb.org/3/discover/tv?with_networks=213" />
            </div>
            <div className="mt-5">
              <h1 className="inline-block pl-2 text-lg font-bold text-black dark:bg-gradient-to-r dark:from-green-400 dark:to-green-800 dark:bg-clip-text dark:text-transparent sm:text-2xl lg:px-0">
                Amazon Prime Shows
              </h1>
              <ListRow url="https://api.themoviedb.org/3/discover/tv?with_watch_providers=387&watch_region=US" />
            </div>
            <div className="mt-5">
              <h1 className="inline-block pl-2 text-lg font-bold text-black dark:bg-gradient-to-r dark:from-orange-400 dark:to-orange-800 dark:bg-clip-text dark:text-transparent sm:text-2xl lg:px-0">
                Apple TV+ Shows
              </h1>
              <ListRow url="https://api.themoviedb.org/3/discover/tv?with_watch_providers=9&watch_region=US" />
            </div>
            <div className="mt-5">
              <h1 className="inline-block pl-2 text-lg font-bold text-black dark:bg-gradient-to-r dark:from-yellow-400 dark:to-yellow-800 dark:bg-clip-text dark:text-transparent sm:text-2xl lg:px-0">
                Disney+ Shows
              </h1>
              <ListRow url="https://api.themoviedb.org/3/discover/tv?with_watch_providers=2&watch_region=US" />
            </div>
            <div className="mt-5">
              <h1 className="inline-block pl-2 text-lg font-bold text-black dark:bg-gradient-to-r dark:from-pink-400 dark:to-pink-800 dark:bg-clip-text dark:text-transparent sm:text-2xl lg:px-0">
                Indian TV Shows
              </h1>
              <ListRow url="https://api.themoviedb.org/3/discover/movie?include_adult=true&page=1&release_date.lte=2024-03-03&sort_by=popularity.desc&watch_region=IN&with_origin_country=IN" />
            </div>
            <div className="mt-5">
              <h1 className="inline-block pl-2 text-lg font-bold text-black dark:bg-gradient-to-r dark:from-blue-400 dark:to-blue-800 dark:bg-clip-text dark:text-transparent sm:text-2xl lg:px-0">
                Peacock Shows
              </h1>
              <div>
                <ListRow url="https://api.themoviedb.org/3/discover/tv?with_watch_providers=386&watch_region=US" />
              </div>
            </div>
            <div className="mt-5">
              <h1 className="inline-block pl-2 text-lg font-bold text-black dark:bg-gradient-to-r dark:from-lime-400 dark:to-lime-800 dark:bg-clip-text dark:text-transparent sm:text-2xl lg:px-0">
                Paramount+ Shows
              </h1>
              <div>
                <ListRow url="https://api.themoviedb.org/3/discover/tv?with_watch_providers=531&watch_region=US" />
              </div>
            </div>
            <div className="mt-5">
              <h1 className="inline-block pl-2 text-lg font-bold text-black dark:bg-gradient-to-r dark:from-amber-400 dark:to-amber-800 dark:bg-clip-text dark:text-transparent sm:text-2xl lg:px-0">
                HBO Max Shows
              </h1>
              <div>
                <ListRow url="https://api.themoviedb.org/3/discover/movie?include_adult=true&language=en-US&page=1&release_date.gte=2022-01-01&release_date.lte=2024-03-03&sort_by=popularity.desc&vote_count.gte=200&watch_region=US&with_watch_providers=15" />
              </div>
            </div>
          </div>
          <div className="sm:col-span-4">
            <TopWidget />
            <PopularWidget />
          </div>
        </div>
      </div>
    </main>
  );
}
