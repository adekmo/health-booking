"use client";

import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, Filter, Eye } from "lucide-react";
import { format } from "date-fns";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Booking } from "@/types/booking";

interface ConsultationNote {
  notes: string;
  recommendation: string;
  fileUrl?: string;
}

const AdminBookingsPage = () => {

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");

  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [consultationNote, setConsultationNote] = useState<ConsultationNote | null>(null);
  const [noteLoading, setNoteLoading] = useState(false);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await fetch("/api/bookings");
        const data = await res.json();
        setBookings(data);
        setFilteredBookings(data);
      } catch (err) {
        console.error("Failed to load bookings:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  // Filter by status
  useEffect(() => {
    if (statusFilter === "all") {
      setFilteredBookings(bookings);
    } else {
      setFilteredBookings(bookings.filter((b) => b.status === statusFilter));
    }
  }, [statusFilter, bookings]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500/30 text-yellow-300";
      case "confirmed":
        return "bg-emerald-500/30 text-emerald-300";
      case "cancelled":
        return "bg-red-500/30 text-red-300";
      default:
        return "bg-gray-500/30 text-gray-300";
    }
  };

  // Fetch consultation note for selected booking
  const handleViewDetails = async (booking: Booking) => {
    setSelectedBooking(booking);
    setConsultationNote(null);
    setNoteLoading(true);

    try {
      const res = await fetch(`/api/consultation-note?bookingId=${booking._id}`);
      const data = await res.json();
      if (data && !data.error) {
        setConsultationNote(data);
      }
    } catch (err) {
      console.error("Failed to fetch consultation note:", err);
    } finally {
      setNoteLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] text-gray-300">
        <Loader2 className="animate-spin mr-2" /> Loading bookings...
      </div>
    );
  }
  return (
    <div className="min-h-screen p-6 bg-gray-900 text-gray-100">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">All Bookings</h1>

        <div className="flex items-center gap-2">
          <Filter className="text-emerald-400 w-4 h-4" />
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[150px] bg-gray-800 border-emerald-700/40 text-gray-100">
              <SelectValue placeholder="Filter status" />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 text-gray-100">
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="confirmed">Confirmed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Table */}
      <Card className="bg-gray-800 border-emerald-800/30">
        <CardHeader>
          <CardTitle className="text-gray-100">Bookings List</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredBookings.length === 0 ? (
            <p className="text-gray-400 text-center py-6">
              No bookings found.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-gray-200">
                <thead className="text-gray-400 border-b border-emerald-800/30">
                  <tr>
                    <th className="p-3">Customer</th>
                    <th className="p-3">Nutritionist</th>
                    <th className="p-3">Date</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 text-center">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBookings.map((booking) => (
                    <tr key={booking._id} className="border-b border-gray-700/40">
                      <td className="p-3">
                        <div>
                          <p>{booking.customerId?.name || "Unknown"}</p>
                          <p className="text-xs text-gray-400">{booking.customerId?.email}</p>
                        </div>
                      </td>
                      <td className="p-3">
                        <div>
                          <p>{booking.nutritionistId?.name || "Unknown"}</p>
                          <p className="text-xs text-gray-400">{booking.nutritionistId?.specialization}</p>
                        </div>
                      </td>
                      <td className="p-3">{format(new Date(booking.date), "PPP")}</td>
                      <td className="p-3">
                        <Badge className={`${getStatusColor(booking.status)} border-none`}>
                          {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                        </Badge>
                      </td>
                      <td className="p-3 text-center">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewDetails(booking)}
                          className="border-emerald-700/40 hover:bg-emerald-500/20 text-emerald-400"
                        >
                          <Eye className="w-4 h-4 mr-1" /> View
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Detail Modal */}
      <Dialog open={!!selectedBooking} onOpenChange={() => setSelectedBooking(null)}>
        <DialogContent className="bg-gray-800 border border-emerald-700 text-gray-100 max-w-lg">
          <DialogHeader>
            <DialogTitle>Booking Details</DialogTitle>
            <DialogDescription className="text-gray-400">
              Detailed information and consultation notes (if available)
            </DialogDescription>
          </DialogHeader>

          {selectedBooking && (
            <div className="space-y-3 mt-3">
              <p><span className="font-semibold text-gray-200">Customer:</span> {selectedBooking.customerId?.name}</p>
              <p><span className="font-semibold text-gray-200">Phone:</span> {selectedBooking.phone || '-'}</p>
              <p><span className="font-semibold text-gray-200">Nutritionist:</span> {selectedBooking.nutritionistId?.name}</p>
              <p><span className="font-semibold text-gray-200">Date:</span> {format(new Date(selectedBooking.date), "PPP")}</p>
              <p>
                <span className="font-semibold text-gray-200">Status:</span>{" "}
                <Badge className={`${getStatusColor(selectedBooking.status)} border-none`}>
                  {selectedBooking.status}
                </Badge>
              </p>
              {selectedBooking.note && (
                <p><span className="font-semibold text-gray-200">Note:</span> {selectedBooking.note}</p>
              )}

              <div className="border-t border-gray-700 pt-3">
                <h3 className="font-semibold text-emerald-400 mb-2">Consultation Note</h3>
                {noteLoading ? (
                  <p className="text-gray-400 text-sm">Loading note...</p>
                ) : consultationNote ? (
                  <div className="space-y-2 text-sm">
                    <p><span className="text-gray-300 font-medium">Notes:</span> {consultationNote.notes}</p>
                    <p><span className="text-gray-300 font-medium">Recommendation:</span> {consultationNote.recommendation}</p>
                    {consultationNote.fileUrl && (
                      <a
                        href={consultationNote.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-emerald-400 underline text-sm"
                      >
                        View Attached File
                      </a>
                    )}
                  </div>
                ) : (
                  <p className="text-gray-400 text-sm">No consultation note available.</p>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default AdminBookingsPage