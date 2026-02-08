import { ReactNode } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";
import { BorderBeam } from "@/components/ui/border-beam";

export interface BentoGridProps {
  children: ReactNode;
  className?: string;
}

export interface BentoGridItemProps {
  title: string;
  description: string;
  icon: ReactNode;
  className?: string;
  header?: ReactNode;
  onLearnMore?: () => void;
}

export const BentoGrid = ({ children, className }: BentoGridProps) => {
  return (
    <div
      className={cn(
        "grid grid-cols-1 md:grid-cols-3 gap-4 max-w-7xl mx-auto",
        className
      )}
    >
      {children}
    </div>
  );
};

export const BentoGridItem = ({
  title,
  description,
  icon,
  className,
  header,
  onLearnMore,
}: BentoGridItemProps) => {
  return (
    <motion.div
      className={cn(
        "group relative bg-white rounded-xl border border-gray-100 p-8 overflow-hidden hover:border-blue-200 transition-all duration-400 flex flex-col h-full shadow-sm hover:shadow-xl",
        className
      )}
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ duration: 0.3 }}
    >
      {/* Border Beam Effect */}
      <BorderBeam 
        size={100} 
        duration={10} 
        delay={0}
        colorFrom="#3b82f6"
        colorTo="#2563eb"
        borderWidth={1}
      />

      {/* Elegant gradient overlay on hover */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-blue-50/0 via-transparent to-blue-50/0 group-hover:from-blue-50/40 group-hover:to-blue-50/20 transition-all duration-500 pointer-events-none"
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 1 }}
      />

      {/* Subtle top accent line */}
      <motion.div
        className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-blue-400 to-transparent"
        initial={{ scaleX: 0 }}
        whileHover={{ scaleX: 1 }}
        transition={{ duration: 0.4 }}
      />

      {/* Header/Icon area */}
      {header ? (
        <div className="mb-6 relative z-10">{header}</div>
      ) : (
        <div className="mb-6 relative z-10 flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 group-hover:from-blue-100 group-hover:to-blue-200 transition-all duration-300">
          {icon}
        </div>
      )}

      {/* Content */}
      <div className="relative z-10 flex-grow">
        <h3 className="text-xl font-semibold text-gray-900 mb-3 tracking-tight">{title}</h3>
        <p className="text-sm text-gray-500 leading-relaxed mb-6">{description}</p>
      </div>

      {/* Learn More Button - Optional */}
      {onLearnMore && (
        <motion.button
          onClick={onLearnMore}
          className="relative z-10 inline-flex items-center gap-2 text-blue-600 font-medium text-sm hover:text-blue-700 transition-colors group/button"
          whileHover={{ x: 2 }}
          transition={{ duration: 0.2 }}
        >
          Learn More
          <motion.span
            initial={{ x: 0 }}
            whileHover={{ x: 2 }}
            transition={{ duration: 0.2 }}
          >
            <ArrowRight className="w-4 h-4" />
          </motion.span>
        </motion.button>
      )}
    </motion.div>
  );
};
