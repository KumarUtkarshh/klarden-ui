"use client";

import { CommandOrbit } from "@/registry/klarden-ui/command-orbit";
import { MagneticDock } from "@/registry/klarden-ui/magnetic-dock";
import { SpotifyCard } from "@/registry/klarden-ui/spotify/spotify-card";
import { TactileHighlight } from "@/registry/klarden-ui/tactile-highlight";
import { Signature } from "@/registry/klarden-ui/signature";
import {
  Pagination,
  usePaginationState,
} from "@/registry/klarden-ui/pagination";
import BoxCarousel from "@/registry/klarden-ui/box-carousel";
import { ImageTrail, ImageTrailItem } from "@/registry/klarden-ui/image-trail";
import { AnimatePresence, motion, type Variants } from "framer-motion";
import {
  Layout,
  MousePointer2,
  Type,
  Zap,
  PenTool,
  Box,
  ChevronRight,
  Image as ImageIcon,
} from "lucide-react";
import { useState, useRef } from "react";
import { cn } from "@/lib/utils";

const SPOTIFY_TRACKS = [
  {
    id: "dark-thoughts",
    url: "https://open.spotify.com/track/7EW7Yivb93qKAtp5qEm5of",
  },
  {
    id: "why",
    url: "https://open.spotify.com/track/5iis4YlH20yv6wqjkwnyGo",
  },
  {
    id: "ball-hog",
    url: "https://open.spotify.com/track/6DiBmgLYK0r6uidXhn8wD8",
  },
];

const spotifySlideVariants: Variants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 80 : -80,
    opacity: 0,
    scale: 0.95,
  }),
  center: {
    x: 0,
    opacity: 1,
    scale: 1,
    transition: {
      x: { type: "spring", stiffness: 300, damping: 28 },
      opacity: { duration: 0.25 },
      scale: { duration: 0.25 },
    },
  },
  exit: (direction: number) => ({
    x: direction < 0 ? 80 : -80,
    opacity: 0,
    scale: 0.95,
    transition: {
      x: { type: "spring", stiffness: 300, damping: 28 },
      opacity: { duration: 0.2 },
      scale: { duration: 0.2 },
    },
  }),
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

const BOX_CAROUSEL_ITEMS = [
  {
    id: "beach",
    type: "image" as const,
    src: "/images/box-carousel-1.jpg",
    alt: "Beautiful tropical beach",
  },
  {
    id: "mountains",
    type: "image" as const,
    src: "/images/box-carousel-2.jpg",
    alt: "Snowy mountain peaks under a starry night sky",
  },
  {
    id: "galaxy",
    type: "image" as const,
    src: "/images/box-carousel-3.jpg",
    alt: "Vibrant cosmic galaxy dust and stars",
  },
  {
    id: "sunset",
    type: "image" as const,
    src: "/images/box-carousel-4.jpg",
    alt: "Colorful sunset over a calm ocean beach",
  },
  {
    id: "valley",
    type: "image" as const,
    src: "/images/box-carousel-5.jpg",
    alt: "Beautiful green valley mountain trail",
  },
  {
    id: "hills",
    type: "image" as const,
    src: "/images/box-carousel-6.jpg",
    alt: "Deep forest hills under a sunny sky",
  },
];

const TRAIL_IMAGES = [
  "/images/trail-1.jpg",
  "/images/trail-2.jpg",
  "/images/trail-3.jpg",
  "/images/trail-4.jpg",
  "/images/trail-5.jpg",
];

