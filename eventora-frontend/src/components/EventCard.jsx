import React from "react";
import { Calendar, MapPin, Ticket, Heart, Share2, ArrowRight } from "lucide-react";
import { format, parseISO } from "date-fns";
import toast from "react-hot-toast";
import { cn } from "../utils/cn";
import Badge from "./Badge";
import Button from "./Button";
import useFavorites from "../hooks/useFavorites";

export const EventCard = ({ event, onBook }) => {
  const { toggleFavorite, isFavorite } = useFavorites();

  const {
    id,
    eventId, // backend could use eventId or id
    title,
    description,
    date,
    city,
    category,
    price,
    ticketsAvailable,
    imageUrl,
  } = event;

  const targetId = id || eventId;

  const handleShare = (e) => {
    e.stopPropagation();
    const url = `${window.location.origin}/events/${targetId}`;
    navigator.clipboard.writeText(url);
    toast.success("Event link copied to clipboard!");
  };

  const handleFavorite = (e) => {
    e.stopPropagation();
    toggleFavorite(targetId);
  };

  const formatDate = (dateStr) => {
    try {
      return format(parseISO(dateStr), "MMM dd, yyyy • h:mm a");
    } catch (e) {
      return dateStr;
    }
  };

  const categoryGradients = {
    technology: "from-purple-600 via-indigo-600 to-blue-600",
    music: "from-pink-600 via-red-500 to-orange-500",
    business: "from-blue-600 via-teal-500 to-emerald-500",
    education: "from-indigo-600 via-purple-500 to-pink-500",
    culture: "from-red-600 via-pink-500 to-rose-500",
    sports: "from-orange-600 via-amber-500 to-yellow-500",
    food: "from-amber-600 via-orange-500 to-red-500",
    comedy: "from-fuchsia-600 via-pink-500 to-rose-500",
    arts: "from-violet-600 via-purple-500 to-indigo-500",
    workshops: "from-emerald-600 via-teal-500 to-cyan-500",
  };

  const gradient = categoryGradients[category?.toLowerCase()] || "from-purple-600 via-pink-600 to-orange-500";

  return (
    <div className="group flex flex-col bg-neutral-white border border-neutral-muted rounded-2xl shadow-soft hover:shadow-premium transition-all duration-300 overflow-hidden relative">
      {/* Banner */}
      <div 
        className={cn("h-44 w-full bg-gradient-to-br flex flex-col justify-between p-4 relative overflow-hidden", !imageUrl && gradient)}
        style={imageUrl ? { backgroundImage: `url(${imageUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}
      >
        <div className="absolute inset-0 bg-neutral-primary/10 opacity-30 mix-blend-overlay"></div>
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-neutral-white/10 rounded-full blur-2xl group-hover:scale-110 transition-transform duration-300"></div>

        <div className="flex justify-between items-center z-10 w-full">
          <Badge variant="primary" className="bg-neutral-white/95 text-neutral-primary border-transparent backdrop-blur-md shadow-soft capitalize">
            {category}
          </Badge>
          <div className="flex gap-2">
            <button
              onClick={handleFavorite}
              className="p-2 rounded-xl bg-neutral-white/20 hover:bg-neutral-white/35 backdrop-blur-md text-neutral-white transition-all shadow-soft active:scale-95 cursor-pointer"
            >
              <Heart size={14} className={cn("transition-colors", isFavorite(targetId) ? "fill-secondary stroke-secondary" : "stroke-current")} />
            </button>
            <button
              onClick={handleShare}
              className="p-2 rounded-xl bg-neutral-white/20 hover:bg-neutral-white/35 backdrop-blur-md text-neutral-white transition-all shadow-soft active:scale-95 cursor-pointer"
            >
              <Share2 size={14} />
            </button>
          </div>
        </div>

        <div className="z-10 bg-neutral-white/10 backdrop-blur-md border border-neutral-white/10 text-neutral-white text-xs font-semibold px-2.5 py-1.5 rounded-lg w-fit flex items-center gap-1.5">
          <Calendar size={12} />
          {formatDate(date)}
        </div>
      </div>

      {/* Details Content */}
      <div className="p-5 flex flex-col flex-1 justify-between gap-5">
        <div className="space-y-2">
          <h3 className="font-bold text-base text-neutral-primary line-clamp-1 group-hover:text-primary transition-colors leading-tight">
            {title}
          </h3>
          <p className="text-xs text-neutral-secondary line-clamp-2 leading-relaxed">
            {description || "Join us for an exclusive experience with Eventora. Book your seats today!"}
          </p>
        </div>

        <div className="space-y-2 text-xs text-neutral-secondary font-medium">
          <div className="flex items-center gap-2">
            <MapPin size={14} className="text-primary-light" />
            <span className="truncate">{city}</span>
          </div>
          <div className="flex items-center gap-2">
            <Ticket size={14} className="text-secondary-light" />
            <span>
              {ticketsAvailable > 0 ? (
                <>
                  <span className="font-bold text-neutral-primary">{ticketsAvailable}</span> tickets left
                </>
              ) : (
                <span className="text-danger font-semibold">Sold out</span>
              )}
            </span>
          </div>
        </div>

        {/* Action Bar */}
        <div className="flex items-center justify-between pt-4 border-t border-neutral-muted mt-auto">
          <div className="flex flex-col">
            <span className="text-[9px] uppercase font-bold text-neutral-secondary tracking-widest">Price</span>
            <span className="text-base font-extrabold text-neutral-primary leading-tight">
              {price > 0 ? `₹${price}` : "Free"}
            </span>
          </div>

          <Button
            onClick={() => onBook && onBook(event)}
            variant={ticketsAvailable > 0 ? "primary" : "secondary"}
            disabled={ticketsAvailable <= 0}
            className="flex items-center gap-1.5 font-bold shadow-soft hover:shadow-medium text-xs px-3 py-2"
          >
            Book Now
            <ArrowRight size={12} />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
