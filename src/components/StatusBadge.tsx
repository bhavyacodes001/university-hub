import { cn } from "@/lib/utils";

type Variant = "success" | "warning" | "danger" | "neutral" | "info";

const variants: Record<Variant, string> = {
  success: "bg-success-muted text-success border-success/20",
  warning: "bg-warning-muted text-warning border-warning/20",
  danger:  "bg-destructive-muted text-destructive border-destructive/20",
  neutral: "bg-secondary text-secondary-foreground border-border",
  info:    "bg-primary-muted text-primary border-primary/20",
};

export function StatusBadge({
  children,
  variant = "neutral",
  className,
}: { children: React.ReactNode; variant?: Variant; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-xs font-medium",
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
