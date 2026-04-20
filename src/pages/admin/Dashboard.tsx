import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { PageHeader } from "@/components/PageHeader";
import { StatCard } from "@/components/StatCard";
import { Users, GraduationCap, MessageSquareWarning, TrendingUp } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid } from "recharts";

const deptAttendance = [
  { dept: "CSE", pct: 84 },
  { dept: "ECE", pct: 88 },
  { dept: "MEC", pct: 76 },
  { dept: "BBA", pct: 91 },
  { dept: "BCA", pct: 73 },
];

const recent = [
  { who: "Aarav Sharma", what: "submitted leave application", when: "2 min ago" },
  { who: "Dr. R. Kapoor", what: "published a new academic notice", when: "1 h ago" },
  { who: "Meera Iyer", what: "paid hostel fee · ₹45,000", when: "3 h ago" },
  { who: "Rohan Verma", what: "raised a maintenance complaint", when: "Yesterday" },
  { who: "Examination Cell", what: "released mid-sem schedule", when: "Yesterday" },
];

export default function AdminDashboard() {
  const [kpi, setKpi] = useState<any>(null);
  useEffect(() => { api.getKpis().then(setKpi); }, []);

  return (
    <div className="space-y-8">
      <PageHeader
        title="Admin overview"
        description="Real-time snapshot of the SRM Sonipat campus"
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total students" value={kpi?.totalStudents ?? "—"} hint="Across all programmes" icon={Users} />
        <StatCard label="Faculty" value={kpi?.totalFaculty ?? "—"} hint="Permanent + visiting" icon={GraduationCap} />
        <StatCard label="Active complaints" value={kpi?.activeComplaints ?? "—"} hint="Awaiting resolution" icon={MessageSquareWarning} tone="warning" />
        <StatCard label="Fee collection" value={`${kpi?.feeCollectionPct ?? "—"}%`} hint="Current academic year" icon={TrendingUp} tone="success" />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="card-surface p-6 lg:col-span-2">
          <p className="stat-label mb-4">Department-wise attendance</p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={deptAttendance} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid stroke="hsl(var(--border))" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="dept" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} domain={[0, 100]} />
                <Tooltip contentStyle={{ background: "hsl(var(--popover))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }} />
                <Bar dataKey="pct" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card-surface p-6">
          <p className="stat-label mb-4">Recent activity</p>
          <ul className="space-y-4">
            {recent.map((a, i) => (
              <li key={i} className="text-sm">
                <p className="leading-snug">
                  <span className="font-medium">{a.who}</span>{" "}
                  <span className="text-muted-foreground">{a.what}</span>
                </p>
                <p className="text-[10px] text-muted-foreground mt-0.5">{a.when}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
