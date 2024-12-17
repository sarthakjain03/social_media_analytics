"use client";
import React from "react";
import { motion } from "motion/react";

type ButtonProps = {
  children: React.ReactNode;
  variant?: "contained" | "outlined" | "text";
  size?: "small" | "medium" | "large";
};

const Variants = {
  text: `border bg-background hover:bg-slate-100 text-black`,
  contained: `bg-purple-600 hover:bg-purple-700 text-white border-purple-600 hover:border-purple-700`,
  outlined: `bg-background hover:bg-purple-100 text-purple-600 border-purple-600`,
};

const Sizes = {
    small: "",
    medium: "px-4 py-2 rounded-md text-base",
    large: ""
}

export const Button = ({ children, variant = "text", size = "medium" }: ButtonProps) => {
    const selectedVariant = Variants[variant];
    const buttonSize = Sizes[size];

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.9 }}
      className={`hover:shadow font-medium font-poppins ${selectedVariant} ${buttonSize}`}
    >
      {children}
    </motion.button>
  );
};
