import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("query");
  const page = searchParams.get("page") || "1";
  const type = searchParams.get("type");
  const year = searchParams.get("year");
  const genre = searchParams.get("genre");
  const country = searchParams.get("country");

  let endpoint = "multi";
  if (type === "movie") endpoint = "movie";
  if (type === "tv") endpoint = "tv";
  if (type === "anime") {
    // Special handling for anime - search in both movies and tv with animation genre
    const baseUrl = `https://api.themoviedb.org/3/search/`;
    const baseParams = `?api_key=${process.env.TMDB_API_KEY}&query=${query}&page=${page}&with_genres=16${
      genre ? `&with_genres=${genre}` : ""
    }${country ? `&with_origin_country=${country}` : ""}`;

    const movieParams =
      baseParams + (year ? `&primary_release_year=${year}` : "");
    const tvParams = baseParams + (year ? `&first_air_date_year=${year}` : "");

    const moviePromise = fetch(baseUrl + "movie" + movieParams);
    const tvPromise = fetch(baseUrl + "tv" + tvParams);

    const [movieRes, tvRes] = await Promise.all([moviePromise, tvPromise]);
    const [movieData, tvData] = await Promise.all([
      movieRes.json(),
      tvRes.json(),
    ]);

    const combinedResults = [...movieData.results, ...tvData.results]
      .sort((a, b) => b.popularity - a.popularity)
      .slice(0, 20);

    return NextResponse.json({
      results: combinedResults,
      page: parseInt(page),
      total_pages: Math.min(movieData.total_pages, tvData.total_pages),
    });
  }

  let url = `https://api.themoviedb.org/3/search/${endpoint}?api_key=${process.env.TMDB_API_KEY}&query=${query}&page=${page}`;
  if (type !== "multi") {
    if (year) {
      url +=
        type === "movie"
          ? `&primary_release_year=${year}`
          : `&first_air_date_year=${year}`;
    }
    if (genre) url += `&with_genres=${genre}`;
    if (country) url += `&with_origin_country=${country}`;
  }

  const response = await fetch(url);
  const data = await response.json();

  return NextResponse.json(data);
}
