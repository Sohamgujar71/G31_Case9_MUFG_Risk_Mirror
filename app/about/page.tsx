"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function AboutPage() {
  // Cursor glow effect
  const [cursor, setCursor] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setCursor({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className="relative min-h-screen bg-background text-gray-900 dark:text-gray-100 p-8 flex flex-col items-center overflow-hidden">
      {/* Cursor Glow */}
      <div
        className="pointer-events-none fixed top-0 left-0 w-[300px] h-[300px] rounded-full bg-blue-500/30 blur-3xl"
        style={{
          transform: `translate(${cursor.x - 150}px, ${cursor.y - 150}px)`,
        }}
      />

      {/* Floating Background Shapes */}
      <motion.div
        className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full opacity-30 blur-2xl"
        animate={{ y: [0, 30, 0] }}
        transition={{ repeat: Infinity, duration: 6 }}
      />
      <motion.div
        className="absolute bottom-20 right-10 w-40 h-40 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full opacity-30 blur-2xl"
        animate={{ y: [0, -40, 0] }}
        transition={{ repeat: Infinity, duration: 8 }}
      />

      {/* Title */}
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-3xl md:text-4xl font-bold mb-6 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 animate-text-shimmer"
      >
        About RISK MIRROR
      </motion.h1>

      {/* Video Section */}
      <motion.div
        className="mb-8 w-full max-w-full"
        whileHover={{ scale: 1.03, rotateY: 5, rotateX: 2 }}
        transition={{ type: "spring", stiffness: 200, damping: 15 }}
      >
        <video
          src="/videos/about.mp4" // Make sure the file exists in public/videos
          controls
          className="w-full h-[300px] md:h-[400px] rounded-xl shadow-lg object-cover"
        />
      </motion.div>

      {/* Description Section */}
      <motion.div
        className="max-w-3xl space-y-4 text-center md:text-left"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.8 }}
      >
        <p className="hover:text-blue-500 transition-colors duration-300">
          RISK MIRROR is an AI-powered risk assessment assistant that helps you
          understand your financial risk, plan investments, and make
          data-driven decisions.
        </p>
        <p className="hover:text-purple-500 transition-colors duration-300">
          Using advanced AI analytics, RISK MIRROR personalizes insights based on
          your financial profile, lifestyle, and goals. Our mission is to make
          financial planning smarter, faster, and more accessible.
        </p>
        <p className="hover:text-pink-500 transition-colors duration-300">
          Whether you’re an individual investor or a financial professional,
          RISK MIRROR provides actionable recommendations and a clear overview of
          your risk landscape.
        </p>
      </motion.div>

      {/* Floating Tagline */}
      <motion.p
        className="mt-10 text-lg font-semibold text-gray-600 dark:text-gray-300"
        animate={{ y: [0, -8, 0] }}
        transition={{ repeat: Infinity, duration: 3 }}
      >
        Empowering smarter financial decisions 💡
      </motion.p>

      <style jsx>{`
        @keyframes shimmer {
          0% {
            background-position: -500px 0;
          }
          100% {
            background-position: 500px 0;
          }
        }
        .animate-text-shimmer {
          background-size: 200% auto;
          animation: shimmer 3s linear infinite;
        }
      `}</style>
    </div>
  );
}
