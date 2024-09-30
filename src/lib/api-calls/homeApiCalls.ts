import { Shows, TrendingMovies, TrendingTV } from "@/types/tmdbApi";

export const fetchTrendingMovies = async (): Promise<
  TrendingMovies[] | null
> => {
  const url = "https://api.themoviedb.org/3/trending/movie/day?language=en-US";

  try {
    const initialResponse = await fetch(url, {
      cache: "force-cache",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${process.env.TMDB_ACCESS_TOKEN}`,
      },
    });
    const response = await initialResponse.json();
    return response.results;
    // console.log(response);
  } catch (err) {
    console.log(err);
    return null;
  }
};

export const fetchTrendingTV = async (): Promise<TrendingTV[] | null> => {
  const url = "https://api.themoviedb.org/3/trending/tv/day?language=en-US";

  try {
    const initialResponse = await fetch(url, {
      cache: "force-cache",
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

export const fetchShows = async (url: string): Promise<Shows[] | null> => {
  try {
    const initialResponse = await fetch(url, {
      cache: "force-cache",
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
      cache: "force-cache",
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
      cache: "force-cache",
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
