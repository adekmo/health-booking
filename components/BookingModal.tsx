"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "react-hot-toast";
import { format } from "date-fns";

interface BookingModalProps {
  nutritionistId: string;
  open: boolean;
  onClose: () => void;
}

const BookingModal = ({ nutritionistId, open, onClose }: BookingModalProps) => {
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [note, setNote] = useState("");
    const [loading, setLoading] = useState(false);

    const handleBook = async () => {
        if (!selectedDate) return toast.error("Please select a date");
        setLoading(true);

        const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            nutritionistId,
            date: selectedDate,
            note,
        }),
        });

        setLoading(false);

        if (res.ok) {
            toast.success("Booking created successfully!");
            onClose();
        } else {
            toast.error("Failed to create booking");
        }
    };
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-emerald-500/20 border-none">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-gray-100">
            Book a Session
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <h4 className="text-gray-100 text-sm mb-2">Select Date</h4>
            <Calendar
              mode="single"
              selected={selectedDate ?? undefined}
              onSelect={(date) => setSelectedDate(date ?? null)}
              className="rounded-md border bg-white"
            />
            {selectedDate && (
              <p className="text-xs text-gray-300 mt-2">
                Selected: {format(selectedDate, "PPP")}
              </p>
            )}
          </div>

          <div>
            <h4 className="text-gray-100 text-sm mb-2">Note</h4>
            <Textarea
              placeholder="Add a note for the nutritionist..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="bg-white/90 text-gray-800"
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            onClick={handleBook}
            disabled={loading}
            className="w-full bg-emerald-500/30 hover:bg-emerald-500/20 text-gray-100"
          >
            {loading ? "Booking..." : "Confirm Booking"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default BookingModal