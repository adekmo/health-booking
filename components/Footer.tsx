"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Instagram, Twitter, Mail } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-foreground border-t border-emerald-800/40 text-gray-100">
      <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-4 gap-8">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <h2 className="text-emerald-400 text-xl font-bold mb-3">NutriCare</h2>
          <p className="text-gray-400 text-sm">
            Your partner for a healthier and balanced lifestyle.  
            Book a session with trusted nutrition experts anytime, anywhere.
          </p>
          <div className="flex gap-3 mt-4">
            <Link href="#" aria-label="Instagram">
              <Instagram className="w-5 h-5 hover:text-emerald-400 transition" />
            </Link>
            <Link href="#" aria-label="Twitter">
              <Twitter className="w-5 h-5 hover:text-emerald-400 transition" />
            </Link>
            <Link href="mailto:support@nutricare.com" aria-label="Email">
              <Mail className="w-5 h-5 hover:text-emerald-400 transition" />
            </Link>
          </div>
        </motion.div>

        {/* Quick Links */}
        <div>
          <h3 className="text-emerald-400 font-semibold mb-3">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li><Link href="/" className="hover:text-emerald-400">Home</Link></li>
            <li><Link href="/nutritionist" className="hover:text-emerald-400">Find Nutritionist</Link></li>
            {/* <li><Link href="/about" className="hover:text-emerald-400">About Us</Link></li>
            <li><Link href="/contact" className="hover:text-emerald-400">Contact</Link></li>
            <li><Link href="/faq" className="hover:text-emerald-400">FAQ</Link></li> */}
          </ul>
        </div>

        {/* Legal */}
        <div>
          <h3 className="text-emerald-400 font-semibold mb-3">Legal</h3>
          <ul className="space-y-2 text-sm">
            <li><Link href="/privacy" className="hover:text-emerald-400">Privacy Policy</Link></li>
            <li><Link href="/terms" className="hover:text-emerald-400">Terms of Service</Link></li>
            <li><Link href="/disclaimer" className="hover:text-emerald-400">Disclaimer</Link></li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-emerald-400 font-semibold mb-3">Get in Touch</h3>
          <p className="text-sm text-gray-400">
            Have questions or need help?
          </p>
          <p className="text-sm mt-2">
            Email:{" "}
            <Link
              href="mailto:syifayulianaxii.3@gmail.com"
              className="text-emerald-400 hover:underline"
            >
              syifayulianaxii.3@gmail.com
            </Link>
          </p>
        </div>
      </div>

      <div className="border-t border-emerald-800/40 py-4 text-center text-sm text-gray-500">
        © 2025 NutriCare. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
