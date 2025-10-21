"use client";

import { motion } from "framer-motion";
import { UserPlus, Stethoscope, BarChart3 } from "lucide-react";

const steps = [
  {
    icon: <UserPlus className="w-10 h-10 text-emerald-500" />,
    title: "Daftar & Buat Akun",
    description: "Mulailah perjalanan sehatmu dengan membuat akun secara gratis.",
  },
  {
    icon: <Stethoscope className="w-10 h-10 text-emerald-500" />,
    title: "Pilih Ahli Gizi",
    description: "Temukan dan pilih nutritionist terbaik yang sesuai dengan kebutuhanmu.",
  },
  {
    icon: <BarChart3 className="w-10 h-10 text-emerald-500" />,
    title: "Mulai Konsultasi & Pantau Hasil",
    description: "Lakukan konsultasi dan pantau perkembangan kesehatanmu secara berkala.",
  },
];

const HowItWorks = () => {
  return (
    <section className="py-20 bg-gray-800/30">
      <div className="container mx-auto px-6 text-center">
        <motion.h2
          className="text-3xl md:text-4xl font-bold text-emerald-500"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Bagaimana NutriCare Bekerja
        </motion.h2>

        <motion.p
          className="text-gray-100 mt-3 max-w-2xl mx-auto"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          Hanya dalam tiga langkah mudah, kamu bisa mendapatkan bimbingan gizi yang dipersonalisasi dan terukur.
        </motion.p>

        <div className="grid md:grid-cols-3 gap-10 mt-14">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              className="flex flex-col items-center text-center p-6 rounded-2xl bg-emerald-500/20 shadow-sm hover:shadow-md transition-all"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2, duration: 0.6 }}
            >
              <div className="p-4 bg-white rounded-full shadow-md mb-4">
                {step.icon}
              </div>
              <h3 className="text-xl font-semibold text-emerald-500 mb-2">
                {step.title}
              </h3>
              <p className="text-gray-100">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
