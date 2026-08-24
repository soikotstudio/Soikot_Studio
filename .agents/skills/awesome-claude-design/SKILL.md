---
name: awesome-claude-design
description: Claude Design & DESIGN.md system specification toolkit from rohitg00/awesome-claude-design. Use when generating, prototyping, or designing UI across 10 aesthetic families (editorial, terminal-core, warm-editorial, data-dense, cinematic-dark, playful, glass, neon-brutalist, indie/cult, remix), applying DESIGN.md prompt recipes, extracting brand styles, and converting wireframes to high-fidelity interfaces.
metadata:
  author: rohitg00
  version: "1.0.0"
  repository: "https://github.com/rohitg00/awesome-claude-design"
---

# Awesome Claude Design & DESIGN.md Specification

A design intelligence and UI engineering skill for creating interfaces across 10 distinct aesthetic families, generating production-grade `DESIGN.md` design systems, and converting briefs into high-fidelity web applications.

---

## 1. The 10 Aesthetic Families & Signatures

| Family | Representative Brands | Primary Palette | Type & Grid Language | Key Mechanics |
| :--- | :--- | :--- | :--- | :--- |
| **1. Editorial Minimalism** | Linear, Vercel, Raycast | `#000000`, `#0f0f14`, `#5e6ad2`, `#ffffff` | Sans-display, geometric mono, 12-col asymmetric grid | Hairline borders (`rgba(255,255,255,0.08)`), keyboard-first shortcuts, subtle surface elevation |
| **2. Terminal-Core** | Ollama, Resend, Modal, Railway | `#000000`, `#ffffff`, `#22c55e` (emerald) | `IBM Plex Mono` / `JetBrains Mono`, strict box-drawing borders | ASCII art headers, live CLI streams, high-contrast monospace tokens |
| **3. Warm Editorial** | Anthropic, Claude, Medium, Substack | `#f4f3ee` (bone), `#c96442` (terracotta), `#191817` | High-contrast serif + neutral sans body | Generous editorial line-heights, bookish margins, warm off-white canvas |
| **4. Data-Dense Pro** | ClickHouse, Datadog, Grafana, Bloomberg | `#181818`, `#faff69` (electric yellow), `#e11d48` | Compact tabular numbers, micro-labels (9-11px), 16-col grid | Zero-margin charts, live metric tickers, dense data tables without card clutter |
| **5. Cinematic Dark** | RunwayML, Midjourney, Luma AI | `#050508`, `#00f2fe`, `#4facfe`, `#ff007f` | Ultra-wide tracking display type, full-bleed media | 3D shader canvases, deep shadow falls, high-contrast media focus |
| **6. Playful Color** | Figma, Miro, Notion, Craft | Multi-hue vibrant pops (`#0acf83`, `#f24e1e`, `#a259ff`) | Rounded friendly sans (`Plus Jakarta Sans`), soft cards | Interactive sticker badges, dynamic cursor previews, spring hover physics |
| **7. Glass & Soft Futurism** | Arc Browser, macOS Tahoe, VisionOS | Layered translucent whites, frosted blur, soft mesh | Clean human sans, dynamic pill containers | `backdrop-filter: blur(24px)`, multi-stop border highlights, light refraction |
| **8. Neon Brutalist** | The Verge, Pitchfork, Gumroad | Stark `#000000`, `#ffffff`, high-voltage `#ff6600` / `#00ff66` | Heavy sans-serif display, raw thick borders (`2px - 3px solid #000`) | Hard drop shadows (`box-shadow: 4px 4px 0 #000`), marquee banners, raw layout blocks |
| **9. Cult & Indie Picks** | Granola.ai, Readwise, Cron, Folk | `#faf8f2` (warm paper), `#2c3e50`, muted sage | Refined indie grotesk, tactile micro-details | Handcrafted micro-animations, analog textures, artisan copy |
| **10. Remix / Hybrid** | Custom Studio / Agency Mashups | Tailored duo-tone or tri-tone brand tokens | Curated pairing (e.g. `Plus Jakarta Sans` + `IBM Plex Mono`) | Fluid scroll-trigger morphing, sticky sidebars, bespoke interactive controls |

---

## 2. Standard `DESIGN.md` Generation Framework

When creating or updating a design system file (`DESIGN.md`) for any project, structure it into the following 6 core sections:

