import { motion } from "framer-motion";
import { ReactNode } from "react";

interface FadeInProps {
  children: ReactNode;
  delay?: number;
  duration?: number;
  y?: number;
  className?: string;
}

const easing = [0.25, 0.46, 0.45, 0.94]; // premium deceleration curve

export const FadeIn = ({ children, delay = 0, duration = 0.6, y = 24, className }: FadeInProps) => (
  <motion.div
    initial={{ opacity: 0, y }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-60px" }}
    transition={{ duration, delay, ease: easing }}
    className={className}
  >
    {children}
  </motion.div>
);

export const FadeInStagger = ({ children, className }: { children: ReactNode; className?: string }) => (
  <motion.div
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, margin: "-60px" }}
    variants={{
      hidden: {},
      visible: { transition: { staggerChildren: 0.15 } },
    }}
    className={className}
  >
    {children}
  </motion.div>
);

export const FadeInChild = ({ children, className }: { children: ReactNode; className?: string }) => (
  <motion.div
    variants={{
      hidden: { opacity: 0, y: 20 },
      visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: easing } },
    }}
    className={className}
  >
    {children}
  </motion.div>
);

export default FadeIn;
