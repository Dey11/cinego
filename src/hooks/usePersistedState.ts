"use client";

import { getItem, setItem } from "@/lib/utils";
import React from "react";

export function usePersistedState<T>(key: string, initialValue: T) {
  const [state, setState] = React.useState<T>(() => {
    const item = getItem(key);
    if (item) {
      return JSON.parse(item) as T;
    } else {
      return initialValue;
    }
  });

  React.useEffect(() => {
    setItem(key, JSON.stringify(state));
  }, [key, state]);

  return [state, setState] as const;
}
