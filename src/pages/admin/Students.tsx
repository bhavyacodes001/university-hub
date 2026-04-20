import { useMemo, useState } from "react";
import { api } from "@/lib/api";
import type { Student } from "@/types";
import { PageHeader } from "@/components/PageHeader";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/StatusBadge";
import { Download, Plus, Search, Trash2 } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useLocalTable } from "@/hooks/useLocalTable";

export default function AdminStudents() {
  const { data: students = [], refresh } = useLocalTable<Student[]>("students", () => api.listStudents());
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState({
    name: "", email: "", enrollmentNo: "", programme: "B.Tech",
    branch: "Computer Science & Engineering", semester: 1, section: "A", year: 1,
  });

  const load = refresh;

  const filtered = useMemo(
    () => students.filter(s =>
      [s.name, s.email, s.enrollmentNo, s.branch].join(" ").toLowerCase().includes(q.toLowerCase())
    ),
    [students, q]
  );

  const exportCsv = () => {
    const header = ["Enrollment", "Name", "Email", "Programme", "Branch", "Semester", "Section", "CGPA", "Attendance", "Pending Fees"];
    const rows = filtered.map(s => [
      s.enrollmentNo, s.name, s.email, s.programme, s.branch, s.semester, s.section, s.cgpa, s.attendancePct, s.pendingFees,
    ]);
    const csv = [header, ...rows].map(r => r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `students-${Date.now()}.csv`;
    a.click(); URL.revokeObjectURL(url);
    toast.success(`Exported ${filtered.length} students`);
  };

  const onCreate = async () => {
    if (!draft.name || !draft.email || !draft.enrollmentNo) {
      toast.error("Name, email and enrollment number are required");
      return;
    }
    await api.createStudent({
      ...draft,
      cgpa: 0, attendancePct: 0, pendingFees: 0,
    } as any);
    toast.success("Student added (default password: demo1234)");
    setOpen(false);
    setDraft({ name: "", email: "", enrollmentNo: "", programme: "B.Tech", branch: "Computer Science & Engineering", semester: 1, section: "A", year: 1 });
    load();
  };

  const onDelete = async (id: string) => {
    await api.deleteStudent(id);
    toast.success("Student removed");
    load();
  };

  return (
    <div>
      <PageHeader
        title="Students"
        description={`${students.length} enrolled · search, export or add`}
        actions={
          <>
            <Button variant="outline" size="sm" onClick={exportCsv}>
              <Download className="h-3.5 w-3.5 mr-1.5" /> Export CSV
            </Button>
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button size="sm"><Plus className="h-3.5 w-3.5 mr-1.5" /> Add student</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader><DialogTitle>Add student</DialogTitle></DialogHeader>
                <div className="space-y-3">
                  {[
                    { k: "name", label: "Full name" },
                    { k: "email", label: "Email" },
                    { k: "enrollmentNo", label: "Enrollment no." },
                    { k: "programme", label: "Programme" },
                    { k: "branch", label: "Branch" },
                  ].map(f => (
                    <div key={f.k} className="space-y-1.5">
                      <Label>{f.label}</Label>
                      <Input
                        value={(draft as any)[f.k]}
                        onChange={e => setDraft(d => ({ ...d, [f.k]: e.target.value }))}
                      />
                    </div>
                  ))}
                  <div className="grid grid-cols-3 gap-3">
                    <div className="space-y-1.5">
                      <Label>Semester</Label>
                      <Input type="number" min={1} max={8} value={draft.semester} onChange={e => setDraft(d => ({ ...d, semester: +e.target.value }))} />
                    </div>
                    <div className="space-y-1.5">
                      <Label>Section</Label>
                      <Input value={draft.section} onChange={e => setDraft(d => ({ ...d, section: e.target.value }))} />
                    </div>
                    <div className="space-y-1.5">
                      <Label>Year</Label>
                      <Input type="number" min={1} max={4} value={draft.year} onChange={e => setDraft(d => ({ ...d, year: +e.target.value }))} />
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                  <Button onClick={onCreate}>Create</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </>
        }
      />

      <div className="card-surface mb-4 p-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={q} onChange={e => setQ(e.target.value)}
            placeholder="Search by name, email, enrollment, branch…"
            className="pl-9 border-0 shadow-none focus-visible:ring-0"
          />
        </div>
      </div>

      <div className="card-surface overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-surface text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-4 py-3 text-left font-medium">Enrollment</th>
                <th className="px-4 py-3 text-left font-medium">Name</th>
                <th className="px-4 py-3 text-left font-medium">Programme</th>
                <th className="px-4 py-3 text-left font-medium">Sem</th>
                <th className="px-4 py-3 text-right font-medium">CGPA</th>
                <th className="px-4 py-3 text-right font-medium">Attend.</th>
                <th className="px-4 py-3 text-right font-medium">Fees</th>
                <th className="px-4 py-3 text-right font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((s, i) => (
                <tr key={s.id} className={i % 2 ? "bg-surface/50" : ""}>
                  <td className="px-4 py-3 font-mono text-xs">{s.enrollmentNo}</td>
                  <td className="px-4 py-3">
                    <p className="font-medium">{s.name}</p>
                    <p className="text-xs text-muted-foreground">{s.email}</p>
                  </td>
                  <td className="px-4 py-3 text-xs">
                    <p>{s.programme}</p>
                    <p className="text-muted-foreground">{s.branch}</p>
                  </td>
                  <td className="px-4 py-3">{s.semester}{s.section}</td>
                  <td className="px-4 py-3 text-right font-mono">{s.cgpa.toFixed(2)}</td>
                  <td className="px-4 py-3 text-right">
                    <StatusBadge variant={s.attendancePct < 75 ? "danger" : s.attendancePct < 85 ? "warning" : "success"}>
                      {s.attendancePct}%
                    </StatusBadge>
                  </td>
                  <td className="px-4 py-3 text-right">
                    {s.pendingFees === 0
                      ? <StatusBadge variant="success">Cleared</StatusBadge>
                      : <span className="font-mono text-destructive">₹{s.pendingFees.toLocaleString("en-IN")}</span>}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Button size="sm" variant="ghost" onClick={() => onDelete(s.id)}>
                      <Trash2 className="h-3.5 w-3.5 text-destructive" />
                    </Button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={8} className="px-4 py-12 text-center text-sm text-muted-foreground">No students match your search.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
