import * as React from "react";
import { cn } from "@/lib/utils";

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        ref={ref}
        className={cn(
          "flex h-11 w-full rounded-xl border border-[var(--input-border)] bg-[var(--input-bg)] px-3.5 text-body-md text-ink-primary placeholder:text-[var(--input-placeholder)] transition-colors focus-visible:border-[var(--input-border-focus)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent-strong disabled:cursor-not-allowed disabled:opacity-50",
          className,
        )}
        {...props}
      />
    );
  },
);
Input.displayName = "Input";

export { Input };
