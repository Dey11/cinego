import { CarouselComponent } from "../carousel";
import { fetchTrendingMovies } from "@/lib/api-calls/homeApiCalls";
import { TrendingMovies } from "@/types/tmdbApi";

const TrendingMoviesSection = async () => {
  const trendingMovies = await fetchTrendingMovies();

  return (
    <div className="">
      <h1 className="inline-block bg-gradient-to-r from-yellow-400 to-red-500 bg-clip-text pl-2 text-lg font-bold text-transparent sm:text-2xl lg:px-0">
        Trending Movies
      </h1>
      <div className="flex pt-4">
        <CarouselComponent
          shows={
            trendingMovies! as Pick<
              TrendingMovies,
              "id" | "title" | "backdrop_path" | "vote_average"
            >[]
          }
        />
      </div>
    </div>
  );
};

export default TrendingMoviesSection;
