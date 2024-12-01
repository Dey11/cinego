import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";

export default async function WatchlistPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const watchlist = await prisma.watchlist.findMany({
    where: { userId },
    orderBy: { addedAt: "desc" },
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold">My Watchlist</h1>

      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {watchlist.map((item) => (
          <Link
            key={item.id}
            href={`/${item.mediaType}/${item.mediaId}`}
            className="group relative overflow-hidden rounded-lg bg-gray-800 transition-transform hover:scale-105"
          >
            <img
              src={
                item.backdrop_path
                  ? `https://image.tmdb.org/t/p/w500${item.backdrop_path}`
                  : "/placeholder.png"
              }
              alt={item.title}
              className="h-[300px] w-full object-cover"
            />
            <div className="absolute bottom-0 w-full bg-gradient-to-t from-black p-4">
              <h3 className="text-lg font-semibold text-white">{item.title}</h3>
              <p className="text-sm text-gray-300">
                {item.mediaType.toUpperCase()}
              </p>
              <p className="mt-1 text-xs text-gray-400">
                Added {formatDistanceToNow(new Date(item.addedAt))} ago
              </p>
            </div>
          </Link>
        ))}
      </div>

      {watchlist.length === 0 && (
        <div className="text-center">
          <p className="text-gray-500">Your watchlist is empty.</p>
        </div>
      )}
    </div>
  );
}
