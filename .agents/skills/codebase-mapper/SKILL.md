---
name: codebase-mapper
description: Generates, reads, and updates a visual Mermaid.js mind map of the codebase to prevent token burnout. Use this when starting a session, onboarding to the repo, or after making structural changes.
---

# Codebase Mapper Skill

## Context & Token Optimization Goal

To prevent context window saturation and unnecessary token burn, you MUST NOT reread raw source code files to remember architecture layout across agent loops or restarts. Instead, rely on a dedicated `CODEBASE_MAP.md` artifact which abstracts the structure into a functional Mermaid mind map.

## Core Workflows

### Workflow 1: Initial Session Mapping

When this skill is activated at the beginning of a project or session:

1. Scan the project root for an existing `CODEBASE_MAP.md`.
2. If it EXISTS:
   - Read ONLY `CODEBASE_MAP.md` to instantly absorb the code architecture. Do not read the actual directories unless debugging or explicitly requested.
3. If it DOES NOT EXIST:
   - Perform a structural directory walk (ignoring `.git`, `node_modules`, `build`, etc.).
   - Identify primary entry points, controller/routing layers, data models, and helper utilities.
   - Generate a new `CODEBASE_MAP.md` utilizing the Mermaid.js structure outlined below.

### Workflow 2: Synchronizing on Structural Changes

Whenever you create a new file, change a file path, add a major module, or alter dependencies:

1. Complete the code modification.
2. Immediately rewrite/patch the `CODEBASE_MAP.md` file to reflect the update.
3. Keep the file concise so its absolute footprint remains minimal.

## Markdown Map Structure Blueprint

The file `CODEBASE_MAP.md` must adhere to the following schema:

```markdown
# Codebase Architecture Map

\`\`\`mermaid
mindmap
root((Project Name))
EntryPoints
::icon(fa fa-code)
[main.ts or app.js]
Domain / Core Modules
Module A
)Submodule / Features(
Module B
Infrastructure / Data
[Database Layer]
[API Clients]
State / Context
\`\`\`

## High-Level State & Context Cache

- **Current Technical Debt:** [List major blockers, half-finished migrations, or context rules here]
- **Active Feature Branch Context:** [What we are currently working on]
- **Critical Absolute Paths:** [Key files that handle core logic]
```

## Best Practices

- Keep node names short. Use text shapes like `((Root))` or `[File Name]` to visually prioritize entities.
- Never let this map grow over 150 lines. If a feature is granular, point to a sub-feature documentation file instead of expanding it infinitely.