export function Showcase() {
  const pagination = usePaginationState(1);
  const [spotifyTrackIndex, setSpotifyTrackIndex] = useState(0);
  const [spotifyDirection, setSpotifyDirection] = useState(0);
  const lastWheelTime = useRef(0);

  const handleSpotifyChange = (newIndex: number) => {
    if (newIndex === spotifyTrackIndex) return;
    setSpotifyDirection(newIndex > spotifyTrackIndex ? 1 : -1);
    setSpotifyTrackIndex(newIndex);
  };

  const handleSpotifyNext = () => {
    setSpotifyDirection(1);
    setSpotifyTrackIndex((prev) => (prev + 1) % SPOTIFY_TRACKS.length);
  };

  const handleSpotifyPrev = () => {
    setSpotifyDirection(-1);
    setSpotifyTrackIndex(
      (prev) => (prev - 1 + SPOTIFY_TRACKS.length) % SPOTIFY_TRACKS.length,
    );
  };

  const handleSpotifyWheel = (e: React.WheelEvent) => {
    const now = Date.now();
    if (now - lastWheelTime.current < 400) return;

    if (Math.abs(e.deltaX) > 20) {
      if (e.deltaX > 0) {
        handleSpotifyNext();
      } else {
        handleSpotifyPrev();
      }
      lastWheelTime.current = now;
    } else if (Math.abs(e.deltaY) > 30 && e.shiftKey) {
      if (e.deltaY > 0) {
        handleSpotifyNext();
      } else {
        handleSpotifyPrev();
      }
      lastWheelTime.current = now;
    }
  };

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      transition={{ staggerChildren: 0.1 }}
      className="grid grid-cols-1 md:grid-cols-12 gap-5 lg:gap-6"
    >
      {/* Command Orbit */}
      <motion.div
        variants={itemVariants}
        className="md:col-span-8 group relative overflow-hidden rounded-3xl border border-border bg-card/50 shadow-sm backdrop-blur-sm transition-colors duration-500"
      >
        <div className="absolute top-6 left-6 z-10">
          <div className="flex items-center gap-2 px-2 py-1 rounded-lg bg-background border border-border text-[8px] font-black uppercase tracking-widest text-muted-foreground mb-2 w-fit shadow-xs">
            <MousePointer2 size={10} /> Interactive
          </div>
          <h3 className="text-xl font-bold tracking-tight">Command Orbit</h3>
        </div>
        <div className="flex items-center justify-center min-h-80 p-6">
          <CommandOrbit radius={90} className="scale-75 sm:scale-100" />
        </div>
      </motion.div>

      {/* Signature */}
      <motion.div
        variants={itemVariants}
        className="md:col-span-4 group relative overflow-hidden rounded-3xl border border-border bg-card/50 p-6 md:p-8 shadow-sm backdrop-blur-sm transition-colors duration-500 flex flex-col justify-center min-h-80"
      >
        <div className="absolute top-6 left-6 z-10">
          <div className="flex items-center gap-2 px-2 py-1 rounded-lg bg-background border border-border text-[8px] font-black uppercase tracking-widest text-muted-foreground mb-2 w-fit shadow-xs">
            <PenTool size={10} /> Vector
          </div>
          <h3 className="text-xl font-bold tracking-tight">Signature</h3>
        </div>
        <div className="flex items-center justify-center mt-12 overflow-hidden">
          <Signature
            text="Klarden UI"
            color="currentColor"
            className="text-zinc-900 dark:text-zinc-50"
            fontSize={36}
            duration={1.8}
            delay={0.3}
            glow={false}
            inView={true}
            once={false}
          />
        </div>
      </motion.div>

      {/* Spotify Card showcase */}
      <motion.div
        variants={itemVariants}
        onWheel={handleSpotifyWheel}
        className="md:col-span-5 group relative overflow-hidden rounded-3xl border border-border bg-card/50 p-6 md:p-8 shadow-sm backdrop-blur-sm transition-colors duration-500 flex flex-col items-center justify-between min-h-80 select-none"
      >
        <div className="absolute top-6 left-6 z-10 pointer-events-none">
          <div className="flex items-center gap-2 px-2 py-1 rounded-lg bg-background border border-border text-[8px] font-black uppercase tracking-widest text-muted-foreground mb-2 w-fit shadow-xs pointer-events-auto">
            <Zap size={10} /> Media
          </div>
          <h3 className="text-xl font-bold tracking-tight pointer-events-auto">
            Spotify Card
          </h3>
        </div>

        {/* Carousel Card with Mouse Drag / Slide */}
        <div className="relative w-full flex-1 flex items-center justify-center mt-12 overflow-hidden">
          <AnimatePresence
            initial={false}
            custom={spotifyDirection}
            mode="wait"
          >
            <motion.div
              key={spotifyTrackIndex}
              custom={spotifyDirection}
              variants={spotifySlideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.2}
              onDragEnd={(_, { offset, velocity }) => {
                const swipeThreshold = 40;
                if (offset.x < -swipeThreshold || velocity.x < -250) {
                  handleSpotifyNext();
                } else if (offset.x > swipeThreshold || velocity.x > 250) {
                  handleSpotifyPrev();
                }
              }}
              className="cursor-grab active:cursor-grabbing scale-90 xl:scale-100 transition-transform touch-pan-y"
            >
              <SpotifyCard trackUrl={SPOTIFY_TRACKS[spotifyTrackIndex].url} />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* 3 Ellipses / Dots Indicators */}
        <div className="flex items-center justify-center gap-2 mt-2 z-10">
          {SPOTIFY_TRACKS.map((track, i) => {
            const isActive = i === spotifyTrackIndex;
            return (
              <button
                key={track.id}
                type="button"
                onClick={() => handleSpotifyChange(i)}
                aria-label={`Go to song ${i + 1}`}
                className="relative py-1.5 px-1 flex items-center justify-center cursor-pointer group/dot focus:outline-none focus-visible:ring-1 focus-visible:ring-ring rounded-full"
              >
                <span
                  className={cn(
                    "block rounded-full transition-all duration-300",
                    isActive
                      ? "w-6 h-1.5 bg-foreground"
                      : "w-1.5 h-1.5 bg-muted-foreground/30 hover:bg-muted-foreground/60",
                  )}
                />
              </button>
            );
          })}
        </div>
      </motion.div>

      {/* Magnetic Dock */}
      <motion.div
        variants={itemVariants}
        className="md:col-span-7 group relative overflow-hidden rounded-3xl border border-border bg-card/50 flex flex-col items-center justify-center p-6 md:p-10 shadow-sm backdrop-blur-sm transition-colors duration-500"
      >
        <div className="absolute top-6 left-6">
          <div className="flex items-center gap-2 px-2 py-1 rounded-lg bg-background border border-border text-[8px] font-black uppercase tracking-widest text-muted-foreground mb-2 w-fit shadow-xs">
            <MousePointer2 size={10} /> Proximity
          </div>
          <h3 className="text-xl font-bold tracking-tight">Magnetic Dock</h3>
        </div>
        <div className="mt-20 md:mt-12 scale-75 sm:scale-90 lg:scale-100">
          <MagneticDock magnification={70} distance={120} />
        </div>
      </motion.div>

      {/* Box Carousel showcase */}
      <motion.div
        variants={itemVariants}
        className="md:col-span-7 group relative overflow-hidden rounded-3xl border border-border bg-card/50 p-6 md:p-8 shadow-sm backdrop-blur-sm transition-colors duration-500 flex flex-col items-center justify-center min-h-80"
      >
        <div className="absolute top-6 left-6 z-10">
          <div className="flex items-center gap-2 px-2 py-1 rounded-lg bg-background border border-border text-[8px] font-black uppercase tracking-widest text-muted-foreground mb-2 w-fit shadow-xs">
            <Box size={10} /> 3D Cube
          </div>
          <h3 className="text-xl font-bold tracking-tight">Box Carousel</h3>
        </div>
        <div className="mt-16 scale-90 sm:scale-100 flex items-center justify-center">
          <BoxCarousel
            items={BOX_CAROUSEL_ITEMS}
            width={180}
            height={180}
            direction="left"
            autoPlay={true}
            enableDrag={true}
            perspective={800}
          />
        </div>
      </motion.div>

      {/* Tactile Text showcase */}
      <motion.div
        variants={itemVariants}
        className="md:col-span-5 group relative overflow-hidden rounded-3xl border border-border bg-card/50 p-8 md:p-10 shadow-sm backdrop-blur-sm transition-colors duration-500 flex flex-col items-center justify-center min-h-80"
      >
        <div className="absolute top-6 left-6">
          <div className="flex items-center gap-2 px-2 py-1 rounded-lg bg-background border border-border text-[8px] font-black uppercase tracking-widest text-muted-foreground mb-2 w-fit shadow-xs">
            <Type size={10} /> Typography
          </div>
          <h3 className="text-xl font-bold tracking-tight">Tactile Text</h3>
        </div>
        <div className="flex-1 flex items-center justify-center py-6 px-4">
          <div className="text-2xl md:text-3xl font-bold tracking-tighter text-zinc-900 dark:text-zinc-50 text-center leading-tight">
            Build{" "}
            <TactileHighlight direction="left">
              Better Interfaces
            </TactileHighlight>
          </div>
        </div>
      </motion.div>

      {/* Pagination showcase */}
      <motion.div
        variants={itemVariants}
        className="md:col-span-4 group relative overflow-hidden rounded-3xl border border-border bg-card/50 p-6 md:p-8 shadow-sm backdrop-blur-sm transition-colors duration-500 flex flex-col justify-center min-h-80"
      >
        <div className="absolute top-6 left-6 z-10">
          <div className="flex items-center gap-2 px-2 py-1 rounded-lg bg-background border border-border text-[8px] font-black uppercase tracking-widest text-muted-foreground mb-2 w-fit shadow-xs">
            <ChevronRight size={10} /> Navigation
          </div>
          <h3 className="text-xl font-bold tracking-tight">Pagination</h3>
        </div>
        <div className="flex flex-col items-center justify-center mt-12 gap-4">
          <Pagination
            totalPages={5}
            currentPage={pagination.page}
            onPageChange={pagination.setPage}
            color="default"
            showEdges
          />
          <p className="text-[10px] text-muted-foreground font-medium mt-2">
            Active Page: {pagination.page}
          </p>
        </div>
      </motion.div>

      {/* Image Trail showcase */}
      <motion.div
        variants={itemVariants}
        className="md:col-span-8 group relative overflow-hidden rounded-3xl border border-border bg-card/50 p-6 md:p-8 shadow-sm backdrop-blur-sm transition-colors duration-500 flex flex-col justify-center min-h-80 cursor-crosshair"
      >
        <div className="absolute top-6 left-6 z-10">
          <div className="flex items-center gap-2 px-2 py-1 rounded-lg bg-background border border-border text-[8px] font-black uppercase tracking-widest text-muted-foreground mb-2 w-fit shadow-xs">
            <ImageIcon size={10} /> Cursor Trail
          </div>
          <h3 className="text-xl font-bold tracking-tight">Image Trail</h3>
        </div>

        {/* Background grid representation */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px] pointer-events-none" />

        <div className="absolute inset-0 flex items-center justify-center pt-16">
          <ImageTrail
            className="absolute inset-0"
            threshold={60}
            intensity={0.2}
            repeatChildren={8}
            keyframes={{
              scale: [0.3, 1, 1, 0.3],
              rotate: [0, -10, 10, 0],
              opacity: [0, 1, 1, 0],
            }}
            keyframesOptions={{
              duration: 1.0,
              times: [0, 0.05, 0.85, 1],
              ease: "easeOut",
            }}
            trailElementAnimationKeyframes={{
              x: { duration: 0.35, type: "tween", ease: "easeOut" },
              y: { duration: 0.35, type: "tween", ease: "easeOut" },
            }}
          >
            {TRAIL_IMAGES.map((src, index) => (
              <ImageTrailItem
                key={index}
                className="w-20 h-20 sm:w-28 sm:h-28 shadow-2xl overflow-hidden rounded-2xl bg-zinc-200 dark:bg-zinc-800"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={src}
                  alt={`Trail photo ${index + 1}`}
                  className="w-full h-full object-cover pointer-events-none select-none"
                />
              </ImageTrailItem>
            ))}
          </ImageTrail>

          <span className="text-xs text-muted-foreground font-medium pointer-events-none select-none z-10 bg-background/50 backdrop-blur-xs px-3 py-1.5 rounded-full border border-border">
            Move mouse here to view trail
          </span>
        </div>
      </motion.div>
    </motion.div>
  );
}
