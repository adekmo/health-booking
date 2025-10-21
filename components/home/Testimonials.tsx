"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";
import { motion } from "framer-motion";

const testimonials = [
  {
    name: "Rina Putri",
    role: "Customer",
    message:
      "Saya berhasil menurunkan 5kg dalam 2 bulan berkat panduan dari ahli gizi NutriCare. Konsultasinya sangat profesional!",
    rating: 5,
  },
  {
    name: "Andi Pratama",
    role: "Customer",
    message:
      "Platform-nya mudah digunakan, dan nutrisionisnya sangat ramah serta memberikan saran yang realistis.",
    rating: 4,
  },
  {
    name: "Lestari Ananda",
    role: "Customer",
    message:
      "Saya merasa lebih sehat dan teratur setelah mengikuti program meal plan dari NutriCare. Highly recommended!",
    rating: 5,
  },
];

const Testimonials = () => {
  return (
    <section className="py-20 bg-emerald-500/10">
      <div className="max-w-6xl mx-auto px-6 text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-emerald-400 mb-10">
          What Our Clients Say
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((t, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.03 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Card className="bg-emerald-500/20 border-none text-gray-100 shadow-lg h-full">
                <CardContent className="p-6 flex flex-col justify-between">
                  <div className="mb-4">
                    <div className="flex justify-center mb-3 text-yellow-400">
                      {[...Array(t.rating)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 fill-yellow-400" />
                      ))}
                    </div>
                    <p className="text-gray-300 text-sm italic">
                      “{t.message}”
                    </p>
                  </div>
                  <div className="mt-4">
                    <h3 className="font-semibold text-emerald-400">{t.name}</h3>
                    <p className="text-xs text-gray-400">{t.role}</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
