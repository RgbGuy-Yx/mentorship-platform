import { motion } from "framer-motion";
import { ReactNode } from "react";

interface SpotlightCardProps {
  children: ReactNode;
  className?: string;
}

export function SpotlightCard({ children, className = "" }: SpotlightCardProps) {
  return (
    <motion.div
      className={`relative bg-white rounded-lg p-8 overflow-hidden group ${className}`}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
    >
      {/* Spotlight effect */}
      <motion.div
        className="absolute inset-0 bg-linear-to-r from-blue-500/0 via-blue-500/10 to-blue-500/0 opacity-0 group-hover:opacity-100 blur-xl"
        initial={{ x: "-100%" }}
        whileHover={{ x: "100%" }}
        transition={{ duration: 0.5 }}
      />

      {/* Shadow effect */}
      <div className="absolute inset-0 shadow-lg group-hover:shadow-xl transition-shadow duration-300" />

      {/* Content */}
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
}
