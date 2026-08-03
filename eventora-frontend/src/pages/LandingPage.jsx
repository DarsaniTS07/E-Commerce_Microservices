import React from "react";
import { useNavigate } from "react-router-dom";
import Hero from "../components/Hero";
import useAuth from "../hooks/useAuth";
import toast from "react-hot-toast";
import { Users, CalendarDays, MapPin, Star } from "lucide-react";

export const LandingPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const handleExploreEvents = () => {
    if (isAuthenticated) {
      navigate("/events");
    } else {
      navigate("/login");
    }
  };

  return (
    <div className="bg-neutral-lightest pb-12">
      {/* Hero Section */}
      <Hero
        onPrimaryClick={handleExploreEvents}
        onSecondaryClick={() => toast.success("Feature demo video coming soon!")}
      />

      {/* Stats Bar */}
      <section className="max-w-6xl mx-auto px-4 md:px-6 mt-8 relative z-20">
        <div className="bg-neutral-white rounded-3xl p-6 md:p-8 shadow-soft grid gap-6 grid-cols-2 lg:grid-cols-4 items-center border border-neutral-muted">
          
          <div className="flex items-center gap-4 border-r border-neutral-muted/50 last:border-0 justify-center">
            <div className="w-12 h-12 rounded-full bg-primary-lightest text-primary flex items-center justify-center shrink-0">
              <Users size={24} />
            </div>
            <div>
              <p className="text-xl md:text-2xl font-extrabold text-primary">50K+</p>
              <p className="text-xs text-neutral-secondary font-medium">Happy Users</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4 border-r border-neutral-muted/50 last:border-0 justify-center">
            <div className="w-12 h-12 rounded-full bg-secondary-lightest text-secondary flex items-center justify-center shrink-0">
              <CalendarDays size={24} />
            </div>
            <div>
              <p className="text-xl md:text-2xl font-extrabold text-secondary">10K+</p>
              <p className="text-xs text-neutral-secondary font-medium">Events Hosted</p>
            </div>
          </div>

          <div className="flex items-center gap-4 border-r border-neutral-muted/50 last:border-0 justify-center">
            <div className="w-12 h-12 rounded-full bg-accent-lightest text-accent flex items-center justify-center shrink-0">
              <MapPin size={24} />
            </div>
            <div>
              <p className="text-xl md:text-2xl font-extrabold text-accent">120+</p>
              <p className="text-xs text-neutral-secondary font-medium">Cities Covered</p>
            </div>
          </div>

          <div className="flex items-center gap-4 justify-center">
            <div className="w-12 h-12 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center shrink-0">
              <Star size={24} />
            </div>
            <div>
              <p className="text-xl md:text-2xl font-extrabold text-purple-600">4.8/5</p>
              <p className="text-xs text-neutral-secondary font-medium">Users Love Us</p>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
};

export default LandingPage;
