import { useState, useEffect } from "react";
import toast from "react-hot-toast";

export const useFavorites = () => {
  const [favorites, setFavorites] = useState(() => {
    try {
      const saved = localStorage.getItem("eventora_favorites");
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("eventora_favorites", JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = (eventId) => {
    if (!eventId) return;
    
    setFavorites((prev) => {
      if (prev.includes(eventId)) {
        toast.success("Removed from favorites");
        return prev.filter((id) => id !== eventId);
      } else {
        toast.success("Added to favorites!");
        return [...prev, eventId];
      }
    });
  };

  const isFavorite = (eventId) => {
    if (!eventId) return false;
    return favorites.includes(eventId);
  };

  return { favorites, toggleFavorite, isFavorite };
};

export default useFavorites;
