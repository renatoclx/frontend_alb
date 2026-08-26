import { ReactNode } from "react";
import { ThemeToggle } from "@/components/ui/theme-toggle";

interface AuthLayoutProps {
  eyebrow: string;
  title: string;
  description: string;
  children: ReactNode;
}

export function AuthLayout({ eyebrow, title, description, children }: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="fixed right-4 top-4">
        <ThemeToggle />
      </div>

      <div className="flex w-full max-w-5xl overflow-hidden rounded-2xl border border-foreground/10 bg-surface shadow-sm">
        <div className="relative hidden w-1/2 overflow-hidden lg:block">
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(135deg, var(--primary) 0%, var(--primary-pressed) 55%, #060b18 100%)",
            }}
          />
          <div className="absolute -left-16 top-1/3 size-64 rounded-full bg-primary/40 blur-3xl" />
          <div className="absolute bottom-0 right-0 size-72 rounded-full bg-primary-hover/30 blur-3xl" />

          <div className="relative flex h-full flex-col justify-between p-10 text-white">
            <span className="text-xs font-semibold uppercase tracking-widest text-white/70">
              {eyebrow}
            </span>
            <div className="flex flex-col gap-3">
              <h2 className="font-heading text-3xl font-semibold leading-tight">{title}</h2>
              <p className="text-sm text-white/70">{description}</p>
            </div>
          </div>
        </div>

        <div className="flex w-full flex-col justify-center gap-8 p-8 sm:p-12 lg:w-1/2">
          <span className="font-heading text-lg font-bold text-foreground">LocObra</span>
          {children}
        </div>
      </div>
    </div>
  );
}
