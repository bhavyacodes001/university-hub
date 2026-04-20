import { api } from "@/lib/api";
import type { AttendanceRecord, Subject } from "@/types";
import { PageHeader } from "@/components/PageHeader";
import { StatusBadge } from "@/components/StatusBadge";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, ReferenceLine, Tooltip, Cell } from "recharts";
import { useAuth } from "@/store/auth";
import { useLocalTable } from "@/hooks/useLocalTable";

export default function Attendance() {
  const user = useAuth(s => s.user);
  const studentId = user?.id;
  const { data: records = [] } = useLocalTable<AttendanceRecord[]>(
    "attendanceLog",
    () => api.getAttendance(studentId),
    [studentId],
  );
  const { data: subjects = [] } = useLocalTable<Subject[]>("subjects", () => api.getSubjects());

  const subMap = Object.fromEntries(subjects.map(s => [s.code, s]));
  const data = records.map(r => ({
    code: r.subjectCode,
    name: subMap[r.subjectCode]?.name ?? r.subjectCode,
    pct: Math.round((r.attended / r.total) * 100),
    attended: r.attended,
    total: r.total,
  }));
  const overall = data.length ? Math.round(data.reduce((s, d) => s + d.pct, 0) / data.length) : 0;

  return (
    <div>
      <PageHeader
        title="Attendance"
        description={`Overall ${overall}% · subjects below 75% are flagged`}
      />

      <div className="card-surface p-6 mb-6">
        <p className="stat-label mb-4">Subject-wise attendance</p>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <XAxis dataKey="code" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} domain={[0, 100]} />
              <Tooltip
                cursor={{ fill: "hsl(var(--muted))" }}
                contentStyle={{ background: "hsl(var(--popover))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }}
              />
              <ReferenceLine y={75} stroke="hsl(var(--destructive))" strokeDasharray="3 3" />
              <Bar dataKey="pct" radius={[6, 6, 0, 0]}>
                {data.map((d, i) => (
                  <Cell key={i} fill={d.pct < 75 ? "hsl(var(--destructive))" : "hsl(var(--primary))"} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="card-surface overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-surface text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="px-4 py-3 text-left font-medium">Code</th>
              <th className="px-4 py-3 text-left font-medium">Subject</th>
              <th className="px-4 py-3 text-right font-medium">Attended</th>
              <th className="px-4 py-3 text-right font-medium">Total</th>
              <th className="px-4 py-3 text-right font-medium">%</th>
              <th className="px-4 py-3 text-right font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {data.map((d, i) => (
              <tr key={d.code} className={i % 2 ? "bg-surface/50" : ""}>
                <td className="px-4 py-3 font-mono text-xs">{d.code}</td>
                <td className="px-4 py-3">{d.name}</td>
                <td className="px-4 py-3 text-right font-mono">{d.attended}</td>
                <td className="px-4 py-3 text-right font-mono">{d.total}</td>
                <td className={`px-4 py-3 text-right font-mono font-medium ${d.pct < 75 ? "text-destructive" : ""}`}>{d.pct}%</td>
                <td className="px-4 py-3 text-right">
                  <StatusBadge variant={d.pct < 75 ? "danger" : d.pct < 85 ? "warning" : "success"}>
                    {d.pct < 75 ? "Low" : d.pct < 85 ? "Watch" : "Good"}
                  </StatusBadge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
