import { Shows, TrendingMovies, TrendingTV } from "@/types/tmdbApi";

export const fetchShows = async (url: string): Promise<Shows[] | null> => {
  try {
    const initialResponse = await fetch(url, {
      next: { revalidate: 7200 }, // 2 hours
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${process.env.TMDB_ACCESS_TOKEN}`,
      },
    });
    const response = await initialResponse.json();
    // console.log(response.results);
    return response.results;
  } catch (err) {
    console.log(err);
    return null;
  }
};

export const fetchPopularMovies = async (
  url: string,
): Promise<TrendingMovies[] | null> => {
  try {
    // console.log("here", url);
    const initialResponse = await fetch(url, {
      next: { revalidate: 7200 }, // 2 hours
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${process.env.TMDB_ACCESS_TOKEN}`,
      },
    });
    const response = await initialResponse.json();
    return response.results;
  } catch (err) {
    console.log(err);
    return null;
  }
};

export const fetchPopularTV = async (
  url: string,
): Promise<TrendingTV[] | null> => {
  try {
    const initialResponse = await fetch(url, {
      next: { revalidate: 7200 }, // 2 hours
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${process.env.TMDB_ACCESS_TOKEN}`,
      },
    });
    const response = await initialResponse.json();
    // console.log(response.results);
    return response.results;
  } catch (err) {
    console.log(err);
    return null;
  }
};
