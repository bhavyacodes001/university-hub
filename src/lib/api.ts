/**
 * API layer — currently backed by /lib/mockData.ts.
 * Swap implementations here for Supabase without touching pages.
 *
 * Detect Supabase env vars to optionally switch backends:
 *   const useSupabase = !!import.meta.env.VITE_SUPABASE_URL;
 */

import {
  mockStudents, mockAdmins, mockPasswords, mockSubjects,
  mockTimetable, mockAttendance, mockResults, mockFees,
  mockNotices, mockExams,
} from "./mockData";
import type {
  Student, Admin, User, Notice, NoticeCategory,
} from "@/types";

const delay = <T,>(value: T, ms = 250): Promise<T> =>
  new Promise(r => setTimeout(() => r(value), ms));

// ─── AUTH ───
export const api = {
  async login(email: string, password: string): Promise<User> {
    const stored = mockPasswords[email.toLowerCase()];
    if (!stored || stored !== password) {
      throw new Error("Invalid email or password");
    }
    const student = mockStudents.find(s => s.email === email.toLowerCase());
    if (student) return delay(student);
    const admin = mockAdmins.find(a => a.email === email.toLowerCase());
    if (admin) return delay(admin);
    throw new Error("Account not found");
  },

  async register(payload: { name: string; email: string; password: string; enrollmentNo: string }): Promise<Student> {
    const exists = mockPasswords[payload.email.toLowerCase()];
    if (exists) throw new Error("Email already registered");
    const student: Student = {
      id: `s${Date.now()}`, role: "student",
      email: payload.email.toLowerCase(), name: payload.name,
      enrollmentNo: payload.enrollmentNo, programme: "B.Tech",
      branch: "Computer Science & Engineering", semester: 1, section: "A",
      year: 1, cgpa: 0, attendancePct: 0, pendingFees: 0,
    };
    mockStudents.push(student);
    mockPasswords[student.email] = payload.password;
    return delay(student);
  },

  async forgotPassword(email: string): Promise<{ ok: true }> {
    if (!mockPasswords[email.toLowerCase()]) {
      throw new Error("No account with that email");
    }
    return delay({ ok: true });
  },

  // ─── STUDENT ───
  getSubjects: () => delay(mockSubjects),
  getTimetable: () => delay(mockTimetable),
  getAttendance: () => delay(mockAttendance),
  getResults: () => delay(mockResults),
  getFees: () => delay(mockFees),
  getExams: () => delay(mockExams),

  // ─── NOTICES ───
  getNotices: (category?: NoticeCategory) =>
    delay(category ? mockNotices.filter(n => n.category === category) : mockNotices),

  createNotice: async (n: Omit<Notice, "id" | "postedAt">) => {
    const notice: Notice = { ...n, id: `n${Date.now()}`, postedAt: new Date().toISOString().slice(0, 10) };
    mockNotices.unshift(notice);
    return delay(notice);
  },

  deleteNotice: async (id: string) => {
    const idx = mockNotices.findIndex(n => n.id === id);
    if (idx >= 0) mockNotices.splice(idx, 1);
    return delay({ ok: true });
  },

  // ─── ADMIN: STUDENTS ───
  listStudents: () => delay([...mockStudents]),

  createStudent: async (s: Omit<Student, "id" | "role">) => {
    const student: Student = { ...s, id: `s${Date.now()}`, role: "student" };
    mockStudents.push(student);
    mockPasswords[student.email] = "demo1234";
    return delay(student);
  },

  updateStudent: async (id: string, patch: Partial<Student>) => {
    const idx = mockStudents.findIndex(s => s.id === id);
    if (idx < 0) throw new Error("Student not found");
    mockStudents[idx] = { ...mockStudents[idx], ...patch };
    return delay(mockStudents[idx]);
  },

  deleteStudent: async (id: string) => {
    const idx = mockStudents.findIndex(s => s.id === id);
    if (idx >= 0) mockStudents.splice(idx, 1);
    return delay({ ok: true });
  },

  // ─── ADMIN: ATTENDANCE ENTRY ───
  recordAttendance: async (entries: { studentId: string; present: boolean }[], subjectCode: string, date: string) => {
    // In real backend: insert rows. Here: just acknowledge.
    return delay({ ok: true, count: entries.length, subjectCode, date });
  },

  getKpis: async () => delay({
    totalStudents: mockStudents.length,
    totalFaculty: 48,
    activeComplaints: 7,
    feeCollectionPct: 78,
  }),
};

export type ApiType = typeof api;
