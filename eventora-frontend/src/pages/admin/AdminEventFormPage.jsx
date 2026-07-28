import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as zod from "zod";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import eventService from "../../services/eventService";
import Button from "../../components/Button";
import Input from "../../components/Input";
import toast from "react-hot-toast";

const eventSchema = zod.object({
  title: zod.string().min(3, "Title must be at least 3 characters"),
  description: zod.string().min(10, "Description must be at least 10 characters"),
  category: zod.string().min(2, "Category is required"),
  imageUrl: zod.string().url("Must be a valid URL").optional().or(zod.literal("")),
  venue: zod.string().min(2, "Venue is required"),
  city: zod.string().min(2, "City is required"),
  eventDate: zod.string().min(1, "Date is required"),
  eventTime: zod.string().min(1, "Time is required"),
  ticketPrice: zod.coerce.number().min(0, "Price must be positive"),
  availableTicketCount: zod.coerce.number().min(0, "Ticket count must be positive"),
  reservedTickets: zod.coerce.number().min(0).optional(),
  status: zod.enum(["DRAFT", "PUBLISHED", "CANCELLED"]),
});

export const AdminEventFormPage = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isEditing = !!eventId;

  const { data: eventToEdit, isLoading: isFetching } = useQuery({
    queryKey: ["admin-event", eventId],
    queryFn: () => eventService.getEventDetails(eventId),
    enabled: isEditing,
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      status: "PUBLISHED",
      ticketPrice: 0,
      availableTicketCount: 100,
      reservedTickets: 0,
    }
  });

  useEffect(() => {
    if (eventToEdit) {
      reset({
        title: eventToEdit.title,
        description: eventToEdit.description,
        category: eventToEdit.category,
        imageUrl: eventToEdit.imageUrl || "",
        venue: eventToEdit.venue,
        city: eventToEdit.city,
        eventDate: eventToEdit.date ? new Date(eventToEdit.date).toISOString().split('T')[0] : "",
        eventTime: eventToEdit.eventTime || "",
        ticketPrice: eventToEdit.price,
        availableTicketCount: eventToEdit.ticketsAvailable,
        reservedTickets: eventToEdit.reservedTickets || 0,
        status: eventToEdit.status || "PUBLISHED",
      });
    }
  }, [eventToEdit, reset]);

  const saveMutation = useMutation({
    mutationFn: (data) => isEditing ? eventService.updateEvent(eventId, data) : eventService.createEvent(data),
    onSuccess: () => {
      toast.success(`Event ${isEditing ? 'updated' : 'created'} successfully`);
      queryClient.invalidateQueries({ queryKey: ["admin-events"] });
      queryClient.invalidateQueries({ queryKey: ["events"] });
      navigate("/admin/events");
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || `Failed to ${isEditing ? 'update' : 'create'} event`);
    }
  });

  const onSubmit = (data) => {
    // Format date properly to ISO string if needed by backend, though YYYY-MM-DD should be fine
    const payload = { ...data };
    if (!payload.eventDate.includes('T')) {
       payload.eventDate = new Date(payload.eventDate).toISOString();
    }
    saveMutation.mutate(payload);
  };

  if (isEditing && isFetching) {
    return <div className="p-8 text-center text-neutral-secondary">Loading event details...</div>;
  }

  return (
    <div className="p-3 md:p-4 lg:p-6 space-y-4 max-w-4xl mx-auto">
      <div className="flex items-center gap-4">
        <button 
          onClick={() => navigate("/admin/events")}
          className="p-2 bg-neutral-white border border-neutral-muted rounded-xl hover:bg-neutral-light transition-colors"
        >
          <ArrowLeft size={18} />
        </button>
        <div>
          <h1 className="text-2xl md:text-3xl font-black tracking-tight text-neutral-primary">
            {isEditing ? "Edit Event" : "Create New Event"}
          </h1>
          <p className="text-sm text-neutral-secondary mt-1">
            Fill in the details below to {isEditing ? "update the" : "publish a new"} event.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-neutral-white p-6 rounded-[24px] border border-neutral-muted shadow-sm">
        
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-neutral-primary border-b border-neutral-100 pb-2">Basic Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Event Title" placeholder="e.g. Summer Music Fest" error={errors.title?.message} {...register("title")} className="md:col-span-2" />
            <Input label="Category" placeholder="e.g. Music, Tech, Workshop" error={errors.category?.message} {...register("category")} className="md:col-span-2" />
            <Input label="Image URL (Banner)" placeholder="https://example.com/image.jpg" error={errors.imageUrl?.message} {...register("imageUrl")} />
            
            <div className="flex flex-col gap-1.5 w-full">
              <label className="text-xs font-semibold text-neutral-secondary uppercase tracking-wider">Status</label>
              <select 
                {...register("status")}
                className="w-full px-3 py-2.5 text-sm bg-neutral-white border border-neutral-border rounded-lg shadow-soft outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              >
                <option value="DRAFT">Draft</option>
                <option value="PUBLISHED">Published</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
              {errors.status && <span className="text-xs font-medium text-danger mt-0.5">{errors.status.message}</span>}
            </div>
            <div className="md:col-span-2 flex flex-col gap-1.5 w-full">
              <label className="text-xs font-semibold text-neutral-secondary uppercase tracking-wider">Description</label>
              <textarea 
                {...register("description")}
                placeholder="Detailed event description..."
                className={`w-full px-3 py-2.5 text-sm bg-neutral-white border rounded-lg shadow-soft outline-none min-h-[100px] ${errors.description ? 'border-danger focus:ring-danger/20' : 'border-neutral-border focus:border-primary focus:ring-primary/20'}`}
              />
              {errors.description && <span className="text-xs font-medium text-danger mt-0.5">{errors.description.message}</span>}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-bold text-neutral-primary border-b border-neutral-100 pb-2">Date & Location</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input type="date" label="Event Date" error={errors.eventDate?.message} {...register("eventDate")} />
            <Input type="time" label="Event Time" placeholder="e.g. 18:00" error={errors.eventTime?.message} {...register("eventTime")} />
            <Input label="Venue / Building" placeholder="e.g. Madison Square Garden" error={errors.venue?.message} {...register("venue")} />
            <Input label="City" placeholder="e.g. New York" error={errors.city?.message} {...register("city")} />
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-bold text-neutral-primary border-b border-neutral-100 pb-2">Ticketing</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input type="number" label="Ticket Price (₹)" placeholder="0.00" step="0.01" error={errors.ticketPrice?.message} {...register("ticketPrice")} />
            <Input type="number" label="Total Capacity" placeholder="100" error={errors.availableTicketCount?.message} {...register("availableTicketCount")} />
            <Input type="number" label="Reserved Tickets" placeholder="0" {...register("reservedTickets")} />
          </div>
        </div>

        <div className="pt-4 border-t border-neutral-muted flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={() => navigate("/admin/events")}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" isLoading={isSubmitting || saveMutation.isPending} className="px-8">
            {isEditing ? "Save Changes" : "Create Event"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AdminEventFormPage;
