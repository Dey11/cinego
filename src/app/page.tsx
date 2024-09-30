import PopularAmazonShows from "@/components/home/lists/amazon";
import PopularAppleShows from "@/components/home/lists/apple";
import PopularDisneyShows from "@/components/home/lists/disney";
import PopularHuluShows from "@/components/home/lists/hulu";
import PopularIndianShows from "@/components/home/lists/indian";
import PopularNetflixShows from "@/components/home/lists/netflix";
import TrendingTVSection from "@/components/home/lists/trending-tv";
import TopSlider from "@/components/home/top-slider";
import TrendingMoviesSection from "@/components/home/lists/trending-movies";
import TopWidget from "@/components/home/lists/top-movies";

export default function Home() {
  return (
    <main className="">
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
          </div>
          <div className="sm:col-span-4">
            <TopWidget />
          </div>
        </div>
      </div>
    </main>
  );
}
