"use client";

import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, Filter, Eye } from "lucide-react";
import { format } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Booking } from "@/types/booking";
import { getStatusColor } from "@/lib/getStatusColor";
import { motion, AnimatePresence } from "framer-motion";

interface ConsultationNote {
  notes: string;
  recommendation: string;
  fileUrl?: string;
}

const AdminBookingsPage = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");

  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [consultationNote, setConsultationNote] = useState<ConsultationNote | null>(null);
  const [noteLoading, setNoteLoading] = useState(false);

  // Fetch bookings by status (server-side filtering)
  const fetchBookings = async (status: string) => {
    setLoading(true);
    try {
      const query = status === "all" ? "" : `?status=${status}`;
      const res = await fetch(`/api/bookings${query}`);
      const data = await res.json();
      setBookings(data);
    } catch (err) {
      console.error("Failed to load bookings:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings(statusFilter);
  }, [statusFilter]);

  const handleViewDetails = async (booking: Booking) => {
    setSelectedBooking(booking);
    setConsultationNote(null);
    setNoteLoading(true);

    try {
      const res = await fetch(`/api/consultation-note?bookingId=${booking._id}`);
      const data = await res.json();
      if (data && !data.error) setConsultationNote(data);
    } catch (err) {
      console.error("Failed to fetch consultation note:", err);
    } finally {
      setNoteLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-6 text-gray-100">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">All Bookings</h1>

        <div className="flex items-center gap-2">
          <Filter className="text-emerald-400 w-4 h-4" />
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px] bg-gray-800/50 border-gray-700 text-gray-100">
              <SelectValue placeholder="Filter status" />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-700 text-gray-100">
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="confirmed">Confirmed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Loading / Table */}
      {loading ? (
        <div className="flex items-center justify-center min-h-[40vh] text-gray-300">
          <Loader2 className="animate-spin mr-2" /> Loading bookings...
        </div>
      ) : (
        <AnimatePresence mode="wait">
          <motion.div
            key={statusFilter}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
          >
            <Card className="bg-gray-800/40 border border-emerald-800/30 text-gray-100 overflow-x-auto rounded-2xl">
              <CardHeader>
                <CardTitle className="text-gray-100">Bookings List</CardTitle>
              </CardHeader>
              <CardContent>
                {bookings.length === 0 ? (
                  <p className="text-gray-400 text-center py-6">No bookings found.</p>
                ) : (
                  <table className="w-full text-left text-gray-200">
                    <thead>
                      <tr className="bg-emerald-900/30 text-emerald-300 text-left">
                        <th className="p-3">Customer</th>
                        <th className="p-3">Nutritionist</th>
                        <th className="p-3">Date</th>
                        <th className="p-3">Status</th>
                        <th className="p-3 text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bookings.map((booking) => (
                        <tr key={booking._id} className="border-b border-gray-700/50">
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
                )}
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>
      )}

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
  );
};

export default AdminBookingsPage;
