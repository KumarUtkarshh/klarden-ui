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
import { ArrowDown, SlidersHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";

const DEMO_ID = "stretchy-footer-preview";

type PaletteKey = keyof typeof STRETCHY_FOOTER_PALETTES;

const PALETTES: { key: PaletteKey; label: string; dot: string }[] = [
  {
    key: "default",
    label: "Aurora",
    dot: "bg-gradient-to-r from-pink-500 via-amber-400 to-blue-600",
  },
  {
    key: "sunset",
    label: "Sunset",
    dot: "bg-gradient-to-r from-amber-300 via-rose-500 to-purple-800",
  },
  {
    key: "ocean",
    label: "Ocean",
    dot: "bg-gradient-to-r from-cyan-300 via-blue-500 to-indigo-900",
  },
  {
    key: "neon",
    label: "Neon",
    dot: "bg-gradient-to-r from-cyan-400 via-purple-600 to-pink-500",
  },
];

export default function StretchyFooterDemo() {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [playing, setPlaying] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  // Configuration options
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
      // Smoothly return back to the centered hero position
      await new Promise<void>((r) => window.setTimeout(r, 450));
      scrollerRef.current?.scrollTo({ top: 0, behavior: "smooth" });
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
    <div className="relative w-full h-[520px] overflow-hidden bg-background select-none flex flex-col">
      {/* Canvas Aurora Engine */}
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

      {/* Floating Header Toolbar */}
      <div className="absolute top-3 inset-x-3 z-30 flex items-center justify-between gap-2 pointer-events-none">
        {/* Palette Selector */}
        <div className="flex items-center gap-1 p-1 rounded-xl bg-background/80 dark:bg-zinc-900/80 backdrop-blur-md border border-zinc-200/80 dark:border-zinc-800/80 shadow-xs pointer-events-auto">
          {PALETTES.map((p) => {
            const active = paletteKey === p.key;
            return (
              <button
                key={p.key}
                type="button"
                onClick={() => setPaletteKey(p.key)}
                className={cn(
                  "flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-colors",
                  active
                    ? "bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 shadow-xs"
                    : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200"
                )}
              >
                <span className={cn("w-2 h-2 rounded-full", p.dot)} />
                <span>{p.label}</span>
              </button>
            );
          })}
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5 pointer-events-auto">
          <button
            type="button"
            onClick={() => setShowSettings((prev) => !prev)}
            aria-label="Toggle settings"
            className={cn(
              "p-2 rounded-xl border backdrop-blur-md transition-colors",
              showSettings
                ? "bg-zinc-900 text-zinc-50 border-zinc-900 dark:bg-zinc-100 dark:text-zinc-900 dark:border-zinc-100"
                : "bg-background/80 dark:bg-zinc-900/80 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 border-zinc-200/80 dark:border-zinc-800/80 shadow-xs"
            )}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Pop-down Settings Tray */}
      {showSettings && (
        <div className="absolute top-14 right-3 z-30 w-72 p-3.5 rounded-2xl bg-background/95 dark:bg-zinc-900/95 backdrop-blur-md border border-zinc-200/90 dark:border-zinc-800/90 shadow-xl flex flex-col gap-3 text-xs animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="flex items-center justify-between font-medium text-zinc-500 dark:text-zinc-400">
            <span>Stretch height</span>
            <span className="font-mono text-zinc-900 dark:text-zinc-100">{maxStretch}px</span>
          </div>
          <input
            type="range"
            min={120}
            max={360}
            step={10}
            value={maxStretch}
            onChange={(e) => setMaxStretch(Number(e.target.value))}
            className="w-full h-1 bg-zinc-200 dark:bg-zinc-800 rounded-full appearance-none cursor-pointer accent-zinc-900 dark:accent-zinc-100"
          />

          <div className="flex items-center justify-between font-medium text-zinc-500 dark:text-zinc-400">
            <span>Columns</span>
            <span className="font-mono text-zinc-900 dark:text-zinc-100">{columns}</span>
          </div>
          <input
            type="range"
            min={3}
            max={19}
            step={2}
            value={columns}
            onChange={(e) => setColumns(Number(e.target.value))}
            className="w-full h-1 bg-zinc-200 dark:bg-zinc-800 rounded-full appearance-none cursor-pointer accent-zinc-900 dark:accent-zinc-100"
          />

          <div className="flex items-center justify-between font-medium text-zinc-500 dark:text-zinc-400">
            <span>Blur</span>
            <span className="font-mono text-zinc-900 dark:text-zinc-100">{blur}px</span>
          </div>
          <input
            type="range"
            min={0}
            max={32}
            step={2}
            value={blur}
            onChange={(e) => setBlur(Number(e.target.value))}
            className="w-full h-1 bg-zinc-200 dark:bg-zinc-800 rounded-full appearance-none cursor-pointer accent-zinc-900 dark:accent-zinc-100"
          />

          <div className="pt-2 border-t border-zinc-200/70 dark:border-zinc-800/70 flex flex-col gap-2">
            <label className="flex items-center justify-between cursor-pointer text-zinc-600 dark:text-zinc-300">
              <span>Invert pyramid</span>
              <input
                type="checkbox"
                checked={flip}
                onChange={(e) => setFlip(e.target.checked)}
                className="w-3.5 h-3.5 rounded border-zinc-300 dark:border-zinc-700 accent-zinc-900 dark:accent-zinc-100"
              />
            </label>
            <label className="flex items-center justify-between cursor-pointer text-zinc-600 dark:text-zinc-300">
              <span>Rotate 180°</span>
              <input
                type="checkbox"
                checked={rotated}
                onChange={(e) => setRotated(e.target.checked)}
                className="w-3.5 h-3.5 rounded border-zinc-300 dark:border-zinc-700 accent-zinc-900 dark:accent-zinc-100"
              />
            </label>

            <button
              type="button"
              onClick={handleReset}
              className="mt-1 text-[11px] font-medium text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200 text-left transition-colors cursor-pointer"
            >
              Reset to defaults
            </button>
          </div>
        </div>
      )}

      {/* Main Scroller Content (no visible scrollbar, centered text, natural scroll flow) */}
      <div
        ref={scrollerRef}
        className="relative z-10 h-full overflow-y-auto no-scrollbar [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden scroll-smooth px-6"
      >
        <div
          data-stretchy-content
          className="flex flex-col items-center"
        >
          {/* Viewport 1: Dead-centered editorial block */}
          <div className="h-[520px] w-full flex flex-col items-center justify-center text-center max-w-sm mx-auto px-4">
            <h3 className="text-xl sm:text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
              Rubber-band overscroll
            </h3>
            <p className="mt-2.5 text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
              Overscroll past the bottom boundary to reveal the aurora.
              Springs back with customizable harmonic wobble.
            </p>

            <div className="mt-6">
              <button
                type="button"
                onClick={handlePlay}
                disabled={playing}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium bg-zinc-900 text-zinc-50 hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200 shadow-xs transition-transform active:scale-95 disabled:opacity-50 cursor-pointer"
              >
                <ArrowDown className="w-3.5 h-3.5" />
                <span>{playing ? "Playing…" : "Show effect"}</span>
              </button>
            </div>

            <div className="mt-8 flex flex-col items-center gap-1 text-[11px] font-mono tracking-widest text-zinc-400/80 dark:text-zinc-500/80 uppercase">
              <span>Scroll down</span>
              <span className="text-xs">↓</span>
            </div>
          </div>

          {/* Buffer track leading into the bottom floor */}
          <div className="h-[200px] w-full flex items-center justify-center pb-8">
            <p className="text-[11px] font-mono tracking-widest text-zinc-400 dark:text-zinc-600 uppercase">
              Pull past bottom
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
