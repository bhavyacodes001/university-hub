import { useState } from "react";
import { api } from "@/lib/api";
import type { Notice, NoticeCategory } from "@/types";
import { PageHeader } from "@/components/PageHeader";
import { StatusBadge } from "@/components/StatusBadge";
import { useLocalTable } from "@/hooks/useLocalTable";

const CATS: (NoticeCategory | "All")[] = ["All", "Academic", "Administrative", "Events"];

export default function Notices() {
  const [filter, setFilter] = useState<NoticeCategory | "All">("All");
  const { data } = useLocalTable<Notice[]>("notices", () => api.getNotices());
  const items = data ?? [];

  const visible = filter === "All" ? items : items.filter(n => n.category === filter);

  return (
    <div>
      <PageHeader title="Notice board" description="University-wide announcements" />

      <div className="flex gap-2 mb-6 overflow-x-auto">
        {CATS.map(c => (
          <button
            key={c}
            onClick={() => setFilter(c)}
            className={`px-3.5 py-1.5 rounded-md border text-xs font-medium transition-colors ${
              filter === c
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-background border-border hover:bg-secondary"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {visible.map(n => (
          <article key={n.id} className="card-surface p-5 hover:border-primary/30 transition-colors">
            <div className="flex items-center gap-2 mb-2">
              <StatusBadge variant={n.category === "Academic" ? "info" : n.category === "Events" ? "success" : "neutral"}>
                {n.category}
              </StatusBadge>
              <span className="text-xs text-muted-foreground">{n.postedAt} · {n.postedBy}</span>
            </div>
            <h3 className="font-medium">{n.title}</h3>
            <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed">{n.body}</p>
          </article>
        ))}
        {visible.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-12">No notices in this category.</p>
        )}
      </div>
    </div>
  );
}
