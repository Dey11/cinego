import { CarouselComponent } from "../carousel";
import { fetchShows } from "@/lib/api-calls/homeApiCalls";
import { Shows } from "@/types/tmdbApi";

const PopularHuluShows = async () => {
  const huluShows = await fetchShows(process.env.HULU_URL!);

  return (
    <div>
      <h1 className="inline-block bg-gradient-to-r from-green-400 to-green-800 bg-clip-text pl-2 text-lg font-bold text-transparent sm:text-2xl lg:px-0">
        Hulu Shows
      </h1>
      <div className="flex pt-4">
        <CarouselComponent
          shows={
            huluShows! as Pick<
              Shows,
              "id" | "title" | "poster_path" | "vote_average"
            >[]
          }
        />
      </div>
    </div>
  );
};

export default PopularHuluShows;
