import React from "react";
import { motion } from "motion/react";

type ButtonProps = {
  children: React.ReactNode;
  variant?: "contained" | "outlined" | "default";
  size?: "small" | "medium" | "large";
};

const Variants = {
  default: `border bg-white hover:bg-slate-100 text-black`,
  contained: `bg-purple-600 hover:bg-purple-700 text-white border-purple-600 hover:border-purple-700`,
  outlined: `bg-background hover:bg-purple-100 text-purple-600 border border-purple-600`,
};

const Sizes = {
    small: "text-sm rounded-md px-4 py-1",
    medium: "px-4 py-2 rounded-md text-base",
    large: "px-5 py-2 rounded-lg text-lg"
}

export const Button = ({ children, variant = "default", size = "medium" }: ButtonProps) => {
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
