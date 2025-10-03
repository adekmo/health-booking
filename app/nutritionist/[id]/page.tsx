"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { Card, CardHeader, CardContent, CardFooter, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

type Nutritionist = {
  _id: string;
  userId: {
    name: string;
    email: string;
  };
  name: string;
  specialization: string;
  experienceYears: number;
  bio: string;
  pricePerSession: number;
  availableDays: string[];
  availableHours: {
    start: string;
    end: string;
  };
  photo?: string;
};

const NutritionistDetailsPage = () => {
    const { id } = useParams<{ id: string }>();
    const [nutritionist, setNutritionist] = useState<Nutritionist | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchNutritionist = async () => {
        const res = await fetch(`/api/nutritionist/${id}`);
        if (res.ok) {
            const data = await res.json();
            setNutritionist(data);
        }
        setLoading(false);
        };
        if (id) fetchNutritionist();
    }, [id]);

    if (loading) return <p className="text-center mt-10">Loading...</p>;
    if (!nutritionist) return <p className="text-center mt-10">Nutritionist not found.</p>;
  return (
    <div className="max-w-3xl mx-auto p-6">
      <Card className="shadow-md bg-emerald-500/20 border-none">
        <CardHeader className="flex flex-col items-center">
          <Image
            src={nutritionist.photo || "/default-avatar.png"}
            alt={nutritionist.userId.name}
            width={120}
            height={120}
            className="w-32 h-32 object-cover rounded-full mb-3"
          />
          <CardTitle className="text-2xl text-gray-100">{nutritionist.name}</CardTitle>
          <CardDescription className="text-gray-400">{nutritionist.specialization}</CardDescription>
          <p className="text-sm text-gray-400 mt-1">
            {nutritionist.experienceYears} years experience
          </p>
          <p className="mt-2 font-semibold text-gray-100">
            Rp {nutritionist.pricePerSession} / session
          </p>
        </CardHeader>

        <CardContent className="space-y-4">
          <div>
            <h2 className="font-semibold text-gray-100">About</h2>
            <p className="text-gray-400">{nutritionist.bio}</p>
          </div>

          <div>
            <h2 className="font-semibold text-gray-100 mb-1">Availability</h2>
            <div className="flex flex-wrap gap-2 mb-2">
              {nutritionist.availableDays.map((day) => (
                <Badge key={day} variant="secondary" className="capitalize bg-emerald-500/30 text-white hover:bg-emerald-600">
                  {day}
                </Badge>
              ))}
            </div>

            <Badge variant="outline" className="border border-emerald-400 text-emerald-300 bg-transparent">
              {nutritionist.availableHours.start} - {nutritionist.availableHours.end}
            </Badge>
          </div>
        </CardContent>

        <CardFooter>
          <Button
            className="w-full bg-emerald-500/30 hover:bg-emerald-500/20"
            onClick={() => alert("Booking feature coming soon!")}
          >
            Book Session
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

export default NutritionistDetailsPage