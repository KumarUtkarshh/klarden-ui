import {
  Compass,
  MousePointerClick,
  Sliders,
  Route,
  AppWindow,
  Baseline,
  GalleryHorizontal,
  Sparkles,
  LucideIcon,
} from "lucide-react";

export interface CategoryMeta {
  title: string;
  icon: LucideIcon;
  order: number;
}

export const CATEGORIES: Record<string, CategoryMeta> = {
  Overview: { title: "Overview", icon: Compass, order: 0 },
  Buttons: { title: "Buttons", icon: MousePointerClick, order: 1 },
  Inputs: { title: "Inputs", icon: Sliders, order: 2 },
  Navigation: { title: "Navigation", icon: Route, order: 3 },
  Cards: { title: "Cards", icon: AppWindow, order: 4 },
  Typography: { title: "Typography", icon: Baseline, order: 5 },
  Carousels: { title: "Carousels", icon: GalleryHorizontal, order: 6 },
  Backgrounds: { title: "Backgrounds", icon: Sparkles, order: 7 },
};

export const FALLBACK_CATEGORY: CategoryMeta = {
  title: "General",
  icon: Compass,
  order: 99,
};

const CATEGORY_ALIASES: Record<string, string> = {
  "Getting Started": "Overview",
  Button: "Buttons",
  Form: "Inputs",
  Layout: "Cards",
  Media: "Carousels",
};

export function getCategoryKey(category?: string): string {
  if (!category) return "General";
  return CATEGORY_ALIASES[category] ?? category;
}

export function getCategoryMeta(category?: string): CategoryMeta {
  const key = getCategoryKey(category);
  return CATEGORIES[key] ?? FALLBACK_CATEGORY;
}
