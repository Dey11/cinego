import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = searchParams.get("page") || "1";
  const type = searchParams.get("type") || "movie";
  const genre = searchParams.get("genre");
  const country = searchParams.get("country");
  const year = searchParams.get("year");

  let url;
  if (type === "anime") {
    const baseAnimeUrl = `https://api.themoviedb.org/3/discover/`;
    const params = `?api_key=${process.env.TMDB_API_KEY}&with_genres=16&page=${page}${
      genre ? `&with_genres=${genre}` : ""
    }${country ? `&with_origin_country=${country}` : ""}`;

    const movieParams = params + (year ? `&primary_release_year=${year}` : "");
    const tvParams = params + (year ? `&first_air_date_year=${year}` : "");

    const moviePromise = fetch(baseAnimeUrl + "movie" + movieParams, {
      cache: "force-cache",
    });
    const tvPromise = fetch(baseAnimeUrl + "tv" + tvParams, {
      cache: "force-cache",
    });

    const [movieResponse, tvResponse] = await Promise.all([
      moviePromise,
      tvPromise,
    ]);
    const [movieData, tvData] = await Promise.all([
      movieResponse.json(),
      tvResponse.json(),
    ]);

    // Combine and sort results
    const combinedResults = [...movieData.results, ...tvData.results]
      .sort((a, b) => b.popularity - a.popularity)
      .slice(0, 20);

    return NextResponse.json({
      results: combinedResults,
      page: parseInt(page),
      total_pages: Math.min(movieData.total_pages, tvData.total_pages),
    });
  } else {
    url = `https://api.themoviedb.org/3/discover/${type}?api_key=${process.env.TMDB_API_KEY}&page=${page}`;

    if (genre) url += `&with_genres=${genre}`;
    if (country) url += `&with_origin_country=${country}`;
    if (year) {
      url +=
        type === "movie"
          ? `&primary_release_year=${year}`
          : `&first_air_date_year=${year}`;
    }

    const response = await fetch(url, {
      cache: "force-cache",
    });
    const data = await response.json();
    return NextResponse.json(data);
  }
}
