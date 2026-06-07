import { type ReactNode } from "react";
import { cn } from "@/lib/utils";

export function PageHeader({
  eyebrow, title, description, action, className,
}: {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("mb-8 flex flex-wrap items-end justify-between gap-4", className)}>
      <div>
        {eyebrow && <p className="text-xs font-medium uppercase tracking-widest text-primary mb-2">{eyebrow}</p>}
        <h1 className="font-display text-3xl md:text-4xl font-semibold tracking-tight">{title}</h1>
        {description && <p className="mt-2 text-muted-foreground max-w-2xl">{description}</p>}
      </div>
      {action && <div className="flex items-center gap-2">{action}</div>}
    </div>
  );
}
