"use client";

import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

interface BookingStatusChartProps {
  data: { name: string; value: number }[];
}

const COLORS = ["#10b981", "#facc15", "#ef4444"];

const BookingStatusChart = ({ data }: BookingStatusChartProps) => {
  return (
    <Card className="bg-emerald-950/40 border-emerald-800/40 backdrop-blur-xl">
      <CardHeader>
        <CardTitle className="text-emerald-200">🥧 Booking Status Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={70}
                fill="#10b981"
                label
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "#064e3b",
                  border: "1px solid #065f46",
                  color: "#d1fae5",
                }}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}

export default BookingStatusChart