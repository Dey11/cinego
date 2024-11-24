import {
  MovieCastInfo,
  MovieInfo,
  MovieTrailer,
  MovieRecommendations,
} from "@/types/tmdbApi";

export const fetchMovieInfo = async (id: number): Promise<MovieInfo | null> => {
  const movieInfo = `https://api.themoviedb.org/3/movie/${id}?language=en-US`;
  try {
    const initResMovie = await fetch(movieInfo, {
      next: { revalidate: 86400 }, // 24 hours
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${process.env.TMDB_ACCESS_TOKEN}`,
      },
    });
    const movieResponse = await initResMovie.json();

    return movieResponse;
  } catch (err) {
    console.log(err);
    return null;
  }
};

export const fetchTrailerInfo = async (
  id: number,
): Promise<MovieTrailer[] | null> => {
  const trailerInfo = `https://api.themoviedb.org/3/movie/${id}/videos?language=en-US`;
  try {
    const initResTrailer = await fetch(trailerInfo, {
      next: { revalidate: 86400 }, // 24 hours
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${process.env.TMDB_ACCESS_TOKEN}`,
      },
    });
    const trailerResponse = await initResTrailer.json();
    return trailerResponse.results;
  } catch (err) {
    console.log(err);
    return null;
  }
};

export const fetchCastInfo = async (
  id: number,
): Promise<MovieCastInfo[] | null> => {
  const castInfo = `https://api.themoviedb.org/3/movie/${id}/credits?language=en-US`;
  try {
    const initResCast = await fetch(castInfo, {
      next: { revalidate: 86400 }, // 24 hours
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${process.env.TMDB_ACCESS_TOKEN}`,
      },
    });
    const castResponse = await initResCast.json();
    return castResponse.cast;
  } catch (err) {
    console.log(err);
    return null;
  }
};

export const fetchMovieRecommendations = async (
  id: number,
): Promise<MovieRecommendations[] | null> => {
  const recommendations = `https://api.themoviedb.org/3/movie/${id}/recommendations?language=en-US&page=1`;
  try {
    const initResRec = await fetch(recommendations, {
      next: { revalidate: 43200 }, // 12 hours
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${process.env.TMDB_ACCESS_TOKEN}`,
      },
    });
    const recResponse = await initResRec.json();
    return recResponse.results;
  } catch (err) {
    console.log(err);
    return null;
  }
};
