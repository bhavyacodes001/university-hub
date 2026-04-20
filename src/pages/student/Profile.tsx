import { useState } from "react";
import { useAuth } from "@/store/auth";
import type { Student } from "@/types";
import { PageHeader } from "@/components/PageHeader";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function Profile() {
  const { user, updateUser } = useAuth();
  const student = user as Student;
  const [form, setForm] = useState({
    name: student?.name ?? "",
    phone: student?.phone ?? "",
    address: student?.address ?? "",
  });

  if (!student) return null;

  const onSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateUser(form);
    toast.success("Profile updated");
  };

  return (
    <div>
      <PageHeader title="Your profile" description="Personal information & contact details" />

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="card-surface p-6 text-center">
          <div className="h-20 w-20 mx-auto rounded-full bg-primary-muted text-primary flex items-center justify-center text-2xl font-semibold">
            {student.name.split(" ").map(n => n[0]).slice(0, 2).join("")}
          </div>
          <h3 className="mt-4 font-semibold">{student.name}</h3>
          <p className="text-xs text-muted-foreground mt-1">{student.enrollmentNo}</p>
          <div className="mt-4 pt-4 border-t border-border space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-muted-foreground">Programme</span><span className="font-medium">{student.programme}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Branch</span><span className="font-medium text-right text-xs">{student.branch}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Semester</span><span className="font-medium">{student.semester}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Section</span><span className="font-medium">{student.section}</span></div>
          </div>
        </div>

        <form onSubmit={onSave} className="card-surface p-6 lg:col-span-2 space-y-4">
          <h3 className="font-semibold mb-2">Edit details</h3>
          <div className="space-y-1.5">
            <Label htmlFor="name">Full name</Label>
            <Input id="name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="email">Email</Label>
            <Input id="email" value={student.email} disabled />
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="address">Address</Label>
              <Input id="address" value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))} />
            </div>
          </div>
          <div className="flex justify-end pt-2">
            <Button type="submit">Save changes</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
