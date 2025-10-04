"use client";

import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, CalendarDays, User } from "lucide-react";
import { format } from "date-fns";
import toast from "react-hot-toast";
import type { Booking } from "@/types/booking";

const NutritionistBookingsPage = () => {

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await fetch("/api/bookings");
        const data = await res.json();
        setBookings(data);
      } catch (error) {
        console.error("Failed to load bookings:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

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
  return (
    <div className="min-h-screen p-6 bg-gradient-to-b from-gray-900 via-emerald-900/10 to-gray-900">
      <h1 className="text-2xl font-semibold text-gray-100 mb-6">
        Incoming Bookings
      </h1>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {bookings.map((booking) => (
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
                {format(new Date(booking.date), "PPP")}
              </p>
              <p>
                <span className="text-gray-100 font-medium">Status:</span>{" "}
                <Badge className={`${getStatusColor(booking.status)} border-none`}>
                  {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                </Badge>
              </p>
              {booking.note && (
                <p>
                  <span className="text-gray-100 font-medium">Note:</span>{" "}
                  {booking.note}
                </p>
              )}
            </CardContent>

            <CardFooter className="flex gap-2">
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
              ) : (
                <p className="text-sm text-gray-400 italic">
                  {booking.status === "confirmed"
                    ? "Accepted"
                    : booking.status === "cancelled"
                    ? "Rejected / Cancelled"
                    : ""}
                </p>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default NutritionistBookingsPage