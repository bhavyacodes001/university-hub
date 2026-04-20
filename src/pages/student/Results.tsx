import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import type { SemesterResult } from "@/types";
import { PageHeader } from "@/components/PageHeader";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid } from "recharts";

export default function Results() {
  const [results, setResults] = useState<SemesterResult[]>([]);
  const [active, setActive] = useState<number | null>(null);

  useEffect(() => {
    api.getResults().then(r => {
      setResults(r);
      setActive(r[r.length - 1]?.semester ?? null);
    });
  }, []);

  const cgpaTrend = results.map(r => ({ name: `Sem ${r.semester}`, sgpa: r.sgpa }));
  const current = results.find(r => r.semester === active);

  const cgpa = results.length
    ? (results.reduce((s, r) => s + r.sgpa, 0) / results.length).toFixed(2)
    : "—";

  return (
    <div>
      <PageHeader title="Academic results" description={`Cumulative CGPA ${cgpa}`} />

      <div className="card-surface p-6 mb-6">
        <p className="stat-label mb-4">SGPA trend</p>
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={cgpaTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid stroke="hsl(var(--border))" strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} domain={[6, 10]} />
              <Tooltip contentStyle={{ background: "hsl(var(--popover))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }} />
              <Line type="monotone" dataKey="sgpa" stroke="hsl(var(--primary))" strokeWidth={2.5} dot={{ r: 4, fill: "hsl(var(--primary))" }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="flex gap-2 mb-4 overflow-x-auto">
        {results.map(r => (
          <button
            key={r.semester}
            onClick={() => setActive(r.semester)}
            className={`px-3.5 py-1.5 rounded-md border text-xs font-medium whitespace-nowrap transition-colors ${
              active === r.semester
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-background border-border hover:bg-secondary"
            }`}
          >
            Semester {r.semester} · SGPA {r.sgpa}
          </button>
        ))}
      </div>

      {current && (
        <div className="card-surface overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-surface text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-4 py-3 text-left font-medium">Code</th>
                <th className="px-4 py-3 text-left font-medium">Subject</th>
                <th className="px-4 py-3 text-right font-medium">Credits</th>
                <th className="px-4 py-3 text-right font-medium">Marks</th>
                <th className="px-4 py-3 text-right font-medium">Grade</th>
              </tr>
            </thead>
            <tbody>
              {current.subjects.map((s, i) => (
                <tr key={s.code} className={i % 2 ? "bg-surface/50" : ""}>
                  <td className="px-4 py-3 font-mono text-xs">{s.code}</td>
                  <td className="px-4 py-3">{s.name}</td>
                  <td className="px-4 py-3 text-right font-mono">{s.credits}</td>
                  <td className="px-4 py-3 text-right font-mono">{s.marks}</td>
                  <td className="px-4 py-3 text-right font-medium">{s.grade}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
