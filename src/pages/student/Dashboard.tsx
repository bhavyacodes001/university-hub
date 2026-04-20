import { useAuth } from "@/store/auth";
import type { Student, TimetableSlot, Notice, FeeRecord, AttendanceRecord } from "@/types";
import { api } from "@/lib/api";
import { StatCard } from "@/components/StatCard";
import { StatusBadge } from "@/components/StatusBadge";
import { GraduationCap, ClipboardCheck, Wallet, BookOpen, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { ROUTES } from "@/constants";
import { useLocalTable } from "@/hooks/useLocalTable";

const TODAY_DAY: TimetableSlot["day"] = (["Sun","Mon","Tue","Wed","Thu","Fri","Sat"] as const)[new Date().getDay()] as any || "Mon";

export default function StudentDashboard() {
  const user = useAuth(s => s.user) as Student | null;
  const studentId = user?.id;

  const { data: timetable = [] } = useLocalTable<TimetableSlot[]>("timetable", () => api.getTimetable());
  const { data: notices = [] }   = useLocalTable<Notice[]>("notices", () => api.getNotices());
  const { data: fees = [] }      = useLocalTable<FeeRecord[]>("fees", () => api.getFees());
  const { data: attendance = [] } = useLocalTable<AttendanceRecord[]>(
    "attendanceLog", () => api.getAttendance(studentId), [studentId],
  );

  const today = (timetable ?? []).filter(s => s.day === TODAY_DAY);
  const recentNotices = (notices ?? []).slice(0, 3);

  if (!user) return null;
  const pending = (fees ?? []).filter(f => f.status !== "Paid").reduce((s, f) => s + f.amount, 0);
  const liveAttendancePct = (attendance ?? []).length
    ? Math.round(
        (attendance!.reduce((a, r) => a + r.attended, 0) /
          Math.max(1, attendance!.reduce((a, r) => a + r.total, 0))) * 100,
      )
    : user.attendancePct;

  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm text-muted-foreground">Welcome back</p>
        <h1 className="text-3xl font-semibold tracking-tight mt-1">{user.name.split(" ")[0]}.</h1>
        <p className="text-sm text-muted-foreground mt-1">
          {user.enrollmentNo} · {user.programme}, {user.branch} · Sem {user.semester}
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="CGPA" value={user.cgpa.toFixed(2)} hint="Cumulative" icon={GraduationCap} />
        <StatCard
          label="Attendance"
          value={`${liveAttendancePct}%`}
          hint={liveAttendancePct < 75 ? "Below threshold" : "Healthy"}
          icon={ClipboardCheck}
          tone={liveAttendancePct < 75 ? "danger" : "success"}
        />
        <StatCard
          label="Pending Fees"
          value={`₹${pending.toLocaleString("en-IN")}`}
          hint={pending === 0 ? "All cleared" : "Action needed"}
          icon={Wallet}
          tone={pending === 0 ? "success" : "warning"}
        />
        <StatCard label="Upcoming Exams" value="5" hint="Mid-sem starts Oct 6" icon={BookOpen} />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="card-surface p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-semibold">Today's classes</h2>
              <p className="text-xs text-muted-foreground mt-0.5">{TODAY_DAY} · Sem {user.semester} · Section {user.section}</p>
            </div>
            <Link to={ROUTES.STUDENT.TIMETABLE} className="text-xs text-primary hover:underline inline-flex items-center gap-1">
              Full week <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          {today.length === 0 ? (
            <p className="text-sm text-muted-foreground py-8 text-center">No classes scheduled today.</p>
          ) : (
            <ul className="divide-y divide-border">
              {today.map((s, i) => (
                <li key={i} className="py-3 flex items-center gap-4">
                  <div className="w-20 text-xs font-mono text-muted-foreground">{s.start}–{s.end}</div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{s.subjectCode}</p>
                    <p className="text-xs text-muted-foreground">Room {s.room}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="card-surface p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold">Recent notices</h2>
            <Link to={ROUTES.STUDENT.NOTICES} className="text-xs text-primary hover:underline">All</Link>
          </div>
          <ul className="space-y-4">
            {recentNotices.map(n => (
              <li key={n.id}>
                <div className="flex items-center gap-2 mb-1">
                  <StatusBadge variant={n.category === "Academic" ? "info" : n.category === "Events" ? "success" : "neutral"}>
                    {n.category}
                  </StatusBadge>
                  <span className="text-[10px] text-muted-foreground">{n.postedAt}</span>
                </div>
                <p className="text-sm font-medium leading-snug">{n.title}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: "Attendance", url: ROUTES.STUDENT.ATTENDANCE },
          { label: "Results",    url: ROUTES.STUDENT.RESULTS },
          { label: "Fees",       url: ROUTES.STUDENT.FEES },
          { label: "Profile",    url: ROUTES.STUDENT.PROFILE },
        ].map(q => (
          <Link key={q.label} to={q.url} className="card-surface p-4 hover:bg-secondary transition-colors flex items-center justify-between">
            <span className="text-sm font-medium">{q.label}</span>
            <ArrowRight className="h-4 w-4 text-muted-foreground" />
          </Link>
        ))}
      </div>
    </div>
  );
}
