import React, { useState } from "react";
import { Search, MapPin, Calendar } from "lucide-react";
import Button from "./Button";

export const SearchBar = ({ onSearch, initialValues = {} }) => {
  const [query, setQuery] = useState(initialValues.query || "");
  const [city, setCity] = useState(initialValues.city || "");
  const [date, setDate] = useState(initialValues.date || "");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch({ query, city, date });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-4xl bg-neutral-white border border-neutral-muted rounded-2xl md:rounded-full shadow-medium p-2.5 md:p-3 flex flex-col md:flex-row items-center gap-3 relative z-20"
    >
      {/* Keyword Search */}
      <div className="flex items-center gap-2.5 px-3 py-1 flex-1 w-full border-b md:border-b-0 md:border-r border-neutral-muted">
        <Search className="text-neutral-secondary shrink-0" size={18} />
        <input
          type="text"
          placeholder="Search for amazing events..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full text-sm text-neutral-primary bg-transparent outline-none placeholder:text-neutral-secondary/50 font-medium"
        />
      </div>

      {/* City Search */}
      <div className="flex items-center gap-2.5 px-3 py-1 flex-1 w-full border-b md:border-b-0 md:border-r border-neutral-muted">
        <MapPin className="text-primary-light shrink-0" size={18} />
        <input
          type="text"
          placeholder="City or location..."
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="w-full text-sm text-neutral-primary bg-transparent outline-none placeholder:text-neutral-secondary/50 font-medium"
        />
      </div>

      {/* Date Picker */}
      <div className="flex items-center gap-2.5 px-3 py-1 w-full md:w-auto md:min-w-[180px]">
        <Calendar className="text-secondary-light shrink-0" size={18} />
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full text-sm text-neutral-primary bg-transparent outline-none placeholder:text-neutral-secondary/50 font-medium cursor-pointer"
        />
      </div>

      {/* Trigger Search Button */}
      <Button
        type="submit"
        variant="primary"
        className="w-full md:w-auto font-bold rounded-xl md:rounded-full px-8 py-3 shadow-soft shrink-0"
      >
        Search
      </Button>
    </form>
  );
};

export default SearchBar;
