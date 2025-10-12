'use client'

import React, { useEffect, useState } from 'react'
import DashboardInsights from '@/components/nutritionist/DashboardInsights';
import StatsOverview from '@/components/nutritionist/StatsOverview'
import { Loader2 } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { motion } from "framer-motion";

const NutritionistDashboardPage = () => {

  const { data: session } = useSession();
  const [insights, setInsights] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!session?.user?.id) return;

    const fetchInsights = async () => {
      try {
        const res = await fetch(`/api/nutritionist/insights/${session.user.id}`);
        const data = await res.json();
        setInsights(data);
      } catch (error) {
        console.error("Failed to load insights:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchInsights();
  }, [session?.user?.id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin text-emerald-500 w-8 h-8" />
      </div>
    );
  }

  if (!insights) {
    return (
      <div className="text-center text-emerald-400">
        Failed to load insights.
      </div>
    );
  }
  return (
    <motion.div
      className="p-6 space-y-6"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >

      <h1 className="text-xl font-semibold text-emerald-400">Dashboard Overview</h1>
      <StatsOverview />

      <DashboardInsights
        consultationData={insights.consultationData}
        statusData={insights.statusData}
        topCustomers={insights.topCustomers}
      />
    </motion.div>
  )
}

export default NutritionistDashboardPage