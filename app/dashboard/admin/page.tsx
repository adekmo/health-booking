"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, ClipboardList, UserCheck, Activity } from "lucide-react";
import StatsCard from "@/components/admin/StatsCard";
import { motion } from "framer-motion";

const AdminDashboardPage = () => {
  
  return (
    <motion.div
      className="p-6 space-y-6"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h1 className="text-xl font-semibold text-emerald-400">Overview</h1>

      {/* Summary Cards */}
      <StatsCard />
    </motion.div>
  )
}

export default AdminDashboardPage