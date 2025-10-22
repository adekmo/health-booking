"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const nutritionists = [
  {
    name: "Syifa Yuliana Ayuningtyas S.Gz",
    specialty: "Ahli Gizi",
    image: "/images/nutrition.jpg",
  },
  {
    name: "Dr. Aditya Pratama",
    specialty: "Spesialis Nutrisi & Diet",
    image: "/images/nutritionist2.jpg",
  },
  {
    name: "Dr. Lestari Dewi",
    specialty: "Konsultan Gizi Anak",
    image: "/images/nutritionist3.jpg",
  },
];

const FeaturedNutritionists = () => {
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

        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8 mt-12">
          {nutritionists.map((n, i) => (
            <motion.div
              key={i}
              className="bg-emerald-500/20 rounded-2xl shadow-md hover:shadow-lg p-6 transition-all"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.2 }}
            >
              <Image
                src={n.image}
                alt={n.name}
                width={200}
                height={200}
                className="w-32 h-32 object-cover rounded-full mx-auto mb-4 text-gray-100"
              />
              <h3 className="text-lg font-semibold text-emerald-500">{n.name}</h3>
              <p className="text-gray-300">{n.specialty}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedNutritionists;
