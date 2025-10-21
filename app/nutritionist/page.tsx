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
import { Star } from "lucide-react";
import { motion } from "framer-motion";

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
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-2xl text-gray-100 font-bold mb-6 text-center">
        Find a Nutritionist
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
        {/* === KOLUM 1: DAFTAR NUTRISIONIS === */}
        <div>
          {nutritionists.length === 0 ? (
            <p>No nutritionists available.</p>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {nutritionists.map((nutritionist) => (
                <motion.div
                  key={nutritionist._id}
                  whileHover={{ scale: 1.03 }}
                  transition={{ type: "spring" }}
                >
                  <Card className="flex flex-col bg-emerald-500/20 border-none">
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

                      {/* Rating */}
                      <div className="flex items-center justify-center gap-1 text-yellow-400">
                        <Star className="h-4 w-4 fill-yellow-400" />
                        <Star className="h-4 w-4 fill-yellow-400" />
                        <Star className="h-4 w-4 fill-yellow-400" />
                        <Star className="h-4 w-4 fill-yellow-400" />
                        <Star className="h-4 w-4 text-gray-500" />
                        <span className="text-sm text-gray-400 ml-2">
                          (24 reviews)
                        </span>
                      </div>
                    </CardContent>

                    <CardFooter className="flex justify-center">
                      <Button
                        asChild
                        className="bg-emerald-500/30 hover:bg-emerald-500/20"
                      >
                        <Link href={`/nutritionist/${nutritionist._id}`}>
                          View Profile
                        </Link>
                      </Button>
                    </CardFooter>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* === KOLUM 2: WHY CHOOSE NUTRICARE === */}
        <div className="space-y-6 lg:sticky lg:top-20">
          <h2 className="text-2xl font-semibold text-emerald-400">
            Why Choose NutriCare Experts?
          </h2>
          <p className="text-gray-400 leading-relaxed">
            All our nutritionists are verified professionals with years of
            experience helping clients achieve a healthier lifestyle. With
            NutriCare, you’ll get trusted guidance, flexible scheduling, and
            personalized nutrition plans that truly work for you.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6">
            <div className="p-4 bg-emerald-700/20 rounded-lg">
              <h3 className="text-emerald-400 font-medium">Verified Experts</h3>
              <p className="text-gray-400 text-sm mt-2">
                Each nutritionist is vetted by our team to ensure the highest
                quality of service.
              </p>
            </div>
            <div className="p-4 bg-emerald-700/20 rounded-lg">
              <h3 className="text-emerald-400 font-medium">Flexible Booking</h3>
              <p className="text-gray-400 text-sm mt-2">
                Book sessions anytime that fits your schedule with just a few
                clicks.
              </p>
            </div>
            <div className="p-4 bg-emerald-700/20 rounded-lg">
              <h3 className="text-emerald-400 font-medium">Personalized Plans</h3>
              <p className="text-gray-400 text-sm mt-2">
                Receive a nutrition plan tailored to your unique health goals.
              </p>
            </div>
            <div className="p-4 bg-emerald-700/20 rounded-lg">
              <h3 className="text-emerald-400 font-medium">Trusted by Clients</h3>
              <p className="text-gray-400 text-sm mt-2">
                Thousands of clients have reached their health goals with
                NutriCare’s help.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NutritionistListPage