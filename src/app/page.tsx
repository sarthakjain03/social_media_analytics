"use client";
import { motion } from "motion/react";
import { ChartNoAxesCombined } from "lucide-react";
import { Button } from "@/components/Button";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      <motion.header
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mx-auto flex justify-between items-center px-20 py-6"
      >
        <div className="flex items-center space-x-3">
          <ChartNoAxesCombined className="size-7 text-purple-600" />
          <span className="text-2xl font-bold text-gray-800 font-poppins">
            Social Analytics
          </span>
        </div>
        <Button variant="contained" size="medium">Sign In</Button>
        {/* <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.9 }} className="border bg-background px-4 py-2 hover:shadow rounded-md hover:bg-slate-100 font-medium font-poppins">
          Sign In
        </motion.button> */}
      </motion.header>
    </div>
  );
}
