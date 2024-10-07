import "@vidstack/react/player/styles/default/theme.css";
import "@vidstack/react/player/styles/default/layouts/video.css";
import { MediaPlayer, MediaProvider } from "@vidstack/react";
import {
  defaultLayoutIcons,
  DefaultVideoLayout,
} from "@vidstack/react/player/layouts/default";
import { MovieTrailer } from "@/types/tmdbApi";

const Player = ({
  trailerInfo,
  name,
}: {
  trailerInfo: MovieTrailer[];
  name: string;
}) => {
  let source;
  let findTrailer = trailerInfo.filter((trailer) => trailer.type == "Trailer");
  if (findTrailer.length) source = findTrailer[0].key;
  else source = "";
  if (source == "" && trailerInfo[0]) source = trailerInfo[0].key;

  if (source == "") return <div></div>;

  return (
    <div>
      <h1 className="font-bold text-2xl pb-5">Trailer</h1>
      <MediaPlayer title={name} src={`youtube/${source}`}>
        <MediaProvider />
        <DefaultVideoLayout icons={defaultLayoutIcons} />
      </MediaPlayer>
    </div>
  );
};

export default Player;
