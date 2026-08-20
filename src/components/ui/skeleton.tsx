import { cn } from "@/lib/utils";

function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse bg-surface-sunken", className)}
      role="status"
      aria-label="Loading"
      {...props}
    />
  );
}

export { Skeleton };
