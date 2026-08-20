"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";

/**
 * Staggered scroll-reveal wrapper for homepage sections. Framer Motion
 * animations are JS-driven (not CSS), so the global prefers-reduced-motion
 * override in globals.css does not reach them automatically — this
 * explicitly checks useReducedMotion() and disables motion when it's set.
 */
export function SectionReveal({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const reduceMotion = useReducedMotion();

  const variants: Variants = reduceMotion
    ? { hidden: { opacity: 1, y: 0 }, visible: { opacity: 1, y: 0 } }
    : {
        hidden: { opacity: 0, y: 24 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1], delay } },
      };

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      // Vertical-only margin: a single value shrinks the intersection root
      // on all four sides, so content within 80px of the left/right
      // viewport edge (the norm on mobile) would never trigger and stay
      // permanently invisible (opacity: 0, since `once: true`).
      viewport={{ once: true, margin: "-80px 0px" }}
      variants={variants}
    >
      {children}
    </motion.div>
  );
}

/** Parent for a staggered group of `StaggerItem` children. */
export function StaggerGroup({ children, className }: { children: React.ReactNode; className?: string }) {
  const reduceMotion = useReducedMotion();

  const container: Variants = {
    hidden: {},
    visible: {
      transition: reduceMotion ? {} : { staggerChildren: 0.1 },
    },
  };

  return (
    <motion.div className={className} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px 0px" }} variants={container}>
      {children}
    </motion.div>
  );
}

export function StaggerItem({ children, className }: { children: React.ReactNode; className?: string }) {
  const reduceMotion = useReducedMotion();

  const item: Variants = reduceMotion
    ? { hidden: { opacity: 1, y: 0 }, visible: { opacity: 1, y: 0 } }
    : { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } } };

  return (
    <motion.div className={className} variants={item}>
      {children}
    </motion.div>
  );
}
