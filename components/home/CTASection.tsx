"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import Link from "next/link";

const CTASection = () => {
  return (
    <section className="py-20 bg-gray-800/20 text-white text-center">
      <motion.div
        className="container mx-auto px-6"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-emerald-500">
          Siap Memulai Perjalanan Sehatmu?
        </h2>
        <p className="text-emerald-100 mb-8 max-w-2xl mx-auto">
          Dapatkan bimbingan dari ahli gizi profesional dan capai tujuan kesehatanmu bersama NutriCare.
        </p>
        <Button asChild size="lg" className="bg-emerald-500/20 text-gray-100 hover:bg-emerald-100 hover:text-emerald-500 font-semibold">
          <Link href="/auth/register">Mulai Sekarang</Link>
        </Button>
      </motion.div>
    </section>
  );
};

export default CTASection;
