import { cn } from "@/lib/utils";
import { codeToHtml } from "shiki";

interface CodeBlockProps {
  code: string;
  language?: string;
  className?: string;
  filename?: string;
}

export async function CodeBlock({
  code,
  language = "tsx",
  className,
  filename,
}: CodeBlockProps) {
  const html = await codeToHtml(code, {
    lang: language,
    theme: "github-dark", // Or any other premium theme
  });

  return (
    <div
      className={cn(
        "relative group my-6 overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800",
        className,
      )}
    >
      {filename && (
        <div className="flex items-center px-4 py-2 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950">
          <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
            {filename}
          </span>
        </div>
      )}
      <div
        className="text-sm overflow-x-auto p-4 bg-[#24292e] dark:bg-zinc-950"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  );
}
