//@ts-nocheck

import Card from "@/components/movie-page/Card";
import { Button } from "@/components/ui/button";
import { Download, Play, Plus, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Metadata } from "next";
import { fetchAnimeInfo } from "@/lib/api-calls/anime";
import AnimeEpisodesList from "@/components/anime/AnimeEpisodesList";

type AnimeEpisode = {
  id: string;
  number: number;
  title: string;
  image: string;
  description: string;
};

type AnimeCharacter = {
  id: string;
  name: string;
  image: string;
  role: string;
  voiceActor: {
    id: string;
    name: string;
    image: string;
    language: string;
  };
};

type AnimeInfo = {
  id: string;
  title: {
    english: string;
    romaji: string;
  };
  type: string;
  episodes: AnimeEpisode[];
  rating: number;
  releaseDate: string;
  genres: string[];
  description: string;
  cover: string;
  image: string;
  trailer?: {
    id: string;
    site: string;
    thumbnail: string;
  };
  characters?: AnimeCharacter[];
  recommendations: {
    id: string;
    title: {
      english: string;
      romaji: string;
    };
    image: string;
  }[];
};

type Props = Promise<{
  id: string;
  type: "tv" | "movie";
}>;

export async function generateMetadata(props: {
  params: Props;
}): Promise<Metadata> {
  const params = await props.params;
  const animeData = await fetchAnimeInfo(params.id);

  if (!animeData) {
    return {
      title: "Anime Info",
    };
  }

  return {
    title: animeData.title.english || animeData.title.romaji,
    description: animeData.description,
    openGraph: {
      images: [animeData.cover || animeData.image],
    },
  };
}

const Page = async (props: { params: Props }) => {
  const params = await props.params;
  const animeInfo: AnimeInfo = await fetchAnimeInfo(params.id);

  if (!animeInfo) {
    return (
      <div className="p-4 text-center text-red-500 dark:text-red-400">
        Error occurred, we're sorry
      </div>
    );
  }

  return (
    <div className="relative min-h-screen pb-16 text-gray-900 dark:text-gray-100">
      {/* Background Image */}
      <div className="relative h-[100vh] w-full">
        <Image
          src={animeInfo.cover}
          fill
          className="fixed object-cover"
          alt={animeInfo.title.english || animeInfo.title.romaji}
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
              src={animeInfo.image}
              alt={animeInfo.title.english || animeInfo.title.romaji}
              width={300}
              height={450}
            />
          </div>

          {/* Details */}
          <div className="mt-6 md:mt-0 md:w-2/3 lg:w-3/4">
            <h1 className="mb-4 text-3xl font-bold md:text-4xl">
              {animeInfo.title.english || animeInfo.title.romaji}
            </h1>
            <div className="mb-4 flex items-center space-x-4">
              <div className="flex items-center">
                <Star className="mr-1 h-5 w-5 fill-yellow-500 text-yellow-500" />
                <span>{(animeInfo.rating / 20).toFixed(1)}</span>
              </div>
              <span>{animeInfo.releaseDate}</span>
            </div>
            <div className="mb-4 flex flex-wrap gap-2">
              {animeInfo.genres.slice(0, 3).map((genre) => (
                <span
                  key={genre}
                  className="rounded-full bg-slate-900 bg-opacity-40 px-3 py-1 text-sm text-white dark:bg-red-900 dark:bg-opacity-40 dark:text-red-400"
                >
                  {genre}
                </span>
              ))}
            </div>
            <p className="mb-6 text-lg">{animeInfo.description}</p>
            <div className="hidden md:block">
              <div className="flex items-center space-x-4">
                <Link href={`/watch/anime/${params.id}`}>
                  <Button
                    variant={"default"}
                    size={"lg"}
                    className="border border-white font-bold transition-transform hover:scale-110"
                  >
                    <Play className="fill-black pr-1" />
                    Watch Now
                  </Button>
                </Link>
                <Button
                  variant={"secondary"}
                  size={"lg"}
                  className="border border-black bg-transparent font-bold transition-transform hover:scale-110 dark:border-white dark:text-white"
                >
                  <Plus className="pr-1" />
                  Add to watchlist
                </Button>
              </div>
            </div>
            <div className="space-y-3 md:hidden">
              <Link href={`/watch/anime/${params.id}`}>
                <Button
                  variant={"default"}
                  size={"lg"}
                  className="w-full border border-white font-bold transition-transform hover:scale-110"
                >
                  <Play className="fill-black pr-1" />
                  Watch Now
                </Button>
              </Link>
              <Button
                variant={"secondary"}
                size={"lg"}
                className="w-full border border-black bg-transparent font-bold transition-transform hover:scale-110 dark:border-white dark:text-white"
              >
                <Plus className="pr-1" />
                Add to watchlist
              </Button>
            </div>
          </div>
        </div>

        {/* Cast */}
        <div className="mt-16">
          <h2 className="mb-6 text-2xl font-bold">Cast</h2>
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4">
            {animeInfo.characters &&
              animeInfo.characters.slice(0, 8).map((character) => (
                <div key={character.id} className="flex items-center space-x-4">
                  <Image
                    className="h-16 w-16 rounded-full object-cover"
                    src={character.image}
                    width={64}
                    height={64}
                    alt={character.name.full}
                  />
                  <div>
                    <h3 className="font-semibold">
                      {character.name.userPreferred}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {character.voiceActors[0]?.name.userPreferred ||
                        "Unknown VA"}
                      {character.voiceActors[0]?.language &&
                        ` (${character.voiceActors[0].language})`}
                    </p>
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Episodes Section */}
        {animeInfo.episodes && animeInfo.episodes.length > 0 && (
          <div className="mt-16">
            <AnimeEpisodesList
              animeId="1"
              episodes={animeInfo.episodes}
              key={animeInfo.id}
            />
          </div>
        )}

        {/* Recommendations Section */}
        {animeInfo.recommendations && animeInfo.recommendations.length > 0 && (
          <div className="mt-16">
            <h2 className="mb-4 text-2xl font-bold">You may also like</h2>
            <div className="grid grid-cols-3 justify-items-center gap-4 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6">
              {animeInfo.recommendations.map((recommendation) => {
                const show = {
                  type: recommendation.type,
                  image: recommendation.image,
                  id: parseInt(recommendation.id),
                  originalTitle: recommendation.title.romaji,
                  title:
                    recommendation.title.userPreffered ||
                    recommendation.title.english ||
                    recommendation.title.romaji,
                  poster_path: recommendation.image,
                  original_language: recommendation.countryOfOrigin,
                  vote_average: recommendation.rating,
                };
                return <Card key={recommendation.id} show={show} />;
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Page;
