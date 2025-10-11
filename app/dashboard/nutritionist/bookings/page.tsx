"use client";

import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import {Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Loader2, CalendarDays, User, Search, Phone, Mail, X } from "lucide-react";
import { format, isSameDay } from "date-fns";
import toast from "react-hot-toast";
import type { BookingEvent } from "@/types/booking";
import CustomerDetailModal from "@/components/CustomerDetailModal";
import { mapBookingData } from "@/lib/bookingUtils";
import ConsultationForm from "@/components/ConsultationForm";
import { createPortal } from "react-dom";

const NutritionistBookingsPage = () => {

  const [bookings, setBookings] = useState<BookingEvent[]>([]);
  const [filteredBookings, setFilteredBookings] = useState<BookingEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [searchQuery, setSearchQuery] = useState("");

  const [selectedBooking, setSelectedBooking] = useState<BookingEvent | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [openNoteFormId, setOpenNoteFormId] = useState<string | null>(null);
  const currentBooking = bookings.find(b => b._id === openNoteFormId) || null;

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await fetch("/api/bookings");
        const data = await res.json();
        if (Array.isArray(data)) {
          const mapped = data.map(mapBookingData);
          setBookings(mapped);
          setFilteredBookings(mapped);
        }
      } catch (error) {
        console.error("Failed to load bookings:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  useEffect(() => {
    let filtered = bookings;

    if (statusFilter !== "all") {
      filtered = filtered.filter((b) => b.status === statusFilter);
    }

    if (selectedDate) {
      filtered = filtered.filter((b) =>
        isSameDay(new Date(b.start), selectedDate)
      );
    }

    if (searchQuery) {
      filtered = filtered.filter((b) =>
        b.customerId?.name?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredBookings(filtered);
  }, [statusFilter, selectedDate, searchQuery, bookings]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500/30 text-yellow-200";
      case "confirmed":
        return "bg-emerald-500/30 text-emerald-200";
      case "cancelled":
        return "bg-red-500/30 text-red-200";
      default:
        return "bg-gray-500/30 text-gray-200";
    }
  };

  const handleViewDetail = (booking: BookingEvent) => {
    setSelectedBooking(booking);
    setIsDetailOpen(true);
  };

  const handleUpdateStatus = async (id: string, status: "confirmed" | "cancelled") => {
    setProcessingId(id);
    try {
      const res = await fetch(`/api/bookings/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      if (res.ok) {
        setBookings((prev) =>
          prev.map((b) => (b._id === id ? { ...b, status } : b))
        );

        toast.success(
          status === "confirmed"
            ? "Booking accepted successfully!"
            : "Booking rejected successfully!",
          {
            style: {
              background: status === "confirmed" ? "#064e3b" : "#450a0a",
              color: "#f0fdf4",
              border: `1px solid ${
                status === "confirmed" ? "#10b981" : "#ef4444"
              }`,
            },
          }
        );
      } else {
        toast.error("Failed to update booking status.");
      }
    } catch (error) {
      toast.error("Error updating booking. Please try again later.");
    } finally {
      setProcessingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] text-gray-100">
        <Loader2 className="animate-spin mr-2" /> Loading bookings...
      </div>
    );
  }

  if (bookings.length === 0) {
    return (
      <div className="text-center min-h-[60vh] flex flex-col items-center justify-center text-gray-300">
        <CalendarDays className="w-10 h-10 mb-2 text-emerald-400" />
        <p>No incoming bookings yet.</p>
      </div>
    );
  }

  const ConsultationModal = () => {
    if (!currentBooking) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
            {/* Konten Modal Custom */}
            <div className="relative max-w-lg w-full p-6 m-4 rounded-xl bg-gray-900 border border-emerald-700 shadow-2xl">
                {/* Header Modal */}
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold text-gray-100">🩺 Consultation Notes for {currentBooking.customerId?.name}</h2>
                    <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => setOpenNoteFormId(null)}
                        className="text-gray-400"
                    >
                        <X className="w-5 h-5" />
                    </Button>
                </div>
                
                {/* Form Konsultasi */}
                <ConsultationForm
                    bookingId={currentBooking._id}
                    onSuccess={() => {
                        toast.success("Consultation note saved successfully!");
                        setOpenNoteFormId(null);
                    }}
                />
            </div>
        </div>
    );
};

  return (
    <div className="min-h-screen p-6 bg-gradient-to-b from-gray-900 via-emerald-900/10 to-gray-900">
      <h1 className="text-2xl font-semibold text-gray-100 mb-6">
        Incoming Bookings
      </h1>

      {/* --- Filter Section --- */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        {/* Tabs Filter */}
        <Tabs
          value={statusFilter}
          onValueChange={(val) => setStatusFilter(val)}
          className="w-full md:w-auto"
        >
          <TabsList className="bg-emerald-950/30 border border-emerald-800/50">
            <TabsTrigger value="all" className="text-gray-100">All</TabsTrigger>
            <TabsTrigger value="pending" className="text-gray-100">Pending</TabsTrigger>
            <TabsTrigger value="confirmed" className="text-gray-100">Confirmed</TabsTrigger>
            <TabsTrigger value="cancelled" className="text-gray-100">Cancelled</TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Search Input */}
        <div className="relative w-full md:w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search customer..."
            className="pl-8 bg-emerald-950/20 border-emerald-800 text-gray-100"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Date Picker */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="bg-emerald-900/20 text-gray-100 border-emerald-800 hover:bg-emerald-900/40"
            >
              <CalendarDays className="w-4 h-4 mr-2 text-emerald-400" />
              {selectedDate ? format(selectedDate, "PPP") : "Select date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0 bg-emerald-900/20 border border-emerald-800 text-gray-100">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
            />
          </PopoverContent>
        </Popover>
      </div>

      {/* --- Booking List --- */}
      {filteredBookings.length === 0 ? (
        <div className="text-center min-h-[50vh] flex flex-col items-center justify-center text-gray-400">
          <CalendarDays className="w-10 h-10 mb-2 text-emerald-400" />
          <p>No bookings found.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBookings.map((booking) => (
            <Card
              key={booking._id}
              className="bg-emerald-500/10 border-emerald-700/30 text-gray-100 hover:bg-emerald-500/20 transition"
            >
              <CardHeader className="flex flex-col space-y-2">
                <CardTitle className="flex items-center gap-2 text-gray-100 text-lg">
                  <User className="w-4 h-4 text-emerald-400" />
                  {booking.customerId?.name ?? "Unknown Customer"}
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-2 text-sm text-gray-300">
                <p>
                  <span className="text-gray-100 font-medium">Date:</span>{" "}
                  {format(new Date(booking.start), "PPP")}
                </p>
                <p>
                  <span className="text-gray-100 font-medium">Status:</span>{" "}
                  <Badge
                    className={`${getStatusColor(booking.status)} border-none`}
                  >
                    {booking.status.charAt(0).toUpperCase() +
                      booking.status.slice(1)}
                  </Badge>
                </p>
                {booking.note && (
                  <p>
                    <span className="text-gray-100 font-medium">Note:</span>{" "}
                    {booking.note}
                  </p>
                )}
              </CardContent>

              <CardFooter className="flex gap-5 flex-wrap">
                {booking.status === "pending" ? (
                  <>
                    <Button
                      size="sm"
                      className="flex-1 bg-emerald-600 hover:bg-emerald-700"
                      onClick={() => handleUpdateStatus(booking._id, "confirmed")}
                      disabled={processingId === booking._id}
                    >
                      {processingId === booking._id ? "Processing..." : "Accept"}
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      className="flex-1 bg-red-600 hover:bg-red-700"
                      onClick={() => handleUpdateStatus(booking._id, "cancelled")}
                      disabled={processingId === booking._id}
                    >
                      Reject
                    </Button>
                  </>
                ) : booking.status === "confirmed" ? (
                  <>
                    <p className="text-sm text-emerald-400 italic">✅ Accepted</p>
                    <Button
                      size="sm"
                      className="w-full bg-emerald-700 hover:bg-emerald-800"
                      onClick={() => setOpenNoteFormId(booking._id)} // Buka modal custom
                    >
                      Add Consultation Note
                    </Button>
                  </>
                ) : (
                  <p className="text-sm text-gray-400 italic">
                    {booking.status === "cancelled" && "❌ Rejected / Cancelled"}
                  </p>
                )}
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1 text-gray-100 border-emerald-700 bg-gray-800/20 hover:bg-emerald-700/20"
                  onClick={() => handleViewDetail(booking)}
                >
                  View Details
                </Button>
              </CardFooter>
            </Card>
          ))}    
        </div>
      )}

      {openNoteFormId && typeof window !== 'undefined'
          ? createPortal(<ConsultationModal />, document.body)
          : null
      }

      <CustomerDetailModal
        open={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        booking={selectedBooking}
      />
    </div>
  )
}

export default NutritionistBookingsPage