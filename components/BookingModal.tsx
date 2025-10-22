"use client";

import { useEffect, useMemo, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "react-hot-toast";
import { format, isBefore, startOfDay } from "date-fns";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

interface BookingModalProps {
  nutritionistId: string;
  open: boolean;
  onClose: () => void;
  availableDays: string[];
  availableHours: {
    start: string;
    end: string;
  };
}

const BookingModal = ({ nutritionistId, open, onClose, availableDays, availableHours }: BookingModalProps) => {
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [selectedHour, setSelectedHour] = useState("");
    const [note, setNote] = useState("");
    const [phone, setPhone] = useState("");
    const [loading, setLoading] = useState(false);
    const [bookedTimes, setBookedTimes] = useState<string[]>([]);

    // list jam dari range availableHours
    const timeSlots = useMemo(() => {
      if (!availableHours?.start || !availableHours?.end) return [];
      const [startHour] = availableHours.start.split(":").map(Number);
      const [endHour] = availableHours.end.split(":").map(Number);
      const slots: string[] = [];
      for (let hour = startHour; hour <= endHour; hour++) {
        slots.push(`${hour.toString().padStart(2, "0")}:00`);
      }
      return slots;
    }, [availableHours]);

    useEffect(() => {
      const fetchBookedTimes = async () => {
        if (!selectedDate || !nutritionistId) return;
        try {
          const res = await fetch(
            `/api/bookings/booked-times?nutritionistId=${nutritionistId}&date=${selectedDate.toISOString()}`
          );
          const data = await res.json();
          setBookedTimes(data || []);
        } catch (error) {
          console.error("Failed to fetch booked times", error);
        }
      };
      fetchBookedTimes();
    }, [selectedDate, nutritionistId]);

    const handleBook = async () => {
        if (!selectedDate) return toast.error("Please select a date");
        if (!selectedHour) return toast.error("Please select a time slot");
        setLoading(true);

        const [hours, minutes] = selectedHour.split(":");
        const bookingDate = new Date(selectedDate);
        bookingDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);

        const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            nutritionistId,
            date: bookingDate.toISOString(),
            note,
            phone,
        }),
        });

        setLoading(false);

        if (res.ok) {
            toast.success("Booking created successfully!");
            onClose();
        } else {
           const errorData = await res.json();
           toast.error(errorData.error || "Failed to create booking");
        }
    };

    // mmbtasi tgl yg dipilih
    const disabledDays = (date: Date) => {
      const today = startOfDay(new Date());
      if (isBefore(date, today)) return true; // tidak bisa tanggal sebelum hari ini

      const dayName = date.toLocaleDateString("en-US", { weekday: "long" }).toLowerCase();
      return !availableDays.some((d) => d.toLowerCase() === dayName); // hanya hari yang tersedia
    };
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-emerald-500/20 border-none overflow-auto">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-gray-100">
            Book a Session
          </DialogTitle>
        </DialogHeader>

        <div className="flex gap-5 justify-between space-y-3">
          <div>
            <h4 className="text-gray-100 text-sm mb-2">Select Date</h4>
            <Calendar
              mode="single"
              selected={selectedDate ?? undefined}
              onSelect={(date) => setSelectedDate(date ?? null)}
              disabled={disabledDays}
              className="rounded-md border bg-white"
            />
            {selectedDate && (
              <p className="text-xs text-gray-300 mt-2">
                Selected: {format(selectedDate, "PPP")}
              </p>
            )}
          </div>
          <div className="flex flex-col gap-4 w-full md:w-1/2">
            <div>
              <h4 className="text-gray-100 text-sm mb-2">Select Time</h4>
              <Select onValueChange={setSelectedHour} value={selectedHour}>
                <SelectTrigger className="bg-white/90 text-gray-800">
                  <SelectValue placeholder="Choose available time" />
                </SelectTrigger>
                <SelectContent>
                  {timeSlots.map((time) => {
                    const isBooked = bookedTimes.includes(time);
                    return (
                      <SelectItem
                        key={time}
                        value={time}
                        disabled={isBooked}
                        className={isBooked ? "opacity-50 pointer-events-none" : ""}
                      >
                        {time} {isBooked && "(Booked)"}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>

            <div>
              <h4 className="text-gray-100 text-sm mb-2">Phone Number</h4>
              <Input
                placeholder="08xxxxxxxx"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="bg-white/90 text-gray-800"
              />
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