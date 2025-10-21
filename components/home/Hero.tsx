"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

const Hero = () => {
  return (
    <section className="relative overflow-hidden bg-emerald-500/10 py-20">
      <div className="container mx-auto flex flex-col md:flex-row items-center gap-12 px-6">
        
        {/* Left Section - Text */}
        <motion.div
          className="flex-1 text-center md:text-left"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold text-emerald-500 leading-tight">
            Konsultasi Gizi dengan Ahli Terpercaya, Kapan Saja!
          </h1>
          <p className="mt-4 text-gray-100 text-lg max-w-md mx-auto md:mx-0">
            Temukan nutritionist profesional dan kelola kesehatanmu dengan mudah melalui NutriCare.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
            <Button asChild className="bg-emerald-500/20 hover:bg-emerald-500/10 text-white px-6 py-3 rounded-xl text-lg">
              <Link href="/auth/signin">Mulai Sekarang</Link>
            </Button>
            <Button asChild variant="outline" className="border-emerald-500 text-emerald-600 px-6 py-3 rounded-xl text-lg">
              <Link href="/about">Pelajari Lebih Lanjut</Link>
            </Button>
          </div>
        </motion.div>

        {/* Right Section - Image */}
        <motion.div
          className="flex-1 flex justify-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
        >
          <Image
            src="/images/nutrition.jpg"
            alt="Nutrition consultation"
            width={500}
            height={500}
            className="rounded-2xl drop-shadow-lg"
          />
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
