"use client";

import { motion, type Variants } from "framer-motion";
import type { ReactNode } from "react";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.96 },
  visible: { opacity: 1, scale: 1 },
};

interface Props {
  children: ReactNode;
  variant?: "up" | "fade" | "scale";
  delay?: number;
  duration?: number;
  className?: string;
  once?: boolean;
}

export function AnimateIn({
  children,
  variant = "up",
  delay = 0,
  duration = 0.5,
  className,
  once = true,
}: Props) {
  const variants = variant === "fade" ? fadeIn : variant === "scale" ? scaleIn : fadeUp;

  return (
    <motion.div
      variants={variants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once }}
      transition={{ duration, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

interface StaggerProps {
  children: ReactNode;
  className?: string;
  stagger?: number;
  once?: boolean;
}

const staggerContainer: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

export function StaggerIn({ children, className, stagger = 0.1, once = true }: StaggerProps) {
  return (
    <motion.div
      variants={{ ...staggerContainer, visible: { transition: { staggerChildren: stagger } } }}
      initial="hidden"
      whileInView="visible"
      viewport={{ once }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export const MotionDiv = motion.div;
export const MotionSection = motion.section;
