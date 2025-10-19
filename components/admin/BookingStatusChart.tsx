"use client";

import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface StatusData {
  name: string;
  value: number;
}

const COLORS = ["#10B981", "#FBBF24", "#EF4444"];

const BookingStatusChart = ({ data }: { data: StatusData[] }) => {
  return (
    <Card className="bg-emerald-900/30 border border-emerald-800">
      <CardHeader>
        <CardTitle className="text-emerald-300">Booking Status Overview</CardTitle>
      </CardHeader>
      <CardContent className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 10, right: 20, left: 0, bottom: 10 }}
            barSize={40}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#2dd4bf30" />
            <XAxis dataKey="name" stroke="#a7f3d0" />
            <YAxis stroke="#a7f3d0" />
            <Tooltip
              contentStyle={{
                backgroundColor: "#064e3b",
                border: "1px solid #10b981",
                color: "#d1fae5",
              }}
              cursor={{ fill: "#064e3b40" }}
            />
            <Bar dataKey="value" radius={[8, 8, 0, 0]}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default BookingStatusChart;
