import { AnimeEpisodesList } from "@/components/anime/AnimeEpisodesList";
import { fetchAnimeInfo } from "@/lib/api-calls/anime";
import { AnimeInfo } from "@/types/consumet";
import { Metadata } from "next";
import Image from "next/image";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const params = await props.params;
  const animeInfo = await fetchAnimeInfo(params.id);

  if (!animeInfo) {
    return {
      title: `Watch `,
    };
  }

  return {
    title: `Watch ${animeInfo.title.english || animeInfo.title.romaji} `,
    description: animeInfo.description,
  };
}

export default async function WatchPage(props: PageProps) {
  const params = await props.params;
  const animeInfo = (await fetchAnimeInfo(params.id)) as AnimeInfo;

  if (!animeInfo) {
    return (
      <div>
        <p className="p-4 text-center text-red-500 dark:text-red-400">
          Error occurred, we're sorry
        </p>
      </div>
    );
  }

  return (
    <main className="relative min-h-screen bg-gray-800">
      {/* Background Image */}
      <div className="absolute inset-0 blur-sm">
        <Image
          src={animeInfo.cover || animeInfo.image}
          fill
          className="object-cover"
          alt={animeInfo.title.english || animeInfo.title.romaji}
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/60 to-white dark:via-black/60 dark:to-black"></div>
      </div>

      {/* Player */}
      <div className="relative z-10">{/* Player component will go here */}</div>

      {/* Episodes List */}
      {animeInfo.episodes && animeInfo.episodes.length > 0 && (
        <div className="relative z-10 mx-auto max-w-7xl px-4 py-8">
          <AnimeEpisodesList
            image={animeInfo.image}
            coverImage={animeInfo.cover}
            description={animeInfo.description}
            episodes={animeInfo.episodes}
            animeId={params.id}
          />
        </div>
      )}
    </main>
  );
}
