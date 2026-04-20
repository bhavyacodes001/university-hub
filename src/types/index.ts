export type Role = "student" | "admin";

export interface User {
  id: string;
  email: string;
  name: string;
  role: Role;
  avatarUrl?: string;
}

export interface Student extends User {
  role: "student";
  enrollmentNo: string;
  programme: string;
  branch: string;
  semester: number;
  section: string;
  year: number;
  phone?: string;
  address?: string;
  cgpa: number;
  attendancePct: number;
  pendingFees: number;
}

export interface Admin extends User {
  role: "admin";
  department: string;
}

export interface Subject {
  id: string;
  code: string;
  name: string;
  credits: number;
  faculty: string;
}

export interface TimetableSlot {
  day: "Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat";
  start: string; // "09:00"
  end: string;
  subjectCode: string;
  room: string;
}

export interface AttendanceRecord {
  subjectCode: string;
  attended: number;
  total: number;
}

export interface SemesterResult {
  semester: number;
  sgpa: number;
  subjects: { code: string; name: string; credits: number; grade: string; marks: number }[];
}

export type FeeStatus = "Paid" | "Pending" | "Overdue";
export interface FeeRecord {
  id: string;
  category: string;
  amount: number;
  dueDate: string;
  paidOn?: string;
  status: FeeStatus;
}

export type NoticeCategory = "Academic" | "Administrative" | "Events";
export interface Notice {
  id: string;
  title: string;
  body: string;
  category: NoticeCategory;
  postedAt: string;
  postedBy: string;
}

export interface ExamSchedule {
  id: string;
  subjectCode: string;
  subjectName: string;
  date: string;
  time: string;
  venue: string;
}
