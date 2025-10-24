"use client";

import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, User, Phone, Mail, Loader2, FileText } from "lucide-react";
import moment from "moment";
import { Separator } from "@/components/ui/separator";
import { BookingEvent, BookingHistory } from "@/types/booking";
import Image from "next/image";


interface CustomerDetailModalProps {
  open: boolean;
  onClose: () => void;
  booking: BookingEvent | null;
}

interface ConsultationNote {
  _id: string;
  notes: string;
  recommendation: string;
  fileUrl?: string;
  createdAt: string;
  nutritionistId: {
    name: string;
    email: string;
  };
}

const CustomerDetailModal: React.FC<CustomerDetailModalProps> = ({ open, onClose, booking }) => {
  const [history, setHistory] = useState<BookingHistory[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  const [consultationNote, setConsultationNote] = useState<ConsultationNote | null>(null);
  const [loadingNote, setLoadingNote] = useState(false);

  useEffect(() => {
    const fetchHistory = async () => {
      if (!booking?.customerId?._id || !booking?._id) return;
      setLoadingHistory(true);
      try {
        const res = await fetch(`/api/bookings/history/${booking.customerId._id}`);
        if (!res.ok) throw new Error("Failed to fetch history");
        const data: BookingHistory[] = await res.json();
        // console.log("📜 Booking History Data:", data);
        setHistory(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingHistory(false);
      }

      setLoadingNote(true);
      try {
        const res = await fetch(`/api/consultation-note?bookingId=${booking._id}`);
        if (!res.ok) throw new Error("Failed to fetch note");
        const data: ConsultationNote | null = await res.json();
        setConsultationNote(data);
      } catch (err) {
        console.error("Error fetching consultation note:", err);
      } finally {
        setLoadingNote(false);
      }
    };
    if (open) fetchHistory();
  }, [open, booking?.customerId?._id, booking?._id]);

  if (!booking) return null;

  const start = typeof booking.start === "string" ? new Date(booking.start) : booking.start;
  const customer = booking.customerId ?? { name: booking.title };
  const phoneNumber = booking.phone ?? customer?.phone ?? "";
  const whatsappLink = phoneNumber ? `https://wa.me/${phoneNumber.replace(/\D/g, "")}` : null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-gray-900 border border-emerald-800/50 text-gray-100 max-w-md max-h-[90vh] overflow-y-auto custom-scrollbar">
        <DialogHeader>
          <DialogTitle className="text-lg text-emerald-400 flex items-center gap-2">
            <User className="w-5 h-5" />
            Customer Details
          </DialogTitle>
          <DialogDescription>
            View customer information and booking history.
          </DialogDescription>
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

          {/* Consultation Note Section */}
          <Separator className="my-4 border-emerald-800/50" />
          <div>
            <h3 className="text-emerald-400 text-sm font-semibold mb-1">Consultation Note</h3>
            {loadingNote ? (
              <div className="flex justify-center py-3">
                <Loader2 className="w-5 h-5 animate-spin text-emerald-400" />
              </div>
            ) : consultationNote ? (
              <div className="space-y-2 bg-gray-800/40 border border-emerald-800/40 p-3 rounded-lg">
                <p className="text-gray-200 text-sm">{consultationNote.notes}</p>
                <p className="text-gray-400 text-xs italic">
                  Rekomendasi: {consultationNote.recommendation}
                </p>

                {consultationNote.fileUrl && (
                  <div className="mt-2">
                    {consultationNote.fileUrl.match(/\.(jpg|jpeg|png|webp)$/i) ? (
                      <Image
                        src={consultationNote.fileUrl}
                        alt="Consultation file"
                        width={200}
                        height={200}
                        className="w-screen h-50 rounded-lg border border-emerald-700/30"
                      />
                    ) : (
                      <a
                        href={consultationNote.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-emerald-400 flex items-center gap-1 text-sm underline"
                      >
                        <FileText className="w-4 h-4" />
                        Lihat File
                      </a>
                    )}
                  </div>
                )}

                <p className="text-xs text-gray-500 mt-2">
                  Dibuat oleh: <span className="text-emerald-300">{consultationNote.nutritionistId?.name}</span> (
                  {moment(consultationNote.createdAt).format("DD MMM YYYY")})
                </p>
              </div>
            ) : (
              <p className="text-gray-500 text-sm italic">Belum ada catatan konsultasi.</p>
            )}
          </div>
          {/* END Consultation Note Section */}

        {/* Riwayat Konsultasi */}
          <Separator className="my-3 border-emerald-800/50" />
          <div>
            <p className="text-emerald-400 text-sm font-semibold mb-1">Riwayat Konsultasi Sebelumnya</p>
            {loadingHistory ? (
              <div className="flex justify-center py-3">
                <Loader2 className="w-5 h-5 animate-spin text-emerald-400" />
              </div>
            ) : history.length === 0 ? (
              <p className="text-sm text-gray-500">Belum ada riwayat konsultasi.</p>
            ) : (
              <ul className="space-y-2 max-h-40 overflow-y-auto pr-1 custom-scrollbar">
                {history.map((h) => (
                  <li
                    key={h._id}
                    className="border border-emerald-800/40 bg-gray-800/50 rounded-lg p-2 text-sm"
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-emerald-300">
                        {moment(h.date).format("DD MMM YYYY")}
                      </span>
                      <Badge
                        className={`text-xs border-none ${
                          h.status === "confirmed"
                            ? "bg-emerald-600/30 text-emerald-200"
                            : h.status === "pending"
                            ? "bg-yellow-600/30 text-yellow-200"
                            : "bg-red-600/30 text-red-200"
                        }`}
                      >
                        {h.status}
                      </Badge>
                    </div>
                    {h.note && (
                      <p className="text-gray-400 text-xs mt-1 italic">“{h.note}”</p>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
          {/* END Riwayat */}
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
