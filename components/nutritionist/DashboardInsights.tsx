"use client";

import React from "react";
import ConsultationTrends from "./ConsultationTrends";
import BookingStatusChart from "./BookingStatusChart";
import TopCustomersList from "./TopCustomersList";

interface DashboardInsightsProps {
  consultationData: { date: string; consultations: number }[];
  statusData: { name: string; value: number }[];
  topCustomers: { name: string; total: number }[];
}

const DashboardInsights = ({ consultationData, statusData, topCustomers}: DashboardInsightsProps) => {
  return (
    <section className="mt-6 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      <div className="col-span-1 md:col-span-2">
        <ConsultationTrends data={consultationData} />
      </div>
      <BookingStatusChart data={statusData} />
      <TopCustomersList customers={topCustomers} />
    </section>
  )
}

export default DashboardInsights