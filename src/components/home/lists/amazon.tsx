import { CarouselComponent } from "../carousel";
import { fetchShows } from "@/lib/api-calls/homeApiCalls";
import { Shows } from "@/types/tmdbApi";

const PopularAmazonShows = async () => {
  const amazonShows = await fetchShows(process.env.AMAZON_URL!);

  return (
    <div>
      <h1 className="inline-block pl-2 text-lg font-bold text-black dark:bg-gradient-to-r dark:from-blue-400 dark:to-blue-800 dark:bg-clip-text dark:text-transparent sm:text-2xl lg:px-0">
        Amazon Shows
      </h1>
      <div className="flex pt-4">
        <CarouselComponent
          shows={
            amazonShows! as Pick<
              Shows,
              | "id"
              | "title"
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

export default PopularAmazonShows;
