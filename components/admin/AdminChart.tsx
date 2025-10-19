"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import BookingTrendChart from "./BookingTrendChart";
import UserTrendChart from "./UserTrendChart";
import BookingStatusChart from "./BookingStatusChart";


interface ConsultationData {
  date: string;
  consultations: number;
}

interface StatusData {
  name: string;
  value: number;
}

interface UserData {
  date: string;
  users: number;
}

const AdminChart = () => {

    const [consultationData, setConsultationData] = useState<ConsultationData[]>([]);
    const [statusData, setStatusData] = useState<StatusData[]>([]);
    const [userData, setUserData] = useState<UserData[]>([]);
    const [range, setRange] = useState("7d");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/admin/insights?range=${range}`);
        const data = await res.json();
        setConsultationData(data.consultationData || []);
        setStatusData(data.statusData || []);
        setUserData(data.userData || []);
      } catch (error) {
        console.error("Failed to fetch admin insights:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [range]);

  return (
    <section className="mt-6 space-y-6">
      {/* Header Filter */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold tracking-tight text-emerald-400">Admin Insights</h2>
        <div className="flex items-center gap-3">
          <Select value={range} onValueChange={setRange}>
            <SelectTrigger className="w-[140px] text-gray-100 border-emerald-500">
              <SelectValue placeholder="Select range" />
            </SelectTrigger>
            <SelectContent className="bg-emerald-700 text-gray-100">
              <SelectItem value="7d">7 Hari Terakhir</SelectItem>
              <SelectItem value="30d">30 Hari Terakhir</SelectItem>
              <SelectItem value="90d">3 Bulan Terakhir</SelectItem>
              <SelectItem value="all">Semua Waktu</SelectItem>
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
                <BookingTrendChart data={consultationData} />
              </div>
              <UserTrendChart data={userData} />
              <BookingStatusChart data={statusData} />
            </div>
          </motion.div>
        </AnimatePresence>
      )}
    </section>
  )
}

export default AdminChart