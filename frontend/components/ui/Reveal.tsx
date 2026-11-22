
"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

type RevealProps = {
    children: ReactNode;
    className?: string;
    delay?: number;
    direction?: "up" | "left" | "right";
};

export default function Reveal({
    children,
    className,
    delay = 0,
    direction = "up",
}: RevealProps) {
    const reducedMotion = useReducedMotion();

    const offsets = {
        up: { x: 0, y: 36 },
        left: { x: -36, y: 0 },
        right: { x: 36, y: 0 },
    };

    return (
        <motion.div
            className={className}
            initial={
                reducedMotion
                    ? false
                    : {
                        opacity: 0,
                        ...offsets[direction],
                        filter: "blur(5px)",
                    }
            }
            whileInView={{
                opacity: 1,
                x: 0,
                y: 0,
                filter: "blur(0px)",
            }}
            viewport={{ once: true, amount: 0.12 }}
            transition={{
                duration: 0.65,
                delay,
                ease: [0.22, 1, 0.36, 1],
            }}
        >
            {children}
        </motion.div>
    );
}
