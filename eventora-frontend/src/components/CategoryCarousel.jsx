import React from "react";
import { Cpu, Music, Briefcase, GraduationCap, Globe, Trophy, Utensils, Laugh, Palette, Hammer } from "lucide-react";
import { cn } from "../utils/cn";

const categories = [
  { name: "Technology", icon: Cpu, value: "Technology" },
  { name: "Music", icon: Music, value: "Music" },
  { name: "Business", icon: Briefcase, value: "Business" },
  { name: "Education", icon: GraduationCap, value: "Education" },
  { name: "Culture", icon: Globe, value: "Culture" },
  { name: "Sports", icon: Trophy, value: "Sports" },
  { name: "Food", icon: Utensils, value: "Food" },
  { name: "Comedy", icon: Laugh, value: "Comedy" },
  { name: "Arts", icon: Palette, value: "Arts" },
  { name: "Workshops", icon: Hammer, value: "Workshops" },
];

export const CategoryCarousel = ({ activeCategory, onSelectCategory }) => {
  return (
    <div className="w-full">
      <div className="flex gap-4 overflow-x-auto pb-4 pt-1 px-1 scrollbar-hide -mx-4 sm:mx-0 sm:px-0 scroll-smooth">
        {categories.map((category) => {
          const Icon = category.icon;
          const isActive = activeCategory === category.value;

          return (
            <button
              key={category.value}
              onClick={() => onSelectCategory(isActive ? null : category.value)}
              className={cn(
                "flex flex-col items-center justify-center min-w-[100px] h-24 rounded-xl border transition-all duration-300 relative group cursor-pointer focus:outline-none shrink-0",
                isActive
                  ? "bg-neutral-white border-primary shadow-medium scale-105"
                  : "bg-neutral-white border-neutral-muted hover:border-primary-light hover:shadow-soft"
              )}
            >
              {/* Premium Gradient outline */}
              {isActive && (
                <div className="absolute inset-0 rounded-xl bg-brand-gradient -z-10 p-[1px]">
                  <div className="w-full h-full bg-neutral-white rounded-[11px]"></div>
                </div>
              )}

              <div
                className={cn(
                  "p-2 rounded-lg mb-2 transition-all duration-300",
                  isActive
                    ? "bg-primary-lightest text-primary"
                    : "bg-neutral-light text-neutral-secondary group-hover:bg-primary-lightest group-hover:text-primary"
                )}
              >
                <Icon size={18} />
              </div>

              <span
                className={cn(
                  "text-xs font-bold transition-colors",
                  isActive ? "text-primary" : "text-neutral-secondary group-hover:text-neutral-primary"
                )}
              >
                {category.name}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default CategoryCarousel;
