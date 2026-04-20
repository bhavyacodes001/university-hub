import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { AuthLayout } from "@/components/AuthLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/api";
import { ROUTES } from "@/constants";
import { Loader2 } from "lucide-react";

const schema = z.object({ email: z.string().trim().email().max(255) });
type Form = z.infer<typeof schema>;

export default function ForgotPassword() {
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const form = useForm<Form>({ resolver: zodResolver(schema), defaultValues: { email: "" } });

  const onSubmit = async (v: Form) => {
    setSubmitting(true);
    try {
      await api.forgotPassword(v.email);
      setSent(true);
      toast.success("Reset link sent (demo)");
    } catch (e: any) {
      toast.error(e.message ?? "Could not send reset link");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout title="Forgot your password?" subtitle="We'll email you a reset link.">
      {sent ? (
        <div className="space-y-4">
          <div className="card-surface p-4 text-sm">
            If that email is registered, a reset link has been sent. Check your inbox.
          </div>
          <Link to={ROUTES.LOGIN} className="text-sm text-primary hover:underline">← Back to sign in</Link>
        </div>
      ) : (
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" {...form.register("email")} />
            {form.formState.errors.email && <p className="text-xs text-destructive">{form.formState.errors.email.message}</p>}
          </div>
          <Button type="submit" className="w-full" disabled={submitting}>
            {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Send reset link
          </Button>
          <p className="text-xs text-center text-muted-foreground">
            <Link to={ROUTES.LOGIN} className="text-primary hover:underline">← Back to sign in</Link>
          </p>
        </form>
      )}
    </AuthLayout>
  );
}
