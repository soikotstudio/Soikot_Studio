---
name: skills-cli
description: Official Vercel Labs open agent skills ecosystem CLI (skills.sh). Use when instructed to "search skills", "install skill from github", "list installed skills", "update agent skills", "remove skills", or manage agent skills across repositories.
metadata:
  author: vercel-labs
  version: "1.0.0"
  repository: "https://github.com/vercel-labs/skills"
---

# Vercel Labs Skills CLI (`skills.sh`)

Command-line package manager for discovering, installing, managing, and synchronizing AI agent skills across 75+ coding agents.

---

## Global CLI Installation

```bash
npm install -g skills@latest
skills --help
```

---

## Quick Reference Commands

### 1. Add / Install Skills
```bash
# Add all skills from a GitHub repo
skills add owner/repo --all

# Add a specific skill from a repository
skills add vercel-labs/agent-skills --skill web-design-guidelines

# Add skills globally (user configuration level)
skills add vercel-labs/agent-skills -g --all

# List skills available in a repository before installing
skills add owner/repo --list
```

### 2. Discover & Search Skills
```bash
# Interactive skill search from skills.sh registry
skills find

# Search by topic or keyword
skills find react
skills find animations --owner emilkowalski
```

### 3. List & Inspect Skills
```bash
# List all skills installed in current project
skills list

# List all globally installed skills
skills list -g

# Output machine-readable JSON
skills list --json
```

### 4. Update & Synchronize
```bash
# Update all project skills to latest upstream version
skills update -y

# Update all global skills
skills update -g -y
```

### 5. Remove Skills
```bash
# Remove a specific skill
skills remove <skill-name>

# Remove a skill globally
skills remove --global <skill-name>
```
