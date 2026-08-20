import * as React from "react";
import { cn } from "@/lib/utils";

const Textarea = React.forwardRef<HTMLTextAreaElement, React.ComponentProps<"textarea">>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        className={cn(
          "flex min-h-24 w-full border border-[var(--input-border)] bg-[var(--input-bg)] px-3.5 py-2.5 text-body-md text-ink-primary placeholder:text-[var(--input-placeholder)] transition-colors focus-visible:border-[var(--input-border-focus)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent-strong disabled:cursor-not-allowed disabled:opacity-50",
          className,
        )}
        {...props}
      />
    );
  },
);
Textarea.displayName = "Textarea";

export { Textarea };
