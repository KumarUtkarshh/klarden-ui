"use client";

import { Slider } from "@/registry/klarden-ui/slider";
import { useState } from "react";

export default function SliderDemo() {
  const [value, setValue] = useState(1222);
  const max = 5363; // 1:29:23 total

  return (
    <div className="w-87.5">
      <Slider
        value={value}
        max={max}
        onValueChange={setValue}
        onValueCommit={setValue}
      />
    </div>
  );
}
