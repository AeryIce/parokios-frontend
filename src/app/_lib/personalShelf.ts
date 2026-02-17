export const FAVORITES_STORAGE_KEY = "parokios:favorites:v1";
export const RECENTS_STORAGE_KEY = "parokios:recents:v1";
export const PERSONAL_EVENT_NAME = "parokios-personal";

export type ProductKey = `${string}/${string}/${string}`;

export function makeProductKey(
  parishSlug: string,
  sellerSlug: string,
  productSlug: string
): ProductKey {
  return `${parishSlug}/${sellerSlug}/${productSlug}`;
}

function canUseStorage(): boolean {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

function safeParseArray(raw: string): string[] {
  try {
    const v: unknown = JSON.parse(raw);
    if (!Array.isArray(v)) return [];
    return v.filter((x) => typeof x === "string");
  } catch {
    return [];
  }
}

/**
 * Cache per key untuk memenuhi requirement useSyncExternalStore:
 * - getSnapshot() harus mengembalikan "nilai yang sama" (referensi stabil)
 *   kalau underlying data belum berubah.
 */
type CacheEntry = {
  raw: string;
  list: string[];
};

const cache: Record<string, CacheEntry> = {};

function readList(key: string): string[] {
  if (!canUseStorage()) return [];

  // normalize: kalau item belum ada, anggap "[]"
  const raw = window.localStorage.getItem(key) ?? "[]";

  const hit = cache[key];
  if (hit && hit.raw === raw) return hit.list;

  const parsed = safeParseArray(raw);
  cache[key] = { raw, list: parsed };
  return parsed;
}

function writeList(key: string, list: string[]): void {
  if (!canUseStorage()) return;

  const raw = JSON.stringify(list);
  window.localStorage.setItem(key, raw);

  // update cache biar snapshot langsung konsisten & stabil
  cache[key] = { raw, list };
}

function emitPersonalChanged(): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(PERSONAL_EVENT_NAME));
}

export function getFavorites(): ProductKey[] {
  return readList(FAVORITES_STORAGE_KEY) as ProductKey[];
}

export function isFavorite(productKey: ProductKey): boolean {
  return getFavorites().includes(productKey);
}

export function toggleFavorite(productKey: ProductKey): boolean {
  const list = getFavorites();
  const idx = list.indexOf(productKey);

  let next: ProductKey[];
  let nowFav = false;

  if (idx >= 0) {
    next = [...list.slice(0, idx), ...list.slice(idx + 1)];
    nowFav = false;
  } else {
    next = [productKey, ...list];
    nowFav = true;
  }

  writeList(FAVORITES_STORAGE_KEY, next);
  emitPersonalChanged();
  return nowFav;
}

export function getRecents(): ProductKey[] {
  return readList(RECENTS_STORAGE_KEY) as ProductKey[];
}

export function addRecent(productKey: ProductKey, limit = 12): void {
  const list = getRecents();
  const deduped = [productKey, ...list.filter((x) => x !== productKey)];
  const next = deduped.slice(0, Math.max(1, limit));
  writeList(RECENTS_STORAGE_KEY, next);
  emitPersonalChanged();
}

export function clearFavorites(): void {
  writeList(FAVORITES_STORAGE_KEY, []);
  emitPersonalChanged();
}

export function clearRecents(): void {
  writeList(RECENTS_STORAGE_KEY, []);
  emitPersonalChanged();
}
