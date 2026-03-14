"use client";

import { cn } from "@/lib/utils";
import { registry } from "@/registry/components";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Code2, Copy, Monitor } from "lucide-react";
import React, { useState } from "react";

interface ComponentPreviewProps {
  name: string;
  code: string;
  children?: React.ReactNode;
}

export function ComponentPreview({
  name,
  code,
  children,
}: ComponentPreviewProps) {
  const [tab, setTab] = useState<"preview" | "code">("preview");
  const [copied, setCopied] = useState(false);

  const Component = registry[name];

  const copyToClipboard = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative my-8 group">
      {/* Tabs Header */}
      <div className="flex items-center justify-between pb-4 border-b border-zinc-200 dark:border-zinc-800">
        <div className="flex gap-1 p-1 bg-zinc-100 dark:bg-zinc-900 rounded-lg">
          <button
            onClick={() => setTab("preview")}
            className={cn(
              "flex items-center gap-2 px-3 py-1.5 text-xs font-bold rounded-md transition-all",
              tab === "preview"
                ? "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 shadow-sm"
                : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-300",
            )}
          >
            <Monitor size={14} />
            Preview
          </button>
          <button
            onClick={() => setTab("code")}
            className={cn(
              "flex items-center gap-2 px-3 py-1.5 text-xs font-bold rounded-md transition-all",
              tab === "code"
                ? "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 shadow-sm"
                : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-300",
            )}
          >
            <Code2 size={14} />
            Code
          </button>
        </div>

        <button
          onClick={copyToClipboard}
          className="p-2 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-300 transition-colors"
        >
          {copied ? (
            <Check size={16} className="text-emerald-500" />
          ) : (
            <Copy size={16} />
          )}
        </button>
      </div>

      {/* Content Area */}
      <div className="mt-4 min-h-[350px] rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/50 flex items-center justify-center overflow-hidden">
        <AnimatePresence mode="wait">
          {tab === "preview" ? (
            <motion.div
              key="preview"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="w-full flex items-center justify-center p-8"
            >
              {Component ? (
                <Component />
              ) : (
                <div className="text-sm text-zinc-500 font-medium">
                  Component not found: {name}
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="code"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="w-full h-full max-h-[600px] overflow-auto"
            >
              {children}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
