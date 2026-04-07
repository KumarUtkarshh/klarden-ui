"use client";

import { QRCode } from "@/registry/klarden-ui/qr-code";
import type { GradientPreset } from "@/registry/klarden-ui/qr-code";

const gradientPresets: { gradient: GradientPreset; label: string }[] = [
  { gradient: "default", label: "Default" },
  { gradient: "ocean", label: "Ocean" },
  { gradient: "sunset", label: "Sunset" },
  { gradient: "forest", label: "Forest" },
  { gradient: "berry", label: "Berry" },
  { gradient: "twilight", label: "Twilight" },
  { gradient: "aurora", label: "Aurora" },
  { gradient: "fire", label: "Fire" },
  { gradient: "neon", label: "Neon" },
  { gradient: "rose", label: "Rose" },
  { gradient: "mint", label: "Mint" },
];

export default function QRCodeVariants() {
  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
        {gradientPresets.map((preset) => (
          <div key={preset.label} className="flex flex-col items-center gap-3">
            <QRCode
              value="https://klarden.vercel.app"
              gradient={preset.gradient}
            />
            <span className="text-sm text-muted-foreground">
              {preset.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
