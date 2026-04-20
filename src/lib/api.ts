/**
 * API layer — backed by localStorage via /lib/storage + /lib/seed.
 * 100% offline. No external network calls.
 *
 * Pages and components only import from this file, so swapping to a real
 * backend later means rewriting these methods only.
 */

import { db, KEYS } from "./storage";
import { ensureSeed } from "./seed";
import type {
  Student, Admin, User, Notice, NoticeCategory,
  Subject, TimetableSlot, AttendanceRecord, SemesterResult,
  FeeRecord, ExamSchedule,
} from "@/types";

ensureSeed();

const delay = <T,>(value: T, ms = 120): Promise<T> =>
  new Promise(r => setTimeout(() => r(value), ms));

// Generic helpers
const get = <T,>(key: string, fallback: T): T => db.read<T>(key, fallback);
const set = <T,>(key: string, value: T): void => db.write<T>(key, value);

interface AttendanceLogEntry {
  date: string;
  subjectCode: string;
  studentId: string;
  present: boolean;
}

/** Recompute per-subject totals for a given student from the raw log. */
function recomputeAttendanceFor(studentId: string): AttendanceRecord[] {
  const baseline = get<AttendanceRecord[]>(KEYS.attendance, []);
  const log = get<AttendanceLogEntry[]>(KEYS.attendanceLog, [])
    .filter(e => e.studentId === studentId);

  // Start from baseline (the seeded snapshot) so the demo charts look full,
  // then layer admin-recorded sessions on top.
  const map = new Map<string, AttendanceRecord>();
  baseline.forEach(b => map.set(b.subjectCode, { ...b }));

  for (const entry of log) {
    const cur = map.get(entry.subjectCode) ?? { subjectCode: entry.subjectCode, attended: 0, total: 0 };
    cur.total += 1;
    if (entry.present) cur.attended += 1;
    map.set(entry.subjectCode, cur);
  }
  return Array.from(map.values());
}

