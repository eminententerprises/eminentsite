import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-body-sm font-semibold tracking-wide uppercase transition-[color,background-color,border-color,box-shadow,transform] duration-200 disabled:pointer-events-none disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-none [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        primary:
          "relative overflow-hidden [background-image:var(--button-primary-gradient)] text-[var(--button-primary-fg)] shadow-[0_4px_18px_rgba(86,56,201,0.35)] before:absolute before:inset-0 before:-translate-x-full before:content-[''] before:bg-gradient-to-r before:from-transparent before:via-white/35 before:to-transparent before:transition-transform before:duration-700 hover:-translate-y-0.5 hover:[background-image:var(--button-primary-gradient-hover)] hover:shadow-[0_14px_32px_rgba(86,56,201,0.45)] hover:before:translate-x-full active:translate-y-0 active:shadow-[0_4px_18px_rgba(86,56,201,0.35)]",
        secondary:
          "border border-[var(--button-secondary-border)] bg-[var(--button-secondary-bg)] text-[var(--button-secondary-fg)] hover:border-accent hover:text-accent",
        outline:
          "border border-border-strong bg-transparent text-ink-primary hover:border-navy-800 hover:text-navy-800",
        ghost: "text-ink-primary hover:bg-surface-sunken",
        link: "text-navy-800 underline-offset-4 hover:underline normal-case font-medium tracking-normal",
        whatsapp:
          "bg-[#25D366] text-white shadow-[0_1px_2px_rgba(0,0,0,0.15)] hover:-translate-y-0.5 hover:bg-[#1DA851] hover:shadow-[0_10px_24px_rgba(37,211,102,0.35)] active:translate-y-0 active:shadow-[0_1px_2px_rgba(0,0,0,0.15)]",
        destructive: "bg-danger text-white hover:opacity-90",
      },
      size: {
        sm: "h-9 px-3 text-xs",
        md: "h-11 px-5",
        lg: "h-14 px-8 text-base",
        icon: "h-11 w-11 shrink-0 normal-case",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
