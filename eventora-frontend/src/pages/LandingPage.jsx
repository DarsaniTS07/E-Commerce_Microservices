import React from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import Hero from "../components/Hero";
import SearchBar from "../components/SearchBar";
import CategoryCarousel from "../components/CategoryCarousel";
import EventCard from "../components/EventCard";
import SectionHeader from "../components/SectionHeader";
import eventService from "../services/eventService";
import { ArrowRight } from "lucide-react";
import Button from "../components/Button";
import toast from "react-hot-toast";

export const LandingPage = () => {
  const navigate = useNavigate();

  const { data: featuredData, isLoading: isFeaturedLoading } = useQuery({
    queryKey: ["events", "featured"],
    queryFn: () => eventService.listEvents({ page: 1, limit: 3 }),
  });

  const { data: popularData, isLoading: isPopularLoading } = useQuery({
    queryKey: ["events", "popular"],
    queryFn: () => eventService.listEvents({ page: 1, limit: 3 }),
  });

  const handleSearch = ({ query, city, date }) => {
    const params = new URLSearchParams();
    if (query) params.append("search", query);
    if (city) params.append("city", city);
    if (date) params.append("date", date);
    navigate(`/events?${params.toString()}`);
  };

  const handleCategorySelect = (category) => {
    if (category) {
      navigate(`/events?category=${encodeURIComponent(category)}`);
    }
  };

  const handleBookEvent = (event) => {
    toast.success(`Redirecting to checkout for: ${event.title}!`);
  };

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <Hero
        onPrimaryClick={() => navigate("/events")}
        onSecondaryClick={() => toast.success("Feature demo video coming soon!")}
      />

      {/* Floating Search Bar */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 -mt-24 relative z-20 flex justify-center">
        <SearchBar onSearch={handleSearch} />
      </div>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 pt-6" id="categories">
        <SectionHeader
          title="Browse by Category"
          subtitle="Explore curated experiences tailored to your professional and leisure interests."
        />
        <CategoryCarousel onSelectCategory={handleCategorySelect} />
      </section>

      {/* Featured Events */}
      <section className="max-w-7xl mx-auto px-4 md:px-6">
        <SectionHeader
          title="Featured Events"
          subtitle="Handpicked premium conferences, festivals, and summits you cannot afford to miss."
        >
          <Button
            variant="ghost"
            onClick={() => navigate("/events")}
            className="text-primary font-bold flex items-center gap-1 text-sm cursor-pointer"
          >
            View All
            <ArrowRight size={14} />
          </Button>
        </SectionHeader>

        {isFeaturedLoading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-80 rounded-2xl bg-neutral-light border border-neutral-muted animate-pulse"></div>
            ))}
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featuredData?.events?.slice(0, 3).map((event) => (
              <EventCard key={event.eventId} event={event} onBook={handleBookEvent} />
            ))}
          </div>
        )}
      </section>

      {/* Trust Stats Bar */}
      <section className="bg-brand-gradient py-12 text-neutral-white shadow-soft relative overflow-hidden">
        <div className="absolute inset-0 bg-neutral-primary/5 opacity-20 mix-blend-overlay"></div>
        <div className="max-w-7xl mx-auto px-4 md:px-6 grid gap-8 grid-cols-2 md:grid-cols-4 text-center relative z-10">
          <div>
            <p className="text-3xl sm:text-4xl font-extrabold">100k+</p>
            <p className="text-xs text-neutral-white/80 font-bold uppercase tracking-wider mt-1">Tickets Sold</p>
          </div>
          <div>
            <p className="text-3xl sm:text-4xl font-extrabold">500+</p>
            <p className="text-xs text-neutral-white/80 font-bold uppercase tracking-wider mt-1">Organizers</p>
          </div>
          <div>
            <p className="text-3xl sm:text-4xl font-extrabold">99.9%</p>
            <p className="text-xs text-neutral-white/80 font-bold uppercase tracking-wider mt-1">Uptime SLA</p>
          </div>
          <div>
            <p className="text-3xl sm:text-4xl font-extrabold">24/7</p>
            <p className="text-xs text-neutral-white/80 font-bold uppercase tracking-wider mt-1">Support Desk</p>
          </div>
        </div>
      </section>

      {/* Trending Events */}
      <section className="max-w-7xl mx-auto px-4 md:px-6">
        <SectionHeader
          title="Trending Events"
          subtitle="See what the community is booking right now."
        />

        {isPopularLoading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-80 rounded-2xl bg-neutral-light border border-neutral-muted animate-pulse"></div>
            ))}
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {popularData?.events?.slice(0, 3).map((event) => (
              <EventCard key={event.eventId} event={event} onBook={handleBookEvent} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default LandingPage;
