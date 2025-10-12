"use client";

import React, { useEffect, useState } from "react";
import ConsultationTrends from "./ConsultationTrends";
import BookingStatusChart from "./BookingStatusChart";
import TopCustomersList from "./TopCustomersList";
import { motion, AnimatePresence } from "framer-motion";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";

interface DashboardInsightsProps {}

interface ConsultationData {
  date: string;
  consultations: number;
}

interface StatusData {
  name: string;
  value: number;
}

interface CustomerData {
  name: string;
  total: number;
}

const DashboardInsights = ({}: DashboardInsightsProps) => {

    const { data: session } = useSession();
    const [consultationData, setConsultationData] = useState<ConsultationData[]>([]);
    const [statusData, setStatusData] = useState<StatusData[]>([]);
    const [topCustomers, setTopCustomers] = useState<CustomerData[]>([]);
    const [range, setRange] = useState("7d");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
    if (!session?.user?.id) return;
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/nutritionist/insights/${session.user.id}?range=${range}`);
        const data = await res.json();
        setConsultationData(data.consultationData || []);
        setStatusData(data.statusData || []);
        setTopCustomers(data.topCustomers || []);
      } catch (error) {
        console.error("Failed to fetch insights:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [session?.user?.id, range]);
  return (
    <section className="mt-6 space-y-6">
      {/* Header with filter */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold tracking-tight">Dashboard Insights</h2>

        <div className="flex items-center gap-3">
          <Select value={range} onValueChange={setRange}>
            <SelectTrigger className="w-[140px] text-gray-100 border-emerald-500">
              <SelectValue placeholder="Select range" />
            </SelectTrigger>
            <SelectContent className="bg-emerald-700 text-gray-100">
              <SelectItem value="7d" >7 Hari Terakhir</SelectItem>
              <SelectItem value="30d" >30 Hari Terakhir</SelectItem>
              <SelectItem value="90d" >3 Bulan Terakhir</SelectItem>
              <SelectItem value="all" >Semua Waktu</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="w-6 h-6 animate-spin text-emerald-400" />
        </div>
      ) : (
        <AnimatePresence mode="wait">
          <motion.div
            key={range}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4 }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              <div className="col-span-1 md:col-span-2">
                <ConsultationTrends data={consultationData} />
              </div>
              <BookingStatusChart data={statusData} />
              <TopCustomersList customers={topCustomers} />
            </div>
          </motion.div>
        </AnimatePresence>
      )}
    </section>
  )
}

export default DashboardInsights