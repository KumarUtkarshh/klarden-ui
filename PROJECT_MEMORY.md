# Project Memory: Klarden UI

## Project Overview
- **Purpose**: Free, open-source animated React UI component collection for design engineers built around the shadcn CLI registry distribution model (copy-paste components directly into consuming projects).
- **Tech Stack**: Next.js 16 (App Router), React 19, TypeScript 5, Tailwind CSS v4, Framer Motion / Motion 12, Three.js / OGL (WebGL shaders), Base UI / Radix UI primitives, Lucide React, Shiki (syntax highlighting), Next MDX Remote, Dodo Payments.
- **Main Goals**: Deliver high-polish physics-based animated components with zero vendor lock-in, strict TypeScript typing, automatic dark/light theming, and CLI registry distribution.

## Architecture
- **Monorepo / Next.js Structure**:
  - `app/`: Next.js 16 App Router routes, metadata, and API handlers.
  - `components/`: Global layout and app UI components (landing, docs shell, icons, theme).
  - `content/docs/`: MDX documentation files for components and background effects.
  - `registry/`: The shadcn component registry source code (`registry/klarden-ui/`), interactive demos (`registry/demos/`), and registry entry mapping (`registry/components.ts`).
  - `lib/`: Shared utility functions, category mappings, docs loader, and payment SDK clients.
  - `hooks/`: Reusable React hooks.
  - `public/r/`: Generated static JSON registry files consumed by `npx shadcn add`.
- **System Interactions**:
  - MDX docs (`content/docs/**.mdx`) are statically loaded by `lib/docs.ts` and rendered by `app/docs/[...slug]/page.tsx` with `next-mdx-remote`.
  - Component previews in docs resolve component demos dynamically from `registry/components.ts`.
  - Registry assets build via `pnpm registry:build` (`shadcn build`) outputting component JSON schemas to `public/r/`.
  - Payments and sponsorships process through Dodo Payments via server-side checkout sessions (`app/api/donate/route.ts`) and verified webhooks (`app/api/webhook/dodo/route.ts`).

## UI Knowledge
- **Design System & Styling**:
  - Tailwind CSS v4 using modern `@import "tailwindcss";` and `@theme inline` with CSS variables in OKLCH color space.
  - Dark mode supported via `@custom-variant dark (&:is(.dark *));` driven by `next-themes`.
  - Typography: Geist Sans and Geist Mono font variables.
- **Key Screens / Routes**:
  - `/`: Landing page featuring Hero, animated Showcase grid, search dialog, and footer.
  - `/docs/[...slug]`: Documentation pages rendering MDX content, interactive preview tabs, and props tables.
  - `/llm-info`: Machine and human readable structured facts for AI assistants (ChatGPT, Claude, Perplexity, Gemini).
  - `/sponsor` & `/donate`: Sponsorship and donation checkout interfaces.
  - `/donate/success`: Post-checkout payment acknowledgement.
- **Navigation Flow**:
  - Global `Navbar` with instant search shortcut (Cmd/Ctrl + K), GitHub star button, theme toggle, and doc links.
  - Docs view includes responsive `Sidebar`, `MobileNav` sheet, on-page Table of Contents (`TOC`), and previous/next page links.

## Code Conventions
- **Naming**:
  - Kebab-case for registry component files and routes (`rich-button.tsx`, `ghost-ether.tsx`).
  - PascalCase for React component definitions (`RichButton`, `CommandOrbit`).
  - CamelCase for utility functions, hooks, and helpers (`useDimensions`, `getDocBySlug`).
- **File Organisation**:
  - Component registry files in `registry/klarden-ui/`.
  - Interactive demos paired with components in `registry/demos/<component>-demo.tsx`.
  - MDX documentation files paired with components in `content/docs/components/<component>.mdx` or `backgrounds/`.
- **State Management**:
  - React local state (`useState`, `useRef`, `useCallback`) and Motion values (`useMotionValue`, `useSpring`).
  - Client state subscriptions via `useSyncExternalStore` for resize and layout awareness without unnecessary re-renders.
- **Error Handling**:
  - Graceful fallback UI in docs previews when dynamic component resolution fails.
  - API routes validate request payloads, parse amounts safely, and catch SDK errors with standard JSON error responses.
- **Testing Patterns**:
  - Linting via ESLint 9 (`pnpm lint`).
  - TypeScript strict mode checks with `tsc --noEmit`.

## Key Files & Responsibilities

