import React from "react";
import { cn } from "@/lib/utils";

export interface PropRow {
  name: string;
  type: string;
  default?: string;
  description: string;
}

export interface PropsTableProps {
  data: PropRow[];
  className?: string;
}

export function PropsTable({ data = [], className }: PropsTableProps) {
  // Ensure data is always an array
  const rows = Array.isArray(data) ? data : [];

  return (
    <div className={cn("my-6 w-full overflow-y-auto rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950", className)}>
      <table className="w-full border-collapse text-sm text-left">
        <thead className="bg-zinc-50 dark:bg-zinc-900/50 border-b border-zinc-200 dark:border-zinc-800 text-zinc-500 dark:text-zinc-400">
          <tr>
            <th className="px-4 py-3 font-black uppercase tracking-widest text-[10px]">Prop</th>
            <th className="px-4 py-3 font-black uppercase tracking-widest text-[10px]">Type</th>
            <th className="px-4 py-3 font-black uppercase tracking-widest text-[10px]">Default</th>
            <th className="px-4 py-3 font-black uppercase tracking-widest text-[10px]">Description</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/50">
          {rows.map((prop) => (
            <tr
              key={prop.name}
              className="group transition-colors hover:bg-zinc-50/50 dark:hover:bg-zinc-900/20"
            >
              <td className="px-4 py-3 font-mono font-bold text-zinc-900 dark:text-zinc-200 tracking-tight">
                {prop.name}
              </td>
              <td className="px-4 py-3 font-mono text-xs text-blue-600 dark:text-blue-400">
                {prop.type}
              </td>
              <td className="px-4 py-3 font-mono text-xs text-zinc-500 dark:text-zinc-500">
                {prop.default || "—"}
              </td>
              <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400 leading-relaxed">
                {prop.description}
              </td>
            </tr>
          ))}
          {rows.length === 0 && (
            <tr>
              <td colSpan={4} className="px-4 py-8 text-center text-zinc-500 font-medium">
                No properties defined.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
