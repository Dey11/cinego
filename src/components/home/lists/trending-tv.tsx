import { CarouselComponent } from "../carousel";
import { fetchTrendingTV } from "@/lib/api-calls/homeApiCalls";
import { TrendingTV } from "@/types/tmdbApi";

const TrendingTVSection = async () => {
  const trendingTV = await fetchTrendingTV();

  return (
    <div>
      <h1 className="inline-block pl-2 text-lg font-bold text-black dark:bg-gradient-to-r dark:from-orange-400 dark:to-orange-500 dark:bg-clip-text dark:text-transparent sm:text-2xl lg:px-0">
        Trending TV Shows
      </h1>
      <div className="flex pt-4">
        <CarouselComponent
          shows={
            trendingTV! as Pick<
              TrendingTV,
              | "id"
              | "name"
              | "poster_path"
              | "vote_average"
              | "original_language"
            >[]
          }
        />
      </div>
    </div>
  );
};

export default TrendingTVSection;
