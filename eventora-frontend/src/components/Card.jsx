import React from "react";
import { cn } from "../utils/cn";

export const Card = ({ className, ...props }) => (
  <div
    className={cn(
      "rounded-xl border border-neutral-muted bg-neutral-white text-neutral-primary shadow-soft transition-all duration-200",
      className
    )}
    {...props}
  />
);

export const CardHeader = ({ className, ...props }) => (
  <div
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
);

export const CardTitle = ({ className, ...props }) => (
  <h3
    className={cn(
      "text-lg font-semibold leading-none tracking-tight text-neutral-primary",
      className
    )}
    {...props}
  />
);

export const CardDescription = ({ className, ...props }) => (
  <p
    className={cn("text-sm text-neutral-secondary", className)}
    {...props}
  />
);

export const CardContent = ({ className, ...props }) => (
  <div className={cn("p-6 pt-0", className)} {...props} />
);

export const CardFooter = ({ className, ...props }) => (
  <div
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
);

export default Card;
