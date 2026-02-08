import { motion } from "framer-motion";

interface AnimatedAvatarProps {
  initials: string;
  className?: string;
}

export function AnimatedAvatar({ initials, className = "" }: AnimatedAvatarProps) {
  return (
    <motion.div
      className={`w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-700 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4 ${className}`}
      initial={{ scale: 0, rotate: -180 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={{
        type: "spring",
        stiffness: 260,
        damping: 20,
      }}
      whileHover={{
        scale: 1.1,
        boxShadow: "0 8px 16px rgba(59, 130, 246, 0.4)",
      }}
    >
      {initials}
    </motion.div>
  );
}
