"use client";

import { RichButton } from "@/registry/klarden-ui/rich-button";
import { motion } from "framer-motion";
import { ArrowRight, Layout } from "lucide-react";
import Link from "next/link";

export function Hero() {
  return (
    <div className="relative flex flex-col items-center text-center space-y-6 pt-16 pb-4 md:pt-24 md:pb-6 overflow-visible">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 -translate-y-1/2 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-primary/5 blur-[120px] rounded-full pointer-events-none -z-10" />
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] dark:bg-[radial-gradient(#1f2937_1px,transparent_1px)] [background-size:40px_40px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)] -z-20 opacity-40 pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-100/50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 text-[10px] font-black uppercase tracking-[0.25em] text-zinc-500 backdrop-blur-md shadow-sm"
      >
        <div className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse shadow-[0_0_8px_rgba(var(--primary),0.5)]" />
        Curated for Design Engineers
      </motion.div>

      <div className="space-y-4 max-w-5xl">
        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
          className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-[0.95] text-zinc-900 dark:text-zinc-50"
        >
          Refined components for <br />
          <span className="text-zinc-400 dark:text-zinc-600 italic font-serif font-light lowercase">
            modern builders.
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
          className="mx-auto max-w-2xl text-zinc-500 dark:text-zinc-400 text-base md:text-lg lg:text-xl font-bold leading-relaxed tracking-tight px-4"
        >
          High-end React primitives engineered with{" "}
          <br className="hidden md:block" />
          tactile precision and fluid motion.
        </motion.p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
        className="flex flex-wrap items-center justify-center gap-3 pt-4"
      >
        <Link href="/docs/introduction">
          <RichButton
            size="default"
            color="default"
            className="rounded-2xl h-12 px-8 text-xs font-black uppercase tracking-widest border-zinc-200 dark:border-zinc-800 shadow-xl shadow-zinc-200/50 dark:shadow-none transition-all active:scale-95"
          >
            Explore Docs <ArrowRight size={14} className="ml-2" />
          </RichButton>
        </Link>
        <Link href="/docs/components/accordion">
          <RichButton
            size="default"
            color="blue"
            className="rounded-2xl h-12 px-8 text-xs font-black uppercase tracking-widest gap-2 shadow-xl shadow-blue-500/10 transition-all active:scale-95"
          >
            <Layout size={14} /> Components
          </RichButton>
        </Link>
      </motion.div>
    </div>
  );
}
