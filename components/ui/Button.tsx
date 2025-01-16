import { ButtonHTMLAttributes, ReactNode } from "react";
import clsx from "clsx";
import { BiLoaderAlt } from "react-icons/bi";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
  isLoading?: boolean;
}

export function Button({
  children,
  className,
  variant = "primary",
  size = "md",
  fullWidth = false,
  isLoading = false,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className={clsx(
        "inline-flex items-center justify-center rounded-lg font-medium transition-colors",
        {
          "bg-primary text-white hover:bg-primary/90 disabled:bg-primary/50":
            variant === "primary",
          "bg-background-secondary text-text hover:bg-background-secondary/90 disabled:bg-background-secondary/50":
            variant === "secondary",
          "border border-border text-text-secondary hover:text-text hover:border-primary disabled:opacity-50":
            variant === "outline",
          "text-text-secondary hover:text-text disabled:opacity-50": variant === "ghost",

          "text-sm px-3 py-1.5": size === "sm",
          "text-sm px-4 py-2": size === "md",
          "text-base px-6 py-2.5": size === "lg",

          "w-full": fullWidth,
          "cursor-not-allowed": disabled || isLoading,
        },
        className
      )}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && <BiLoaderAlt className="mr-2 h-4 w-4 animate-spin" />}
      {children}
    </button>
  );
}
