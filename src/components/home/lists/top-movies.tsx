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
      {/* <div className="inline-block bg-gradient-to-r from-blue-400 to-green-500 bg-clip-text text-center text-lg font-bold text-transparent sm:text-2xl lg:px-0">
        Popular Movies Now
      </div> */}
      <TopList movieItems={topMovies} tvItems={topTVShows!} type="Movies" />
    </div>
  );
};

export default TopWidget;
