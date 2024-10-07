"use client";

import * as React from "react";
import {
  ArrowDownWideNarrow,
  ArrowUpNarrowWide,
  Check,
  ChevronsUpDown,
  GalleryThumbnails,
  List,
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { fetchSeasonInfo } from "@/lib/api-calls/tv";
import { TVSeasonInfo } from "@/types/tmdbApi";
import ListItem from "./ListItem";
import clsx from "clsx";

type Seasons = {
  air_date: string;
  episode_count: number;
  id: number;
  name: string;
  overview: string;
  poster_path: string;
  season_number: number;
  vote_average: number;
};

type SeasonInfo = {
  id: number;
  data: TVSeasonInfo;
};

export function Combobox({
  props,
}: {
  props: { id: number; seasons: Seasons[] };
}) {
  const seasons = props.seasons;
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("1");
  const [order, setOrder] = React.useState(false);
  const [icon, setIcon] = React.useState(false);
  const [epInfo, setEpInfo] = React.useState<SeasonInfo[]>([]);

  const fetchEpisodeInfo = React.useCallback(
    async (id: number, seasonNumber: number) => {
      try {
        const fetchEpsInfo = (await fetchSeasonInfo(
          id,
          seasonNumber,
        )) as TVSeasonInfo;
        setEpInfo([...epInfo, { id: seasonNumber, data: fetchEpsInfo }]);
      } catch (err) {
        console.log(err);
      }
    },
    [value],
  );

  React.useEffect(() => {
    fetchEpisodeInfo(props.id, Number(value));
  }, [value]);

  return (
    <div className="w-full">
      <h1 className="pb-5 text-2xl">Episodes</h1>
      <div className="flex justify-between">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className="w-[200px] justify-between"
            >
              {value
                ? seasons.find(
                    (season) => String(season.season_number) === value,
                  )?.name
                : "Select season..."}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[200px] p-0">
            <Command>
              <CommandList>
                <CommandInput placeholder="Search season..." />
                <CommandEmpty>No season found.</CommandEmpty>
                <CommandGroup>
                  {seasons.map((season) => (
                    <CommandItem
                      key={season.id}
                      value={String(season.season_number)}
                      onSelect={(currentValue) => {
                        setValue(currentValue === value ? "" : currentValue);
                        setOpen(false);
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          value === String(season.season_number)
                            ? "opacity-100"
                            : "opacity-0",
                        )}
                      />
                      {season.name}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
        <div className="mr-6 flex h-10 w-10 gap-2">
          <div>
            {order ? (
              <ArrowUpNarrowWide
                onClick={() => setOrder(!order)}
                className="cursor-pointer"
              />
            ) : (
              <ArrowDownWideNarrow
                onClick={() => setOrder(!order)}
                className="cursor-pointer"
              />
            )}
          </div>
          <div>
            {icon ? (
              <List onClick={() => setIcon(!icon)} className="cursor-pointer" />
            ) : (
              <GalleryThumbnails
                onClick={() => setIcon(!icon)}
                className="cursor-pointer"
              />
            )}
          </div>
        </div>
      </div>
      <ScrollArea className="h-[500px] px-2 pt-5">
        <div
          className={clsx(
            !icon && "grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4",
            icon && "space-y-4",
          )}
        >
          {(order
            ? epInfo.filter((ep) => ep.id == Number(value))[0]?.data.episodes
            : epInfo
                .filter((ep) => ep.id == Number(value))[0]
                ?.data.episodes.toReversed()
          )?.map((ep) => <ListItem props={ep} icons={icon} key={ep.id} />)}
        </div>
      </ScrollArea>
    </div>
  );
}
