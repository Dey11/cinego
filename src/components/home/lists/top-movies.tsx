import {
  fetchPopularMovies,
  fetchPopularTV,
} from "@/lib/api-calls/homeApiCalls";
import TopList from "../widget";

const TopWidget = async () => {
  const topMovies = await fetchPopularMovies(process.env.POPULAR_MOVIES!);
  const topTVShows = await fetchPopularTV(process.env.POPULAR_TV!);

  if (topMovies == null) {
    return (
      <div className="text-center text-red-700">Failed to load content</div>
    );
  }

  return (
    <div>
      <TopList movieItems={topMovies} tvItems={topTVShows!} type="Movie" />
    </div>
  );
};

export default TopWidget;
