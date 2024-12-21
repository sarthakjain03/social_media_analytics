"use client";
import { motion } from "motion/react";
import { SignedIn, SignInButton, UserButton, SignedOut } from "@clerk/nextjs";
import { ChartNoAxesCombined } from "lucide-react";

export default function Header() {
  return (
    <motion.header
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      className="mx-auto flex justify-between items-center px-20 py-6"
    >
      <div className="flex items-center space-x-3">
        <ChartNoAxesCombined className="size-7 text-purple-600" />
        <span className="text-2xl font-bold text-gray-800">Socialytics</span>
      </div>
      <SignedOut>
        <SignInButton mode="modal">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.9 }}
            className={`hover:shadow font-medium font-poppins px-4 py-2 rounded-md text-base border bg-white hover:bg-slate-100 text-black`}
          >
            Sign In
          </motion.button>
        </SignInButton>
      </SignedOut>
      <SignedIn>
        <UserButton
          appearance={{
            elements: {
              userButtonAvatarBox: "size-10",
            },
          }}
        />
      </SignedIn>
    </motion.header>
  );
}
