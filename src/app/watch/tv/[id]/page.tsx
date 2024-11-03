import TVPlayer from "@/components/watch/tv-player";
import { fetchTVInfo } from "@/lib/api-calls/tv";
import { Metadata } from "next";
import Image from "next/image";

interface PageProps {
  params: {
    id: string;
  };
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const tvInfo = await fetchTVInfo(parseInt(params.id));

  if (!tvInfo) {
    return {
      title: `Watch - Hope`,
    };
  }

  return {
    title: `Watch ${tvInfo.name} - Hope`,
    description: tvInfo.overview,
  };
}

export default async function WatchPage({ params }: PageProps) {
  const tvInfo = await fetchTVInfo(parseInt(params.id));
  // console.log(tvInfo);

  if (!tvInfo) {
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
          src={`${process.env.TMDB_IMG}${tvInfo.backdrop_path}`}
          fill
          className="object-cover"
          alt={tvInfo.name}
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/60 to-white dark:via-black/60 dark:to-black"></div>
      </div>

      {/* Player */}
      <div className="relative z-10">
        <TVPlayer tvId={params.id} tvInfo={tvInfo} />
      </div>
    </main>
  );
}
