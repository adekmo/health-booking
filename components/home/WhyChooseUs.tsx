"use client";

import { motion } from "framer-motion";
import { ShieldCheck, Smartphone, Users } from "lucide-react";

const features = [
  {
    icon: <ShieldCheck className="w-10 h-10 text-emerald-500" />,
    title: "Data Aman & Terlindungi",
    desc: "Kami menjaga privasi dan keamanan data kesehatan Anda dengan standar tinggi.",
  },
  {
    icon: <Smartphone className="w-10 h-10 text-emerald-500" />,
    title: "Mudah Digunakan",
    desc: "Akses layanan gizi di mana pun dan kapan pun melalui perangkatmu.",
  },
  {
    icon: <Users className="w-10 h-10 text-emerald-500" />,
    title: "Didukung Ahli Terpercaya",
    desc: "Semua nutritionist kami telah terverifikasi dan berpengalaman di bidangnya.",
  },
];

const WhyChooseUs = () => {
  return (
    <section className="py-20 bg-gray-800/20">
      <div className="container mx-auto px-6 text-center">
        <motion.h2
          className="text-3xl md:text-4xl font-bold text-emerald-500"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Kenapa Memilih NutriCare?
        </motion.h2>

        <div className="grid md:grid-cols-3 gap-10 mt-12">
          {features.map((f, i) => (
            <motion.div
              key={i}
              className="p-8 rounded-2xl bg-emerald-500/20 shadow-sm hover:shadow-md transition-all"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.2, duration: 0.5 }}
            >
              <div className="flex justify-center mb-4">{f.icon}</div>
              <h3 className="text-xl font-semibold text-emerald-500 mb-2">{f.title}</h3>
              <p className="text-gray-100">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
