"use client";

import { LogoIcon } from "@/components/landing/logo-icon";
import { DocMetadata } from "@/lib/docs";
import { getCategoryMeta, getCategoryKey } from "@/lib/categories";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useEffect, useMemo, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { SearchButton } from "@/components/landing/search-button";
import { GitHubStarButton } from "@/components/github-star-button";
import { ModeToggle } from "@/components/mode-toggle";

interface MobileNavProps {
  items: DocMetadata[];
}

const emptySubscribe = () => () => {};

function useMounted() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );
}

export function MobileNav({ items }: MobileNavProps) {
  const [open, setOpen] = useState(false);
  const mounted = useMounted();
  const pathname = usePathname();

  // Lock body scroll while open and restore cleanly
  useEffect(() => {
    if (!open) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  const sortedEntries = useMemo(() => {
    const categories = items.reduce(
      (acc, item) => {
        const categoryKey = getCategoryKey(item.category);
        if (!acc[categoryKey]) acc[categoryKey] = [];
        acc[categoryKey].push(item);
        return acc;
      },
      {} as Record<string, DocMetadata[]>,
    );

    return Object.entries(categories).sort((a, b) => {
      return getCategoryMeta(a[0]).order - getCategoryMeta(b[0]).order;
    });
  }, [items]);

  return (
    <div className="md:hidden flex items-center">
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center justify-center h-9 w-9 rounded-xl border border-input bg-background text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors active:scale-95 shadow-xs cursor-pointer relative z-101"
        aria-label="Open navigation"
      >
        <Menu size={18} />
      </button>

      {mounted &&
        createPortal(
          <AnimatePresence mode="wait">
            {open && (
              <div className="fixed inset-0 z-99999 isolation-auto">
                {/* Backdrop */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  onClick={() => setOpen(false)}
                  className="absolute inset-0 bg-zinc-950/60 backdrop-blur-md"
                />

                {/* Drawer */}
                <motion.div
                  initial={{ x: "-100%" }}
                  animate={{ x: 0 }}
                  exit={{ x: "-100%" }}
                  transition={{
                    type: "spring",
                    damping: 28,
                    stiffness: 240,
                    mass: 0.9,
                  }}
                  className="absolute inset-y-0 left-0 w-80 bg-white dark:bg-zinc-950 border-r border-zinc-200 dark:border-zinc-800 shadow-2xl overflow-hidden flex flex-col"
                >
                  {/* Header */}
                  <div className="flex items-center justify-between p-6 border-b border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-950/50 backdrop-blur-xl shrink-0">
                    <div className="flex items-center -ml-2">
                      <LogoIcon className="size-12 text-zinc-900 dark:text-zinc-50" />
                      <span className="text-xl font-bold tracking-tighter leading-none text-zinc-900 dark:text-zinc-50 -ml-2">
                        Klarden{" "}
                        <span className="text-zinc-500 font-medium ml-1">UI</span>
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setOpen(false)}
                      className="inline-flex items-center justify-center h-9 w-9 rounded-xl border border-input bg-background text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors active:scale-95 shadow-xs cursor-pointer"
                      aria-label="Close navigation"
                    >
                      <X size={18} />
                    </button>
                  </div>

                  {/* Content */}
                  <div className="flex-1 overflow-y-auto p-6 bg-zinc-50/50 dark:bg-zinc-950/50 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                    <div className="space-y-8 pb-10">
                      {sortedEntries.map(([category, docs]) => {
                        const { icon: Icon, title } = getCategoryMeta(category);
                        const hasActiveChild = docs.some(
                          (doc) => pathname === `/docs/${doc.slug}`,
                        );

                        return (
                          <div key={category}>
                            <div className="flex items-center gap-2 mb-3 px-2">
                              <Icon
                                size={15}
                                className={cn(
                                  "transition-colors duration-300",
                                  hasActiveChild
                                    ? "text-primary"
                                    : "text-zinc-400 dark:text-zinc-500",
                                )}
                              />
                              <h4
                                className={cn(
                                  "text-[10px] uppercase tracking-[0.2em] transition-colors duration-300",
                                  hasActiveChild
                                    ? "font-extrabold text-zinc-900 dark:text-zinc-100"
                                    : "font-semibold text-zinc-400 dark:text-zinc-500",
                                )}
                              >
                                {title}
                              </h4>
                            </div>
                            <div className="flex flex-col gap-0.5 relative">
                              {docs.map((doc) => {
                                const isActive = pathname === `/docs/${doc.slug}`;
                                return (
                                  <Link
                                    key={doc.slug}
                                    href={`/docs/${doc.slug}`}
                                    onClick={() => setOpen(false)}
                                    className={cn(
                                      "group relative isolate flex w-full items-center rounded-lg px-3 py-2 transition-colors duration-150 text-sm outline-none",
                                      isActive
                                        ? "font-semibold text-primary bg-primary/10 dark:bg-primary/15 border border-primary/20"
                                        : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100/60 dark:hover:bg-zinc-900/60",
                                    )}
                                  >
                                    <span className="relative z-10">{doc.title}</span>
                                  </Link>
                                );
                              })}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Mobile Drawer Actions Footer */}
                  <div className="p-4 border-t border-zinc-200 dark:border-zinc-800 bg-white/70 dark:bg-zinc-950/70 backdrop-blur-xl space-y-3 shrink-0">
                    <div className="flex items-center justify-between gap-2">
                      <a
                        href="https://kulhad.co/dev-o-los"
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center shrink-0 transition-transform duration-200 hover:scale-[1.03] active:scale-[0.98]"
                        title="Buy me a kulhad"
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src="https://kulhad.co/api/button.png?text=Buy%20me%20a%20kulhad&color=%238E3414"
                          alt="Buy me a kulhad"
                          height={36}
                          className="h-9 w-auto rounded-xl shadow-xs"
                        />
                      </a>
                      <div className="flex items-center gap-2">
                        <GitHubStarButton size="sm" className="h-9" />
                        <ModeToggle />
                      </div>
                    </div>
                    <SearchButton
                      onOpen={() => {
                        setOpen(false);
                        setTimeout(() => {
                          document.dispatchEvent(new CustomEvent("open-search"));
                        }, 100);
                      }}
                      className="flex w-full"
                    />
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>,
          document.body,
        )}
    </div>
  );
}