export const api = {
  // ─── AUTH ───
  async login(email: string, password: string): Promise<User> {
    const passwords = get<Record<string, string>>(KEYS.passwords, {});
    const stored = passwords[email.toLowerCase()];
    if (!stored || stored !== password) throw new Error("Invalid email or password");

    const students = get<Student[]>(KEYS.students, []);
    const student = students.find(s => s.email === email.toLowerCase());
    if (student) return delay(student);

    const admins = get<Admin[]>(KEYS.admins, []);
    const admin = admins.find(a => a.email === email.toLowerCase());
    if (admin) return delay(admin);

    throw new Error("Account not found");
  },

  async register(payload: { name: string; email: string; password: string; enrollmentNo: string }): Promise<Student> {
    const passwords = get<Record<string, string>>(KEYS.passwords, {});
    if (passwords[payload.email.toLowerCase()]) throw new Error("Email already registered");

    const students = get<Student[]>(KEYS.students, []);
    const student: Student = {
      id: `s${Date.now()}`, role: "student",
      email: payload.email.toLowerCase(), name: payload.name,
      enrollmentNo: payload.enrollmentNo, programme: "B.Tech",
      branch: "Computer Science & Engineering", semester: 1, section: "A",
      year: 1, cgpa: 0, attendancePct: 0, pendingFees: 0,
    };
    students.push(student);
    passwords[student.email] = payload.password;
    set(KEYS.students, students);
    set(KEYS.passwords, passwords);
    return delay(student);
  },

  async forgotPassword(email: string): Promise<{ ok: true }> {
    const passwords = get<Record<string, string>>(KEYS.passwords, {});
    if (!passwords[email.toLowerCase()]) throw new Error("No account with that email");
    return delay({ ok: true });
  },

  // ─── STUDENT VIEWS ───
  getSubjects:  (): Promise<Subject[]>        => delay(get<Subject[]>(KEYS.subjects, [])),
  getTimetable: (): Promise<TimetableSlot[]>  => delay(get<TimetableSlot[]>(KEYS.timetable, [])),
  getResults:   (): Promise<SemesterResult[]> => delay(get<SemesterResult[]>(KEYS.results, [])),
  getFees:      (): Promise<FeeRecord[]>      => delay(get<FeeRecord[]>(KEYS.fees, [])),
  getExams:     (): Promise<ExamSchedule[]>   => delay(get<ExamSchedule[]>(KEYS.exams, [])),

  /** Per-subject attendance for a given student (or the baseline if none specified). */
  getAttendance: (studentId?: string): Promise<AttendanceRecord[]> => {
    if (!studentId) return delay(get<AttendanceRecord[]>(KEYS.attendance, []));
    return delay(recomputeAttendanceFor(studentId));
  },

  // ─── NOTICES ───
  getNotices: (category?: NoticeCategory) => {
    const all = get<Notice[]>(KEYS.notices, []);
    return delay(category ? all.filter(n => n.category === category) : all);
  },

  createNotice: async (n: Omit<Notice, "id" | "postedAt">) => {
    const all = get<Notice[]>(KEYS.notices, []);
    const notice: Notice = { ...n, id: `n${Date.now()}`, postedAt: new Date().toISOString().slice(0, 10) };
    all.unshift(notice);
    set(KEYS.notices, all);
    return delay(notice);
  },

  deleteNotice: async (id: string) => {
    const all = get<Notice[]>(KEYS.notices, []).filter(n => n.id !== id);
    set(KEYS.notices, all);
    return delay({ ok: true });
  },

  // ─── ADMIN: STUDENTS ───
  listStudents: () => delay(get<Student[]>(KEYS.students, [])),

  createStudent: async (s: Omit<Student, "id" | "role">) => {
    const students = get<Student[]>(KEYS.students, []);
    const passwords = get<Record<string, string>>(KEYS.passwords, {});
    const student: Student = { ...s, id: `s${Date.now()}`, role: "student" };
    students.push(student);
    passwords[student.email] = "demo1234";
    set(KEYS.students, students);
    set(KEYS.passwords, passwords);
    return delay(student);
  },

  updateStudent: async (id: string, patch: Partial<Student>) => {
    const students = get<Student[]>(KEYS.students, []);
    const idx = students.findIndex(s => s.id === id);
    if (idx < 0) throw new Error("Student not found");
    students[idx] = { ...students[idx], ...patch };
    set(KEYS.students, students);
    return delay(students[idx]);
  },

  deleteStudent: async (id: string) => {
    const students = get<Student[]>(KEYS.students, []).filter(s => s.id !== id);
    set(KEYS.students, students);
    return delay({ ok: true });
  },

  // ─── ADMIN: ATTENDANCE ENTRY ───
  recordAttendance: async (
    entries: { studentId: string; present: boolean }[],
    subjectCode: string,
    date: string,
  ) => {
    const log = get<AttendanceLogEntry[]>(KEYS.attendanceLog, []);
    // Remove any prior entries for the same date+subject so re-submits replace.
    const filtered = log.filter(e => !(e.date === date && e.subjectCode === subjectCode));
    const next = [
      ...filtered,
      ...entries.map(e => ({ date, subjectCode, studentId: e.studentId, present: e.present })),
    ];
    set(KEYS.attendanceLog, next);

    // Update each student's headline attendance % so the dashboard updates too.
    const students = get<Student[]>(KEYS.students, []);
    for (const s of students) {
      const recs = recomputeAttendanceFor(s.id);
      if (recs.length === 0) continue;
      const total = recs.reduce((a, r) => a + r.total, 0);
      const att = recs.reduce((a, r) => a + r.attended, 0);
      s.attendancePct = total ? Math.round((att / total) * 100) : 0;
    }
    set(KEYS.students, students);

    return delay({ ok: true, count: entries.length, subjectCode, date });
  },

  // ─── ADMIN: KPIs ───
  getKpis: async () => {
    const students = get<Student[]>(KEYS.students, []);
    const fees = get<FeeRecord[]>(KEYS.fees, []);
    const total = fees.reduce((s, f) => s + f.amount, 0);
    const paid = fees.filter(f => f.status === "Paid").reduce((s, f) => s + f.amount, 0);
    return delay({
      totalStudents: students.length,
      totalFaculty: 48,
      activeComplaints: 7,
      feeCollectionPct: total ? Math.round((paid / total) * 100) : 0,
    });
  },
};

export type ApiType = typeof api;
