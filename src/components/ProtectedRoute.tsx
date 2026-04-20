import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/store/auth";
import type { Role } from "@/types";
import { ROUTES } from "@/constants";

export function ProtectedRoute({
  children,
  role,
}: {
  children: React.ReactNode;
  role?: Role;
}) {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    return <Navigate to={ROUTES.LOGIN} state={{ from: location }} replace />;
  }
  if (role && user.role !== role) {
    return <Navigate to={user.role === "admin" ? ROUTES.ADMIN.DASHBOARD : ROUTES.STUDENT.DASHBOARD} replace />;
  }
  return <>{children}</>;
}
