"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";

type Nutritionist = {
  _id: string;
  userId: {
    name: string;
    email: string;
  };
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
    <div className="max-w-3xl mx-auto p-6 bg-white shadow rounded">
      <div className="flex flex-col items-center">
        <Image
          src={nutritionist.photo || "/default-avatar.png"}
          alt={nutritionist.userId.name}
          width={100}
          height={100}
          className="w-32 h-32 object-cover rounded-full mb-4"
        />
        <h1 className="text-2xl font-bold">{nutritionist.userId.name}</h1>
        <p className="text-gray-600">{nutritionist.specialization}</p>
        <p className="text-sm text-gray-500">{nutritionist.experienceYears} years experience</p>
        <p className="mt-2 font-semibold">Rp {nutritionist.pricePerSession} / session</p>
      </div>

      <div className="mt-6 space-y-4">
        <div>
          <h2 className="font-semibold">About</h2>
          <p className="text-gray-700">{nutritionist.bio}</p>
        </div>

        <div>
          <h2 className="font-semibold">Availability</h2>
          <p>Days: {nutritionist.availableDays.join(", ")}</p>
          <p>Hours: {nutritionist.availableHours.start} - {nutritionist.availableHours.end}</p>
        </div>
      </div>

      <button
        className="mt-6 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        onClick={() => alert("Booking feature coming soon!")}
      >
        Book Session
      </button>
    </div>
  )
}

export default NutritionistDetailsPage