import { ReactNode } from "react";
import { Logo } from "@/components/Logo";

export function AuthLayout({
  title,
  subtitle,
  children,
  side,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
  side?: ReactNode;
}) {
  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left: form */}
      <div className="flex flex-col px-6 sm:px-10 lg:px-16 py-8 bg-background">
        <div className="mb-12">
          <Logo />
        </div>
        <div className="flex-1 flex items-center">
          <div className="w-full max-w-sm mx-auto">
            <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
            {subtitle && <p className="text-sm text-muted-foreground mt-2">{subtitle}</p>}
            <div className="mt-8">{children}</div>
          </div>
        </div>
        <p className="text-xs text-muted-foreground text-center mt-8">
          © {new Date().getFullYear()} SRM University, Sonipat
        </p>
      </div>

      {/* Right: brand panel */}
      <div className="hidden lg:flex relative bg-surface border-l border-border overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,hsl(var(--primary)/0.08),transparent_50%)]" />
        <div className="relative flex flex-col justify-end p-12 w-full">
          {side ?? (
            <div className="max-w-md">
              <p className="text-xs uppercase tracking-widest text-primary font-medium mb-3">Delhi NCR Campus</p>
              <h2 className="text-3xl font-semibold tracking-tight leading-tight">
                Everything academic.<br />One quiet place.
              </h2>
              <p className="text-sm text-muted-foreground mt-4 leading-relaxed">
                Attendance, results, fees, notices and more — designed to stay out of your way so you can focus on what matters.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
