import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import type { FeeRecord } from "@/types";
import { PageHeader } from "@/components/PageHeader";
import { StatusBadge } from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { Download, Printer } from "lucide-react";
import { toast } from "sonner";

export default function Fees() {
  const [fees, setFees] = useState<FeeRecord[]>([]);

  useEffect(() => { api.getFees().then(setFees); }, []);

  const total = fees.reduce((s, f) => s + f.amount, 0);
  const paid = fees.filter(f => f.status === "Paid").reduce((s, f) => s + f.amount, 0);
  const pending = total - paid;

  return (
    <div>
      <PageHeader
        title="Fees"
        description="Breakdown by category and payment history"
        actions={
          <Button variant="outline" size="sm" onClick={() => window.print()}>
            <Printer className="h-3.5 w-3.5 mr-1.5" /> Print receipts
          </Button>
        }
      />

      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: "Total", value: total, tone: "" },
          { label: "Paid",  value: paid,  tone: "text-success" },
          { label: "Outstanding", value: pending, tone: "text-destructive" },
        ].map(s => (
          <div key={s.label} className="card-surface p-5">
            <p className="stat-label">{s.label}</p>
            <p className={`mt-2 text-2xl font-semibold tracking-tight ${s.tone}`}>
              ₹{s.value.toLocaleString("en-IN")}
            </p>
          </div>
        ))}
      </div>

      <div className="card-surface overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-surface text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="px-4 py-3 text-left font-medium">Category</th>
              <th className="px-4 py-3 text-right font-medium">Amount</th>
              <th className="px-4 py-3 text-left font-medium">Due date</th>
              <th className="px-4 py-3 text-left font-medium">Paid on</th>
              <th className="px-4 py-3 text-left font-medium">Status</th>
              <th className="px-4 py-3 text-right font-medium">Receipt</th>
            </tr>
          </thead>
          <tbody>
            {fees.map((f, i) => (
              <tr key={f.id} className={i % 2 ? "bg-surface/50" : ""}>
                <td className="px-4 py-3">{f.category}</td>
                <td className="px-4 py-3 text-right font-mono">₹{f.amount.toLocaleString("en-IN")}</td>
                <td className="px-4 py-3 text-muted-foreground">{f.dueDate}</td>
                <td className="px-4 py-3 text-muted-foreground">{f.paidOn ?? "—"}</td>
                <td className="px-4 py-3">
                  <StatusBadge variant={f.status === "Paid" ? "success" : f.status === "Pending" ? "warning" : "danger"}>
                    {f.status}
                  </StatusBadge>
                </td>
                <td className="px-4 py-3 text-right">
                  {f.status === "Paid" ? (
                    <Button
                      size="sm" variant="ghost"
                      onClick={() => toast.success(`Receipt #${f.id.toUpperCase()} downloaded`)}
                    >
                      <Download className="h-3.5 w-3.5" />
                    </Button>
                  ) : (
                    <Button size="sm" onClick={() => toast.info("Redirecting to payment gateway… (demo)")}>
                      Pay now
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
