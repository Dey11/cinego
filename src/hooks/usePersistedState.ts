// "use client";

import { getItem, setItem } from "@/lib/utils";
import React from "react";

export function usePersistedState<T>(key: string, initialValue: T) {
  const [state, setState] = React.useState<T>();
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      setState(() => {
        const item = getItem(key);
        // console.log(item);
        if (item) {
          return item as T;
          // return JSON.parse(item) as T;
        } else {
          // console.log("im here");
          setItem(key, JSON.stringify(initialValue));
          return initialValue;
        }
      });
      setLoading(false);
    }
  }, [key, initialValue]);

  React.useEffect(() => {
    setItem(key, JSON.stringify(state));
  }, [key, state]);

  return [state, setState, loading] as const;
}
