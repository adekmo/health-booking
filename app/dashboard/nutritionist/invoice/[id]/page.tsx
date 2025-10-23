"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { Booking } from "@/types/booking";
// import { id } from "date-fns/locale"

const NutritionistInvoicePage = () => {
  const { id } = useParams();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchBooking = async () => {
      try {
        const res = await fetch(`/api/bookings/${id}`);
        if (!res.ok) throw new Error("Failed to fetch booking");
        const data: Booking = await res.json();
        setBooking(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchBooking();
  }, [id]);

  const markAsPaid = async () => {
    if (!id) return;
    try {
      const res = await fetch(`/api/bookings/${id}/pay`, {
        method: "PATCH",
      });
      if (!res.ok) throw new Error("Failed to update payment status");
      const data = await res.json();
      setBooking(data.booking);
      alert("Marked as Paid!");
    } catch (err) {
      console.error(err);
      alert("Failed to mark as paid");
    }
  };

  if (loading)
    return <p className="text-center text-gray-500 mt-10">Loading invoice...</p>;

  if (!booking)
    return <p className="text-center text-red-500 mt-10">Booking not found</p>;
  return (
    <div className="max-w-lg mx-auto mt-10 bg-white shadow-md rounded-xl p-6">
      <h2 className="text-2xl font-semibold mb-4 text-center text-emerald-700">
        Invoice
      </h2>

      <div className="space-y-2 text-gray-700">
        <p>
          <strong>Customer:</strong> {booking.customerId?.name}
        </p>
        <p>
          <strong>Nutritionist:</strong> {booking.nutritionistId?.name}
        </p>
        <p>
            <strong>Date:</strong>{" "}
            {new Date(booking.date).toLocaleString("id-ID", {
                dateStyle: "medium",
                timeStyle: "short",
            })}
        </p>
        <p>
          <strong>Status:</strong> {booking.status}
        </p>
        <p>
          <strong>Payment Status:</strong>
          <span
            className={`ml-2 px-2 py-1 rounded-md text-sm ${
              booking.paymentStatus === "paid"
                ? "bg-green-100 text-green-700"
                : "bg-yellow-100 text-yellow-700"
            }`}
          >
            {booking.paymentStatus}
          </span>
        </p>
        <p>
          <strong>Total Price:</strong>{" "}
          Rp {booking.totalPrice?.toLocaleString("id-ID")}
        </p>
      </div>

      {booking.paymentStatus === "unpaid" && (
        <Button
          className="w-full mt-5 bg-emerald-600 hover:bg-emerald-700 text-white"
          onClick={markAsPaid}
        >
          Tandai Sudah Bayar
        </Button>
      )}

      <Button
        onClick={() => window.print()}
        variant="outline"
        className="w-full mt-3"
        >
        Print Invoice
      </Button>
    </div>
  )
}

export default NutritionistInvoicePage