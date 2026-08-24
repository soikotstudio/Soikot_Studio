---
name: vercel-agent-skills-builder
description: Create, package, validate, and manage AI agent skills adhering to the official Vercel Labs AGENTS.md specification. Use when asked to "create a skill", "write a new agent skill", "package a skill", "format SKILL.md", or "structure agent skills according to Vercel standards".
metadata:
  author: vercel-labs
  version: "1.0.0"
  repository: "https://github.com/vercel-labs/agent-skills"
---

# Vercel Labs Agent Skills Builder

A skill for scaffolding, authoring, and validating reusable AI agent skills following the official [vercel-labs/agent-skills](https://github.com/vercel-labs/agent-skills) architecture.

---

## Skill Architecture Specification

Every skill must follow this directory layout:

```
skills/ (or .agents/skills/)
  {skill-name}/           # kebab-case directory name
    SKILL.md              # Required: skill definition with YAML frontmatter
    scripts/              # Optional: executable scripts (.sh, .mjs, .ps1)
      {script-name}.mjs   # Node.js scripts
      {script-name}.sh    # Bash scripts
    references/           # Optional: supporting docs, rule sheets, and examples
    lib/                  # Optional: shared utilities for scripts
```

---

## Naming Conventions

- **Skill Directory**: `kebab-case` (e.g., `web-design-guidelines`, `react-best-practices`)
- **SKILL.md**: Always uppercase, always this exact filename at the skill root.
- **Scripts**: `kebab-case.sh` or `kebab-case.mjs`.

---

## Standard `SKILL.md` Template

```markdown
---
name: {skill-name}
description: {One concise sentence describing when to trigger/use this skill. Include explicit trigger phrases.}
metadata:
  author: {author-name}
  version: "1.0.0"
---

# {Skill Title}

{Brief description of what the skill accomplishes.}

## How It Works

{Numbered list explaining the skill's execution workflow}

## When to Apply

- {Trigger scenario 1}
- {Trigger scenario 2}

## Guidelines & Rules

### 1. Core Rule Category
- Rule 1
- Rule 2

## Usage & Execution

```bash
# Example command or CLI invocation
npx skills add {skill-name}
```
```

---

## Validation Checklist

Before publishing or installing any skill, verify:
1. `SKILL.md` contains valid YAML frontmatter with `name` and `description`.
2. Directory name is `kebab-case` and matches the `name` field in `SKILL.md`.
3. Clear trigger phrases are included in the description.
4. Any reference files are located in `references/` and referenced cleanly via relative links.
