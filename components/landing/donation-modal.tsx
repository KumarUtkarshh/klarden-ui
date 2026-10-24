"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Heart, Loader2, Sparkles, Globe, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

interface DonationModalProps {
  children?: React.ReactNode;
  triggerClassName?: string;
}

const PRESET_AMOUNTS = [
  { value: 3, label: "$3", subtitle: "Coffee ☕" },
  { value: 5, label: "$5", subtitle: "Supporter 💖" },
  { value: 15, label: "$15", subtitle: "Advocate 🚀" },
  { value: 25, label: "$25", subtitle: "Patron 👑" },
];

export function DonationModal({ children, triggerClassName }: DonationModalProps) {
  const [open, setOpen] = React.useState(false);
  const [selectedPreset, setSelectedPreset] = React.useState<number | "custom">(5);
  const [customAmount, setCustomAmount] = React.useState<string>("10");
  const [donorName, setDonorName] = React.useState("");
  const [donorEmail, setDonorEmail] = React.useState("");
  const [message, setMessage] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  const effectiveAmount =
    selectedPreset === "custom"
      ? parseFloat(customAmount) || 0
      : selectedPreset;

  const handleDonate = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (effectiveAmount < 1) {
      setErrorMessage("Please enter an amount of at least $1.00 USD");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/donate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: effectiveAmount,
          donorName,
          donorEmail,
          message,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to initialize checkout session");
      }

      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      } else {
        throw new Error("Checkout URL not received");
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Something went wrong";
      setErrorMessage(msg);
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children ? (
          children
        ) : (
          <button
            type="button"
            className={cn(
              "inline-flex items-center gap-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 px-4 py-2.5 text-xs font-semibold uppercase tracking-wider transition-all duration-200 hover:opacity-90 hover:shadow-md active:scale-95 cursor-pointer",
              triggerClassName
            )}
          >
            <Heart className="size-3.5 fill-rose-500 text-rose-500" />
            <span>Donate</span>
          </button>
        )}
      </DialogTrigger>

      <DialogContent className="sm:max-w-md p-6 bg-background border-border/80 shadow-2xl rounded-2xl">
        <DialogHeader className="text-left space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="flex items-center justify-center size-8 rounded-full bg-rose-500/10 text-rose-500 border border-rose-500/20">
              <Heart className="size-4 fill-rose-500 text-rose-500" />
            </span>
            <DialogTitle className="text-xl font-bold tracking-tight">
              Support Klarden UI
            </DialogTitle>
          </div>
          <DialogDescription className="text-xs text-muted-foreground font-light leading-relaxed">
            Choose a flexible amount to fund open-source component development. Payments are powered securely worldwide by Dodo Payments.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleDonate} className="space-y-4 pt-2">
          {/* Preset Buttons */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-foreground flex items-center justify-between">
              <span>Select Donation Amount (USD)</span>
              <span className="text-[10px] text-muted-foreground flex items-center gap-1 font-normal">
                <Globe className="size-3" /> Auto-converted worldwide
              </span>
            </label>
            <div className="grid grid-cols-4 gap-2">
              {PRESET_AMOUNTS.map((preset) => {
                const isSelected = selectedPreset === preset.value;
                return (
                  <button
                    key={preset.value}
                    type="button"
                    onClick={() => {
                      setSelectedPreset(preset.value);
                      setErrorMessage(null);
                    }}
                    className={cn(
                      "flex flex-col items-center justify-center p-2.5 rounded-xl border text-center transition-all cursor-pointer select-none",
                      isSelected
                        ? "border-foreground bg-foreground text-background font-bold shadow-xs scale-[1.02]"
                        : "border-border/60 bg-muted/40 hover:bg-muted text-foreground hover:border-border"
                    )}
                  >
                    <span className="text-sm font-bold">{preset.label}</span>
                    <span
                      className={cn(
                        "text-[10px] mt-0.5",
                        isSelected ? "text-background/80" : "text-muted-foreground"
                      )}
                    >
                      {preset.subtitle.split(" ")[0]}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Custom Amount toggle / input */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => {
                  setSelectedPreset("custom");
                  setErrorMessage(null);
                }}
                className={cn(
                  "text-xs font-medium underline-offset-4 hover:underline cursor-pointer transition-colors",
                  selectedPreset === "custom"
                    ? "text-foreground font-semibold underline"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                Or enter custom amount
              </button>
              {selectedPreset === "custom" && (
                <span className="text-[10px] text-muted-foreground">Min. $1.00</span>
              )}
            </div>

            {selectedPreset === "custom" && (
              <div className="relative rounded-xl border border-border bg-background focus-within:border-foreground transition-all">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground font-semibold text-sm">
                  $
                </span>
                <input
                  type="number"
                  min="1"
                  step="any"
                  value={customAmount}
                  onChange={(e) => {
                    setCustomAmount(e.target.value);
                    setErrorMessage(null);
                  }}
                  placeholder="50.00"
                  className="w-full bg-transparent pl-8 pr-4 py-2 text-sm font-semibold outline-hidden text-foreground placeholder:text-muted-foreground/50"
                  autoFocus
                />
              </div>
            )}
          </div>

          {/* Optional Details (Name, Email, Note) */}
          <div className="space-y-2 pt-1">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[11px] font-light text-muted-foreground block mb-1">
                  Name (optional)
                </label>
                <input
                  type="text"
                  value={donorName}
                  onChange={(e) => setDonorName(e.target.value)}
                  placeholder="Ada Lovelace"
                  className="w-full text-xs rounded-lg border border-border/60 bg-muted/30 px-2.5 py-1.5 text-foreground placeholder:text-muted-foreground/40 outline-hidden focus:border-foreground"
                />
              </div>
              <div>
                <label className="text-[11px] font-light text-muted-foreground block mb-1">
                  Email (optional)
                </label>
                <input
                  type="email"
                  value={donorEmail}
                  onChange={(e) => setDonorEmail(e.target.value)}
                  placeholder="ada@example.com"
                  className="w-full text-xs rounded-lg border border-border/60 bg-muted/30 px-2.5 py-1.5 text-foreground placeholder:text-muted-foreground/40 outline-hidden focus:border-foreground"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-light text-muted-foreground block mb-1">
                Cheer message (optional)
              </label>
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Keep creating wonderful components!"
                className="w-full text-xs rounded-lg border border-border/60 bg-muted/30 px-2.5 py-1.5 text-foreground placeholder:text-muted-foreground/40 outline-hidden focus:border-foreground"
              />
            </div>
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className="rounded-lg bg-destructive/10 border border-destructive/20 p-2.5 text-xs text-destructive">
              {errorMessage}
            </div>
          )}

          {/* Submit Action */}
          <button
            type="submit"
            disabled={isLoading || effectiveAmount < 1}
            className="w-full rounded-xl bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 py-3 text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 hover:opacity-90 active:scale-[0.99] transition-all disabled:opacity-50 disabled:pointer-events-none cursor-pointer shadow-md"
          >
            {isLoading ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                <span>Redirecting to Dodo Payments...</span>
              </>
            ) : (
              <>
                <Sparkles className="size-3.5" />
                <span>Donate ${effectiveAmount > 0 ? effectiveAmount : 0} via Dodo</span>
              </>
            )}
          </button>

          <div className="flex items-center justify-center gap-2 text-[10px] text-muted-foreground/80 font-light pt-1">
            <ShieldCheck className="size-3.5 text-emerald-500" />
            <span>Encrypted checkout • Cards, Apple Pay, Google Pay, UPI & More</span>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
