import Card from "@/components/movie-page/Card";
import Player from "@/components/movie-page/Player";
import { Button } from "@/components/ui/button";
import {
  fetchCastInfo,
  fetchTVInfo,
  fetchTVRecommendations,
  fetchTrailerInfo,
} from "@/lib/api-calls/tv";
import { Download, Play, Plus, Star } from "lucide-react";
import Image from "next/image";
import { Combobox } from "../../../components/tv-page/EpisodesSection";

const Page = async ({ params }: { params: { id: number } }) => {
  const tvId = params.id;
  const [tvInfo, trailerInfo, recommendationsInfo, castInfo] =
    await Promise.all([
      fetchTVInfo(tvId),
      fetchTrailerInfo(tvId),
      fetchTVRecommendations(tvId),
      fetchCastInfo(tvId),
    ]);

  if (!tvInfo || !trailerInfo || !recommendationsInfo || !castInfo) {
    return (
      <div className="p-4 text-center text-red-500 dark:text-red-400">
        Error occurred, we're sorry
      </div>
    );
  }

  return (
    <div className="relative min-h-screen pb-16 text-gray-900 dark:text-gray-100">
      {/* Background Image */}
      <div className="relative h-dvh">
        <Image
          src={`${process.env.TMDB_IMG}${tvInfo.backdrop_path}`}
          fill
          className="object-cover"
          alt={tvInfo.name}
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/60 to-white dark:via-black/60 dark:to-black"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 mx-auto -mt-96 max-w-screen-xl px-4 md:px-8 lg:px-12 xl:px-16">
        <div className="flex flex-col md:flex-row md:items-start md:space-x-32">
          {/* Poster */}
          <div className="hidden flex-shrink-0 md:block md:w-1/3 lg:w-1/4">
            <Image
              className="mx-auto rounded-xl shadow-xl md:mx-0"
              src={`${process.env.TMDB_IMG}${tvInfo.poster_path}`}
              alt={tvInfo.name}
              width={300}
              height={450}
            />
          </div>

          {/* Details */}
          <div className="mt-6 md:mt-0 md:w-2/3 lg:w-3/4">
            <h1 className="mb-4 text-3xl font-bold md:text-4xl">
              {tvInfo.name}
            </h1>
            <div className="mb-4 flex items-center space-x-4">
              <div className="flex items-center">
                <h3 className="mr-4">TV</h3>
                <Star className="mr-1 h-5 w-5 fill-yellow-500 text-yellow-500" />
                <span>{tvInfo.vote_average.toFixed(1)}</span>
              </div>
              <span>{tvInfo.first_air_date.split("-")[0]}</span>
            </div>
            <div className="mb-4 flex flex-wrap gap-2">
              {tvInfo.genres.slice(0, 3).map((genre) => (
                <span
                  key={genre.id}
                  className="rounded-full bg-slate-900 bg-opacity-40 px-3 py-1 text-sm text-white dark:bg-red-900 dark:bg-opacity-40 dark:text-red-400"
                >
                  {genre.name}
                </span>
              ))}
            </div>
            <p className="mb-6 text-lg">{tvInfo.overview}</p>
            <div className="hidden md:block">
              <div className="flex items-center space-x-4">
                <Button
                  variant={"default"}
                  size={"lg"}
                  className="border border-white font-bold transition-transform hover:scale-110"
                >
                  <Play className="fill-black pr-1" />
                  Play
                </Button>
                <Button
                  variant={"secondary"}
                  size={"lg"}
                  className="border border-black bg-transparent font-bold transition-transform hover:scale-110 dark:border-white dark:text-white"
                >
                  <Plus className="pr-1" />
                  Add to watchlist
                </Button>
                <Download className="h-5 w-5" />
              </div>
            </div>
            <div className="space-y-3 md:hidden">
              <Button
                variant={"default"}
                size={"lg"}
                className="w-full border border-white font-bold transition-transform hover:scale-110"
              >
                <Play className="fill-black pr-1" />
                Play
              </Button>
              <Button
                variant={"secondary"}
                size={"lg"}
                className="w-full border border-black bg-transparent font-bold transition-transform hover:scale-110 dark:border-white dark:text-white"
              >
                <Plus className="pr-1" />
                Add to watchlist
              </Button>
              <Button
                variant="secondary"
                className="flex w-full items-center justify-center space-x-2"
              >
                <Download className="h-5 w-5" />
                <span>Download</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Cast */}
        <div className="mt-16">
          <h2 className="mb-6 text-2xl font-bold">Cast</h2>
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4">
            {castInfo.slice(0, 8).map((cast) => (
              <div key={cast.id} className="flex items-center space-x-4">
                <Image
                  className="h-16 w-16 rounded-full object-cover"
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

        {/* Episodes Section */}
        <div className="mt-16">
          <Combobox props={tvInfo} />
        </div>

        {/* Trailer */}
        <div className="mt-16">
          <Player trailerInfo={trailerInfo} name={tvInfo.name} />
        </div>

        {/* Recommendations */}
        <div className="mt-8">
          <h2 className="mb-4 text-xl font-bold">You may also like</h2>
          <div className="grid grid-cols-3 justify-items-center gap-4 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6">
            {recommendationsInfo.slice(0, 12).map((recommendation) => (
              <Card key={recommendation.id} show={recommendation} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
