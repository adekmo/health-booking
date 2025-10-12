"use client";

import StatsOverview from "@/components/nutritionist/StatsOverview";
import DashboardInsights from "@/components/nutritionist/DashboardInsights";
import { motion } from "framer-motion";

const NutritionistDashboardPage = () => {
  return (
    <motion.div
      className="p-6 space-y-6"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >

      <h1 className="text-xl font-semibold text-emerald-400">Dashboard Overview</h1>
      <StatsOverview />

      <DashboardInsights />
    </motion.div>
  )
}

export default NutritionistDashboardPage