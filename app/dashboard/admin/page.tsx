"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Users, ClipboardList, UserCheck, Activity } from "lucide-react";
import StatsCard from "@/components/admin/StatsCard";

interface BookingStatusStat {
  _id: "pending" | "confirmed" | "cancelled" | string;
  count: number;
}

interface AdminStats {
  totalUsers: number;
  totalCustomers: number;
  totalNutritionists: number;
  totalBookings: number;
  statusStats: BookingStatusStat[];
}

const AdminDashboardPage = () => {

  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch("/api/admin/stats");
        if(!res.ok) throw new Error("Failed to fetch stats");
        const data: AdminStats = await res.json();
        setStats(data);
      } catch (err) {
        console.error("Error fetching stats:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh] text-gray-200">
        <Loader2 className="animate-spin mr-2" /> Loading dashboard...
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="text-center text-gray-400 mt-10">
        Failed to load stats.
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-gray-100">Overview</h1>

      {/* Summary Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Users"
          value={stats.totalUsers}
          icon={<Users className="text-emerald-400" />}
        />
        <StatsCard
          title="Total Customers"
          value={stats.totalCustomers}
          icon={<Users className="text-emerald-400" />}
        />
        <StatsCard
          title="Nutritionists"
          value={stats.totalNutritionists}
          icon={<UserCheck className="text-emerald-400" />}
        />
        <StatsCard
          title="Total Bookings"
          value={stats.totalBookings}
          icon={<ClipboardList className="text-emerald-400" />}
        />
        <Card className="bg-gray-800/50 border-gray-700 text-gray-100">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Booking Status</CardTitle>
            <Activity className="text-emerald-400" />
          </CardHeader>
          <CardContent>
            {stats.statusStats.map((s) => (
              <p key={s._id} className="capitalize">
                {s._id}: <span className="font-bold">{s.count}</span>
              </p>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default AdminDashboardPage