"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, Users, Leaf, Lightbulb } from "lucide-react";

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-gray-800/20 text-gray-100">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 bg-emerald-500/20">
        <div className="container mx-auto px-6 flex flex-col md:flex-row items-center gap-12">
          {/* Left Text */}
          <motion.div
            className="flex-1 text-center md:text-left"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold text-emerald-500">
              Tentang <span className="text-emerald-500">NutriCare</span>
            </h1>
            <p className="mt-4 text-gray-100 max-w-md mx-auto md:mx-0">
              Kami percaya bahwa kesehatan dimulai dari pola makan yang tepat. NutriCare hadir untuk menghubungkanmu dengan ahli gizi profesional — kapan pun, di mana pun.
            </p>
          </motion.div>

          {/* Right Image */}
          <motion.div
            className="flex-1 flex justify-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
          >
            <Image
              src="/images/undraw.svg"
              alt="About NutriCare"
              width={500}
              height={400}
              className="rounded-2xl drop-shadow-lg"
            />
          </motion.div>
        </div>
      </section>

      {/* Our Story */}
      <section className="container mx-auto px-6 py-16 text-center">
        <motion.h2
          className="text-3xl font-bold text-emerald-500 mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          Cerita Kami
        </motion.h2>
        <p className="text-gray-100 max-w-2xl mx-auto">
          <span className="text-emerald-500">NutriCare</span> lahir dari visi sederhana: membantu setiap orang memahami kebutuhan gizinya dengan mudah.
          Kami menyadari bahwa akses ke ahli gizi sering kali sulit dan mahal. Karena itu, kami membangun platform
          yang mempermudah siapa pun untuk berkonsultasi langsung dengan ahli gizi bersertifikat.
        </p>
      </section>

      {/* Mission & Vision */}
      <section className="bg-emerald-500/20 py-16">
        <div className="container mx-auto px-6 grid md:grid-cols-2 gap-8">
          <Card className="bg-emerald-500/20 backdrop-blur border-none shadow-sm">
            <CardContent className="p-8">
              <h3 className="text-2xl font-semibold text-emerald-500 mb-3">
                🎯 Misi Kami
              </h3>
              <p className="text-gray-100">
                Memberdayakan masyarakat untuk hidup lebih sehat melalui edukasi dan konsultasi gizi yang mudah diakses.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-black/20 backdrop-blur border-none shadow-sm">
            <CardContent className="p-8">
              <h3 className="text-2xl font-semibold text-emerald-500 mb-3">
                🌱 Visi Kami
              </h3>
              <p className="text-gray-100">
                Menjadi platform digital terpercaya di bidang nutrisi dan kesehatan di Indonesia.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Core Values */}
      <section className="container mx-auto px-6 py-20 text-center">
        <h2 className="text-3xl font-bold text-emerald-500 mb-12">
          Nilai-Nilai Kami
        </h2>
        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-8">
          {[
            {
              icon: <Users className="w-8 h-8 text-emerald-500 mb-3" />,
              title: "Kepercayaan",
              desc: "Semua ahli gizi kami tersertifikasi dan berpengalaman.",
            },
            {
              icon: <Heart className="w-8 h-8 text-emerald-500 mb-3" />,
              title: "Personalisasi",
              desc: "Setiap rencana disesuaikan dengan kebutuhan unik pengguna.",
            },
            {
              icon: <Leaf className="w-8 h-8 text-emerald-500 mb-3" />,
              title: "Aksesibilitas",
              desc: "Konsultasi gizi mudah, di mana pun dan kapan pun.",
            },
            {
              icon: <Lightbulb className="w-8 h-8 text-emerald-500 mb-3" />,
              title: "Inovasi",
              desc: "Kami terus berinovasi untuk pengalaman terbaik pengguna.",
            },
          ].map((value, index) => (
            <motion.div
              key={index}
              className="p-6 rounded-xl bg-emerald-500/20 backdrop-blur shadow-sm"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
            >
              {value.icon}
              <h4 className="font-semibold text-emerald-500 mb-2">{value.title}</h4>
              <p className="text-gray-100 text-sm">{value.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-emerald-500/20 py-16 text-center text-gray-100">
        <h2 className="text-3xl font-bold mb-4">
          Siap memulai perjalanan hidup sehatmu?
        </h2>
        <p className="mb-8 text-gray-100">
          Konsultasikan kebutuhan gizi kamu dengan ahli terpercaya hanya di NutriCare.
        </p>
        <Button asChild className="bg-white text-emerald-600 hover:bg-white/90 px-8 py-3 rounded-xl">
          <Link href="/auth/signin">Mulai Sekarang</Link>
        </Button>
      </section>
    </div>
  )
}

export default AboutPage