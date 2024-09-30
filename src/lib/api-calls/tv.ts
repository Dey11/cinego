import {
  MovieTrailer,
  TVCast,
  TVInfo,
  TVRecommendations,
  TVSeasonInfo,
} from "@/types/tmdbApi";

export const fetchTVInfo = async (id: number): Promise<TVInfo | null> => {
  const TVInfo = `https://api.themoviedb.org/3/tv/${id}?language=en-US`;
  try {
    const initResTV = await fetch(TVInfo, {
      cache: "force-cache",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${process.env.TMDB_ACCESS_TOKEN}`,
      },
    });
    const tvResponse = await initResTV.json();

    return tvResponse;
  } catch (err) {
    console.log(err);
    return null;
  }
};

export const fetchCastInfo = async (id: number): Promise<TVCast[] | null> => {
  const castInfo = `https://api.themoviedb.org/3/tv/${id}/credits?language=en-US`;
  try {
    const initResCast = await fetch(castInfo, {
      cache: "force-cache",
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

export const fetchTVRecommendations = async (
  id: number
): Promise<TVRecommendations[] | null> => {
  const recommendations = `https://api.themoviedb.org/3/tv/${id}/recommendations?language=en-US&page=1`;
  try {
    const initResRec = await fetch(recommendations, {
      cache: "force-cache",
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

export const fetchSeasonInfo = async (
  id: number,
  seasonNo: number
): Promise<TVSeasonInfo | null> => {
  const url = `https://api.themoviedb.org/3/tv/${id}/season/${seasonNo}?language=en-US`;
  try {
    const initResSeason = await fetch(url, {
      cache: "force-cache",
      headers: {
        accept: "application/json",
        Authorization:
          "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI0YzY4ZTRjYjBhMDM4OTk0MTliNmVmYTZiOGJjOGJiZSIsInN1YiI6IjY2NWQ5YmMwYTVlMDU0MzUwMTQ5MWUwNSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.5f_cwrVa5tcJitWk--nzhAVIVWB__cFJl21JRGTbnJo",
      },
    });
    const seasonInfoResponse = await initResSeason.json();
    return seasonInfoResponse;
  } catch (err) {
    console.log(err);
    return null;
  }
};

export const fetchTrailerInfo = async (
  id: number
): Promise<MovieTrailer[] | null> => {
  const trailerInfo = `https://api.themoviedb.org/3/tv/${id}/season/1/videos?language=en-US`;
  try {
    const initResTrailer = await fetch(trailerInfo, {
      cache: "force-cache",
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
