import { CarouselComponent } from "../carousel";
import { fetchTrendingTV } from "@/lib/api-calls/homeApiCalls";
import { TrendingTV } from "@/types/tmdbApi";

const TrendingTVSection = async () => {
  const trendingTV = await fetchTrendingTV();

  return (
    <div>
      <h1 className="inline-block bg-gradient-to-r from-orange-400 to-orange-500 bg-clip-text pl-2 text-lg font-bold text-transparent sm:text-2xl lg:px-0">
        Trending TV Shows
      </h1>
      <div className="flex pt-4">
        <CarouselComponent
          shows={
            trendingTV! as Pick<
              TrendingTV,
              "id" | "name" | "poster_path" | "vote_average"
            >[]
          }
        />
      </div>
    </div>
  );
};

export default TrendingTVSection;
