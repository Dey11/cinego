import Image from "next/image";
import Link from "next/link";

const ListItem = ({
  props,
  // icons,
  tvId,
  viewMode,
}: {
  viewMode: "list" | "grid" | "thumbnail";
  // icons: boolean;
  tvId: number;
  props: {
    name: string;
    overview: string;
    still_path: string;
    episode_number: number;
    season_number: number;
  };
}) => {
  if (viewMode === "list") {
    return (
      <Link
        href={`/watch/tv/${tvId}?season=${props.season_number}&episode=${props.episode_number}`}
      >
        <div className="mb-2 flex h-24 w-full cursor-pointer gap-2 overflow-hidden rounded-md bg-gray-100 transition-colors hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700">
          <div className="relative h-full min-w-[96px]">
            <Image
              className="rounded-l-md object-cover"
              src={`https://image.tmdb.org/t/p/original${props.still_path}`}
              fill
              alt={props.name}
            />
          </div>
          <div className="flex flex-col justify-center p-2">
            <h2 className="text-sm font-semibold">{props.name}</h2>
            <p className="line-clamp-2 text-xs text-gray-600 dark:text-gray-400">
              {props.overview}
            </p>
          </div>
        </div>
      </Link>
    );
  }

  if (viewMode === "grid") {
    return (
      <Link
        href={`/watch/tv/${tvId}?season=${props.season_number}&episode=${props.episode_number}`}
      >
        <div className="mb-2 flex h-12 w-full cursor-pointer gap-2 overflow-hidden rounded-md bg-gray-100 transition-colors hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700">
          <div className="flex flex-col justify-center p-2">
            <h2 className="text-sm font-semibold">
              Episode {props.episode_number}: {props.name}
            </h2>
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
            className="rounded-md"
            src={`https://image.tmdb.org/t/p/original${props.still_path}`}
            height={300}
            width={300}
            alt={props.name}
          />
          <div className="absolute left-0 top-0 rounded-br-md rounded-tl-md bg-black bg-opacity-70 px-2 py-1 text-sm text-white">
            {props.episode_number}
          </div>
        </div>
      </Link>
    );
  }
};

export default ListItem;
