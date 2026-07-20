import React from "react";
import { Link } from "react-router-dom";
import { Code2, Globe, Briefcase, Mail, Phone, MapPin } from "lucide-react";

export const PublicFooter = () => {
  return (
    <footer className="bg-neutral-white border-t border-neutral-muted pt-16 pb-8 mt-20">
      <div className="max-w-7xl mx-auto px-4 md:px-6 grid gap-8 sm:grid-cols-2 md:grid-cols-4">
        {/* About Panel */}
        <div className="space-y-4">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 bg-brand-gradient rounded-lg flex items-center justify-center text-neutral-white font-black shadow-soft">
              E
            </div>
            <span className="font-extrabold text-lg tracking-tight text-neutral-primary">Eventora</span>
          </div>
          <p className="text-xs text-neutral-secondary leading-relaxed">
            Eventora is a cloud-native ticketing and seat reservation SaaS. Discover business conferences, concerts, and workshops with instant checkout verification.
          </p>
          <div className="flex items-center gap-3 pt-2">
            <a href="#" className="p-1.5 bg-neutral-light rounded-lg text-neutral-secondary hover:text-primary transition-colors">
              <Globe size={15} />
            </a>
            <a href="#" className="p-1.5 bg-neutral-light rounded-lg text-neutral-secondary hover:text-primary transition-colors">
              <Code2 size={15} />
            </a>
            <a href="#" className="p-1.5 bg-neutral-light rounded-lg text-neutral-secondary hover:text-primary transition-colors">
              <Briefcase size={15} />
            </a>
          </div>
        </div>

        {/* Links Panel */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold text-neutral-primary uppercase tracking-wider">Quick Links</h3>
          <ul className="space-y-2 text-xs font-semibold text-neutral-secondary">
            <li>
              <Link to="/events" className="hover:text-primary transition-colors">Browse Events</Link>
            </li>
            <li>
              <Link to="/login" className="hover:text-primary transition-colors">Sign In Portal</Link>
            </li>
            <li>
              <Link to="/signup" className="hover:text-primary transition-colors">Create Account</Link>
            </li>
            <li>
              <a href="#about" className="hover:text-primary transition-colors">Platform About</a>
            </li>
          </ul>
        </div>

        {/* Categories list */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold text-neutral-primary uppercase tracking-wider">Top Categories</h3>
          <ul className="space-y-2 text-xs font-semibold text-neutral-secondary">
            <li>
              <Link to="/events?category=Technology" className="hover:text-primary transition-colors">Technology</Link>
            </li>
            <li>
              <Link to="/events?category=Music" className="hover:text-primary transition-colors">Music</Link>
            </li>
            <li>
              <Link to="/events?category=Business" className="hover:text-primary transition-colors">Business</Link>
            </li>
            <li>
              <Link to="/events?category=Workshops" className="hover:text-primary transition-colors">Workshops</Link>
            </li>
          </ul>
        </div>

        {/* Contacts details */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold text-neutral-primary uppercase tracking-wider">Get in Touch</h3>
          <ul className="space-y-2.5 text-xs text-neutral-secondary font-medium">
            <li className="flex items-center gap-2">
              <MapPin size={14} className="text-primary-light" />
              <span>Singapore HQ, Downtown Core</span>
            </li>
            <li className="flex items-center gap-2">
              <Phone size={14} className="text-secondary-light" />
              <span>+65 8900 1245</span>
            </li>
            <li className="flex items-center gap-2">
              <Mail size={14} className="text-accent-light" />
              <span>support@eventora.com</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-6 pt-12 mt-12 border-t border-neutral-muted flex flex-col sm:flex-row items-center justify-between text-xs text-neutral-secondary font-medium">
        <div>
          &copy; {new Date().getFullYear()} Eventora Inc. All rights reserved.
        </div>
        <div className="flex gap-4 mt-2 sm:mt-0">
          <a href="#terms" className="hover:text-primary transition-colors">Terms of Service</a>
          <a href="#privacy" className="hover:text-primary transition-colors">Privacy Policy</a>
        </div>
      </div>
    </footer>
  );
};

export default PublicFooter;
