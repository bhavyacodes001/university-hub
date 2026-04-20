import { useEffect, useState, useCallback } from "react";
import { db, KEYS } from "@/lib/storage";

type Key = keyof typeof KEYS;

/**
 * Reactive read of a localStorage-backed table.
 * Re-runs the loader whenever the same key is written in another tab.
 */
export function useLocalTable<T>(key: Key, loader: () => Promise<T>, deps: any[] = []) {
  const [data, setData] = useState<T | undefined>(undefined);

  const refresh = useCallback(() => {
    loader().then(setData);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  useEffect(() => {
    refresh();
    const unsub = db.subscribe(KEYS[key], refresh);
    return unsub;
  }, [key, refresh]);

  return { data, refresh };
}
