import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import type { Notice, NoticeCategory } from "@/types";
import { PageHeader } from "@/components/PageHeader";
import { StatusBadge } from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { useAuth } from "@/store/auth";

const CATS: NoticeCategory[] = ["Academic", "Administrative", "Events"];

export default function AdminNotices() {
  const [items, setItems] = useState<Notice[]>([]);
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<{ title: string; body: string; category: NoticeCategory }>({
    title: "", body: "", category: "Academic",
  });
  const { user } = useAuth();

  const load = () => api.getNotices().then(setItems);
  useEffect(() => { load(); }, []);

  const onCreate = async () => {
    if (!draft.title || !draft.body) {
      toast.error("Title and body are required");
      return;
    }
    await api.createNotice({
      title: draft.title, body: draft.body, category: draft.category,
      postedBy: user?.name ?? "Admin",
    });
    toast.success("Notice published");
    setOpen(false);
    setDraft({ title: "", body: "", category: "Academic" });
    load();
  };

  const onDelete = async (id: string) => {
    await api.deleteNotice(id);
    toast.success("Notice removed");
    load();
  };

  return (
    <div>
      <PageHeader
        title="Notices"
        description="Publish announcements visible to all students"
        actions={
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button size="sm"><Plus className="h-3.5 w-3.5 mr-1.5" /> New notice</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Publish notice</DialogTitle></DialogHeader>
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <Label>Title</Label>
                  <Input value={draft.title} onChange={e => setDraft(d => ({ ...d, title: e.target.value }))} />
                </div>
                <div className="space-y-1.5">
                  <Label>Category</Label>
                  <div className="flex gap-2">
                    {CATS.map(c => (
                      <button
                        key={c} type="button"
                        onClick={() => setDraft(d => ({ ...d, category: c }))}
                        className={`px-3 py-1.5 rounded-md border text-xs font-medium transition-colors ${
                          draft.category === c
                            ? "bg-primary text-primary-foreground border-primary"
                            : "bg-background border-border hover:bg-secondary"
                        }`}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label>Body</Label>
                  <Textarea rows={5} value={draft.body} onChange={e => setDraft(d => ({ ...d, body: e.target.value }))} />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                <Button onClick={onCreate}>Publish</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        }
      />

      <div className="space-y-3">
        {items.map(n => (
          <article key={n.id} className="card-surface p-5">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <StatusBadge variant={n.category === "Academic" ? "info" : n.category === "Events" ? "success" : "neutral"}>
                    {n.category}
                  </StatusBadge>
                  <span className="text-xs text-muted-foreground">{n.postedAt} · {n.postedBy}</span>
                </div>
                <h3 className="font-medium">{n.title}</h3>
                <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed">{n.body}</p>
              </div>
              <Button variant="ghost" size="sm" onClick={() => onDelete(n.id)}>
                <Trash2 className="h-3.5 w-3.5 text-destructive" />
              </Button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
