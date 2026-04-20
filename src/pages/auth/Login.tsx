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
import { ROUTES, DEMO_ACCOUNTS } from "@/constants";
import { Loader2 } from "lucide-react";

const schema = z.object({
  email: z.string().trim().email("Enter a valid email").max(255),
  password: z.string().min(6, "At least 6 characters").max(72),
});
type Form = z.infer<typeof schema>;

export default function Login() {
  const navigate = useNavigate();
  const login = useAuth(s => s.login);
  const [submitting, setSubmitting] = useState(false);

  const form = useForm<Form>({
    resolver: zodResolver(schema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (values: Form) => {
    setSubmitting(true);
    try {
      const user = await login(values.email, values.password);
      toast.success(`Welcome back, ${user.name.split(" ")[0]}`);
      navigate(user.role === "admin" ? ROUTES.ADMIN.DASHBOARD : ROUTES.STUDENT.DASHBOARD, { replace: true });
    } catch (e: any) {
      toast.error(e.message ?? "Sign in failed");
    } finally {
      setSubmitting(false);
    }
  };

  const fillDemo = (email: string, password: string) => {
    form.setValue("email", email);
    form.setValue("password", password);
  };

  return (
    <AuthLayout title="Sign in to your portal" subtitle="Use your university email to continue.">
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" autoComplete="email" placeholder="you@srm.demo" {...form.register("email")} />
          {form.formState.errors.email && (
            <p className="text-xs text-destructive">{form.formState.errors.email.message}</p>
          )}
        </div>
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            <Link to={ROUTES.FORGOT} className="text-xs text-primary hover:underline">Forgot?</Link>
          </div>
          <Input id="password" type="password" autoComplete="current-password" placeholder="••••••••" {...form.register("password")} />
          {form.formState.errors.password && (
            <p className="text-xs text-destructive">{form.formState.errors.password.message}</p>
          )}
        </div>
        <Button type="submit" className="w-full" disabled={submitting}>
          {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Sign in
        </Button>
        <p className="text-xs text-center text-muted-foreground">
          New here? <Link to={ROUTES.REGISTER} className="text-primary hover:underline">Create an account</Link>
        </p>
      </form>

      <div className="mt-8 pt-6 border-t border-border">
        <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium mb-3">Try a demo account</p>
        <div className="space-y-1.5">
          {DEMO_ACCOUNTS.map(a => (
            <button
              key={a.email}
              type="button"
              onClick={() => fillDemo(a.email, a.password)}
              className="w-full text-left px-3 py-2 rounded-md border border-border hover:bg-secondary text-xs flex items-center justify-between transition-colors"
            >
              <span>{a.label}</span>
              <span className="text-[10px] text-muted-foreground capitalize">{a.role}</span>
            </button>
          ))}
        </div>
      </div>
    </AuthLayout>
  );
}
