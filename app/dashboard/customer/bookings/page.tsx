"use client";

import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, CalendarDays, Filter, FileText } from "lucide-react";
import { format } from "date-fns";
import toast from "react-hot-toast";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import type { Booking } from "@/types/booking";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

const CustomerBookingsPage = () => {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [filteredBookings, setFilteredBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedBookingId, setSelectedBookingId] = useState<string | null>(null);
    const [isCancelling, setIsCancelling] = useState(false);
    const [statusFilter, setStatusFilter] = useState("all");
    const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
    const [noteData, setNoteData] = useState<any>(null);
    const [loadingNote, setLoadingNote] = useState(false);

    useEffect(() => {
        const fetchBookings = async () => {
        try {
            const res = await fetch("/api/bookings");
            const data = await res.json();
            setBookings(data);
            setFilteredBookings(data);
        } catch (error) {
            console.error("Failed to load bookings:", error);
        } finally {
            setLoading(false);
        }
        };
        fetchBookings();
    }, []);

    // handle filter by status
  useEffect(() => {
    if (statusFilter === "all") {
      setFilteredBookings(bookings);
    } else {
      setFilteredBookings(bookings.filter((book) => book.status === statusFilter));
    }
  }, [statusFilter, bookings]);

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

    const handleCancelBooking = async (id: string) => {
        setIsCancelling(true);
        try {
        const res = await fetch(`/api/bookings/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status: "cancelled" }),
        });

        if (res.ok) {
            setBookings((prev) =>
            prev.map((b) => (b._id === id ? { ...b, status: "cancelled" } : b))
            );

            toast.success("Booking cancelled successfully!", {
            style: {
                background: "#064e3b",
                color: "#d1fae5",
                border: "1px solid #10b981",
            },
            });
        } else {
            toast.error("Failed to cancel booking. Please try again.");
        }
        } catch (error) {
        toast.error("Error cancelling booking. Please try again later.");
        } finally {
        setIsCancelling(false);
        setSelectedBookingId(null);
        }
    };

    const handleOpenDetail = async (booking: Booking) => {
      setSelectedBooking(booking);
      setLoadingNote(true);
      setNoteData(null);

      try {
        const res = await fetch(`/api/consultation-note?bookingId=${booking._id}`);
        if (res.ok) {
          const data = await res.json();
          setNoteData(data);
        } else {
          setNoteData(null);
        }
      } catch (error) {
        console.error("Error fetching consultation note:", error);
      } finally {
        setLoadingNote(false);
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
            <p>No bookings yet. Start by booking a session with a nutritionist!</p>
        </div>
        );
    }
  return (
    <div className="min-h-screen p-6 bg-gradient-to-b from-gray-900 via-emerald-900/10 to-gray-900">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-gray-100">My Bookings</h1>

        {/* Filter Dropdown */}
        <div className="flex items-center gap-2">
          <Filter className="text-emerald-400 w-4 h-4" />
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[150px] bg-gray-800/40 border border-emerald-700/40 text-gray-100">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-emerald-700/30 text-gray-100">
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="confirmed">Confirmed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBookings.map((booking) => (
          <Card
            key={booking._id}
            className="bg-emerald-500/10 border-emerald-700/30 text-gray-100 hover:bg-emerald-500/20 transition"
          >
            <CardHeader>
              <CardTitle className="text-gray-100 text-lg">
                {booking.nutritionistId?.name ?? "Unknown Nutritionist"}
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
            </CardContent>

            <CardFooter className="flex gap-2">
              {/* Detail button */}
              <Dialog onOpenChange={(open) => !open && setSelectedBooking(null)}>
                <DialogTrigger asChild>
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-200 border-emerald-700/50"
                    onClick={() => handleOpenDetail(booking)}
                  >
                    <FileText className="w-4 h-4 mr-1" />
                    View Details
                  </Button>
                </DialogTrigger>

                <DialogContent className="bg-gray-900/90 text-gray-100 border border-emerald-700/40">
                  <DialogHeader>
                    <DialogTitle>Booking Details</DialogTitle>
                  </DialogHeader>
                  {selectedBooking && (
                    <div className="space-y-2 text-sm mt-2">
                      <p>
                        <strong>Nutritionist:</strong>{" "}
                        {selectedBooking.nutritionistId?.name ?? "Unknown"}
                      </p>
                      <p>
                        <strong>Date:</strong>{" "}
                        {format(new Date(selectedBooking.date), "PPP")}
                      </p>
                      <p>
                        <strong>Status:</strong>{" "}
                        {selectedBooking.status}
                      </p>

                      <hr className="my-3 border-emerald-700/40" />
                      <h4 className="font-semibold text-emerald-300">
                        Consultation Note
                      </h4>

                      {loadingNote ? (
                        <p className="text-gray-400">Loading note...</p>
                      ) : noteData ? (
                        <div className="space-y-2">
                          <p><strong>Notes:</strong> {noteData.notes}</p>
                          <p><strong>Recommendation:</strong> {noteData.recommendation}</p>
                          {noteData.fileUrl && (
                            <a
                              href={noteData.fileUrl}
                              target="_blank"
                              className="text-blue-400 underline"
                            >
                              View attached file
                            </a>
                          )}
                          <p className="text-xs text-gray-400">
                            — by {selectedBooking.nutritionistId?.name}
                          </p>
                        </div>
                      ) : (
                        <p className="text-gray-500 italic">
                          No consultation note yet.
                        </p>
                      )}
                    </div>
                  )}
                </DialogContent>
              </Dialog>

              {/* Cancel button */}
              {booking.status === "pending" && (
                <AlertDialog
                  open={selectedBookingId === booking._id}
                  onOpenChange={(open) =>
                    setSelectedBookingId(open ? booking._id : null)
                  }
                >
                  <AlertDialogTrigger asChild>
                    <Button
                      size="sm"
                      className="flex-1 bg-red-600/20 hover:bg-red-600/30 border-none"
                      onClick={() => setSelectedBookingId(booking._id)}
                    >
                      Cancel
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="bg-gray-800/80 border border-emerald-700 text-gray-100">
                    <AlertDialogHeader>
                      <AlertDialogTitle>Cancel this booking?</AlertDialogTitle>
                      <AlertDialogDescription className="text-gray-400">
                        This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel className="bg-gray-600/40 hover:bg-gray-600 border-none">
                        Close
                      </AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleCancelBooking(booking._id)}
                        className="bg-red-600/40 hover:bg-red-600"
                        disabled={isCancelling}
                      >
                        {isCancelling ? "Cancelling..." : "Confirm"}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default CustomerBookingsPage