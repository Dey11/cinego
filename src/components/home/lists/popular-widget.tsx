import {
  fetchPopularMovies,
  fetchPopularTV,
} from "@/lib/api-calls/homeApiCalls";
import PopularList from "../widget-btm";

const PopularWidget = async () => {
  const topMovies = await fetchPopularMovies(
    "https://api.themoviedb.org/3/movie/popular",
  );
  const topTVShows = await fetchPopularTV(
    "https://api.themoviedb.org/3/tv/popular",
  );

  if (topMovies == null) {
    return (
      <div className="text-center text-red-700">Failed to load content</div>
    );
  }

  return (
    <div>
      <PopularList movieItems={topMovies} tvItems={topTVShows!} type="Movie" />
    </div>
  );
};

export default PopularWidget;