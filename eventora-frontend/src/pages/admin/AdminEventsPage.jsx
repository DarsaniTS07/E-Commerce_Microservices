import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";
import { Plus, Edit2, Trash2, Calendar, MapPin, MoreVertical, Search } from "lucide-react";
import eventService from "../../services/eventService";
import Button from "../../components/Button";
import Input from "../../components/Input";
import toast from "react-hot-toast";
import { cn } from "../../utils/cn";

export const AdminEventsPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [searchVal, setSearchVal] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  
  // Debounce search
  React.useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchVal);
    }, 500);
    return () => clearTimeout(handler);
  }, [searchVal]);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["admin-events", debouncedSearch],
    queryFn: () => eventService.listEvents({ search: debouncedSearch, limit: 100, status: "" }),
    keepPreviousData: true,
  });

  const deleteMutation = useMutation({
    mutationFn: (eventId) => eventService.deleteEvent(eventId),
    onSuccess: () => {
      toast.success("Event deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["admin-events"] });
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Failed to delete event");
    }
  });

  const handleDelete = (eventId, title) => {
    if (window.confirm(`Are you sure you want to delete "${title}"? This cannot be undone.`)) {
      deleteMutation.mutate(eventId);
    }
  };

  const events = data?.events || [];

  return (
    <div className="p-3 md:p-4 lg:p-6 space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-black tracking-tight text-neutral-primary">Manage Events</h1>
          <p className="text-sm text-neutral-secondary mt-1">Create, update, and remove events across the platform.</p>
        </div>
        
        <Link to="/admin/events/new">
          <Button variant="primary" className="font-bold flex items-center gap-2 px-4 py-2.5">
            <Plus size={16} /> Create Event
          </Button>
        </Link>
      </div>

      {/* Filters/Search */}
      <div className="bg-neutral-white p-4 rounded-[16px] border border-neutral-muted shadow-sm flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={16} className="text-neutral-400" />
          </div>
          <input
            type="text"
            className="w-full pl-10 pr-4 py-2.5 bg-neutral-lightest border border-neutral-border rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            placeholder="Search events by title..."
            value={searchVal}
            onChange={(e) => setSearchVal(e.target.value)}
          />
        </div>
      </div>

      {/* Events Table/List */}
      <div className="bg-neutral-white rounded-[24px] border border-neutral-muted shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-neutral-muted bg-neutral-lightest/50">
                <th className="px-6 py-4 text-xs font-bold text-neutral-secondary uppercase tracking-wider">Event Details</th>
                <th className="px-6 py-4 text-xs font-bold text-neutral-secondary uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-neutral-secondary uppercase tracking-wider">Price / Capacity</th>
                <th className="px-6 py-4 text-xs font-bold text-neutral-secondary uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-muted">
              {isLoading ? (
                <tr>
                  <td colSpan="4" className="px-6 py-8 text-center text-neutral-secondary text-sm">
                    Loading events...
                  </td>
                </tr>
              ) : isError ? (
                <tr>
                  <td colSpan="4" className="px-6 py-8 text-center text-red-500 font-semibold text-sm">
                    Failed to load events.
                  </td>
                </tr>
              ) : events.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-6 py-12 text-center text-neutral-secondary text-sm">
                    <p className="font-semibold text-base mb-1 text-neutral-primary">No events found</p>
                    <p>Get started by creating a new event.</p>
                  </td>
                </tr>
              ) : (
                events.map((event) => (
                  <tr key={event.id} className="hover:bg-neutral-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div 
                          className="w-12 h-12 rounded-lg bg-neutral-200 bg-cover bg-center shrink-0 border border-neutral-100"
                          style={{ backgroundImage: `url(${event.imageUrl || 'https://via.placeholder.com/150'})` }}
                        />
                        <div>
                          <div className="font-bold text-neutral-primary">{event.title}</div>
                          <div className="flex items-center gap-3 text-xs text-neutral-secondary mt-1">
                            <span className="flex items-center gap-1"><Calendar size={12}/> {new Date(event.date).toLocaleDateString()}</span>
                            <span className="flex items-center gap-1"><MapPin size={12}/> {event.city}</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={cn(
                        "inline-flex px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border",
                        event.status === 'PUBLISHED' ? "bg-emerald-50 text-emerald-600 border-emerald-200" :
                        event.status === 'DRAFT' ? "bg-neutral-100 text-neutral-600 border-neutral-200" :
                        "bg-red-50 text-red-600 border-red-200"
                      )}>
                        {event.status || 'DRAFT'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-bold text-neutral-primary">₹{event.price}</div>
                      <div className="text-xs text-neutral-secondary mt-1">{event.ticketsAvailable} available</div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant="outline" 
                          className="p-2 h-auto text-neutral-500 hover:text-primary hover:bg-primary/5 border-neutral-200"
                          onClick={() => navigate(`/admin/events/${event.id}/edit`)}
                        >
                          <Edit2 size={16} />
                        </Button>
                        <Button 
                          variant="outline" 
                          className="p-2 h-auto text-neutral-500 hover:text-red-500 hover:bg-red-50 border-neutral-200"
                          onClick={() => handleDelete(event.id, event.title)}
                          disabled={deleteMutation.isPending}
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminEventsPage;
