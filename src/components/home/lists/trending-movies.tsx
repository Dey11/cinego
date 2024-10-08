import { CarouselComponent } from "../carousel";
import { fetchTrendingMovies } from "@/lib/api-calls/homeApiCalls";
import { TrendingMovies } from "@/types/tmdbApi";

const TrendingMoviesSection = async () => {
  const trendingMovies = await fetchTrendingMovies();

  return (
    <div className="">
      <h1 className="inline-block pl-2 text-lg font-bold text-black dark:bg-gradient-to-r dark:from-yellow-400 dark:to-red-500 dark:bg-clip-text dark:text-transparent sm:text-2xl lg:px-0">
        Trending Movies
      </h1>
      <div className="flex pt-4">
        <CarouselComponent
          shows={
            trendingMovies! as Pick<
              TrendingMovies,
              | "id"
              | "title"
              | "backdrop_path"
              | "vote_average"
              | "original_language"
            >[]
          }
        />
      </div>
    </div>
  );
};

export default TrendingMoviesSection;
