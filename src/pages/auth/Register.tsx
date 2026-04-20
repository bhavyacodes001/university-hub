import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { AuthLayout } from "@/components/AuthLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/store/auth";
import { ROUTES } from "@/constants";
import { Loader2 } from "lucide-react";

const schema = z.object({
  name: z.string().trim().min(2, "Name is required").max(80),
  email: z.string().trim().email("Enter a valid email").max(255),
  enrollmentNo: z.string().trim().min(4, "Enter your enrollment number").max(40),
  password: z.string().min(6, "At least 6 characters").max(72),
});
type Form = z.infer<typeof schema>;

export default function Register() {
  const navigate = useNavigate();
  const register = useAuth(s => s.register);
  const [submitting, setSubmitting] = useState(false);

  const form = useForm<Form>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", email: "", enrollmentNo: "", password: "" },
  });

  const onSubmit = async (v: Form) => {
    setSubmitting(true);
    try {
      await register(v);
      toast.success("Account created");
      navigate(ROUTES.STUDENT.DASHBOARD, { replace: true });
    } catch (e: any) {
      toast.error(e.message ?? "Could not register");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout title="Create your account" subtitle="For currently enrolled students of SRM Sonipat.">
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="name">Full name</Label>
          <Input id="name" {...form.register("name")} />
          {form.formState.errors.name && <p className="text-xs text-destructive">{form.formState.errors.name.message}</p>}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" {...form.register("email")} />
          {form.formState.errors.email && <p className="text-xs text-destructive">{form.formState.errors.email.message}</p>}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="enrollmentNo">Enrollment number</Label>
          <Input id="enrollmentNo" placeholder="SRMS2025XXX000" {...form.register("enrollmentNo")} />
          {form.formState.errors.enrollmentNo && <p className="text-xs text-destructive">{form.formState.errors.enrollmentNo.message}</p>}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password" {...form.register("password")} />
          {form.formState.errors.password && <p className="text-xs text-destructive">{form.formState.errors.password.message}</p>}
        </div>
        <Button type="submit" className="w-full" disabled={submitting}>
          {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Create account
        </Button>
        <p className="text-xs text-center text-muted-foreground">
          Already have an account? <Link to={ROUTES.LOGIN} className="text-primary hover:underline">Sign in</Link>
        </p>
      </form>
    </AuthLayout>
  );
}
