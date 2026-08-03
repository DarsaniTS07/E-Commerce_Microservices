import React from "react";
import { Link, useLocation } from "react-router-dom";
import { ChevronRight, Home } from "lucide-react";
import { cn } from "../utils/cn";

export const Breadcrumb = ({ className }) => {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((x) => x);

  const formatName = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1).replace(/-/g, " ");
  };

  return (
    <nav className={cn("flex", className)} aria-label="Breadcrumb">
      <ol className="inline-flex items-center space-x-1 md:space-x-2 text-sm font-medium">
        <li className="inline-flex items-center">
          <Link
            to={location.pathname.startsWith("/admin") ? "/admin/dashboard" : "/dashboard"}
            className="inline-flex items-center text-neutral-secondary hover:text-primary transition-colors gap-1.5"
          >
            <Home size={14} />
            <span className="hidden sm:inline">Home</span>
          </Link>
        </li>
        {pathnames.map((value, index) => {
          if (value.toLowerCase() === "dashboard" || value.toLowerCase() === "admin") return null;

          const to = `/${pathnames.slice(0, index + 1).join("/")}`;
          const isLast = index === pathnames.length - 1;

          return (
            <li key={to} className="inline-flex items-center">
              <ChevronRight size={14} className="text-neutral-secondary/50 mx-1" />
              {isLast ? (
                <span className="text-neutral-primary font-semibold truncate max-w-[120px] sm:max-w-none">
                  {formatName(value)}
                </span>
              ) : (
                <Link
                  to={to}
                  className="text-neutral-secondary hover:text-primary transition-colors"
                >
                  {formatName(value)}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumb;
