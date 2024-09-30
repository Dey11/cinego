import { CarouselComponent } from "../carousel";
import { fetchShows } from "@/lib/api-calls/homeApiCalls";
import { Shows } from "@/types/tmdbApi";

const PopularNetflixShows = async () => {
  const netflixShows = await fetchShows(process.env.NETFLIX_URL!);

  return (
    <div>
      <h1 className="inline-block bg-gradient-to-r from-red-400 to-red-800 bg-clip-text pl-2 text-lg font-bold text-transparent sm:text-2xl lg:px-0">
        Netflix Shows
      </h1>
      <div className="flex pt-4">
        <CarouselComponent
          shows={
            netflixShows! as Pick<
              Shows,
              "id" | "title" | "poster_path" | "vote_average"
            >[]
          }
        />
      </div>
    </div>
  );
};

export default PopularNetflixShows;
