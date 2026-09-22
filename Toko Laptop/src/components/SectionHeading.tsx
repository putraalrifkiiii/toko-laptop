import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export default function SectionHeading({
  eyebrow,
  title,
  sub,
  action,
  className,
}: {
  eyebrow: string;
  title: string;
  sub?: string;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "mb-10 flex flex-col gap-6 md:flex-row md:items-end md:justify-between",
        className,
      )}
    >
      <div className="max-w-2xl">
        <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.3em] text-brand">
          {"// "}
          {eyebrow}
        </p>
        <h2 className="mt-3 font-heading text-3xl font-bold uppercase leading-[1.05] tracking-tight text-foreground sm:text-4xl">
          {title}
        </h2>
        {sub && (
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
            {sub}
          </p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
