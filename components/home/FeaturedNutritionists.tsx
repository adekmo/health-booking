"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Button } from "../ui/button";

interface Nutritionist {
  _id: string;
  name: string;
  userId: {
    name: string;
    email: string;
  };
  specialization?: string;
  experience?: string;
  photo?: string;
}

const FeaturedNutritionists = () => {

  const [nutritionists, setNutritionists] = useState<Nutritionist[]>([]);

  useEffect(() => {
    const fetchNutritionists = async () => {
      const res = await fetch("/api/nutritionist");
      if (res.ok) {
        const data = await res.json();
        setNutritionists(data);
      }
    };
    fetchNutritionists();
  }, []);

  if (nutritionists.length === 0) return null;

  const single = nutritionists.length === 1;
  const nutritionist = nutritionists[0];

  return (
    <section className="py-20 bg-emerald-500/10">
      <div className="container mx-auto px-6 text-center">
        <motion.h2
          className="text-3xl md:text-4xl font-bold text-emerald-500"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Nutritionist Unggulan Kami
        </motion.h2>

        <p className="text-gray-100 mt-3 max-w-2xl mx-auto">
          Bekerja dengan ahli gizi berpengalaman dan bersertifikat untuk mencapai tujuan kesehatanmu.
        </p>

        {single ? (
          // Tampilan untuk 1 nutritionist
          <motion.div
            className="mt-12 flex flex-col items-center text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Image
              src={nutritionist.photo || "/images/nutritionist-placeholder.jpg"}
              alt={nutritionist.userId?.name}
              width={200}
              height={200}
              className="w-40 h-40 rounded-full object-cover shadow-lg border-4 border-emerald-500 mb-6"
            />
            <h3 className="text-2xl font-semibold text-emerald-500">{nutritionist.name}</h3>
            <p className="text-gray-200 mt-2">
              {nutritionist.specialization || "Ahli Gizi Profesional"}
            </p>
            {nutritionist.experience && (
              <p className="text-gray-400 text-sm mt-1">{nutritionist.experience} tahun pengalaman</p>
            )}
          </motion.div>
        ) : (
          // Tampilan untuk 2 atau lebih nutritionist
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8 mt-12">
            {nutritionists.map((nutris, idx) => (
              <motion.div
                key={nutris._id}
                className="bg-emerald-500/20 rounded-2xl shadow-md hover:shadow-lg p-6 transition-all"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.2 }}
              >
                <Image
                  src={nutris.photo || "/images/nutritionist-placeholder.jpg"}
                  alt={nutris.userId?.name}
                  width={200}
                  height={200}
                  className="w-32 h-32 object-cover rounded-full mx-auto mb-4 text-gray-100"
                />
                <h3 className="text-lg font-semibold text-emerald-500">{nutris.name}</h3>
                <p className="text-gray-300">{nutris.specialization || "Ahli Gizi"}</p>
              </motion.div>
            ))}
          </div>
        )}

        <motion.div
          className="mt-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Link href="/nutritionist">
            <Button
              size="lg"
              className="bg-emerald-500/20 hover:bg-emerald-600 text-gray-100 cursor-pointer font-semibold rounded-full px-6"
            >
              Lihat Semua Nutritionist
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturedNutritionists;
