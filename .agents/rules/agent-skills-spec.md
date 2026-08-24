# Agent Skills Standard Specification (Vercel Labs)

This file provides architectural rules and standards for creating and maintaining AI coding agent skills across the project.

## Directory Structure

```
skills/ (or .agents/skills/)
  {skill-name}/           # kebab-case directory name
    SKILL.md              # Required: skill definition with YAML frontmatter
    scripts/              # Optional: executable scripts (.sh, .mjs, .ps1)
    references/           # Optional: supporting docs and rules loaded on demand
    lib/                  # Optional: shared code or utilities for scripts
```

## Naming Conventions

- **Skill Directory**: `kebab-case` (e.g., `web-design-guidelines`, `taste-skill`, `react-best-practices`)
- **SKILL.md**: Always uppercase, always this exact filename at the root of the skill directory
- **Scripts**: `kebab-case.sh`, `kebab-case.mjs`, or `kebab-case.ps1`
- **References**: Markdown files in `references/` or `rules/` detailing domain-specific rules

## SKILL.md Standard Format

```markdown
---
name: {skill-name}
description: {One concise sentence describing when to trigger/use this skill. Include explicit trigger phrases.}
metadata:
  author: {author-or-team}
  version: "1.0.0"
---

# {Skill Title}

{Brief description of what the skill accomplishes.}

## When to Apply

{Bullet list of scenarios, prompts, and file types where this skill activates.}

## Guidelines & Rules

{Structured list of engineering, design, or architecture rules categorized by priority.}

## Workflows & Usage Examples

{Code blocks, CLI commands, or prompts demonstrating proper execution.}
```
