"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

type Nutritionist = {
  _id: string;
  userId: {
    name: string;
    email: string;
  };
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
            <div
              key={nutritionist._id}
              className="border rounded-lg shadow-sm p-4 bg-white flex flex-col"
            >
              <Image
                src={nutritionist.photo || "/default-avatar.png"}
                width={100}
                height={100}
                alt={nutritionist.userId.name}
                className="w-32 h-32 object-cover rounded-full mx-auto"
              />
              <h2 className="text-lg font-semibold text-center mt-3">
                {nutritionist.userId.name}
              </h2>
              <p className="text-sm text-gray-600 text-center">
                {nutritionist.specialization}
              </p>
              <p className="text-sm text-gray-500 text-center">
                {nutritionist.experienceYears} years experience
              </p>
              <p className="text-center font-semibold mt-2">
                Rp {nutritionist.pricePerSession} / session
              </p>

              <Link
                href={`/nutritionist/${nutritionist._id}`}
                className="mt-4 inline-block bg-blue-600 text-white text-center py-2 rounded hover:bg-blue-700 transition"
              >
                View Profile
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default NutritionistListPage