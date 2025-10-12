"use client";

import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface ConsultationTrendsProps {
  data: { date: string; consultations: number }[];
}

const ConsultationTrends = ({ data }: ConsultationTrendsProps) => {
  return (
    <Card className="bg-emerald-950/40 border-emerald-800/40 backdrop-blur-xl">
      <CardHeader>
        <CardTitle className="text-emerald-200">📈 Consultation Trends</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
              <XAxis dataKey="date" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#064e3b",
                  border: "1px solid #065f46",
                  color: "#d1fae5",
                }}
              />
              <Line
                type="monotone"
                dataKey="consultations"
                stroke="#10b981"
                strokeWidth={2}
                dot={{ r: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}

export default ConsultationTrends