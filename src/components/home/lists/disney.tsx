import { CarouselComponent } from "../carousel";
import { fetchShows } from "@/lib/api-calls/homeApiCalls";
import { Shows } from "@/types/tmdbApi";

const PopularDisneyShows = async () => {
  const disneyShows = await fetchShows(process.env.DISNEY_URL!);

  return (
    <div>
      <h1 className="inline-block bg-gradient-to-r from-violet-400 to-violet-800 bg-clip-text pl-2 text-lg font-bold text-transparent sm:text-2xl lg:px-0">
        Disney Shows
      </h1>
      <div className="flex pt-4">
        <CarouselComponent
          shows={
            disneyShows! as Pick<
              Shows,
              "id" | "title" | "poster_path" | "vote_average"
            >[]
          }
        />
      </div>
    </div>
  );
};

export default PopularDisneyShows;
