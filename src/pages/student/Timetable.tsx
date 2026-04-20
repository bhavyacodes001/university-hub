import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import type { TimetableSlot, Subject } from "@/types";
import { PageHeader } from "@/components/PageHeader";

const DAYS: TimetableSlot["day"][] = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const HOURS = ["09:00", "10:00", "11:30", "12:30", "14:00", "15:00"];

export default function Timetable() {
  const [slots, setSlots] = useState<TimetableSlot[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);

  useEffect(() => {
    api.getTimetable().then(setSlots);
    api.getSubjects().then(setSubjects);
  }, []);

  const subMap = Object.fromEntries(subjects.map(s => [s.code, s]));

  const findSlot = (day: TimetableSlot["day"], hour: string) =>
    slots.find(s => s.day === day && s.start === hour);

  return (
    <div>
      <PageHeader title="Weekly timetable" description="Semester 5 · Section A · Effective from Aug 2025" />

      <div className="card-surface overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-surface text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-4 py-3 text-left font-medium w-24">Time</th>
                {DAYS.map(d => (
                  <th key={d} className="px-4 py-3 text-left font-medium">{d}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {HOURS.map((h, i) => (
                <tr key={h} className={i % 2 === 0 ? "" : "bg-surface/50"}>
                  <td className="px-4 py-4 font-mono text-xs text-muted-foreground border-t border-border align-top">{h}</td>
                  {DAYS.map(d => {
                    const slot = findSlot(d, h);
                    if (!slot) return <td key={d} className="px-4 py-4 border-t border-border align-top text-muted-foreground/40">—</td>;
                    const sub = subMap[slot.subjectCode];
                    return (
                      <td key={d} className="px-4 py-4 border-t border-border align-top">
                        <div className="rounded-lg bg-primary-muted border border-primary/10 p-2.5">
                          <p className="text-[11px] font-mono text-primary font-semibold">{slot.subjectCode}</p>
                          <p className="text-xs font-medium leading-snug mt-0.5 truncate">{sub?.name ?? "—"}</p>
                          <p className="text-[10px] text-muted-foreground mt-1">{slot.room} · {slot.start}–{slot.end}</p>
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
