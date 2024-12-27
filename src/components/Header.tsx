"use client"
import { useState } from "react";
import { motion } from "motion/react";
import { ChartNoAxesCombined } from "lucide-react";
import SignInModal from "./SignInModal";
import { useSession, signOut } from "next-auth/react";

export default function Header() {
  const { data: session } = useSession();
  const [openModal, setOpenModal] = useState(false);

  return (
    <>
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
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.9 }}
          className={`hover:shadow font-medium font-poppins px-4 py-2 rounded-md text-base border bg-white hover:bg-slate-100 text-black`}
          onClick={() => setOpenModal(true)}
        >
          Sign In
        </motion.button>
      </motion.header>
      {openModal && <SignInModal open={openModal} onClose={() => setOpenModal(false)} />}
    </>
  );
}
