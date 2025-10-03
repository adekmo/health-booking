"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type Nutritionist = {
  _id: string;
  userId: {
    name: string;
    email: string;
  };
  name: string;
  specialization: string;
  experienceYears: number;
  pricePerSession: number;
  photo?: string;
};

const NutritionistListPage = () => {
    const [nutritionists, setNutritionists] = useState<Nutritionist[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchNutritionists = async () => {
        const res = await fetch("/api/nutritionist");
        if (res.ok) {
            const data = await res.json();
            setNutritionists(data);
        }
        setLoading(false);
        };
        fetchNutritionists();
    }, []);

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Find a Nutritionist</h1>

      {nutritionists.length === 0 ? (
        <p>No nutritionists available.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {nutritionists.map((nutritionist) => (
            <Card key={nutritionist._id} className="flex flex-col bg-emerald-500/20 border-none">
              <CardHeader className="flex flex-col items-center">
                <Image
                  src={nutritionist.photo || "/default-avatar.png"}
                  width={100}
                  height={100}
                  alt={nutritionist.userId.name}
                  className="w-28 h-28 object-cover rounded-full"
                />
                <CardTitle className="mt-3 text-lg text-center text-gray-100">
                  {nutritionist.name}
                </CardTitle>
                <CardDescription className="text-center text-gray-400">
                  {nutritionist.specialization}
                </CardDescription>
              </CardHeader>

              <CardContent className="text-center space-y-1">
                <p className="text-sm text-gray-400">
                  {nutritionist.experienceYears} years experience
                </p>
                <p className="font-semibold text-gray-100">
                  Rp {nutritionist.pricePerSession} / session
                </p>
              </CardContent>

              <CardFooter className="flex justify-center">
                <Button asChild className="bg-emerald-500/30 hover:bg-emerald-500/20">
                  <Link href={`/nutritionist/${nutritionist._id}`}>
                    View Profile
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

export default NutritionistListPage