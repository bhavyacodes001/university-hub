import { db, KEYS } from "./storage";
import {
  mockStudents, mockAdmins, mockPasswords, mockSubjects,
  mockTimetable, mockAttendance, mockResults, mockFees,
  mockNotices, mockExams,
} from "./mockData";

const SEED_VERSION = 3;

/**
 * Idempotent seed. Runs once per browser (or when SEED_VERSION bumps).
 * If the user wipes data via Settings → Reset, this re-runs.
 */
export function ensureSeed(force = false) {
  const current = db.read<number>(KEYS.seedVersion, 0);
  if (!force && current === SEED_VERSION) return;

  db.write(KEYS.students, mockStudents);
  db.write(KEYS.admins, mockAdmins);
  db.write(KEYS.passwords, mockPasswords);
  db.write(KEYS.subjects, mockSubjects);
  db.write(KEYS.timetable, mockTimetable);
  db.write(KEYS.attendance, mockAttendance);
  db.write(KEYS.attendanceLog, []);
  db.write(KEYS.results, mockResults);
  db.write(KEYS.fees, mockFees);
  db.write(KEYS.notices, mockNotices);
  db.write(KEYS.exams, mockExams);
  db.write(KEYS.seedVersion, SEED_VERSION);
}

export function resetAll() {
  db.clearAll();
  ensureSeed(true);
}
