import { ReactNode } from "react";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  value: ReactNode;
  hint?: string;
  icon?: LucideIcon;
  tone?: "default" | "success" | "warning" | "danger";
}

const tones = {
  default: "text-foreground",
  success: "text-success",
  warning: "text-warning",
  danger: "text-destructive",
};

export function StatCard({ label, value, hint, icon: Icon, tone = "default" }: StatCardProps) {
  return (
    <div className="card-surface p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="stat-label">{label}</p>
          <p className={`mt-2 text-2xl font-semibold tracking-tight ${tones[tone]}`}>{value}</p>
          {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
        </div>
        {Icon && (
          <div className="h-9 w-9 rounded-lg bg-primary-muted flex items-center justify-center text-primary">
            <Icon className="h-4 w-4" />
          </div>
        )}
      </div>
    </div>
  );
}
