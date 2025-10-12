"use client";

import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface TopCustomersListProps {
  customers: { name: string; total: number }[];
}

const TopCustomersList = ({ customers }: TopCustomersListProps) => {
  return (
    <Card className="bg-emerald-950/40 border-emerald-800/40 backdrop-blur-xl">
      <CardHeader>
        <CardTitle className="text-emerald-200">👥 Top Customers</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {customers.length > 0 ? (
          customers.map((c, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between border-b border-emerald-800/30 pb-2"
            >
              <span className="text-emerald-100 font-medium">{c.name}</span>
              <Badge variant="secondary" className="bg-emerald-700/60 text-emerald-100">
                {c.total}x
              </Badge>
            </div>
          ))
        ) : (
          <p className="text-sm text-emerald-300/70">No consultation data yet.</p>
        )}
      </CardContent>
    </Card>
  )
}

export default TopCustomersList