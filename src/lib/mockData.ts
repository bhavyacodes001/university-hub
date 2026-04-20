import type {
  Student, Admin, Subject, TimetableSlot, AttendanceRecord,
  SemesterResult, FeeRecord, Notice, ExamSchedule
} from "@/types";

// ───────────────── USERS ─────────────────
export const mockStudents: Student[] = [
  {
    id: "s1", role: "student",
    email: "aarav.student@srm.demo", name: "Aarav Sharma",
    enrollmentNo: "SRMS2023CSE042", programme: "B.Tech",
    branch: "Computer Science & Engineering", semester: 5, section: "A",
    year: 3, phone: "+91 98100 11122", address: "Sonipat, Haryana",
    cgpa: 8.42, attendancePct: 86, pendingFees: 0,
    avatarUrl: "",
  },
  {
    id: "s2", role: "student",
    email: "meera.student@srm.demo", name: "Meera Iyer",
    enrollmentNo: "SRMS2024ECE018", programme: "B.Tech",
    branch: "Electronics & Communication", semester: 3, section: "B",
    year: 2, phone: "+91 99100 22233", address: "Delhi",
    cgpa: 9.10, attendancePct: 92, pendingFees: 12500,
    avatarUrl: "",
  },
  {
    id: "s3", role: "student",
    email: "rohan.student@srm.demo", name: "Rohan Verma",
    enrollmentNo: "SRMS2022MEC077", programme: "B.Tech",
    branch: "Mechanical Engineering", semester: 7, section: "A",
    year: 4, phone: "+91 98700 33344", address: "Panipat, Haryana",
    cgpa: 7.65, attendancePct: 71, pendingFees: 45000,
    avatarUrl: "",
  },
  {
    id: "s4", role: "student",
    email: "ananya.student@srm.demo", name: "Ananya Gupta",
    enrollmentNo: "SRMS2024BBA009", programme: "BBA",
    branch: "Business Administration", semester: 3, section: "A",
    year: 2, phone: "+91 90100 44455", address: "Gurugram, Haryana",
    cgpa: 8.88, attendancePct: 95, pendingFees: 0,
    avatarUrl: "",
  },
  {
    id: "s5", role: "student",
    email: "kabir.student@srm.demo", name: "Kabir Khan",
    enrollmentNo: "SRMS2023BBA021", programme: "BCA",
    branch: "Computer Applications", semester: 5, section: "C",
    year: 3, phone: "+91 96100 55566", address: "Noida, UP",
    cgpa: 7.20, attendancePct: 68, pendingFees: 22000,
    avatarUrl: "",
  },
];

export const mockAdmins: Admin[] = [
  {
    id: "a1", role: "admin",
    email: "admin@srm.demo", name: "Dr. R. Kapoor",
    department: "Academics",
  },
  {
    id: "a2", role: "admin",
    email: "registrar@srm.demo", name: "Ms. P. Nair",
    department: "Registrar Office",
  },
];

// passwords: student=demo1234, admin=admin1234
export const mockPasswords: Record<string, string> = {
  "aarav.student@srm.demo": "demo1234",
  "meera.student@srm.demo": "demo1234",
  "rohan.student@srm.demo": "demo1234",
  "ananya.student@srm.demo": "demo1234",
  "kabir.student@srm.demo": "demo1234",
  "admin@srm.demo": "admin1234",
  "registrar@srm.demo": "admin1234",
};

// ───────────────── ACADEMIC ─────────────────
export const mockSubjects: Subject[] = [
  { id: "sub1", code: "CS301", name: "Operating Systems", credits: 4, faculty: "Prof. A. Mehta" },
  { id: "sub2", code: "CS302", name: "Database Systems", credits: 4, faculty: "Dr. S. Rao" },
  { id: "sub3", code: "CS303", name: "Computer Networks", credits: 3, faculty: "Prof. N. Singh" },
  { id: "sub4", code: "CS304", name: "Software Engineering", credits: 3, faculty: "Dr. V. Joshi" },
  { id: "sub5", code: "CS305", name: "Theory of Computation", credits: 4, faculty: "Prof. M. Das" },
  { id: "sub6", code: "HS301", name: "Professional Ethics", credits: 2, faculty: "Dr. L. Bhatt" },
];

export const mockTimetable: TimetableSlot[] = [
  { day: "Mon", start: "09:00", end: "10:00", subjectCode: "CS301", room: "B-204" },
  { day: "Mon", start: "10:00", end: "11:00", subjectCode: "CS302", room: "B-204" },
  { day: "Mon", start: "11:30", end: "12:30", subjectCode: "CS303", room: "B-301" },
  { day: "Mon", start: "14:00", end: "15:00", subjectCode: "HS301", room: "A-101" },
  { day: "Tue", start: "09:00", end: "10:00", subjectCode: "CS304", room: "B-205" },
  { day: "Tue", start: "10:00", end: "11:00", subjectCode: "CS305", room: "B-205" },
  { day: "Tue", start: "11:30", end: "13:30", subjectCode: "CS302", room: "Lab-3" },
  { day: "Wed", start: "09:00", end: "10:00", subjectCode: "CS301", room: "B-204" },
  { day: "Wed", start: "10:00", end: "11:00", subjectCode: "CS303", room: "B-301" },
  { day: "Wed", start: "11:30", end: "12:30", subjectCode: "CS305", room: "B-205" },
  { day: "Thu", start: "09:00", end: "11:00", subjectCode: "CS301", room: "Lab-1" },
  { day: "Thu", start: "11:30", end: "12:30", subjectCode: "CS304", room: "B-205" },
  { day: "Thu", start: "14:00", end: "15:00", subjectCode: "HS301", room: "A-101" },
  { day: "Fri", start: "09:00", end: "10:00", subjectCode: "CS302", room: "B-204" },
  { day: "Fri", start: "10:00", end: "11:00", subjectCode: "CS305", room: "B-205" },
  { day: "Fri", start: "11:30", end: "13:30", subjectCode: "CS303", room: "Lab-2" },
];

