import React, { useEffect } from "react";
import { cn } from "../utils/cn";
import { X } from "lucide-react";

export const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  className,
}) => {
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape") onClose();
    };

    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-primary/40 backdrop-blur-sm">
      <div
        className="fixed inset-0"
        onClick={onClose}
      />
      <div
        className={cn(
          "relative w-full max-w-lg bg-neutral-white border border-neutral-muted rounded-xl shadow-premium p-6 overflow-hidden z-10 transition-all",
          className
        )}
      >
        <div className="flex items-center justify-between pb-4 border-b border-neutral-muted">
          {title && (
            <h2 className="text-lg font-bold tracking-tight text-neutral-primary">
              {title}
            </h2>
          )}
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-neutral-secondary hover:bg-neutral-light hover:text-neutral-primary transition-colors"
          >
            <X size={18} />
          </button>
        </div>
        <div className="mt-4">{children}</div>
      </div>
    </div>
  );
};

export default Modal;
