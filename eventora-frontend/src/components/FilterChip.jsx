import React from "react";
import { X } from "lucide-react";
import { cn } from "../utils/cn";

export const FilterChip = ({ label, value, isActive, onClick, onDelete, className }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-semibold border transition-all duration-200 focus:outline-none select-none cursor-pointer",
        isActive
          ? "bg-primary text-neutral-white border-transparent shadow-soft hover:opacity-95"
          : "bg-neutral-white text-neutral-secondary border-neutral-border hover:bg-neutral-light hover:text-neutral-primary",
        className
      )}
    >
      <span>{label}</span>
      {isActive && onDelete && (
        <span
          onClick={(e) => {
            e.stopPropagation();
            onDelete(value);
          }}
          className="p-0.5 rounded-full hover:bg-neutral-white/20 transition-colors cursor-pointer"
        >
          <X size={12} className="stroke-[3]" />
        </span>
      )}
    </button>
  );
};

export default FilterChip;
