import React from "react";
import { cn } from "../utils/cn";

export const Button = React.forwardRef(({
  className,
  variant = "primary",
  size = "md",
  isLoading = false,
  disabled = false,
  type = "button",
  children,
  ...props
}, ref) => {
  const baseStyles = "inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]";
  
  const variants = {
    primary: "bg-brand-gradient text-neutral-white hover:opacity-95 shadow-soft hover:shadow-medium border border-transparent",
    secondary: "bg-neutral-light hover:bg-neutral-muted text-neutral-primary border border-neutral-border",
    outline: "bg-transparent border border-neutral-border hover:bg-neutral-light text-neutral-primary",
    danger: "bg-danger text-neutral-white hover:bg-danger-dark shadow-soft",
    ghost: "bg-transparent hover:bg-neutral-light text-neutral-secondary hover:text-neutral-primary",
    gradientOutline: "bg-neutral-white text-neutral-primary border border-neutral-border hover:border-primary-light transition-all",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base",
  };

  return (
    <button
      ref={ref}
      type={type}
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      )}
      {children}
    </button>
  );
});

Button.displayName = "Button";
export default Button;
