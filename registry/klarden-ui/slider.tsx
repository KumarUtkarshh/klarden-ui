"use client";

import { cn } from "@/lib/utils";
import React, { useCallback, useEffect, useRef, useState } from "react";

interface SliderProps {
  /** Current progress value in seconds */
  value: number;
  /** Maximum value in seconds (total duration) */
  max: number;
  /** Callback when value changes */
  onValueChange?: (value: number) => void;
  /** Callback when dragging ends */
  onValueCommit?: (value: number) => void;
  /** Show remaining time as negative (true) or total duration as positive (false) */
  showRemaining?: boolean;
  /** Vertical gap between track and time display (Tailwind spacing token, e.g. "2", "4") */
  gap?: string;
  /** Whether the slider is disabled */
  disabled?: boolean;
  className?: string;
}

function formatTime(seconds: number): string {
  const absSeconds = Math.abs(seconds);
  const hours = Math.floor(absSeconds / 3600);
  const minutes = Math.floor((absSeconds % 3600) / 60);
  const secs = Math.floor(absSeconds % 60);

  const timeStr = [minutes, secs]
    .map((v) => v.toString().padStart(2, "0"))
    .join(":");

  return hours > 0 ? `${hours}:${timeStr}` : timeStr;
}

export function Slider({
  value,
  max,
  onValueChange,
  onValueCommit,
  showRemaining = true,
  gap = "1",
  disabled = false,
  className,
}: SliderProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [hoverValue, setHoverValue] = useState<number | null>(null);

  // Clamp value between 0 and max
  const clampedValue = Math.max(0, Math.min(value, max));
  const percentage = max > 0 ? (clampedValue / max) * 100 : 0;
  const remainingTime = max - clampedValue;

  const getValueFromPosition = useCallback(
    (clientX: number): number => {
      if (!trackRef.current) return 0;
      const rect = trackRef.current.getBoundingClientRect();
      const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
      const ratio = x / rect.width;
      return Math.round(ratio * max);
    },
    [max],
  );

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (disabled) return;
      e.preventDefault();
      setIsDragging(true);
      const newValue = getValueFromPosition(e.clientX);
      onValueChange?.(newValue);
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
    },
    [disabled, getValueFromPosition, onValueChange],
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (disabled) return;
      const newValue = getValueFromPosition(e.clientX);
      if (isDragging) {
        onValueChange?.(newValue);
      } else {
        setHoverValue(newValue);
      }
    },
    [isDragging, disabled, getValueFromPosition, onValueChange],
  );

  const handlePointerUp = useCallback(
    (e: React.PointerEvent) => {
      if (!isDragging) {
        setHoverValue(null);
        return;
      }
      setIsDragging(false);
      const newValue = getValueFromPosition(e.clientX);
      onValueCommit?.(newValue);
    },
    [isDragging, getValueFromPosition, onValueCommit],
  );

  const handleMouseLeave = useCallback(() => {
    setIsHovering(false);
    setHoverValue(null);
  }, []);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (disabled) return;

      const step = max > 600 ? 10 : 1;
      let newValue = clampedValue;

      switch (e.key) {
        case "ArrowRight":
          newValue = Math.min(clampedValue + step, max);
          break;
        case "ArrowLeft":
          newValue = Math.max(clampedValue - step, 0);
          break;
        case "Home":
          newValue = 0;
          break;
        case "End":
          newValue = max;
          break;
        default:
          return;
      }

      e.preventDefault();
      onValueChange?.(newValue);
      onValueCommit?.(newValue);
    };

    const track = trackRef.current;
    if (track) {
      track.addEventListener("keydown", handleKeyDown);
      return () => track.removeEventListener("keydown", handleKeyDown);
    }
  }, [clampedValue, max, disabled, onValueChange, onValueCommit]);

  const displayValue =
    isHovering && hoverValue !== null
      ? Math.max(0, Math.min(hoverValue, max))
      : clampedValue;

  // Map spacing token to px values
  const gapPx: Record<string, number> = {
    "0": 0,
    "1": 4,
    "2": 8,
    "3": 12,
    "4": 16,
    "5": 20,
    "6": 24,
    "8": 32,
  };
  const gapValue = gapPx[gap] ?? 8;

  return (
    <div className={cn("w-full", className)} style={{ display: "flex", flexDirection: "column", gap: gapValue }}>
      {/* Track */}
      <div
        ref={trackRef}
        className="relative group cursor-pointer select-none touch-none"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={handleMouseLeave}
        role="slider"
        aria-valuemin={0}
        aria-valuemax={max}
        aria-valuenow={clampedValue}
        tabIndex={0}
      >
        {/* Glow effect behind track */}
        <div
          className="absolute inset-y-0 left-0 -inset-x-1 rounded-full blur-xl opacity-0 group-hover:opacity-10 transition-opacity duration-500"
          style={{
            width: `${percentage}%`,
            background: "linear-gradient(90deg, currentColor, transparent)",
          }}
        />

        {/* Background track */}
        <div className="relative h-1 rounded-full bg-muted/50 backdrop-blur-sm">
          {/* Filled portion */}
          <div
            className="absolute inset-y-0 left-0 rounded-full bg-foreground transition-[width] duration-75 ease-out"
            style={{ width: `${percentage}%` }}
          />

          {/* Hover preview fill */}
          {isHovering && hoverValue !== null && !isDragging && (
            <div
              className="absolute inset-y-0 left-0 rounded-full bg-foreground/20 transition-none"
              style={{
                width: `${(Math.max(0, Math.min(hoverValue, max)) / max) * 100}%`,
              }}
            />
          )}

          {/* Thumb */}
          <div
            className={cn(
              "absolute top-1/2 -translate-y-1/2 -translate-x-1/2",
              "h-4 w-4 rounded-full bg-foreground",
              "transition-all duration-150 ease-out",
              isDragging && "scale-125",
              !isDragging && isHovering && "scale-110",
              !isHovering && "scale-0",
            )}
            style={{ left: `${percentage}%` }}
          >
            {/* Thumb inner dot */}
            <div className="absolute inset-1.5 rounded-full bg-background" />
          </div>
        </div>
      </div>

      {/* Time display */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-mono tabular-nums text-muted-foreground/60 transition-colors duration-150">
          {formatTime(displayValue)}
        </span>
        <span className="text-xs font-mono tabular-nums text-muted-foreground/60">
          {showRemaining ? `-${formatTime(remainingTime)}` : formatTime(max)}
        </span>
      </div>
    </div>
  );
}
