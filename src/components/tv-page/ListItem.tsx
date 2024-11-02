import Image from "next/image";

const ListItem = ({
  props,
  icons,
}: {
  icons: boolean;
  props: {
    name: string;
    overview: string;
    still_path: string;
    episode_number: number;
  };
}) => {
  if (icons) {
    return (
      <div className="mb-2 flex h-24 w-full gap-2 overflow-hidden rounded-md bg-gray-100 dark:bg-gray-800">
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
    );
  }

  return (
    <div className="relative">
      <Image
        className="rounded-md"
        src={`https://image.tmdb.org/t/p/original${props.still_path}`}
        height={225}
        width={225}
        alt={props.name}
      />
      <div className="absolute left-0 top-0 rounded-br-md rounded-tl-md bg-black bg-opacity-70 px-2 py-1 text-sm text-white">
        {props.episode_number}
      </div>
    </div>
  );
};

export default ListItem;