| File Path | Purpose |
| --- | --- |
| `app/page.tsx` | Main landing page combining Hero, Showcase, Navbar, and Footer. |
| `app/layout.tsx` | Root HTML structure, ThemeProvider, fonts, and global metadata. |
| `app/docs/[...slug]/page.tsx` | Dynamic MDX document renderer with SEO metadata and adjacent doc links. |
| `app/api/donate/route.ts` | Server-side checkout session creation for one-time donations via Dodo Payments. |
| `app/api/webhook/dodo/route.ts` | Webhook verification and listener for Dodo Payments events. |
| `app/api/spotify/metadata/route.ts` | Scrapes Spotify track metadata (OG tags) for the Spotify Card component. |
| `registry/components.ts` | Registry mapping linking slug keys to dynamic demo component imports. |
| `lib/docs.ts` | File-system MDX loader, slug parser, and category-based doc sorter. |
| `lib/categories.ts` | Category definitions, display order, and sidebar icons. |
| `lib/dodo.ts` | Dodo Payments client singleton and on-demand donation product provisioning. |
| `lib/utils.ts` | Standard `cn(...)` utility combining `clsx` and `tailwind-merge`. |
| `components/docs/component-preview.tsx` | Interactive sandbox container rendering live demos with code tabs. |
| `public/llms.txt` | Standard concise machine-readable specification and component links for LLM search. |
| `public/llms-full.txt` | Full context technical reference, component code examples, and props for AI agents. |
| `app/llm-info/page.tsx` | Web page with JSON-LD schema, canonical definitions, and AI facts. |

## Data & APIs
- **External Services**:
  - **Dodo Payments**: Payment gateway for donations and sponsorships (`dodopayments` SDK).
  - **Vercel Analytics**: Production usage and performance telemetry.
  - **Spotify Web Scraper**: Fetches OpenGraph track title, artist, audio preview, and cover art via `got` + `cheerio`.
- **Internal API Endpoints**:
  - `POST /api/donate`: Accepts `{ amount, donorName, donorEmail, message }`, provisions or retrieves product, returns `{ checkoutUrl, sessionId }`.
  - `POST /api/webhook/dodo`: Verifies `webhook-id`, `webhook-signature`, `webhook-timestamp` headers and handles payment events.
  - `GET /api/spotify/metadata?url=<url>`: Returns `{ title, artist, albumArt, previewUrl }`.

## Decisions Log
- **Registry vs NPM Package**: Adopted shadcn registry distribution pattern (`registry.json` + `pnpm registry:build`) allowing users to own source code and customize without package bloat.
- **Tailwind CSS v4 & Motion 12**: Upgraded to Tailwind v4 CSS-first config (`@theme inline`) and Motion 12 physics-based spring animations for fluid interactions over rigid CSS keyframes.
- **Pay-What-You-Want Donations**: Built self-provisioning donation product (`Klarden UI Project Donation`) in `lib/dodo.ts` with custom amounts and direct checkout session redirection.
- **Lazy Mobile Navigation**: Refactored mobile drawer to memoized components using `useSyncExternalStore` to optimize render cycles.
- **AI Crawlability & LLM-Info**: Implemented standard `/llms.txt`, expanded `/llms-full.txt`, and dedicated `/llm-info` page with `SoftwareApplication` and `FAQPage` JSON-LD schemas inspired by Spectrum UI.

## Current Status
- **Completed Work**:
  - 26 production-ready animated components and WebGL backgrounds in registry.
  - Full MDX documentation site with live preview tabs, props tables, and code snippets.
  - Dodo Payments donation route and checkout integration.
  - Dark/light mode theme support.
  - AI discovery architecture (`/llms.txt`, `/llms-full.txt`, `/llm-info` page, sitemap entry, and footer links).
- **In-Progress / Known TODOs**:
  - Root scratch file `screensaver_fetched.tsx` needs cleanup or promotion to `registry/klarden-ui/screensaver.tsx`.
  - Expand test suite for hooks and utility functions.

## Change Log
- **2026-10-26**: Initialized `PROJECT_MEMORY.md` capturing architecture, tech stack, registry setup, API routes, and code conventions.
- **2026-10-26**: Added AI discoverability files: `public/llms.txt`, `public/llms-full.txt`, dedicated `/llm-info` route with JSON-LD schemas, sitemap inclusion, and footer links.
- **2026-10-26**: Fixed Footer hydration mismatch error by converting `RichButton` to `asChild` wrapping `<Link>`, eliminating illegal HTML `<button>` nesting inside `<a>`, and added `LLM Info` to top Navbar.

