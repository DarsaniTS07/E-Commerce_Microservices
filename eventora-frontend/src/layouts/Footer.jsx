import React from "react";

export const Footer = () => {
  return (
    <footer className="py-4 px-6 border-t border-neutral-muted bg-neutral-white flex flex-col sm:flex-row items-center justify-between text-xs text-neutral-secondary">
      <div>
        &copy; {new Date().getFullYear()} Eventora Inc. All rights reserved.
      </div>
      <div className="flex gap-4 mt-2 sm:mt-0 font-medium">
        <a href="#terms" className="hover:text-primary transition-colors">Terms of Service</a>
        <a href="#privacy" className="hover:text-primary transition-colors">Privacy Policy</a>
        <a href="#support" className="hover:text-primary transition-colors">Support Desk</a>
      </div>
    </footer>
  );
};

export default Footer;
