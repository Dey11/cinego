import { CarouselComponent } from "../carousel";
import { fetchShows } from "@/lib/api-calls/homeApiCalls";
import { Shows } from "@/types/tmdbApi";

const ListRow = async ({ url }: { url: string }) => {
  const peacock = await fetchShows(url);

  return (
    <div>
      <div className="flex pt-4">
        <CarouselComponent
          shows={
            peacock! as Pick<
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

export default ListRow;
