"use client";

import { forwardRef, useImperativeHandle } from "react";
import type { AnimatedIconHandle, AnimatedIconProps } from "./types";
import { motion, useAnimate } from "motion/react";

export interface HeartIconProps extends AnimatedIconProps {
  fill?: string;
}

const HeartIcon = forwardRef<AnimatedIconHandle, HeartIconProps>(
  (
    {
      size = 24,
      color = "currentColor",
      fill = "currentColor",
      strokeWidth = 2,
      className = "",
    },
    ref,
  ) => {
    const [scope, animate] = useAnimate();

    const start = async () => {
      await animate(
        ".heart",
        { scale: [1, 1.28, 0.92, 1.32, 1] },
        { duration: 0.65, ease: "easeInOut" },
      );
    };

    const stop = () => {
      animate(".heart", { scale: 1 }, { duration: 0.2, ease: "easeOut" });
    };

    useImperativeHandle(ref, () => ({
      startAnimation: start,
      stopAnimation: stop,
    }));

    return (
      <motion.svg
        ref={scope}
        onHoverStart={start}
        onHoverEnd={stop}
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill={fill}
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        className={`inline-flex items-center justify-center select-none ${className}`}
        style={{ overflow: "visible" }}
      >
        <motion.path stroke="none" d="M0 0h24v24H0z" fill="none" />
        <motion.path
          className="heart"
          style={{ transformOrigin: "50% 50%" }}
          d="M19.5 12.572l-7.5 7.428l-7.5 -7.428a5 5 0 1 1 7.5 -6.566a5 5 0 1 1 7.5 6.572"
        />
      </motion.svg>
    );
  },
);

HeartIcon.displayName = "HeartIcon";

export default HeartIcon;
