import React from "react";
import { cn } from "../utils/cn";

export const Badge = ({ children, className, variant = "primary" }) => {
  const variants = {
    primary: "bg-primary-lightest text-primary border-primary-light/20",
    secondary: "bg-secondary-lightest text-secondary border-secondary-light/20",
    accent: "bg-accent-lightest text-accent border-accent-light/20",
    neutral: "bg-neutral-light text-neutral-secondary border-neutral-border/50",
    success: "bg-success-lightest text-success border-success-light/20",
    danger: "bg-danger-lightest text-danger border-danger-light/20",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border transition-all duration-200",
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
};

export default Badge;
