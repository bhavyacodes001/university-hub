import { Navigate } from "react-router-dom";
import { useAuth } from "@/store/auth";
import { ROUTES } from "@/constants";

const Index = () => {
  const { user } = useAuth();
  if (!user) return <Navigate to={ROUTES.LOGIN} replace />;
  return <Navigate to={user.role === "admin" ? ROUTES.ADMIN.DASHBOARD : ROUTES.STUDENT.DASHBOARD} replace />;
};

export default Index;
