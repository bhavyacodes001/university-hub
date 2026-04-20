import { ReactNode } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Bell, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/store/auth";
import { resetAll } from "@/lib/seed";
import { toast } from "sonner";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { ROUTES } from "@/constants";

function getCrumbs(pathname: string): string[] {
  return pathname.split("/").filter(Boolean).map(seg =>
    seg.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase())
  );
}

export function AppLayout({ children }: { children?: ReactNode }) {
  const location = useLocation();
  const { user } = useAuth();
  const crumbs = getCrumbs(location.pathname);

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-surface">
        <AppSidebar />

        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-14 flex items-center gap-3 px-4 border-b border-border bg-background sticky top-0 z-30">
            <SidebarTrigger />
            <nav className="hidden sm:flex items-center text-sm text-muted-foreground">
              {crumbs.map((c, i) => (
                <span key={i} className="flex items-center">
                  {i > 0 && <span className="mx-2 text-border">/</span>}
                  <span className={i === crumbs.length - 1 ? "text-foreground font-medium" : ""}>{c}</span>
                </span>
              ))}
            </nav>
            <div className="ml-auto flex items-center gap-2">
              <Button variant="ghost" size="icon" aria-label="Notifications">
                <Bell className="h-4 w-4" />
              </Button>
              <div className="hidden md:flex items-center gap-2 pl-3 ml-1 border-l border-border">
                <div className="h-7 w-7 rounded-full bg-primary-muted text-primary flex items-center justify-center text-[11px] font-semibold">
                  {user?.name?.split(" ").map(n => n[0]).slice(0, 2).join("")}
                </div>
                <div className="text-xs leading-tight">
                  <p className="font-medium">{user?.name}</p>
                  <p className="text-muted-foreground capitalize">{user?.role}</p>
                </div>
              </div>
            </div>
          </header>

          <motion.main
            key={location.pathname}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="flex-1 p-4 sm:p-6 lg:p-8 max-w-[1400px] w-full mx-auto"
          >
            {children ?? <Outlet />}
          </motion.main>
        </div>
      </div>
    </SidebarProvider>
  );
}