```markdown
# DESIGN.md — [Project Name]

## 1. Brand Identity & Aesthetic Family
- Family: [e.g. Editorial Minimalism / Cinematic Dark / Warm Editorial]
- Tone & Voice: [e.g. Technical, precise, authoritative, high-craft]
- Core Metaphor: [e.g. Precision optical instrument, editorial journal, live cockpit]

## 2. Color Calibration & Design Tokens
- Canvas (Background): [Hex / CSS Variable]
- Surface / Cards: [Hex / CSS Variable]
- Primary Text: [Hex / CSS Variable]
- Muted / Secondary Text: [Hex / CSS Variable]
- Singular Accent Token: [Hex / CSS Variable]
- Border & Divider Token: [Hex / CSS Variable]

## 3. Typography Scale & Hierarchy
- Display / H1: [Font family, clamp size, weight, line-height, letter-spacing]
- Section Headlines (H2-H3): [Font family, size, weight, line-height]
- Body / Paragraph: [Font family, 15-16px, line-height 1.6, max-width 65ch]
- Code / Metadata: [Monospace font, 10-12px, tracking 0.05em, tabular-nums]

## 4. Layout Mechanics & Grid Systems
- Page Container: [max-width 1360px - 1440px, centered]
- Breakpoints: [sm: 640px, md: 768px, lg: 1024px, xl: 1280px]
- Spacing Scale: [8px, 16px, 24px, 32px, 48px, 64px, 96px, 128px]
- Corner Radii: [e.g. Sharp 0px / Micro 4px / Sleek 16-22px / Full Pill 9999px]

## 5. Interaction, State & Motion Guidelines
- Hover Transitions: [150ms - 250ms cubic-bezier(0.16, 1, 0.3, 1)]
- Active State: [transform scale(0.98) or translateY(1px)]
- Focus Ring: [focus-visible 2px ring with offset]
- Motion Engine: [GSAP ScrollTrigger / Lenis smooth scroll / Spring physics]
- Reduced Motion: [prefers-reduced-motion fallback to static]

## 6. Component Catalog & Patterns
- Buttons: [Primary Pill, Secondary Ghost, Icon Button]
- Navigation: [Single-line fixed/sticky header, height 64-72px]
- Hero Section: [Single viewport fit, max 2 lines headline, max 20 words subtext]
- Media / Showcase: [16:9 or 16:10 standard aspect ratio with interactive controls]
```

---

## 3. Core Recipes & Workflows

### Recipe A: Brand Extraction to `DESIGN.md`
1. Inspect the existing website, screenshot, or brand brief.
2. Sample the dominant background, primary text color, and single accent color.
3. Identify font pairings (Headings + Body + Technical Mono).
4. Extract spacing rhythms and corner-radius scale.
5. Compile into standard `DESIGN.md`.

### Recipe B: Wireframe to High-Fidelity Conversion
1. Take low-fidelity layout structure (hierarchy, content slots).
2. Apply the chosen aesthetic family's tokens and typography scale.
3. Replace wireframe boxes with rich visual assets (photography, live SVG marks, interactive components).
4. Add micro-interactions (hover feedback, active compression, focus rings).
5. Verify zero layout overflow and full mobile responsiveness (`min-h-[100dvh]`).

### Recipe C: 20-Minute Landing Page Execution
1. **Minute 0–3:** Infer brief & declare aesthetic family.
2. **Minute 4–8:** Lock color tokens, typography, and base CSS variables.
3. **Minute 9–14:** Build Hero section (1-line nav, 2-line headline, max 20 words subtext, primary CTA).
4. **Minute 15–18:** Build Showcase & Social Proof blocks (asymmetric grid, real logo marks).
5. **Minute 19–20:** Run Web Interface Guidelines audit (a11y labels, focus rings, responsive collapse).

---

## 4. Anti-Slop Discipline & AI Fingerprints to Avoid

- ❌ **No AI-Purple Glows:** Never default to purple gradients, magenta blobs, or neon button glows unless explicitly requested.
- ❌ **No Text Wrapping on Buttons:** CTAs must remain single-line at desktop.
- ❌ **No 100vh Mobile Jumps:** Always use `min-h-[100dvh]` or explicit aspect ratios to prevent mobile address bar jumpiness.
- ❌ **No Centered Monotony:** Break repetitive centered columns with asymmetric splits, sticky sidebars, and bento rhythms.
- ❌ **No Duplicate CTAs:** Maintain singular intent per action (e.g. one primary contact action, one primary view work action).
