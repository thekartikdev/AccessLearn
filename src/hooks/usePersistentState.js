import { useEffect, useState } from 'react';
import { read, write } from '../utils/storage.js';

const isObj = (v) => v && typeof v === 'object' && !Array.isArray(v);

/** useState that mirrors to localStorage. Missing or corrupt values fall back to `initial`. */
export function usePersistentState(key, initial, merge) {
  const [value, setValue] = useState(() => {
    const fallback = typeof initial === 'function' ? initial() : initial;
    const stored = read(key, null);
    if (stored == null) return fallback;
    if (merge) return merge(fallback, stored);
    return isObj(fallback) && isObj(stored) ? { ...fallback, ...stored } : stored;
  });
  useEffect(() => {
    write(key, value);
  }, [key, value]);
  return [value, setValue];
}