export const mockAttendance: AttendanceRecord[] = [
  { subjectCode: "CS301", attended: 38, total: 42 },
  { subjectCode: "CS302", attended: 35, total: 40 },
  { subjectCode: "CS303", attended: 26, total: 38 }, // <75%
  { subjectCode: "CS304", attended: 30, total: 36 },
  { subjectCode: "CS305", attended: 33, total: 40 },
  { subjectCode: "HS301", attended: 18, total: 22 },
];

export const mockResults: SemesterResult[] = [
  {
    semester: 1, sgpa: 8.1,
    subjects: [
      { code: "MA101", name: "Calculus", credits: 4, grade: "A", marks: 82 },
      { code: "PH101", name: "Physics", credits: 4, grade: "A-", marks: 76 },
      { code: "CS101", name: "Intro to Programming", credits: 4, grade: "A+", marks: 91 },
      { code: "EN101", name: "English", credits: 2, grade: "B+", marks: 72 },
    ],
  },
  {
    semester: 2, sgpa: 8.4,
    subjects: [
      { code: "MA102", name: "Linear Algebra", credits: 4, grade: "A", marks: 84 },
      { code: "CS102", name: "Data Structures", credits: 4, grade: "A+", marks: 92 },
      { code: "EC101", name: "Basic Electronics", credits: 3, grade: "A-", marks: 78 },
    ],
  },
  {
    semester: 3, sgpa: 8.6,
    subjects: [
      { code: "CS201", name: "Algorithms", credits: 4, grade: "A+", marks: 90 },
      { code: "CS202", name: "OOP in Java", credits: 4, grade: "A", marks: 85 },
      { code: "MA201", name: "Probability", credits: 3, grade: "A-", marks: 79 },
    ],
  },
  {
    semester: 4, sgpa: 8.55,
    subjects: [
      { code: "CS221", name: "Computer Architecture", credits: 4, grade: "A", marks: 83 },
      { code: "CS222", name: "Discrete Math", credits: 3, grade: "A", marks: 81 },
      { code: "CS223", name: "Microprocessors", credits: 3, grade: "A-", marks: 77 },
    ],
  },
];

export const mockFees: FeeRecord[] = [
  { id: "f1", category: "Tuition Fee · Sem 5", amount: 95000, dueDate: "2025-08-15", paidOn: "2025-08-10", status: "Paid" },
  { id: "f2", category: "Hostel Fee · Sem 5",  amount: 45000, dueDate: "2025-08-15", paidOn: "2025-08-10", status: "Paid" },
  { id: "f3", category: "Bus Pass · Sem 5",     amount: 12000, dueDate: "2025-08-15", status: "Pending" },
  { id: "f4", category: "Library Deposit",      amount: 2500,  dueDate: "2025-09-01", paidOn: "2025-08-29", status: "Paid" },
  { id: "f5", category: "Exam Fee · Mid-Sem",  amount: 3500,  dueDate: "2025-10-01", status: "Overdue" },
];

export const mockNotices: Notice[] = [
  { id: "n1", title: "Mid-semester examination schedule released", body: "The mid-sem examinations will commence from 6th October 2025. Detailed timetable is available in the Examinations section.", category: "Academic", postedAt: "2025-09-22", postedBy: "Examination Cell" },
  { id: "n2", title: "Annual Cultural Fest — Aarambh 2025", body: "Registrations open for Aarambh, our flagship cultural festival, from 1st October. Prizes worth ₹5L+. Contact student affairs.", category: "Events", postedAt: "2025-09-20", postedBy: "Student Affairs" },
  { id: "n3", title: "Hostel fee due reminder", body: "Students yet to clear hostel dues must do so by 30th September to avoid late fee charges.", category: "Administrative", postedAt: "2025-09-18", postedBy: "Accounts Office" },
  { id: "n4", title: "Guest lecture: AI in Healthcare", body: "Dr. R. Sundaram (IIT Delhi) will deliver a guest lecture on 28th Sept at the main auditorium, 3 PM.", category: "Academic", postedAt: "2025-09-15", postedBy: "Dept. of CSE" },
  { id: "n5", title: "Library closed for stock-taking", body: "Central library will remain closed on 25th & 26th Sept for annual stock verification.", category: "Administrative", postedAt: "2025-09-12", postedBy: "Librarian" },
];

export const mockExams: ExamSchedule[] = [
  { id: "e1", subjectCode: "CS301", subjectName: "Operating Systems",   date: "2025-10-06", time: "10:00 AM", venue: "Hall A" },
  { id: "e2", subjectCode: "CS302", subjectName: "Database Systems",    date: "2025-10-08", time: "10:00 AM", venue: "Hall A" },
  { id: "e3", subjectCode: "CS303", subjectName: "Computer Networks",   date: "2025-10-10", time: "02:00 PM", venue: "Hall B" },
  { id: "e4", subjectCode: "CS304", subjectName: "Software Engineering",date: "2025-10-13", time: "10:00 AM", venue: "Hall A" },
  { id: "e5", subjectCode: "CS305", subjectName: "Theory of Computation",date:"2025-10-15", time: "02:00 PM", venue: "Hall B" },
];
