import { CarouselComponent } from "../carousel";
import { fetchShows } from "@/lib/api-calls/homeApiCalls";
import { Shows } from "@/types/tmdbApi";

const PopularIndianShows = async () => {
  const indianShows = await fetchShows(process.env.INDIAN_URL!);

  return (
    <div>
      <h1 className="inline-block bg-gradient-to-r from-orange-400 to-orange-700 bg-clip-text pl-2 text-lg font-bold text-transparent sm:text-2xl lg:px-0">
        Indian Shows
      </h1>
      <div className="flex pt-4">
        <CarouselComponent
          shows={
            indianShows! as Pick<
              Shows,
              "id" | "title" | "poster_path" | "vote_average"
            >[]
          }
        />
      </div>
    </div>
  );
};

export default PopularIndianShows;
