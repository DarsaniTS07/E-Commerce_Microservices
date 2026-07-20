import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import SearchBar from "../components/SearchBar";
import FilterBar from "../components/FilterBar";
import CategoryCarousel from "../components/CategoryCarousel";
import EventCard from "../components/EventCard";
import SectionHeader from "../components/SectionHeader";
import eventService from "../services/eventService";
import cartService from "../services/cartService";
import { Inbox, ChevronLeft, ChevronRight } from "lucide-react";
import Button from "../components/Button";
import toast from "react-hot-toast";

export const HomePage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Local states for page management
  const page = parseInt(searchParams.get("page") || "1", 10);
  const search = searchParams.get("search") || "";
  const city = searchParams.get("city") || "";
  const category = searchParams.get("category") || "";
  const date = searchParams.get("date") || "";
  const price = searchParams.get("price") || "";
  const trending = searchParams.get("trending") === "true";

  // Package filters for API transmission
  const filters = { date, price, trending };

  // Query events
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["events", { page, search, city, category, date, price, trending }],
    queryFn: () =>
      eventService.listEvents({
        page,
        limit: 10,
        search,
        city,
        category,
        date,
        price,
        trending,
      }),
  });

  const updateParams = (newParams) => {
    const nextParams = new URLSearchParams(searchParams);
    Object.entries(newParams).forEach(([key, val]) => {
      if (val === null || val === undefined || val === "" || val === false) {
        nextParams.delete(key);
      } else {
        nextParams.set(key, String(val));
      }
    });
    // Reset page back to 1 on filter changes
    if (!newParams.page) {
      nextParams.delete("page");
    }
    setSearchParams(nextParams);
  };

  const handleSearch = ({ query, city: searchCity, date: searchDate }) => {
    updateParams({ search: query, city: searchCity, date: searchDate });
  };

  const handleCategorySelect = (selectedCat) => {
    updateParams({ category: selectedCat });
  };

  const handleFilterChange = (key, val) => {
    updateParams({ [key]: val });
  };

  const handleClearFilters = () => {
    setSearchParams(new URLSearchParams());
  };

  const navigate = useNavigate();

  const handleBookEvent = async (event) => {
    console.log("Booking event:", event);
    const toastId = toast.loading(`Adding ${event.title} to cart...`);
    try {
      const result = await cartService.addToCart(event.eventId || event.id, 1);
      
      if (result && result.alreadyInCart) {
        toast.success("Event is already in your cart!", { id: toastId });
      } else {
        toast.success("Added to cart successfully!", { id: toastId });
      }
      
      navigate("/cart");
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.response?.data?.error || "Failed to add to cart.";
      toast.error(errorMsg, { id: toastId });
    }
  };

  return (
    <div className="space-y-8 py-8">
      {/* Top Search Area */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 flex justify-center">
        <SearchBar onSearch={handleSearch} initialValues={{ query: search, city, date }} />
      </div>

      {/* Category Selection */}
      <div className="max-w-7xl mx-auto px-4 md:px-6" id="categories">
        <CategoryCarousel activeCategory={category} onSelectCategory={handleCategorySelect} />
      </div>

      {/* Sticky Filters Header */}
      <FilterBar
        filters={filters}
        onFilterChange={handleFilterChange}
        onClearFilters={handleClearFilters}
      />

      {/* Main Events Grids */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 space-y-8">
        <SectionHeader
          title={category ? `${category} Events` : "All Events"}
          subtitle={
            data?.total
              ? `Showing ${data.events.length} of ${data.total} premium events`
              : "Discover professional and recreational events"
          }
        />

        {isLoading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="h-80 rounded-2xl bg-neutral-light border border-neutral-muted animate-pulse"></div>
            ))}
          </div>
        ) : isError ? (
          <div className="p-8 border border-danger-light bg-danger-lightest rounded-xl text-center">
            <p className="text-danger font-semibold">{error.message || "Failed to load events. Please try again."}</p>
            <Button variant="outline" className="mt-4" onClick={() => window.location.reload()}>
              Reload Page
            </Button>
          </div>
        ) : !data?.events || data.events.length === 0 ? (
          /* Empty State */
          <div className="flex flex-col items-center justify-center py-20 text-center border border-dashed border-neutral-border rounded-2xl bg-neutral-white p-6">
            <div className="h-16 w-16 bg-neutral-light rounded-full flex items-center justify-center text-neutral-secondary mb-4 shadow-soft">
              <Inbox size={28} />
            </div>
            <h3 className="text-lg font-bold text-neutral-primary">No events found</h3>
            <p className="text-sm text-neutral-secondary mt-1.5 max-w-sm">
              We couldn't find any matches. Try adjusting your query or clear active search parameter configurations.
            </p>
            <Button variant="primary" className="mt-5 font-bold" onClick={handleClearFilters}>
              Clear All Filters
            </Button>
          </div>
        ) : (
          /* Event list grid */
          <div className="space-y-10">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {data.events.map((event) => (
                <EventCard key={event.eventId} event={event} onBook={handleBookEvent} />
              ))}
            </div>

            {/* Pagination Controls */}
            {data.pages > 1 && (
              <div className="flex items-center justify-center gap-4 pt-6 border-t border-neutral-muted">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page <= 1}
                  onClick={() => updateParams({ page: page - 1 })}
                  className="flex items-center gap-1 cursor-pointer"
                >
                  <ChevronLeft size={16} />
                  Prev
                </Button>
                <span className="text-xs font-semibold text-neutral-secondary">
                  Page <span className="text-neutral-primary font-bold">{page}</span> of {data.pages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page >= data.pages}
                  onClick={() => updateParams({ page: page + 1 })}
                  className="flex items-center gap-1 cursor-pointer"
                >
                  Next
                  <ChevronRight size={16} />
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
