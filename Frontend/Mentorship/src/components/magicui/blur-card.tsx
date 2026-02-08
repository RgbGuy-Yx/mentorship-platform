import { motion } from "framer-motion";
import { ReactNode } from "react";

interface BlurCardProps {
  children: ReactNode;
  className?: string;
}

export function BlurCard({ children, className = "" }: BlurCardProps) {
  return (
    <motion.div
      className={`relative backdrop-blur-sm bg-white/30 border border-white/20 rounded-lg p-8 overflow-hidden group hover:shadow-lg transition-shadow duration-300 ${className}`}
      whileHover={{ scale: 1.02, y: -2 }}
      transition={{ duration: 0.3 }}
    >
      {/* Glassmorphism shine effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100"
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 1 }}
      />

      {/* Content */}
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
}
