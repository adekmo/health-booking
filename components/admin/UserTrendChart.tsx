"use client";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";

interface UserData {
  date: string;
  users: number;
}

const UserTrendChart = ({ data }: { data: UserData[] }) => (
  <Card className="bg-gray-800/50 border-gray-700 text-gray-100">
    <CardHeader>
      <CardTitle>👥 User Baru</CardTitle>
    </CardHeader>
    <CardContent className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#2d2d2d" />
          <XAxis dataKey="date" stroke="#aaa" />
          <YAxis stroke="#aaa" />
          <Tooltip />
          <Line type="monotone" dataKey="users" stroke="#fbbf24" strokeWidth={2} dot={{ r: 3 }} />
        </LineChart>
      </ResponsiveContainer>
    </CardContent>
  </Card>
);

export default UserTrendChart;
