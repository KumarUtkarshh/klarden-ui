# Klarden UI

<div align="center">

**Premium animated React components for design engineers.**  
Copy-paste ready. Built with Framer Motion, Tailwind CSS & Next.js.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org/)
[![Framer Motion](https://img.shields.io/badge/Framer%20Motion-12-ff69b4?logo=framer)](https://www.framer.com/motion/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-v4-38bdf8?logo=tailwindcss)](https://tailwindcss.com/)

[**→ Browse Components**](https://klarden.vercel.app) · [**→ Docs**](https://klarden.vercel.app/docs/introduction) · [**→ GitHub**](https://github.com/dev-o-los/klarden-ui)

</div>

---

## What is Klarden UI?

Klarden UI is a **free, open-source** collection of high-quality animated React components for design-conscious engineers. Instead of installing a monolithic npm package, you use the **shadcn registry pattern** to copy individual components directly into your source code — giving you full ownership and customizability.

Every component is:
- ✅ **TypeScript-first** — strict types, no `any`
- ✅ **Physics-based** — spring animations via Framer Motion (not duration-fixed CSS transitions)
- ✅ **Tailwind CSS v4 compatible**
- ✅ **Dark & Light mode** — automatic system-preference aware theming
- ✅ **Next.js App Router compatible**
- ✅ **Copy-paste ready** — no lock-in, no package updates to manage

---

## 🚀 Quick Start

### 1. Install any component with one command

```bash
npx shadcn@latest add https://klarden.vercel.app/r/<component-name>.json
```

For example, to add the **Accordion**:

```bash
npx shadcn@latest add https://klarden.vercel.app/r/accordion.json
```

### 2. Requirements

Your project needs these dependencies:

```bash
pnpm add framer-motion lucide-react clsx tailwind-merge
```

### 3. Import and use

```tsx
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/accordion";

export default function App() {
  return (
    <Accordion type="single" collapsible>
      <AccordionItem value="1">
        <AccordionTrigger>What is Klarden UI?</AccordionTrigger>
        <AccordionContent>
          Premium animated React components — free and open source.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
```

---

## 🧩 Component Library

### UI Components

| Component | Description | Docs |
|-----------|-------------|------|
| **Accordion** | Physics-based accordion with spring animations and magnetic text hover effects | [→](https://klarden.vercel.app/docs/components/accordion) |
| **Basic Number Ticker** | Animated counting number with smooth increment/decrement transitions | [→](https://klarden.vercel.app/docs/components/basic-number-ticker) |
| **Blur Reveal** | Cinematic blur-to-sharp content/text reveal animation on mount | [→](https://klarden.vercel.app/docs/components/blur-reveal) |
| **Box Carousel** | Smooth box-layout content carousel with gesture support | [→](https://klarden.vercel.app/docs/components/box-carousel) |
| **Command Orbit** | Radial command menu with orbiting actions and staggered spring entrance | [→](https://klarden.vercel.app/docs/components/command-orbit) |
| **Image Trail** | Cursor-following image trail that spawns images along mouse movement paths | [→](https://klarden.vercel.app/docs/components/image-trail) |
| **Label Input** | Floating label animated form input with password toggle and 20+ ring color variants | [→](https://klarden.vercel.app/docs/components/label-input) |
| **Logo Carousel** | Infinite-scrolling logo / brand carousel for social proof sections | [→](https://klarden.vercel.app/docs/components/logo-carousel) |
| **Mac Terminal** | Draggable pixel-perfect macOS Terminal window with neofetch, command history, built-in shell commands | [→](https://klarden.vercel.app/docs/components/mac-terminal) |
| **Magnetic Dock** | macOS-style navigation dock with proximity-based icon magnification (spring physics) | [→](https://klarden.vercel.app/docs/components/magnetic-dock) |
| **Orbit Context Menu** | Right-click context menu with radial orbiting layout and spring animation | [→](https://klarden.vercel.app/docs/components/orbit-context-menu) |
| **Page Not Found** | Animated 404 error page with customizable illustration and call-to-action | [→](https://klarden.vercel.app/docs/components/page-not-found) |
| **Pagination** | Animated pagination with smooth page transition effects | [→](https://klarden.vercel.app/docs/components/pagination) |
| **Portal Uploader** | Circular drag-and-drop file upload zone with vortex orbital ring animation | [→](https://klarden.vercel.app/docs/components/portal-uploader) |
| **QR Code** | Client-side QR code generator with customizable colors and error correction | [→](https://klarden.vercel.app/docs/components/qr-code) |
| **Rich Button** | Premium animated button with tactile hover microinteractions and spring feedback | [→](https://klarden.vercel.app/docs/components/rich-button) |
| **Shimmer Text** | Text shimmer/sheen animation for loading states, hero headings, and premium accents | [→](https://klarden.vercel.app/docs/components/shimmer-text) |
| **Signature** | Animated SVG handwritten signature component with draw-on-mount animation | [→](https://klarden.vercel.app/docs/components/signature) |
| **Slider** | Media progress slider with draggable thumb, chapter markers, time display, 17 color variants | [→](https://klarden.vercel.app/docs/components/slider) |
| **Spotify Card** | Live Spotify metadata card with morphing album-cover-to-vinyl-disc animation and audio preview | [→](https://klarden.vercel.app/docs/components/spotify-card) |
| **Tactile Highlight** | Spring-animated text selection highlight for emphasis and interactivity | [→](https://klarden.vercel.app/docs/components/tactile-highlight) |

### Background Components

| Component | Description | Docs |
|-----------|-------------|------|
| **Animated Gradient** | High-performance WebGL shader gradient with organic domain warping for silk-like flow | [→](https://klarden.vercel.app/docs/backgrounds/animated-gradient) |
| **Ghost Ether** | Ethereal WebGL background with floating luminous wisp particles | [→](https://klarden.vercel.app/docs/backgrounds/ghost-ether) |
| **Plasma Wave** | Vibrant WebGL plasma wave with fluid electric color oscillation | [→](https://klarden.vercel.app/docs/backgrounds/plasma-wave) |
| **RNA Lines** | Organic flowing line background inspired by DNA/RNA strand visualization | [→](https://klarden.vercel.app/docs/backgrounds/rna-lines) |
| **Starry Sky** | Animated star field with twinkling stars and parallax depth layers | [→](https://klarden.vercel.app/docs/backgrounds/starry-sky) |

---

## 🛠 Tech Stack

| Technology | Version | Role |
|---|---|---|
| [Next.js](https://nextjs.org/) | 16 (App Router) | Framework |
| [React](https://react.dev/) | 19 | UI Library |
| [TypeScript](https://www.typescriptlang.org/) | 5.x | Type Safety |
| [Framer Motion](https://www.framer.com/motion/) | 12 | Animations |
| [Tailwind CSS](https://tailwindcss.com/) | v4 | Styling |
| [shadcn/ui registry](https://ui.shadcn.com/docs/registry) | latest | Component distribution |
| [next-mdx-remote](https://github.com/hashicorp/next-mdx-remote) | 6 | Documentation (MDX) |
| [Shiki](https://shiki.style/) | 4 | Syntax Highlighting |
| [Lucide React](https://lucide.dev/) | latest | Icons |

---

## 📁 Project Structure

```
klarden/
├── app/                    # Next.js App Router pages
│   ├── docs/               # Documentation pages ([...slug])
│   ├── layout.tsx          # Root layout with SEO metadata
│   ├── page.tsx            # Landing page
│   ├── sitemap.ts          # Auto-generated sitemap
│   └── robots.ts           # Crawler policy
├── components/             # App components (docs UI, landing, etc.)
├── content/docs/           # MDX documentation files
│   ├── components/         # 21 component docs
│   └── backgrounds/        # 5 background docs
├── registry/               # Component source code (shadcn registry)
│   └── klarden-ui/         # All component implementations
├── registry.json           # Registry manifest
└── public/
    └── r/                  # Built registry JSON files for CLI
```

---

## 🤝 Contributing

We welcome contributions from design-conscious engineers! Whether you're fixing a bug, improving documentation, or proposing a new tactile module, your help is appreciated.

### How to add a new component

#### 1. Create the component

Add your source to `registry/klarden-ui/my-new-component.tsx`

Standards:
- **TypeScript** — strict types, no `any`
- **Tailwind CSS** — all styling via Tailwind
- **Framer Motion** — all animations via physics springs
- **Theme-aware** — must look great in both dark and light modes

#### 2. Register the component

- `registry.json` — add metadata (name, title, dependencies) to the `items` array

#### 3. Add documentation

Create `content/docs/components/my-new-component.mdx` using components:
- `<ComponentPreview name="my-new-component" />`
- `<InstallBlock command="my-new-component" />`
- `<PropsTable>` / `<Prop>`

#### 4. Build the registry

```bash
pnpm registry:build
```

### Pull Request Process

1. Branch from `main`
2. Follow the steps above
3. Run `pnpm lint` and `pnpm exec tsc --noEmit`
4. Submit PR with a video or GIF of the interaction

---

## 🔍 Keywords

React components, animated React, Next.js components, Framer Motion components, Tailwind CSS components, shadcn alternative, copy paste UI components, UI component library, design system, accordion, slider, terminal, spotify card, QR code, pagination, portal uploader, magnetic dock, command orbit, label input, shimmer text, number ticker, blur reveal, image trail, logo carousel, box carousel, signature, rich button, tactile highlight, animated gradient, WebGL background, starry sky, plasma wave, ghost ether, RNA lines, open source React, TypeScript components, spring animation React, physics animation React, microinteraction components, premium UI kit, motion UI library

---

## 📄 License

Licensed under the [MIT License](LICENSE) — free to use in personal and commercial projects.

---

<div align="center">
  <strong>Built with ❤️ by <a href="https://github.com/dev-o-los">dev-o-los</a></strong><br/>
  <a href="https://klarden.vercel.app">klarden.vercel.app</a>
</div>
