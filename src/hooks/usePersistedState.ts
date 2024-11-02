// import { getItem, setItem } from "@/lib/utils";
import { setItem } from "@/lib/utils";
import React from "react";

export function usePersistedState<T>(
  key: string,
  initialValue: {
    name: string;
    url: string;
    countryUrl: string;
  },
) {
  const [state, setState] = React.useState<{
    name: string;
    url: string;
    countryUrl: string;
  }>();
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      setState(() => {
        if (key == "currentTVProvider") {
          return {
            name: "VidSrc",
            url: "https://vidsrc.xyz/embed/tv/",
            countryUrl: `https://flagsapi.com/US/flat/32.png`,
          };
        }
        return {
          name: "VidSrc",
          url: "https://vidsrc.xyz/embed/movie/",
          countryUrl: `https://flagsapi.com/US/flat/32.png`,
        };

        // const item = getItem(key);
        // console.log(item);
        // if (item) {
        //   return item as T;
        //   // return JSON.parse(item) as T;
        // } else {
        //   // console.log("im here");
        //   setItem(key, JSON.stringify(initialValue));
        //   return initialValue;
        // }
      });
      setLoading(false);
    }
  }, [key, initialValue]);

  React.useEffect(() => {
    setItem(key, JSON.stringify(state));
  }, [key, state]);

  return [state, setState, loading] as const;
}
