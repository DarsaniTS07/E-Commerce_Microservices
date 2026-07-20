import React from "react";
import FilterChip from "./FilterChip";
import { cn } from "../utils/cn";
import { Filter, X } from "lucide-react";

export const FilterBar = ({
  filters = {},
  onFilterChange,
  onClearFilters,
}) => {
  const { date, price, trending } = filters;

  const dateOptions = [
    { label: "Today", value: "today" },
    { label: "Tomorrow", value: "tomorrow" },
    { label: "This Week", value: "this-week" },
    { label: "Weekend", value: "weekend" },
  ];

  const priceOptions = [
    { label: "Free", value: "free" },
    { label: "Paid", value: "paid" },
  ];

  const toggleTrending = () => {
    onFilterChange("trending", !trending);
  };

  const activeChips = [];
  if (date) {
    const matched = dateOptions.find((d) => d.value === date);
    if (matched) activeChips.push({ category: "date", label: matched.label, value: date });
  }
  if (price) {
    const matched = priceOptions.find((p) => p.value === price);
    if (matched) activeChips.push({ category: "price", label: matched.label, value: price });
  }
  if (trending) {
    activeChips.push({ category: "trending", label: "Trending", value: true });
  }

  const hasActiveFilters = activeChips.length > 0;

  return (
    <div className="w-full bg-neutral-white border-y border-neutral-muted py-3.5 sticky top-16 z-30 shadow-soft">
      <div className="max-w-7xl mx-auto px-4 md:px-6 flex flex-col gap-3">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-neutral-secondary uppercase tracking-wider mr-2">
              <Filter size={14} />
              <span>Filters</span>
            </div>

            {/* Date Triggers */}
            {dateOptions.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => onFilterChange("date", date === opt.value ? null : opt.value)}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all duration-200 cursor-pointer focus:outline-none",
                  date === opt.value
                    ? "bg-primary-lightest text-primary border-primary-light/35"
                    : "bg-transparent text-neutral-secondary border-neutral-muted hover:border-neutral-border hover:text-neutral-primary"
                )}
              >
                {opt.label}
              </button>
            ))}

            <div className="h-4 w-[1px] bg-neutral-muted mx-1 hidden sm:block"></div>

            {/* Price Triggers */}
            {priceOptions.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => onFilterChange("price", price === opt.value ? null : opt.value)}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all duration-200 cursor-pointer focus:outline-none",
                  price === opt.value
                    ? "bg-secondary-lightest text-secondary border-secondary-light/35"
                    : "bg-transparent text-neutral-secondary border-neutral-muted hover:border-neutral-border hover:text-neutral-primary"
                )}
              >
                {opt.label}
              </button>
            ))}

            <div className="h-4 w-[1px] bg-neutral-muted mx-1 hidden sm:block"></div>

            {/* Trending Toggle */}
            <button
              type="button"
              onClick={toggleTrending}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all duration-200 cursor-pointer focus:outline-none",
                trending
                  ? "bg-accent-lightest text-accent border-accent-light/35"
                  : "bg-transparent text-neutral-secondary border-neutral-muted hover:border-neutral-border hover:text-neutral-primary"
              )}
            >
              Trending 🔥
            </button>
          </div>

          {hasActiveFilters && (
            <button
              onClick={onClearFilters}
              className="text-xs font-bold text-danger hover:text-danger-dark transition-colors flex items-center gap-1 cursor-pointer focus:outline-none"
            >
              <X size={14} />
              Clear Filters
            </button>
          )}
        </div>

        {/* Removable Chips */}
        {hasActiveFilters && (
          <div className="flex flex-wrap items-center gap-2 pt-2.5 border-t border-dashed border-neutral-muted">
            <span className="text-[10px] uppercase font-bold text-neutral-secondary tracking-widest mr-1">
              Active:
            </span>
            {activeChips.map((chip) => (
              <FilterChip
                key={`${chip.category}-${chip.value}`}
                label={chip.label}
                value={chip.value}
                isActive={true}
                onDelete={() => onFilterChange(chip.category, null)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FilterBar;
