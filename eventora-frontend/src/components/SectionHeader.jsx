import React from "react";
import { cn } from "../utils/cn";

export const SectionHeader = ({ title, subtitle, className, children }) => {
  return (
    <div className={cn("flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8", className)}>
      <div className="space-y-1.5">
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-neutral-primary">{title}</h2>
        {subtitle && <p className="text-sm text-neutral-secondary">{subtitle}</p>}
      </div>
      {children && <div className="flex items-center gap-3 shrink-0">{children}</div>}
    </div>
  );
};

export default SectionHeader;
