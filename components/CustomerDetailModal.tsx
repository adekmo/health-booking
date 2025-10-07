"use client";

import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, User, Phone, Mail } from "lucide-react";
import moment from "moment";

/** jika nanti mau share type: pindahkan ke /types/calendar.ts dan import dari sana */
export type CalendarCustomer = {
  name?: string;
  email?: string;
};

export type BookingEvent = {
  _id: string;
  title: string;
  start: Date | string;
  end: Date | string;
  status: "pending" | "confirmed" | "cancelled" | string;
  note?: string;
  phone?: string;
  customerId?: CalendarCustomer;
};

interface CustomerDetailModalProps {
  open: boolean;
  onClose: () => void;
  booking: BookingEvent | null;
}

const CustomerDetailModal: React.FC<CustomerDetailModalProps> = ({ open, onClose, booking }) => {
  if (!booking) return null;

  // booking.start bisa berupa Date atau string (api), normalisasi ke Date
  const start = typeof booking.start === "string" ? new Date(booking.start) : booking.start;
  const customer = booking.customerId ?? { name: booking.title };
  const phoneNumber = booking.phone ?? "";
  const whatsappLink = phoneNumber ? `https://wa.me/${phoneNumber.replace(/\D/g, "")}` : null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-gray-900 border border-emerald-800/50 text-gray-100 max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg text-emerald-400 flex items-center gap-2">
            <User className="w-5 h-5" />
            Customer Details
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-400">Name</p>
            <p className="font-medium text-gray-100">{customer.name ?? "Unknown"}</p>
          </div>

          <div>
            <p className="text-sm text-gray-400">Email</p>
            <p className="font-medium text-gray-100 flex items-center gap-2">
              <Mail className="w-4 h-4 text-emerald-400" />
              {customer.email ?? "-"}
            </p>
          </div>

          {phoneNumber && (
            <div>
              <p className="text-sm text-gray-400">Phone</p>
              <p className="font-medium text-gray-100 flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-400" />
                {phoneNumber}
              </p>
            </div>
          )}

          <div>
            <p className="text-sm text-gray-400">Appointment</p>
            <p className="font-medium text-gray-100 flex items-center gap-2">
              <CalendarDays className="w-4 h-4 text-emerald-400" />
              {moment(start).format("LLL")}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-400">Status</p>
            <Badge
              className={`${
                booking.status === "pending"
                  ? "bg-yellow-500/30 text-yellow-300"
                  : booking.status === "confirmed"
                  ? "bg-emerald-500/30 text-emerald-200"
                  : "bg-red-500/30 text-red-300"
              } border-none`}
            >
              {booking.status}
            </Badge>
          </div>

          {booking.note && (
            <div>
              <p className="text-sm text-gray-400">Note</p>
              <p className="italic text-gray-300">“{booking.note}”</p>
            </div>
          )}

          {whatsappLink && (
            <div className="pt-2">
              <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="block">
                <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white">
                  Chat via WhatsApp
                </Button>
              </a>
            </div>
          )}
        </div>

        <div className="flex justify-end mt-4">
          <Button variant="outline" onClick={onClose} className="text-gray-100 border-emerald-700 bg-gray-800/20 hover:bg-emerald-700/20">
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CustomerDetailModal;
