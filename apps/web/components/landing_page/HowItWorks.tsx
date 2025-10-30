"use client";

import React from "react";
import { motion, Variants } from "framer-motion";

const HowItWorks = () => {
  const steps = [
    {
      number: 1,
      title: "Create Your Profile",
      description: "List the skills you can teach and what you want to learn",
    },
    {
      number: 2,
      title: "Get Matched",
      description: "Our algorithm finds people with complementary skills",
    },
    {
      number: 3,
      title: "Start Swapping",
      description: "Schedule sessions and exchange knowledge for free",
    },
  ];

  //Animation Variants
  const containerVariants: Variants  = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.2, // delay between steps
      },
    },
  };

  const cardVariants: Variants = {
    hidden: { opacity: 0, y: 40, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  return (
    <section id="how-it-works" className="bg-emerald-50 py-20 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Heading */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            How It Works
          </h2>
          <p className="text-xl text-gray-600">
            Three simple steps to start learning
          </p>
        </div>

        {/* Animated Steps */}
        <motion.div
          className="grid md:grid-cols-3 gap-12"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }} // triggers only once when 30% visible
        >
          {steps.map((step) => (
            <motion.div
              key={step.number}
              variants={cardVariants}
              className="text-center bg-emerald-100 shadow-md rounded-2xl p-8 hover:shadow-lg transition"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-500 text-white rounded-full text-2xl font-bold mb-6 shadow-md">
                {step.number}
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-4">
                {step.title}
              </h3>
              <p className="text-gray-600 text-lg font-semibold leading-relaxed">
                {step.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default HowItWorks;
