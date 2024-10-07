import { Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

type CardProps = {
  id: number;
  name?: string;
  title?: string;
  poster_path?: string;
  backdrop_path?: string;
  vote_average: number;
};

const Card = ({ show }: { show: CardProps }) => {
  let type = "";
  if (show.title) {
    type = "movie";
  } else {
    type = "tv";
  }

  return (
    <Link href={`/${type}/${show.id}`}>
      <div className="max-h-44 max-w-24 overflow-hidden hover:text-red-500 sm:max-h-52 sm:max-w-32">
        <div className="relative h-32 w-24 overflow-hidden rounded-sm border-0 sm:h-40 sm:w-32">
          <Image
            className="object-cover transition-transform hover:scale-110"
            src={`${process.env.TMDB_IMG}${
              show.poster_path ? show.poster_path : show.backdrop_path
            }`}
            alt={(show.name ? show.name : show.title)!}
            sizes="fill"
            priority={true}
            fill
          />
          <div className="absolute top-2 rounded-r bg-yellow-500 px-0.5 text-xs font-semibold text-black">
            HD
          </div>
          <div className="absolute right-0 top-2 flex gap-1 rounded-l bg-black bg-opacity-50 pl-1 text-xs font-semibold text-white">
            {show.vote_average.toPrecision(2)}{" "}
            <Star
              size={16}
              strokeWidth={0.5}
              className="border-0 fill-yellow-500"
            />
          </div>
        </div>
        <div className="pt-1 text-center text-sm font-semibold sm:text-base">
          {show.name ? show.name : show.title}
        </div>
      </div>
    </Link>
  );
};

export default Card;
