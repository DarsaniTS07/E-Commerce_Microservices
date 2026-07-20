import React, { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import useFavorites from "../hooks/useFavorites";
import eventService from "../services/eventService";
import cartService from "../services/cartService";
import EventCard from "../components/EventCard";
import SectionHeader from "../components/SectionHeader";
import Button from "../components/Button";
import toast from "react-hot-toast";

export const FavoritesPage = () => {
  const { favorites } = useFavorites();
  const [favoriteEvents, setFavoriteEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchFavoriteEvents();
  }, [favorites]); // Refetch if favorites change (though technically they shouldn't change from outside this page unless un-favorited)

  const fetchFavoriteEvents = async () => {
    if (!favorites || favorites.length === 0) {
      setFavoriteEvents([]);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      // Fetch all favorite events concurrently
      const eventPromises = favorites.map(id => eventService.getEventDetails(id).catch(() => null));
      const results = await Promise.all(eventPromises);
      
      // Filter out any failed requests or nulls
      setFavoriteEvents(results.filter(e => e && e.eventId));
    } catch (error) {
      console.error("Failed to load favorites", error);
      toast.error("Could not load your favorite events.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBookEvent = async (event) => {
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
      toast.error("Failed to add to cart. Are you logged in?", { id: toastId });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <SectionHeader 
        title="Your Favorites" 
        subtitle="Events you've saved for later"
      />

      {isLoading ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-80 rounded-2xl bg-neutral-light border border-neutral-muted animate-pulse"></div>
          ))}
        </div>
      ) : favoriteEvents.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center border border-dashed border-neutral-border rounded-2xl bg-neutral-white p-6">
          <div className="h-16 w-16 bg-neutral-light rounded-full flex items-center justify-center text-neutral-secondary mb-4 shadow-soft">
            <Heart size={28} className="text-secondary opacity-50" />
          </div>
          <h3 className="text-lg font-bold text-neutral-primary">No favorites yet</h3>
          <p className="text-sm text-neutral-secondary mt-1.5 max-w-sm">
            You haven't saved any events. Click the heart icon on any event to save it here!
          </p>
          <Link to="/events">
            <Button variant="primary" className="mt-5 font-bold">
              Discover Events
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {favoriteEvents.map((event) => (
            <EventCard 
              key={event.eventId} 
              event={event} 
              onBook={handleBookEvent} 
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default FavoritesPage;
