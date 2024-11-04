"use client";

import { Download } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

const ListItem = ({
  props,
  tvId,
  viewMode,
}: {
  viewMode: "list" | "grid" | "thumbnail";
  tvId: number;
  props: {
    name: string;
    overview: string;
    still_path: string;
    episode_number: number;
    season_number: number;
  };
}) => {
  const searchParams = useSearchParams();
  const season = searchParams.get("season");
  const episode = searchParams.get("episode");
  const isActive =
    parseInt(season! as string) == props.season_number &&
    parseInt(episode! as string) == props.episode_number;

  if (viewMode === "list") {
    return (
      <Link
        href={`/watch/tv/${tvId}?season=${props.season_number}&episode=${props.episode_number}`}
      >
        <div
          className={`mb-2 flex h-20 w-full cursor-pointer gap-2 overflow-hidden rounded-md transition-colors ${isActive ? "bg-gray-400 dark:bg-gray-900" : "bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700"}`}
        >
          <div className="relative h-full min-w-36">
            <Image
              className={`rounded-l-md object-cover ${isActive ? "blur-[1.3px]" : ""}`}
              src={
                props.still_path
                  ? `https://image.tmdb.org/t/p/original${props.still_path}`
                  : "/placeholder.png"
              }
              fill
              alt={props.name}
            />
            <div className="absolute inset-0">
              {isActive && (
                <Image
                  src="/icon-play.png"
                  className="absolute left-1/2 top-1/2 mx-auto -translate-x-1/2 -translate-y-1/2 object-contain opacity-80"
                  width={20}
                  height={20}
                  alt="play"
                />
              )}
              <div className="absolute left-0 top-0 rounded-br-md rounded-tl-md bg-black bg-opacity-70 px-2 py-1 text-sm text-white">
                {props.episode_number}
              </div>
            </div>
          </div>
          <div className="flex flex-1 flex-col justify-center p-2">
            <h2 className="text-sm font-semibold">{props.name}</h2>
            <p className="line-clamp-2 text-xs text-gray-600 dark:text-gray-400">
              {props.overview}
            </p>
          </div>
          <Link
            className="flex items-center justify-center pr-2"
            href={`https://dl.vidsrc.vip/tv/${tvId}/${props.season_number}/${props.episode_number}`}
          >
            <Download className="z-50" />
          </Link>
        </div>
      </Link>
    );
  }

  if (viewMode === "grid") {
    return (
      <Link
        href={`/watch/tv/${tvId}?season=${props.season_number}&episode=${props.episode_number}`}
      >
        <div
          className={`mb-2 flex h-12 w-full cursor-pointer gap-2 overflow-hidden rounded-md transition-colors ${isActive ? "bg-gray-400 dark:bg-gray-900" : "bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700"}`}
        >
          <div className="flex flex-1 items-center justify-center p-2">
            <div className="flex flex-1 text-sm font-semibold">
              Episode {props.episode_number}: {props.name}
            </div>
            <Link
              className="flex items-center justify-center pr-2"
              href={`https://dl.vidsrc.vip/tv/${tvId}/${props.season_number}/${props.episode_number}`}
            >
              <Download className="z-50" />
            </Link>
          </div>
        </div>
      </Link>
    );
  }

  if (viewMode === "thumbnail") {
    return (
      <Link
        href={`/watch/tv/${tvId}?season=${props.season_number}&episode=${props.episode_number}`}
      >
        <div className="relative cursor-pointer transition-opacity hover:opacity-80">
          <Image
            className={`rounded-md ${isActive ? "blur-[1.3px]" : ""}`}
            src={
              props.still_path
                ? `https://image.tmdb.org/t/p/original${props.still_path}`
                : "/placeholder.png"
            }
            height={300}
            width={300}
            alt={props.name}
          />
          <div className="absolute inset-0">
            {isActive && (
              <Image
                src="/icon-play.png"
                className="absolute left-1/2 top-1/2 mx-auto -translate-x-1/2 -translate-y-1/2 object-contain opacity-80"
                width={20}
                height={20}
                alt="play"
              />
            )}
            <div className="absolute left-0 top-0 rounded-br-md rounded-tl-md bg-black bg-opacity-70 px-2 py-1 text-sm text-white">
              {props.episode_number}
            </div>
          </div>
        </div>
      </Link>
    );
  }
};

export default ListItem;
