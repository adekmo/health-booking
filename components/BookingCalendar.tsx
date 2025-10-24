"use client";

import { useEffect, useState } from "react";
// import { Calendar, momentLocalizer, Views, Event as BigCalendarEvent } from "react-big-calendar";
import { Calendar, momentLocalizer, Views } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { Loader2, CalendarDays, User } from "lucide-react";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import CustomerDetailModal from "./CustomerDetailModal";
import { mapBookingData } from "@/lib/bookingUtils";
import { BookingEvent } from "@/types/booking";

const localizer = momentLocalizer(moment);

// type CalendarViewType = 'month' | 'week' | 'day' | 'agenda'; 

const BookingCalendar = () => {
  const [events, setEvents] = useState<BookingEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [filteredBookings, setFilteredBookings] = useState<BookingEvent[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const [currentDate, setCurrentDate] = useState(new Date()); 
  // const [currentView, setCurrentView] = useState<CalendarViewType>(Views.MONTH); 

  const [selectedBooking, setSelectedBooking] = useState<BookingEvent | null>(null);
  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);

  moment.locale("en");

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await fetch("/api/bookings");
        const data = await res.json();

        if (Array.isArray(data)) {
          setEvents(data.map(mapBookingData));
        }
      } catch (error) {
        console.error("Failed to fetch bookings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  // const handleBookingClick = (booking: BookingEvent) => {
  //   setSelectedBooking(booking);
  //   setIsCustomerModalOpen(true);
  // };

  const filterBookingsByDate = (date: Date) => {
    const selected = moment(date).startOf("day");
    
    const sameDayBookings = events.filter((b) =>
      moment(b.start).isSame(selected, "day")
    );

    setFilteredBookings(sameDayBookings);
    setSelectedDate(selected.toDate());
    setIsDialogOpen(true);
  }

  const handleSelectSlot = (slotInfo: { start: Date, end: Date, slots: Date[] | string[], action: "select" | "click" }) => {
    filterBookingsByDate(slotInfo.start);
  };
  
  // const handleSelectEvent = (event: BookingEvent, e: React.SyntheticEvent<HTMLElement>) => {
  //   filterBookingsByDate(event.start); 
  // };
  const handleSelectEvent = (event: BookingEvent) => {
    filterBookingsByDate(event.start);
  };
  
  // const handleViewChange = (view: CalendarViewType) => {
  //     setCurrentView(view); 
  // }
  
  const handleNavigate = (newDate: Date) => {
      setCurrentDate(newDate);
  }

  const eventColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500/30 text-yellow-300";
      case "confirmed":
        return "bg-emerald-500/30 text-emerald-200";
      case "cancelled":
        return "bg-red-500/30 text-red-300";
      default:
        return "bg-gray-500/30 text-gray-300";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] text-gray-200">
        <Loader2 className="animate-spin mr-2" /> Loading calendar...
      </div>
    );
  }

  return (
    <>
      <Card className="relative z-[50] p-4 bg-emerald-950/20 border border-emerald-800/40 text-gray-100 rounded-xl shadow-lg">
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          views={[Views.MONTH, Views.WEEK, Views.DAY]}
          selectable={true}
          date={currentDate} 
          onNavigate={handleNavigate} 
          // onView={handleViewChange}
          
          onSelectSlot={handleSelectSlot}
          onSelectEvent={handleSelectEvent}
          
          defaultView={Views.MONTH}
          style={{ height: 600 }}
          eventPropGetter={(event: BookingEvent) => {
            let bgColor = "";
            switch (event.status) {
              case "pending":
                bgColor = "#facc15";
                break;
              case "confirmed":
                bgColor = "#10b981";
                break;
              case "cancelled":
                bgColor = "#ef4444";
                break;
              default:
                bgColor = "#6b7280";
            }
            return {
              style: {
                backgroundColor: bgColor,
                borderRadius: "6px",
                color: "#0f172a",
                border: "none",
                padding: "4px",
              },
            };
          }}
        />
      </Card>

      {/* Modal Booking List */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen} modal={false}> 
        <DialogContent className="z-[9999] bg-gray-900 border-emerald-800/50 text-gray-100 max-w-md sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-lg text-emerald-400 flex items-center gap-2">
              <CalendarDays className="w-5 h-5" />
              Bookings on{" "}
              {selectedDate && moment(selectedDate).format("LL")}
            </DialogTitle>
          </DialogHeader>

          {filteredBookings.length === 0 ? (
            <p className="text-gray-400 text-sm text-center mt-4">
              No bookings found on this date.
            </p>
          ) : (
            <div className="space-y-3 mt-3 max-h-[70vh] overflow-y-auto pr-2">
              {filteredBookings
                .sort((a, b) => a.start.getTime() - b.start.getTime())
                .map((b) => (
                  <Card
                    key={b._id}
                    onClick={() => {
                        setSelectedBooking(b);
                        setIsCustomerModalOpen(true);
                    }}
                    className="bg-emerald-500/10 border-emerald-700/30 p-3"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium text-gray-100">
                          <User className="inline w-4 h-4 mr-1 text-emerald-400" />
                          {b.title}
                        </p>
                        <p className="text-sm text-gray-400">
                          {moment(b.start).format("LT")} - {moment(b.end).format("LT")}
                        </p>
                      </div>
                      <div className="flex gap-3">
                        <Badge className={`${eventColor(b.status)} border-none`}>
                        {b.status}
                      </Badge>
                      <Badge className="cursor-pointer bg-white/10">
                        <p>Detail</p>
                      </Badge>
                      </div>
                    </div>
                    {b.note && (
                      <p className="text-sm text-gray-300 mt-2 italic">
                        “{b.note}”
                      </p>
                    )}
                  </Card>
                ))}
            </div>
          )}

          <div className="flex justify-end mt-4">
            <Button
              variant="outline"
              onClick={() => setIsDialogOpen(false)}
              className="text-gray-100 border-emerald-700 bg-gray-800/20 hover:bg-emerald-700/20"
            >
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <CustomerDetailModal
        open={isCustomerModalOpen}
        onClose={() => setIsCustomerModalOpen(false)}
        booking={selectedBooking}
      />
    </>
  )
}

export default BookingCalendar;