import StatsOverview from '@/components/nutritionist/StatsOverview'
import React from 'react'

const NutritionistDashboardPage = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold text-emerald-400">Dashboard Overview</h1>
      <StatsOverview />
    </div>
  )
}

export default NutritionistDashboardPage