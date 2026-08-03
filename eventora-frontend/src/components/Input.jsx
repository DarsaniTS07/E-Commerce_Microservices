import React from "react";
import { cn } from "../utils/cn";

export const Input = React.forwardRef(({
  className,
  type = "text",
  label,
  error,
  ...props
}, ref) => {
  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && (
        <label className="text-xs font-semibold text-neutral-secondary uppercase tracking-wider">
          {label}
        </label>
      )}
      <input
        ref={ref}
        type={type}
        className={cn(
          "w-full px-3 py-2.5 text-sm bg-neutral-white border rounded-lg shadow-soft transition-all duration-200 outline-none text-neutral-primary placeholder:text-neutral-secondary/50",
          error
            ? "border-danger focus:border-danger focus:ring-2 focus:ring-danger/20"
            : "border-neutral-border focus:border-primary focus:ring-2 focus:ring-primary/20",
          className
        )}
        {...props}
      />
      {error && (
        <span className="text-xs font-medium text-danger mt-0.5">
          {error}
        </span>
      )}
    </div>
  );
});

Input.displayName = "Input";
export default Input;
