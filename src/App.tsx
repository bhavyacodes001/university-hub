import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

import Index from "./pages/Index.tsx";
import NotFound from "./pages/NotFound.tsx";

import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ForgotPassword from "./pages/auth/ForgotPassword";

import { AppLayout } from "@/components/AppLayout";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { ROUTES } from "@/constants";

import StudentDashboard from "./pages/student/Dashboard";
import Timetable from "./pages/student/Timetable";
import Attendance from "./pages/student/Attendance";
import Results from "./pages/student/Results";
import Fees from "./pages/student/Fees";
import Notices from "./pages/student/Notices";
import Profile from "./pages/student/Profile";

import AdminDashboard from "./pages/admin/Dashboard";
import AdminStudents from "./pages/admin/Students";
import AdminNotices from "./pages/admin/Notices";
import AdminAttendance from "./pages/admin/Attendance";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path={ROUTES.LOGIN} element={<Login />} />
          <Route path={ROUTES.REGISTER} element={<Register />} />
          <Route path={ROUTES.FORGOT} element={<ForgotPassword />} />

          {/* Student */}
          <Route element={<ProtectedRoute role="student"><AppLayout /></ProtectedRoute>}>
            <Route path={ROUTES.STUDENT.DASHBOARD} element={<StudentDashboard />} />
            <Route path={ROUTES.STUDENT.TIMETABLE} element={<Timetable />} />
            <Route path={ROUTES.STUDENT.ATTENDANCE} element={<Attendance />} />
            <Route path={ROUTES.STUDENT.RESULTS} element={<Results />} />
            <Route path={ROUTES.STUDENT.FEES} element={<Fees />} />
            <Route path={ROUTES.STUDENT.NOTICES} element={<Notices />} />
            <Route path={ROUTES.STUDENT.PROFILE} element={<Profile />} />
          </Route>

          {/* Admin */}
          <Route element={<ProtectedRoute role="admin"><AppLayout /></ProtectedRoute>}>
            <Route path={ROUTES.ADMIN.DASHBOARD} element={<AdminDashboard />} />
            <Route path={ROUTES.ADMIN.STUDENTS} element={<AdminStudents />} />
            <Route path={ROUTES.ADMIN.ATTENDANCE} element={<AdminAttendance />} />
            <Route path={ROUTES.ADMIN.NOTICES} element={<AdminNotices />} />
          </Route>

          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
