import { GraduationCap } from "lucide-react";
import { APP_NAME } from "@/constants";

export function Logo({ collapsed = false }: { collapsed?: boolean }) {
  return (
    <div className="flex items-center gap-2.5">
      <div className="h-8 w-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center shadow-sm">
        <GraduationCap className="h-4 w-4" />
      </div>
      {!collapsed && (
        <div className="flex flex-col leading-tight">
          <span className="text-sm font-semibold tracking-tight">{APP_NAME}</span>
          <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Sonipat · NCR</span>
        </div>
      )}
    </div>
  );
}
