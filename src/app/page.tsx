import PopularAmazonShows from "@/components/home/lists/amazon";
import PopularAppleShows from "@/components/home/lists/apple";
import PopularDisneyShows from "@/components/home/lists/disney";
import PopularHuluShows from "@/components/home/lists/hulu";
import PopularIndianShows from "@/components/home/lists/indian";
import PopularNetflixShows from "@/components/home/lists/netflix";
import TrendingTVSection from "@/components/home/lists/trending-tv";
import TopSlider from "@/components/home/top-slider";
import TrendingMoviesSection from "@/components/home/lists/trending-movies";
import TopWidget from "@/components/home/lists/top-widget";
import PopularWidget from "@/components/home/lists/popular-widget";
import ListRow from "@/components/home/lists/list-item";

export default function Home() {
  return (
    <main className="bg-white text-gray-900 dark:bg-black dark:text-white">
      <TopSlider />
      <div className="mx-auto max-w-[1440px] pt-28">
        <div className="sm:grid sm:grid-cols-12">
          <div className="pt-5 sm:col-span-8">
            <div className="">
              <TrendingMoviesSection />
            </div>
            <div className="mt-5">
              <TrendingTVSection />
            </div>
            <div className="mt-5">
              <PopularNetflixShows />
            </div>
            <div className="mt-5">
              <PopularHuluShows />
            </div>
            <div className="mt-5">
              <PopularAmazonShows />
            </div>
            <div className="mt-5">
              <PopularAppleShows />
            </div>
            <div className="mt-5">
              <PopularDisneyShows />
            </div>
            <div className="mt-5">
              <PopularIndianShows />
            </div>
            <div className="mt-5">
              <h1 className="inline-block pl-2 text-lg font-bold text-black dark:bg-gradient-to-r dark:from-blue-400 dark:to-blue-800 dark:bg-clip-text dark:text-transparent sm:text-2xl lg:px-0">
                Peacock Shows
              </h1>
              <div>
                <ListRow
                  url={`https://api.themoviedb.org/3/discover/tv?with_watch_providers=386&watch_region=US`}
                />
              </div>
            </div>
            <div className="mt-5">
              <h1 className="inline-block pl-2 text-lg font-bold text-black dark:bg-gradient-to-r dark:from-lime-400 dark:to-lime-800 dark:bg-clip-text dark:text-transparent sm:text-2xl lg:px-0">
                Paramount+ Shows
              </h1>
              <div>
                <ListRow
                  url={`https://api.themoviedb.org/3/discover/tv?with_watch_providers=531&watch_region=US`}
                />
              </div>
            </div>
            <div className="mt-5">
              <h1 className="inline-block pl-2 text-lg font-bold text-black dark:bg-gradient-to-r dark:from-amber-400 dark:to-amber-800 dark:bg-clip-text dark:text-transparent sm:text-2xl lg:px-0">
                HBO Max Shows
              </h1>
              <div>
                <ListRow
                  url={`https://api.themoviedb.org/3/discover/tv?with_watch_providers=384`}
                />
              </div>
            </div>
            {/* <div className="mt-5">
              <h1 className="inline-block pl-2 text-lg font-bold text-black dark:bg-gradient-to-r dark:from-amber-400 dark:to-amber-800 dark:bg-clip-text dark:text-transparent sm:text-2xl lg:px-0">
                Apple TV+ Shows
              </h1>
              <div>
                <ListRow
                  url={`https://api.themoviedb.org/3/discover/tv?with_watch_providers=350`}
                />
              </div>
            </div> */}
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
