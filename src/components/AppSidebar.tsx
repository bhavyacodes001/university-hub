import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel,
  SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarHeader, SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";
import { NavLink } from "@/components/NavLink";
import {
  LayoutDashboard, Calendar, ClipboardCheck, GraduationCap,
  Wallet, Bell, User, Users, Megaphone, ClipboardList, LogOut,
} from "lucide-react";
import { Logo } from "@/components/Logo";
import { ROUTES } from "@/constants";
import { useAuth } from "@/store/auth";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const studentNav = [
  { title: "Dashboard",  url: ROUTES.STUDENT.DASHBOARD, icon: LayoutDashboard, end: true },
  { title: "Timetable",  url: ROUTES.STUDENT.TIMETABLE, icon: Calendar },
  { title: "Attendance", url: ROUTES.STUDENT.ATTENDANCE, icon: ClipboardCheck },
  { title: "Results",    url: ROUTES.STUDENT.RESULTS, icon: GraduationCap },
  { title: "Fees",       url: ROUTES.STUDENT.FEES, icon: Wallet },
  { title: "Notices",    url: ROUTES.STUDENT.NOTICES, icon: Bell },
  { title: "Profile",    url: ROUTES.STUDENT.PROFILE, icon: User },
];

const adminNav = [
  { title: "Dashboard",  url: ROUTES.ADMIN.DASHBOARD, icon: LayoutDashboard, end: true },
  { title: "Students",   url: ROUTES.ADMIN.STUDENTS, icon: Users },
  { title: "Attendance", url: ROUTES.ADMIN.ATTENDANCE, icon: ClipboardList },
  { title: "Notices",    url: ROUTES.ADMIN.NOTICES, icon: Megaphone },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const items = user?.role === "admin" ? adminNav : studentNav;

  const handleLogout = () => {
    logout();
    navigate(ROUTES.LOGIN, { replace: true });
  };

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border">
      <SidebarHeader className="px-3 py-4">
        <Logo collapsed={collapsed} />
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          {!collapsed && (
            <SidebarGroupLabel className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground px-3">
              {user?.role === "admin" ? "Admin Console" : "Student Portal"}
            </SidebarGroupLabel>
          )}
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild tooltip={item.title}>
                    <NavLink
                      to={item.url}
                      end={item.end}
                      className="hover:bg-sidebar-accent text-sidebar-foreground rounded-md"
                      activeClassName="bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                    >
                      <item.icon className="h-4 w-4 shrink-0" />
                      {!collapsed && <span className="text-sm">{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-3 border-t border-sidebar-border">
        {collapsed ? (
          <Button variant="ghost" size="icon" onClick={handleLogout} title="Sign out">
            <LogOut className="h-4 w-4" />
          </Button>
        ) : (
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-2 py-2 rounded-md hover:bg-sidebar-accent transition-colors"
          >
            <div className="h-8 w-8 rounded-full bg-primary-muted text-primary flex items-center justify-center text-xs font-semibold">
              {user?.name?.split(" ").map(n => n[0]).slice(0, 2).join("")}
            </div>
            <div className="flex-1 min-w-0 text-left">
              <p className="text-xs font-medium truncate">{user?.name}</p>
              <p className="text-[10px] text-muted-foreground truncate">{user?.email}</p>
            </div>
            <LogOut className="h-3.5 w-3.5 text-muted-foreground" />
          </button>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
