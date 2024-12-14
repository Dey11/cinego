import { fetchShows } from "./homeApiCalls";

export async function fetchExplorePageDataFirst() {
  try {
    const [
      trendingMovies,
      trendingTV,
      netflixShows,
      amazonShows,
      appleTVShows,
      disneyShows,
      indianShows,
      peacockShows,
      paramountShows,
      maxShows,
    ] = await Promise.all([
      fetchShows(
        "https://api.themoviedb.org/3/trending/movie/day?language=en-US",
      ),
      fetchShows("https://api.themoviedb.org/3/trending/tv/day?language=en-US"),
      fetchShows("https://api.themoviedb.org/3/discover/tv?with_networks=213"),
      fetchShows(
        "https://api.themoviedb.org/3/discover/tv?with_watch_providers=387&watch_region=US",
      ),
      fetchShows(
        "https://api.themoviedb.org/3/discover/tv?with_watch_providers=9&watch_region=US",
      ),
      fetchShows(
        "https://api.themoviedb.org/3/discover/tv?with_watch_providers=2&watch_region=US",
      ),
      fetchShows(
        "https://api.themoviedb.org/3/discover/movie?include_adult=true&page=1&release_date.lte=2024-03-03&sort_by=popularity.desc&watch_region=IN&with_origin_country=IN",
      ),
      fetchShows(
        "https://api.themoviedb.org/3/discover/tv?with_watch_providers=386&watch_region=US",
      ),
      fetchShows(
        "https://api.themoviedb.org/3/discover/tv?with_watch_providers=531&watch_region=US",
      ),
      fetchShows(
        "https://api.themoviedb.org/3/discover/movie?include_adult=true&language=en-US&page=1&release_date.gte=2022-01-01&release_date.lte=2024-03-03&sort_by=popularity.desc&vote_count.gte=200&watch_region=US&with_watch_providers=15",
      ),
    ]);

    return {
      trendingMovies,
      trendingTV,
      netflixShows,
      amazonShows,
      appleTVShows,
      disneyShows,
      indianShows,
      peacockShows,
      paramountShows,
      maxShows,
    };
  } catch (error) {
    console.error("Error fetching explore page data:", error);
    throw error;
  }
}

// export async function fetchExplorePageDataSecond() {
//   try {
//     const [
//       appleTVShows,
//       disneyShows,
//       indianShows,
//       peacockShows,
//       paramountShows,
//       maxShows,
//     ] = await Promise.all([
//       fetchShows(
//         "https://api.themoviedb.org/3/discover/tv?with_watch_providers=9&watch_region=US",
//       ),
//       fetchShows(
//         "https://api.themoviedb.org/3/discover/tv?with_watch_providers=2&watch_region=US",
//       ),
//       fetchShows(
//         "https://api.themoviedb.org/3/discover/movie?include_adult=true&page=1&release_date.lte=2024-03-03&sort_by=popularity.desc&watch_region=IN&with_origin_country=IN",
//       ),
//       fetchShows(
//         "https://api.themoviedb.org/3/discover/tv?with_watch_providers=386&watch_region=US",
//       ),
//       fetchShows(
//         "https://api.themoviedb.org/3/discover/tv?with_watch_providers=531&watch_region=US",
//       ),
//       fetchShows(
//         "https://api.themoviedb.org/3/discover/movie?include_adult=true&language=en-US&page=1&release_date.gte=2022-01-01&release_date.lte=2024-03-03&sort_by=popularity.desc&vote_count.gte=200&watch_region=US&with_watch_providers=15",
//       ),
//     ]);

//     return {
//       appleTVShows,
//       disneyShows,
//       indianShows,
//       peacockShows,
//       paramountShows,
//       maxShows,
//     };
//   } catch (error) {
//     console.error("Error fetching explore page data:", error);
//     throw error;
//   }
// }
