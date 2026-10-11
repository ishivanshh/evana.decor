import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva("inline-flex items-center justify-center gap-2 whitespace-nowrap transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a85f45] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50", {
  variants: {
    variant: {
      brand: "bg-[#4a3a31] px-6 py-4 text-[10px] uppercase tracking-[.16em] text-white hover:bg-[#a85f45]",
      outline: "border border-[#b7a99c] px-6 py-4 text-[10px] uppercase tracking-[.16em] hover:border-[#4a3a31] hover:bg-[#4a3a31] hover:text-white",
      ghost: "px-3 py-2 text-sm hover:bg-[#f1ebe3]",
    },
    size: { default: "min-h-11", sm: "min-h-9", icon: "h-10 w-10" },
  },
  defaultVariants: { variant: "brand", size: "default" },
});

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({ className, variant, size, asChild = false, ...props }, ref) => {
  const Component = asChild ? Slot : "button";
  return <Component ref={ref} className={cn(buttonVariants({ variant, size }), className)} {...props} />;
});
Button.displayName = "Button";
