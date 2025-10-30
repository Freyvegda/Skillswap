"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { Sparkles, ArrowRight } from "lucide-react";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";

//Smooth Animated Stat Item
const StatItem = ({ value, label }: { value: number | string; label: string }) => {
  const isNumeric = typeof value === "number";
  const count = useMotionValue(0);

  // Map motion value to formatted number
  const display = useTransform(count, (latest) =>
    isNumeric ? Math.floor(latest).toLocaleString() : value
  );

  useEffect(() => {
    if (!isNumeric) return;

    const controls = animate(count, value as number, {
      duration: 2,
      ease: "easeOut",
    });

    return controls.stop;
  }, [count, value, isNumeric]);

  return (
    <div className="flex flex-col items-center">
      <motion.div
        style={{ perspective: 600 }}
        className="text-4xl md:text-5xl font-bold text-gray-900 mb-2"
        initial={{ rotateX: -90, opacity: 0 }}
        animate={{ rotateX: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <motion.span>{display}</motion.span>
        {isNumeric && <span>+</span>}
      </motion.div>
      <div className="text-gray-600">{label}</div>
    </div>
  );
};

//Hero Section
const HeroSection = () => {
  return (
    <section className="bg-emerald-50 py-20 px-4">
      <div className="max-w-6xl mx-auto text-center">
        {/* Badge */}
        <div className="inline-flex items-center space-x-2 bg-emerald-50 text-emerald-700 px-4 py-2 rounded-full text-sm font-medium mb-8">
          <Sparkles className="w-4 h-4" />
          <span>Learn & Teach</span>
        </div>

        {/* Main Heading */}
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-4">
          Exchange Skills,
        </h1>
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-emerald-500 mb-8">
          Not Money
        </h1>

        {/* Subheading */}
        <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto">
          Connect with people who want to learn what you know, and teach you what they know.
        </p>

        {/* CTA Button */}
        <Link
          href="/auth"
          className="bg-emerald-500 text-white px-8 py-4 rounded-lg hover:bg-emerald-600 transition font-semibold text-lg inline-flex items-center space-x-2 shadow-lg hover:shadow-xl"
        >
          <span>Start Swapping</span>
          <ArrowRight className="w-5 h-5" />
        </Link>

        {/* Stats Section */}
        <div className="mt-20 grid grid-cols-3 gap-8 max-w-3xl mx-auto">
          <StatItem value={100} label="Users" />
          <StatItem value={100} label="Swaps" />
          <StatItem value={4.9} label="Rating" />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
