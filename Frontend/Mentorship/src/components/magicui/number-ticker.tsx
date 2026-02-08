import { motion, useMotionValue, useTransform } from "framer-motion";
import { useState, useEffect } from "react";

interface NumberTickerProps {
  value: string;
  className?: string;
}

export function NumberTicker({ value, className = "" }: NumberTickerProps) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.round(latest));
  const [displayValue, setDisplayValue] = useState("0");

  const numericValue = parseInt(value.replace(/[^0-9]/g, ""));
  const suffix = value.replace(/[0-9,]/g, "");

  useEffect(() => {
    const unsubscribe = rounded.on("change", (latest) => {
      setDisplayValue(latest.toLocaleString() + suffix);
    });

    count.set(numericValue);

    return () => unsubscribe();
  }, [numericValue, suffix, count, rounded]);

  return (
    <motion.p className={`text-3xl md:text-4xl font-bold ${className}`}>
      {displayValue}
    </motion.p>
  );
}
