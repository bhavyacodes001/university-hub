/**
 * Local persistence layer.
 * Replaces an external DB with `localStorage`. Data survives reloads and is
 * shared across tabs in the same browser. Cross-tab updates are broadcast
 * via the native `storage` event.
 */

const PREFIX = "srm.db.";

export const db = {
  read<T>(key: string, fallback: T): T {
    try {
      const raw = localStorage.getItem(PREFIX + key);
      if (raw == null) return fallback;
      return JSON.parse(raw) as T;
    } catch {
      return fallback;
    }
  },
  write<T>(key: string, value: T): void {
    localStorage.setItem(PREFIX + key, JSON.stringify(value));
  },
  remove(key: string): void {
    localStorage.removeItem(PREFIX + key);
  },
  clearAll(): void {
    Object.keys(localStorage)
      .filter(k => k.startsWith(PREFIX))
      .forEach(k => localStorage.removeItem(k));
  },
  /** Subscribe to writes from other tabs. Returns an unsubscribe fn. */
  subscribe(key: string, cb: () => void): () => void {
    const handler = (e: StorageEvent) => {
      if (e.key === PREFIX + key) cb();
    };
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  },
};

export const KEYS = {
  students: "students",
  admins: "admins",
  passwords: "passwords",
  subjects: "subjects",
  timetable: "timetable",
  attendance: "attendance",          // per-student aggregated
  attendanceLog: "attendanceLog",    // raw daily entries from admin
  results: "results",
  fees: "fees",
  notices: "notices",
  exams: "exams",
  seedVersion: "seedVersion",
} as const;
