import { CarouselComponent } from "../carousel";
import { fetchShows } from "@/lib/api-calls/homeApiCalls";
import { Shows } from "@/types/tmdbApi";

const PopularAppleShows = async () => {
  const appleShows = await fetchShows(process.env.APPLE_URL!);

  return (
    <div>
      <h1 className="inline-block bg-gradient-to-r from-white to-slate-500 bg-clip-text pl-2 text-lg font-bold text-transparent sm:text-2xl lg:px-0">
        Apple TV Shows
      </h1>
      <div className="flex pt-4">
        <CarouselComponent
          shows={
            appleShows! as Pick<
              Shows,
              "id" | "title" | "poster_path" | "vote_average"
            >[]
          }
        />
      </div>
    </div>
  );
};

export default PopularAppleShows;
