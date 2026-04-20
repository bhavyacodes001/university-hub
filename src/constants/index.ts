export const APP_NAME = "SRM Sonipat";
export const APP_TAGLINE = "Student Portal · Delhi NCR";

export const ROUTES = {
  LOGIN: "/login",
  REGISTER: "/register",
  FORGOT: "/forgot-password",
  STUDENT: {
    DASHBOARD: "/student",
    TIMETABLE: "/student/timetable",
    ATTENDANCE: "/student/attendance",
    RESULTS: "/student/results",
    FEES: "/student/fees",
    NOTICES: "/student/notices",
    PROFILE: "/student/profile",
  },
  ADMIN: {
    DASHBOARD: "/admin",
    STUDENTS: "/admin/students",
    NOTICES: "/admin/notices",
    ATTENDANCE: "/admin/attendance",
  },
} as const;

export const DEMO_ACCOUNTS = [
  { email: "aarav.student@srm.demo", password: "demo1234", role: "student" as const, label: "Aarav (Student · B.Tech CSE Sem 5)" },
  { email: "meera.student@srm.demo", password: "demo1234", role: "student" as const, label: "Meera (Student · B.Tech ECE Sem 3)" },
  { email: "admin@srm.demo", password: "admin1234", role: "admin" as const, label: "Dr. Kapoor (Admin · Academics)" },
];
