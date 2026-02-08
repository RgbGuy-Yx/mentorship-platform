import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

interface AnimatedBeamProps {
  className?: string;
  containerClassName?: string;
  fromRef: React.RefObject<HTMLDivElement>;
  toRef: React.RefObject<HTMLDivElement>;
  curvature?: number;
  reverse?: boolean;
  duration?: number;
  delay?: number;
  pathClassName?: string;
  dotSize?: number;
  gradientStartColor?: string;
  gradientStopColor?: string;
}

export const AnimatedBeam = React.forwardRef<
  SVGSVGElement,
  AnimatedBeamProps
>(
  (
    {
      className = "",
      containerClassName = "",
      fromRef,
      toRef,
      curvature = 0,
      reverse = false,
      duration = 3,
      delay = 0,
      pathClassName = "",
      dotSize = 5,
      gradientStartColor = "#3b82f6",
      gradientStopColor = "#1e40af",
    },
    ref
  ) => {
    const svgRef = useRef<SVGSVGElement>(null);
    const [pathD, setPathD] = useState("");
    const [animationKey, setAnimationKey] = useState(0);

    useEffect(() => {
      const updatePath = () => {
        if (fromRef.current && toRef.current && svgRef.current) {
          const container = svgRef.current.parentElement;
          if (!container) return;

          const from = fromRef.current.getBoundingClientRect();
          const to = toRef.current.getBoundingClientRect();
          const containerRect = container.getBoundingClientRect();

          const fromX = from.left - containerRect.left + from.width / 2;
          const fromY = from.top - containerRect.top + from.height / 2;
          const toX = to.left - containerRect.left + to.width / 2;
          const toY = to.top - containerRect.top + to.height / 2;

          const controlX = (fromX + toX) / 2;
          const controlY = (fromY + toY) / 2 + curvature;

          const path = `M ${fromX} ${fromY} Q ${controlX} ${controlY} ${toX} ${toY}`;
          setPathD(path);
          setAnimationKey((prev) => prev + 1);
        }
      };

      updatePath();
      window.addEventListener("resize", updatePath);
      return () => window.removeEventListener("resize", updatePath);
    }, [fromRef, toRef, curvature]);

    return (
      <svg
        ref={svgRef || ref}
        className={`absolute inset-0 w-full h-full pointer-events-none ${containerClassName}`}
        style={{ overflow: "visible" }}
      >
        <defs>
          <linearGradient id={`gradient-${animationKey}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={gradientStartColor} stopOpacity="1" />
            <stop offset="100%" stopColor={gradientStopColor} stopOpacity="0.6" />
          </linearGradient>
          <filter id={`glow-${animationKey}`}>
            <feGaussianBlur stdDeviation="0.8" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Main animated path - minimal style */}
        <motion.path
          d={pathD}
          stroke={`url(#gradient-${animationKey})`}
          strokeWidth="1"
          fill="none"
          strokeLinecap="round"
          className={pathClassName}
          filter={`url(#glow-${animationKey})`}
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{
            duration,
            delay,
            ease: "easeInOut",
          }}
        />

        {/* Minimal animated dot */}
        <motion.g
          initial={{ offsetDistance: reverse ? "100%" : "0%" }}
          animate={{ offsetDistance: reverse ? "0%" : "100%" }}
          transition={{
            duration: duration * 0.8,
            delay,
            ease: "easeInOut",
            repeat: Infinity,
            repeatType: "loop",
          }}
        >
          <circle
            cx="0"
            cy="0"
            r={dotSize * 0.8}
            fill={gradientStartColor}
            opacity="0.8"
          />
        </motion.g>
      </svg>
    );
  }
);

AnimatedBeam.displayName = "AnimatedBeam";
