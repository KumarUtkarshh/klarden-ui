"use client";

import React, { useRef, useState } from "react";
import {
  StretchyFooter,
  playStretchyFooterDemo,
  STRETCHY_FOOTER_PALETTES,
  DEFAULT_COLORS,
  DEFAULT_MAX_STRETCH,
  DEFAULT_COLUMNS,
  DEFAULT_BLUR,
  DEFAULT_STIFFNESS,
} from "@/registry/klarden-ui/stretchy-footer";
import {
  Play,
  RotateCcw,
  Sparkles,
  Flame,
  Droplets,
  Zap,
  Sliders,
  ChevronDown,
} from "lucide-react";
import { cn } from "@/lib/utils";

const DEMO_ID = "klarden-stretchy-footer-demo";

type PaletteKey = keyof typeof STRETCHY_FOOTER_PALETTES;

const PALETTE_OPTIONS: { key: PaletteKey; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { key: "default", label: "Aurora", icon: Sparkles },
  { key: "sunset", label: "Sunset", icon: Flame },
  { key: "ocean", label: "Ocean", icon: Droplets },
  { key: "neon", label: "Neon", icon: Zap },
];

export default function StretchyFooterDemo() {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [playing, setPlaying] = useState(false);

  // Customizable states
  const [paletteKey, setPaletteKey] = useState<PaletteKey>("default");
  const [maxStretch, setMaxStretch] = useState<number>(DEFAULT_MAX_STRETCH);
  const [columns, setColumns] = useState<number>(DEFAULT_COLUMNS);
  const [blur, setBlur] = useState<number>(DEFAULT_BLUR);
  const [stiffness, setStiffness] = useState<number>(DEFAULT_STIFFNESS);
  const [flip, setFlip] = useState<boolean>(false);
  const [rotated, setRotated] = useState<boolean>(false);

  const colors = STRETCHY_FOOTER_PALETTES[paletteKey] || DEFAULT_COLORS;

  const handlePlay = async () => {
    if (playing) return;
    setPlaying(true);
    try {
      await playStretchyFooterDemo({
        target: DEMO_ID,
        amount: 0.88,
        holdMs: 800,
        scrollRoot: scrollerRef.current,
      });
    } finally {
      setPlaying(false);
    }
  };

  const handleReset = () => {
    setPaletteKey("default");
    setMaxStretch(DEFAULT_MAX_STRETCH);
    setColumns(DEFAULT_COLUMNS);
    setBlur(DEFAULT_BLUR);
    setStiffness(DEFAULT_STIFFNESS);
    setFlip(false);
    setRotated(false);
  };

  return (
    <div className="w-full flex flex-col gap-5 p-3 sm:p-5">
      {/* Top Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-1">
        <div className="flex items-center gap-1.5 p-1 bg-zinc-100 dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800">
          {PALETTE_OPTIONS.map((item) => {
            const Icon = item.icon;
            const active = paletteKey === item.key;
            return (
              <button
                key={item.key}
                onClick={() => setPaletteKey(item.key)}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all",
                  active
                    ? "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 shadow-xs"
                    : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-300"
                )}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePlay}
            disabled={playing}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-zinc-100 dark:hover:bg-zinc-200 dark:text-zinc-900 shadow-sm transition-all active:scale-95 disabled:opacity-50"
          >
            <Play className={cn("w-3.5 h-3.5", playing && "animate-spin")} />
            <span>{playing ? "Playing..." : "Trigger Stretch"}</span>
          </button>

          <button
            onClick={handleReset}
            title="Reset options"
            className="p-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-all active:rotate-180"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Scroller Stage with Stretchy Aurora */}
      <div className="relative w-full h-[460px] rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950/70 overflow-hidden shadow-inner">
        {/* Stretchy Aurora Engine */}
        <StretchyFooter
          demoId={DEMO_ID}
          scrollRef={scrollerRef}
          contentSelector="[data-stretchy-content]"
          colors={colors}
          maxStretch={maxStretch}
          columns={columns}
          stiffness={stiffness}
          blur={blur}
          flip={flip}
          rotate={rotated ? 180 : 0}
          className="z-20"
        />

        {/* Scrollable Container */}
        <div
          ref={scrollerRef}
          className="relative z-10 h-full overflow-y-auto overscroll-contain px-4 py-8 sm:px-12 sm:py-12"
        >
          <div
            data-stretchy-content
            className="flex min-h-[160%] flex-col items-center justify-between text-center select-none"
          >
            {/* Header info */}
            <div className="flex flex-col items-center gap-3 pt-6">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-medium tracking-wide uppercase bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                <Sparkles className="w-3 h-3" />
                Dia-Style Rubber Overscroll
              </div>
              <h3 className="text-2xl sm:text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
                Overscroll past the bottom
              </h3>
              <p className="max-w-md text-xs sm:text-sm text-zinc-500 dark:text-zinc-400">
                Scroll or pull past the lower boundary to see the physics-based
                aurora lift up and wobble back into place.
              </p>
            </div>

            {/* Scroll Indicator */}
            <div className="my-14 flex flex-col items-center gap-2 text-zinc-400 dark:text-zinc-600">
              <span className="text-xs font-mono uppercase tracking-widest">
                Keep Scrolling Down
              </span>
              <ChevronDown className="w-4 h-4 animate-bounce" />
            </div>

            {/* Bottom Target Card */}
            <div className="w-full max-w-md p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800/80 bg-white/70 dark:bg-zinc-900/60 backdrop-blur-md shadow-xs">
              <h4 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                Bottom Floor Reached
              </h4>
              <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                Pull further with your mouse wheel, trackpad, or touch gesture to stretch the aurora!
              </p>
              <div className="mt-4 flex items-center justify-center gap-2">
                <button
                  onClick={handlePlay}
                  disabled={playing}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-900 dark:text-zinc-100 transition-all"
                >
                  <Play className="w-3 h-3" />
                  Test Spring Animation
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Physics & Styling Controls */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 rounded-2xl bg-zinc-100/60 dark:bg-zinc-900/40 border border-zinc-200/80 dark:border-zinc-800/80 text-xs">
        <div className="flex flex-col gap-1.5">
          <div className="flex justify-between text-zinc-600 dark:text-zinc-400 font-medium">
            <span>Stretch</span>
            <span className="font-mono text-zinc-900 dark:text-zinc-200">{maxStretch}px</span>
          </div>
          <input
            type="range"
            min={120}
            max={380}
            step={10}
            value={maxStretch}
            onChange={(e) => setMaxStretch(Number(e.target.value))}
            className="w-full accent-zinc-900 dark:accent-zinc-100 h-1.5 bg-zinc-200 dark:bg-zinc-800 rounded-lg cursor-pointer"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <div className="flex justify-between text-zinc-600 dark:text-zinc-400 font-medium">
            <span>Columns</span>
            <span className="font-mono text-zinc-900 dark:text-zinc-200">{columns}</span>
          </div>
          <input
            type="range"
            min={3}
            max={21}
            step={2}
            value={columns}
            onChange={(e) => setColumns(Number(e.target.value))}
            className="w-full accent-zinc-900 dark:accent-zinc-100 h-1.5 bg-zinc-200 dark:bg-zinc-800 rounded-lg cursor-pointer"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <div className="flex justify-between text-zinc-600 dark:text-zinc-400 font-medium">
            <span>Blur</span>
            <span className="font-mono text-zinc-900 dark:text-zinc-200">{blur}px</span>
          </div>
          <input
            type="range"
            min={0}
            max={32}
            step={2}
            value={blur}
            onChange={(e) => setBlur(Number(e.target.value))}
            className="w-full accent-zinc-900 dark:accent-zinc-100 h-1.5 bg-zinc-200 dark:bg-zinc-800 rounded-lg cursor-pointer"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <div className="flex justify-between text-zinc-600 dark:text-zinc-400 font-medium">
            <span>Stiffness</span>
            <span className="font-mono text-zinc-900 dark:text-zinc-200">{stiffness}</span>
          </div>
          <input
            type="range"
            min={150}
            max={600}
            step={25}
            value={stiffness}
            onChange={(e) => setStiffness(Number(e.target.value))}
            className="w-full accent-zinc-900 dark:accent-zinc-100 h-1.5 bg-zinc-200 dark:bg-zinc-800 rounded-lg cursor-pointer"
          />
        </div>

        {/* Toggles */}
        <div className="col-span-2 sm:col-span-4 flex flex-wrap items-center gap-4 pt-1 border-t border-zinc-200/60 dark:border-zinc-800/60">
          <label className="flex items-center gap-2 cursor-pointer select-none text-zinc-700 dark:text-zinc-300">
            <input
              type="checkbox"
              checked={flip}
              onChange={(e) => setFlip(e.target.checked)}
              className="rounded border-zinc-300 text-zinc-900 focus:ring-0 dark:border-zinc-700 dark:bg-zinc-800"
            />
            <span>Invert Pyramid (Tall Edges)</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer select-none text-zinc-700 dark:text-zinc-300">
            <input
              type="checkbox"
              checked={rotated}
              onChange={(e) => setRotated(e.target.checked)}
              className="rounded border-zinc-300 text-zinc-900 focus:ring-0 dark:border-zinc-700 dark:bg-zinc-800"
            />
            <span>Rotate 180° (Hang from content)</span>
          </label>
        </div>
      </div>
    </div>
  );
}
