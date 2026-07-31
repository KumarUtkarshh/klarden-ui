import { forwardRef, useImperativeHandle, useCallback } from "react";
import type { AnimatedIconHandle, AnimatedIconProps } from "./types";
import { motion, useAnimate } from "motion/react";

const BrandPerplexityIcon = forwardRef<AnimatedIconHandle, AnimatedIconProps>(
  ({ size = 24, color = "currentColor", className = "" }, ref) => {
    const [scope, animate] = useAnimate();

    const start = useCallback(() => {
      animate(
        scope.current,
        { scale: 1.1, rotate: [0, 90] },
        { duration: 0.4, ease: "easeInOut" }
      );
    }, [animate, scope]);

    const stop = useCallback(() => {
      animate(
        scope.current,
        { scale: 1, rotate: 0 },
        { duration: 0.3, ease: "easeInOut" }
      );
    }, [animate, scope]);

    useImperativeHandle(ref, () => ({
      startAnimation: start,
      stopAnimation: stop,
    }));

    return (
      <motion.svg
        ref={scope}
        onHoverStart={start}
        onHoverEnd={stop}
        fill="none"
        stroke={color}
        strokeWidth={1.75}
        strokeLinecap="round"
        strokeLinejoin="round"
        viewBox="0 0 24 24"
        width={size}
        height={size}
        xmlns="http://www.w3.org/2000/svg"
        className={`perplexity-icon cursor-pointer ${className}`}
        style={{ flex: "none", lineHeight: 1, transformOrigin: "center" }}
      >
        <title>Perplexity</title>
        <path d="M12 2v20M2 12h20M4.93 4.93l14.14 14.14M4.93 19.07L19.07 4.93" />
      </motion.svg>
    );
  }
);

BrandPerplexityIcon.displayName = "BrandPerplexityIcon";
export default BrandPerplexityIcon;
