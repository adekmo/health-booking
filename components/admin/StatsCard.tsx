import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Activity, ClipboardList, Loader2, UserCheck, Users, UserSquare } from "lucide-react";
import { motion } from "framer-motion";

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

const StatsCard = () => {

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
        <div className="flex justify-center items-center py-8 text-gray-200">
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

    const cards = [
        {
        title: "Total Users",
        value: stats.totalUsers,
        icon: <Users className="w-5 h-5 text-emerald-400" />,
        color: "bg-emerald-700/20 border-emerald-800/50",
        },
        {
        title: "Total Customers",
        value: stats.totalCustomers,
        icon: <UserSquare className="w-5 h-5 text-emerald-400" />,
        color: "bg-emerald-700/20 border-emerald-800/50",
        },
        {
        title: "Total Nutritionists",
        value: stats.totalNutritionists,
        icon: <UserCheck className="w-5 h-5 text-emerald-400" />,
        color: "bg-emerald-700/20 border-emerald-800/50",
        },
        {
        title: "Total Bookings",
        value: stats.totalBookings,
        icon: <ClipboardList className="w-5 h-5 text-yellow-400" />,
        color: "bg-yellow-700/10 border-yellow-700/30",
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

        <Card className="bg-gray-800/50 border-gray-700 text-gray-100">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Booking Status</CardTitle>
            <Activity className="text-emerald-400" />
          </CardHeader>
          <CardContent>
            {stats.statusStats.map((stat) => (
              <p key={stat._id} className="capitalize">
                {stat._id}: <span className="font-bold">{stat.count}</span>
              </p>
            ))}
          </CardContent>
        </Card>
    </motion.div>
  )
}

export default StatsCard