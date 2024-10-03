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

// export const discoverMovies = async (
//   url: string,
// ): Promise<TrendingMovies[] | null> => {
//   try {
//     const initialResponse = await fetch(url, {
//       cache: "force-cache",
//       headers: {
//         accept: "application/json",
//         Authorization: `Bearer ${process.env.TMDB_ACCESS_TOKEN}`,
//       },
//     });
//     const response = await initialResponse.json();
//     console.log(response.results);

//     const promises = response.results.map(async (movie: any) => {
//       const imagesResponse = await fetch(
//         `https://api.themoviedb.org/3/movie/${movie.id}/images?api_key=${process.env.TMDB_ACCESS_TOKEN}`,
//       );
//       const imagesData = await imagesResponse.json();
//       const logo = imagesData.production_companies[0].logo_path;

//       if (logo) {
//         setLogoImages((prevState) => ({ ...prevState, [movie.id]: logo }));
//       }

//       const videoResponse = await fetch(
//         `https://api.themoviedb.org/3/movie/${movie.id}/videos?api_key=${apiKey}`,
//       );
//       const videoData = await videoResponse.json();
//       const firstVideo = videoData.results.find(
//         (video) => video.type === "Trailer",
//       )?.key;

//       setVideos((prevState) => ({ ...prevState, [movie.id]: firstVideo }));
//       setLoadedStates((prevState) => ({
//         ...prevState,
//         [movie.id]: {
//           isImageLoaded: false,
//           isVideoLoaded: !!firstVideo,
//         },
//       }));
//     });

//     await Promise.all(promises);

//     return response.results;
//   } catch (err) {
//     console.log(err);
//     return null;
//   }
// };

// export const discoverTV = async (url: string): Promise<TrendingTV[] | null> => {
//   try {
//     const initialResponse = await fetch(url, {
//       cache: "force-cache",
//       headers: {
//         accept: "application/json",
//         Authorization: `Bearer ${process.env.TMDB_ACCESS_TOKEN}`,
//       },
//     });
//     const response = await initialResponse.json();
//     console.log(response.results);
//     return response.results;
//   } catch (err) {
//     console.log(err);
//     return null;
//   }
// };
