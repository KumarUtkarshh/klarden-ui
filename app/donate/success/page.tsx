import { Suspense } from "react";
import Link from "next/link";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { Analytics } from "@vercel/analytics/next";
import { Heart, CheckCircle2, ArrowRight } from "lucide-react";

function SuccessCard() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4 py-16">
      <div className="relative mb-6">
        <div className="absolute inset-0 rounded-full bg-rose-500/20 blur-xl animate-pulse" />
        <div className="relative flex items-center justify-center size-20 rounded-2xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-rose-500 shadow-xl">
          <Heart className="size-10 fill-rose-500 text-rose-500" />
        </div>
      </div>

      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 mb-4">
        <CheckCircle2 className="size-3.5" />
        Payment Completed Successfully
      </div>

      <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-foreground max-w-xl">
        Thank You for Your Generous Support!
      </h1>

      <p className="mt-4 text-muted-foreground text-sm md:text-base font-light max-w-md leading-relaxed">
        Your donation directly fuels the ongoing development of tactile, fluid-motion components for Klarden UI. A receipt has been sent to your email by Dodo Payments.
      </p>

      <div className="mt-8 flex items-center gap-4">
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-xl bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 px-6 py-3 text-sm font-semibold tracking-wide hover:opacity-90 transition-all active:scale-[0.98] shadow-md"
        >
          Explore Components
          <ArrowRight className="size-4" />
        </Link>
      </div>
    </div>
  );
}

export default function DonateSuccessPage() {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-background text-foreground font-sans selection:bg-primary selection:text-primary-foreground transition-colors duration-500">
      <Navbar />
      <main className="max-w-350 mx-auto px-6 md:px-10 lg:px-12">
        <Suspense fallback={<div className="min-h-[50vh] flex items-center justify-center">Loading...</div>}>
          <SuccessCard />
        </Suspense>
      </main>
      <Footer />
      <Analytics />
    </div>
  );
}
