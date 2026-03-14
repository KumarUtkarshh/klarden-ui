import { getComponentCode } from "@/lib/registry";
import { cn } from "@/lib/utils";
import { registry } from "@/registry/components";
import React from "react";
import { CodeBlock } from "./code-block";
import { ComponentPreview } from "./component-preview";

type ComponentProps = React.HTMLAttributes<HTMLElement>;

export const mdxComponents = {
  // Pass all registry components globally to MDX
  ...registry,

  h1: ({ className, ...props }: ComponentProps) => (
    <h1
      className={cn(
        "mt-2 scroll-m-20 text-4xl font-black tracking-tighter text-zinc-900 dark:text-zinc-50",
        className,
      )}
      {...props}
    />
  ),
  h2: ({ className, ...props }: ComponentProps) => (
    <h2
      className={cn(
        "mt-12 scroll-m-20 border-b border-zinc-200 dark:border-zinc-800 pb-2 text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 first:mt-0",
        className,
      )}
      {...props}
    />
  ),
  h3: ({ className, ...props }: ComponentProps) => (
    <h3
      className={cn(
        "mt-8 scroll-m-20 text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50",
        className,
      )}
      {...props}
    />
  ),
  p: ({ className, ...props }: ComponentProps) => (
    <p
      className={cn(
        "leading-7 [&:not(:first-child)]:mt-6 text-zinc-600 dark:text-zinc-400",
        className,
      )}
      {...props}
    />
  ),
  ul: ({ className, ...props }: React.HTMLAttributes<HTMLUListElement>) => (
    <ul
      className={cn(
        "my-6 ml-6 list-disc [&>li]:mt-2 text-zinc-600 dark:text-zinc-400",
        className,
      )}
      {...props}
    />
  ),
  code: ({ className, ...props }: ComponentProps) => (
    <code
      className={cn(
        "relative rounded bg-zinc-100 dark:bg-zinc-800 px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold text-zinc-900 dark:text-zinc-300",
        className,
      )}
      {...props}
    />
  ),
  Step: ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
    <div
      className={cn(
        "mb-8 ml-4 border-l-2 border-zinc-200 dark:border-zinc-800 pl-8 relative",
        className,
      )}
    >
      <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-zinc-900 dark:bg-zinc-50" />
      {props.children}
    </div>
  ),
  Steps: ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
    <div className={cn("mt-8 mb-12", className)} {...props} />
  ),
  ComponentPreview: async ({
    name,
    className,
  }: {
    name: string;
    className?: string;
  }) => {
    const code = getComponentCode(name) || "// Component not found";
    return (
      <ComponentPreview name={name} code={code}>
        <CodeBlock code={code} language="tsx" className={className} />
      </ComponentPreview>
    );
  },
  CodeBlock: CodeBlock,
};
