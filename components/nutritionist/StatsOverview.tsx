"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Users, CheckCircle2, Clock, XCircle } from "lucide-react";
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";

interface StatsData {
  totalConsultations: number;
  uniqueCustomers: number;
  conversionRate: number;
  totalPending: number;
  totalCancelled: number;
}

const StatsOverview = () => {

    const { data: session } = useSession();
    const [stats, setStats] = useState<StatsData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
        if (!session?.user?.id) return;
        try {
            const res = await fetch(`/api/nutritionist/stats/${session.user.id}`);
            const data = await res.json();
            setStats(data);
        } catch (err) {
            console.error("Error fetching stats:", err);
        } finally {
            setLoading(false);
        }
        };
        fetchStats();
    }, [session?.user?.id]);

    if (loading) {
        return (
        <div className="flex justify-center items-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-emerald-400" />
        </div>
        );
    }

    if (!stats) {
        return (
        <p className="text-gray-400 text-center py-4">
            No consultation data found.
        </p>
        );
    }

    const cards = [
        {
        title: "Consultations This Month",
        value: stats.totalConsultations,
        icon: <CheckCircle2 className="w-5 h-5 text-emerald-400" />,
        color: "bg-emerald-700/20 border-emerald-800/50",
        },
        {
        title: "Unique Customers",
        value: stats.uniqueCustomers,
        icon: <Users className="w-5 h-5 text-emerald-400" />,
        color: "bg-emerald-700/20 border-emerald-800/50",
        },
        {
        title: "Conversion Rate",
        value: `${stats.conversionRate}%`,
        icon: <CheckCircle2 className="w-5 h-5 text-emerald-400" />,
        color: "bg-emerald-700/20 border-emerald-800/50",
        },
        {
        title: "Pending Bookings",
        value: stats.totalPending,
        icon: <Clock className="w-5 h-5 text-yellow-400" />,
        color: "bg-yellow-700/10 border-yellow-700/30",
        },
        {
        title: "Cancelled",
        value: stats.totalCancelled,
        icon: <XCircle className="w-5 h-5 text-red-400" />,
        color: "bg-red-700/10 border-red-700/30",
        },
    ];
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
    >
      {cards.map((item, idx) => (
        <Card
          key={idx}
          className={`border ${item.color} text-gray-100 shadow-md shadow-emerald-800/10`}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">
              {item.title}
            </CardTitle>
            {item.icon}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-300">
              {item.value}
            </div>
          </CardContent>
        </Card>
      ))}
    </motion.div>
  )
}

export default StatsOverview