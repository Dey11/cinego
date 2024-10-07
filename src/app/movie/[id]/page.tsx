import Card from "@/components/Card";
import Player from "@/components/movie-page/Player";
import { Button } from "@/components/ui/button";
import {
  fetchCastInfo,
  fetchMovieInfo,
  fetchMovieRecommendations,
  fetchTrailerInfo,
} from "@/lib/api-calls/shows";
import { Download, Play, Plus, Star } from "lucide-react";
import Image from "next/image";

const Page = async ({ params }: { params: { id: number } }) => {
  const movieId = params.id;
  const [movieInfo, trailerInfo, recommendationsInfo, castInfo] =
    await Promise.all([
      fetchMovieInfo(movieId),
      fetchTrailerInfo(movieId),
      fetchMovieRecommendations(movieId),
      fetchCastInfo(movieId),
    ]);

  if (!movieInfo || !trailerInfo || !recommendationsInfo || !castInfo) {
    return (
      <div className="p-4 text-center text-red-500 dark:text-red-400">
        Error occurred, we're sorry
      </div>
    );
  }

  return (
    <div className="relative min-h-screen pb-16 text-gray-900 dark:text-gray-100">
      {/* Large Screens */}
      <div className="hidden font-semibold sm:block">
        <div className="relative h-[70vh]">
          <Image
            src={`${process.env.TMDB_IMG}${movieInfo.backdrop_path}`}
            fill
            className="object-cover"
            alt={movieInfo.original_title}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/60 to-white dark:via-black/60 dark:to-black"></div>
        </div>
        <div className="relative z-10 mx-auto -mt-48 max-w-screen-xl px-4 md:px-8 lg:px-12 xl:px-16">
          <div className="flex flex-col md:flex-row md:items-start md:space-x-8">
            <div className="flex-shrink-0 md:w-1/3 lg:w-1/4">
              <Image
                className="mx-auto rounded-xl shadow-xl md:mx-0"
                src={`${process.env.TMDB_IMG}${movieInfo.poster_path}`}
                alt={movieInfo.original_title}
                width={300}
                height={450}
              />
            </div>
            <div className="mt-6 md:mt-0 md:w-2/3 lg:w-3/4">
              <h1 className="mb-4 text-3xl font-bold md:text-4xl">
                {movieInfo.original_title}
              </h1>
              <div className="mb-4 flex items-center space-x-4">
                <div className="flex items-center">
                  <Star className="mr-1 h-5 w-5 fill-yellow-500 text-yellow-500" />
                  <span>{movieInfo.vote_average.toFixed(1)}</span>
                </div>
                <span>{movieInfo.release_date.split("-")[0]}</span>
              </div>
              <div className="mb-4 flex flex-wrap gap-2">
                {movieInfo.genres.slice(0, 3).map((genre) => (
                  <span
                    key={genre.id}
                    className="rounded-full bg-red-900 bg-opacity-40 px-3 py-1 text-sm text-red-400 dark:bg-red-700 dark:bg-opacity-40 dark:text-red-200"
                  >
                    {genre.name}
                  </span>
                ))}
              </div>
              <p className="mb-6 text-lg">{movieInfo.overview}</p>
              <div className="flex space-x-4">
                <Button
                  variant="default"
                  className="flex items-center space-x-2"
                >
                  <Play className="h-5 w-5 fill-black dark:fill-white" />
                  <span>Play</span>
                </Button>
                <Button
                  variant="secondary"
                  className="flex items-center space-x-2"
                >
                  <Plus className="h-5 w-5" />
                  <span>Add to watchlist</span>
                </Button>
              </div>
            </div>
          </div>

          {/* Cast */}
          <div className="mt-16">
            <h2 className="mb-6 text-2xl font-bold">Cast</h2>
            <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4">
              {castInfo.slice(0, 8).map((cast) => (
                <div key={cast.cast_id} className="flex items-center space-x-4">
                  <Image
                    className="h-16 w-16 rounded-full"
                    src={`${process.env.TMDB_IMG}${cast.profile_path}`}
                    width={64}
                    height={64}
                    alt={cast.name}
                  />
                  <div>
                    <h3 className="font-semibold">{cast.original_name}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {cast.character}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Trailer */}
          <div className="mt-16">
            <Player trailerInfo={trailerInfo} name={movieInfo.original_title} />
          </div>

          {/* Recommendations */}
          <div className="mt-16">
            <h2 className="mb-6 text-2xl font-bold">You may also like</h2>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
              {recommendationsInfo.slice(0, 12).map((recommendation) => (
                <Card key={recommendation.id} show={recommendation} />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Small Screens */}
      <div className="sm:hidden">
        <div className="relative h-96">
          <Image
            src={`${process.env.TMDB_IMG}${movieInfo.poster_path}`}
            alt={movieInfo.original_title}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white dark:to-black"></div>
        </div>
        <div className="relative z-10 -mt-20 px-4 py-6">
          <h1 className="mb-2 text-2xl font-semibold">
            {movieInfo.original_title}
          </h1>
          <div className="mb-4 flex items-center space-x-4">
            <div className="flex items-center">
              <Star className="mr-1 h-5 w-5 fill-yellow-500 text-yellow-500" />
              <span>{movieInfo.vote_average.toFixed(1)}</span>
            </div>
            <span>{movieInfo.release_date.split("-")[0]}</span>
          </div>
          <div className="mb-4 flex flex-wrap gap-2">
            {movieInfo.genres.slice(0, 2).map((genre) => (
              <span
                key={genre.id}
                className="rounded-full bg-red-900 bg-opacity-40 px-3 py-1 text-sm text-red-400 dark:bg-red-700 dark:bg-opacity-40 dark:text-red-200"
              >
                {genre.name}
              </span>
            ))}
          </div>
          <p className="mb-6 text-sm">{movieInfo.overview}</p>
          <div className="space-y-3">
            <Button
              variant="default"
              className="flex w-full items-center justify-center space-x-2"
            >
              <Play className="h-5 w-5 fill-black dark:fill-white" />
              <span>Play</span>
            </Button>
            <Button
              variant="secondary"
              className="flex w-full items-center justify-center space-x-2"
            >
              <Plus className="h-5 w-5" />
              <span>Add to watchlist</span>
            </Button>
            <Button
              variant="secondary"
              className="flex w-full items-center justify-center space-x-2"
            >
              <Download className="h-5 w-5" />
              <span>Download</span>
            </Button>
          </div>

          {/* Cast */}
          <div className="mt-8">
            <h2 className="mb-4 text-xl font-bold">Cast</h2>
            <div className="grid grid-cols-2 gap-4">
              {castInfo.slice(0, 8).map((cast) => (
                <div key={cast.cast_id} className="flex items-center space-x-3">
                  <Image
                    className="h-12 w-12 rounded-full"
                    src={`${process.env.TMDB_IMG}${cast.profile_path}`}
                    width={48}
                    height={48}
                    alt={cast.name}
                  />
                  <div>
                    <h3 className="text-sm font-semibold">
                      {cast.original_name}
                    </h3>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      {cast.character}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Trailer */}
          <div className="mt-8">
            <Player trailerInfo={trailerInfo} name={movieInfo.original_title} />
          </div>

          {/* Recommendations */}
          <div className="mt-8">
            <h2 className="mb-4 text-xl font-bold">You may also like</h2>
            <div className="grid grid-cols-3 gap-3">
              {recommendationsInfo.slice(0, 12).map((recommendation) => (
                <Card key={recommendation.id} show={recommendation} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
