import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import type { Student, Subject } from "@/types";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Check, X } from "lucide-react";

export default function AdminAttendance() {
  const [students, setStudents] = useState<Student[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [subject, setSubject] = useState("");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [present, setPresent] = useState<Record<string, boolean>>({});

  useEffect(() => {
    api.listStudents().then(s => {
      setStudents(s);
      setPresent(Object.fromEntries(s.map(x => [x.id, true])));
    });
    api.getSubjects().then(s => {
      setSubjects(s);
      setSubject(s[0]?.code ?? "");
    });
  }, []);

  const toggle = (id: string) => setPresent(p => ({ ...p, [id]: !p[id] }));
  const setAll = (v: boolean) => setPresent(Object.fromEntries(students.map(s => [s.id, v])));

  const onSubmit = async () => {
    if (!subject) return toast.error("Pick a subject");
    const entries = students.map(s => ({ studentId: s.id, present: !!present[s.id] }));
    await api.recordAttendance(entries, subject, date);
    const p = entries.filter(e => e.present).length;
    toast.success(`Attendance saved · ${p}/${entries.length} present`);
  };

  return (
    <div>
      <PageHeader title="Mark attendance" description="Record attendance for a subject and date" />

      <div className="card-surface p-5 mb-4 grid sm:grid-cols-3 gap-4">
        <div className="space-y-1.5">
          <Label>Subject</Label>
          <select
            value={subject}
            onChange={e => setSubject(e.target.value)}
            className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm"
          >
            {subjects.map(s => <option key={s.code} value={s.code}>{s.code} · {s.name}</option>)}
          </select>
        </div>
        <div className="space-y-1.5">
          <Label>Date</Label>
          <Input type="date" value={date} onChange={e => setDate(e.target.value)} />
        </div>
        <div className="flex items-end gap-2">
          <Button variant="outline" size="sm" onClick={() => setAll(true)} className="flex-1">All present</Button>
          <Button variant="outline" size="sm" onClick={() => setAll(false)} className="flex-1">All absent</Button>
        </div>
      </div>

      <div className="card-surface overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-surface text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="px-4 py-3 text-left font-medium">Enrollment</th>
              <th className="px-4 py-3 text-left font-medium">Name</th>
              <th className="px-4 py-3 text-left font-medium">Programme</th>
              <th className="px-4 py-3 text-right font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {students.map((s, i) => (
              <tr key={s.id} className={i % 2 ? "bg-surface/50" : ""}>
                <td className="px-4 py-3 font-mono text-xs">{s.enrollmentNo}</td>
                <td className="px-4 py-3 font-medium">{s.name}</td>
                <td className="px-4 py-3 text-xs text-muted-foreground">{s.programme} · Sem {s.semester}</td>
                <td className="px-4 py-3 text-right">
                  <button
                    onClick={() => toggle(s.id)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium border transition-colors ${
                      present[s.id]
                        ? "bg-success-muted text-success border-success/20"
                        : "bg-destructive-muted text-destructive border-destructive/20"
                    }`}
                  >
                    {present[s.id] ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
                    {present[s.id] ? "Present" : "Absent"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-end mt-6">
        <Button onClick={onSubmit}>Save attendance</Button>
      </div>
    </div>
  );
}
