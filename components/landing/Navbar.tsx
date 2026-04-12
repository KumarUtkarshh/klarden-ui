import { MobileNav } from "@/components/docs/mobile-nav";
import { GitHubStarButton } from "@/components/github-star-button";
import { ModeToggle } from "@/components/mode-toggle";
import { SITE_CONFIG } from "@/lib/constants";
import { getAllDocs } from "@/lib/docs";
import { Search } from "lucide-react";
import Link from "next/link";
import { LogoIcon } from "./logo-icon";

export function Navbar() {
  const docs = getAllDocs();

  return (
    <nav className="sticky top-0 z-100 w-full border-b border-border bg-background/80 backdrop-blur-xl transition-colors">
      <div className="max-w-350 mx-auto flex h-16 items-center justify-between px-6 md:px-10 lg:px-12">
        <div className="flex items-center gap-4 md:gap-8">
          <MobileNav items={docs} />
          <Link href="/" className="flex items-center group -ml-2">
            <LogoIcon className="size-12 text-foreground group-hover:rotate-12 group-hover:scale-110 transition-all duration-300" />
            <span className="text-xl md:text-xl font-black text-foreground tracking-tighter leading-none -ml-2">
              {SITE_CONFIG.name.split(" ")[0]}
              <span className="text-muted-foreground font-bold ml-1">
                {SITE_CONFIG.name.split(" ")[1]}
              </span>
            </span>
          </Link>
          <div className="hidden md:flex gap-6 text-xs font-bold uppercase tracking-widest text-muted-foreground">
            <Link
              href="/docs/introduction"
              className="hover:text-primary transition-colors"
            >
              Docs
            </Link>
            <Link
              href="/docs/components/accordion"
              className="hover:text-primary transition-colors"
            >
              Components
            </Link>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="hidden sm:inline-flex items-center gap-2 h-9 px-4 rounded-md border border-input bg-background text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors">
            <Search size={14} />
            <span className="flex-1 text-left">Search...</span>
            <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
              <span className="text-xs">⌘</span>K
            </kbd>
          </button>
          <GitHubStarButton />
          <ModeToggle />
        </div>
      </div>
    </nav>
  );
}
