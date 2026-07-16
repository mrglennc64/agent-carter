# Design System — HeyRoya

> Category: Music & Publishing Tech
> Metadata correction for music publishers (heyroya.se). Deep forest green, soft sage surfaces, a single gold accent. Scandinavian calm meets rights-management precision.

## 1. Visual Theme & Atmosphere

HeyRoya feels like a quiet Scandinavian office for people who fix other people's messes — calm, orderly, and quietly confident. The canvas is never pure white: it's a family of soft sage and mist tints (`#f6f7f4`, `#eef4f0`, `#e9eee8`) that make the page feel like recycled paper with a faint green undertone. On top of that sits a deep forest green brand color (`#075a3b`) that reads as institutional trust — closer to a national bank than a startup.

The emotional register is *reassurance*. The product cleans up broken music metadata for publishers, so the design must communicate: nothing flashy, nothing broken, everything accounted for. Generous whitespace, soft rounded containers, and low-contrast section boundaries do most of the work. The one moment of warmth is a muted gold (`#b48a47`) used sparingly for premium touches — a highlighted stat, a badge, a key number.

**Key Characteristics:**
- Sage-tinted off-white canvas (`#f6f7f4`) — never pure white pages
- Deep forest green (`#075a3b`) as the trust-anchor brand color
- Mint highlights (`#dff5ec`, `#47b38a`) for success and freshness moments
- Single muted gold accent (`#b48a47`) for premium emphasis, used rarely
- Dark ink-green (`#14211f`) instead of black for dark surfaces and headings
- Swedish-market tone: sober, precise, unhurried

## 2. Color Palette & Roles

### Primary
- **Forest Green** (`#075a3b`): Primary brand color — CTAs, links, logo moments, section accents.
- **Emerald** (`#0c7a56`): Hover/active state for Forest Green; secondary brand emphasis.
- **Ink Green** (`#14211f`): Near-black with a green undertone — headings, dark hero/footer surfaces, primary text on light.

### Secondary & Accent
- **Mint** (`#47b38a`): Positive/fresh accent — success states, upward metrics, checkmarks.
- **Gold** (`#b48a47`): Premium accent — badges, standout numbers, "pro" moments. Never for large areas.
- **Slate Blue** (`#315a82`): Informational accent — links in body copy, info callouts. Use sparingly.

### Surface & Background
- **Sage Paper** (`#f6f7f4`): Default page background.
- **Mist** (`#eef4f0`): Alternate section background for gentle striping.
- **Moss Tint** (`#e9eee8`): Card and container fill on Sage Paper.
- **Mint Wash** (`#dff5ec`): Highlight surface — success banners, featured cards.
- **Mint Border** (`#b8dfcf`): Border for mint-washed elements.

### Neutrals & Text
- **Ink Green** (`#14211f`): Primary text.
- **Gray Green** (`#63706d`): Secondary text, captions, metadata.
- **Border Sage** (`#d8dfda`): Default hairline borders and dividers.
- **White** (`#ffffff`): Card surfaces needing maximum lift, text on dark green.
- On dark surfaces use `rgba(255,255,255,0.88)` for body text, `rgba(216,223,218,0.82)` for muted text.

## 3. Typography Rules

### Font Family
- **Display & body:** system sans stack — `-apple-system, "Segoe UI", Inter, Helvetica, Arial, sans-serif`. The brand's voice is set by color and spacing, not exotic type.
- **Numeric/tabular data:** same stack with `font-variant-numeric: tabular-nums` for royalty figures and tables.

### Hierarchy
- Hero H1: 44–56px, weight 700, line-height 1.1, Ink Green, tracking −0.02em
- H2: 32px, weight 700, line-height 1.2
- H3: 22px, weight 600
- Body: 16–17px, weight 400, line-height 1.6, Ink Green
- Caption/meta: 13–14px, Gray Green

### Principles
- Sentence case everywhere — no ALL CAPS except tiny eyebrow labels (12px, letter-spacing 0.08em, Forest Green)
- Swedish copy tolerates long compound words: keep measure ≤ 65ch and allow generous line-height
- Numbers are heroes: royalty amounts and match-rates get Gold or Forest Green at display sizes

## 4. Component Stylings

### Buttons
- **Primary:** Forest Green fill, white text, radius 10px, padding 12px 24px; hover → Emerald
- **Secondary:** transparent with 1px Border Sage, Ink Green text; hover → Moss Tint fill
- **Gold accent button:** only one per page, Gold fill, white text — reserved for the main conversion CTA when the page needs a premium moment

### Cards & Containers
- Radius 14–16px, Moss Tint or white fill, 1px Border Sage
- Shadows are whispers: `0 2px 8px rgba(26,45,40,0.12)` max; prefer borders over shadows
- Featured/success cards use Mint Wash fill + Mint Border

### Inputs & Forms
- White fill, 1px Border Sage, radius 10px, 12px padding
- Focus: 2px Forest Green ring, no glow
- Labels above inputs, 14px weight 500

### Navigation
- Transparent over Sage Paper, Ink Green links, Forest Green active state
- Sticky nav gains white fill + hairline bottom border on scroll

### Distinctive Components
- **Stat blocks:** big Forest Green or Gold number, Gray Green label underneath
- **Before/after metadata rows:** broken value struck through in Gray Green, corrected value in Forest Green with a Mint check
- **Dark closer section:** Ink Green (`#14211f`) full-bleed footer/CTA band with white text and Mint accents

## 5. Layout Principles

- Spacing scale: 4 / 8 / 12 / 16 / 24 / 32 / 48 / 64 / 96px
- Container: max-width 1120px, 24px side padding
- Section rhythm: 96–128px vertical padding, alternating Sage Paper / Mist backgrounds instead of divider lines
- Radius scale: 10px (controls) / 14–16px (cards) / 24px (hero panels)
- Whitespace is the primary luxury signal — when in doubt, add space, not decoration

## 6. Depth & Elevation

- Two levels only: flat (default) and lifted (`0 2px 8px rgba(26,45,40,0.12)` or `0 1px 3px rgba(30,48,43,0.08)`)
- No layered mega-shadows, no glassmorphism, no gradients except a barely-there sage→mist wash in heroes

## 7. Do's and Don'ts

### Do
- Keep every gray green-tinted — no cool blue-grays
- Use Gold once or twice per page, at most
- Let numbers and checkmarks carry the persuasion
- Alternate section backgrounds for rhythm

### Don't
- Don't use pure black (`#000`) anywhere
- Don't stack more than one accent color in a single component
- Don't use loud gradients, neon, or dark mode (except the Ink Green closer band)
- Don't shout — no exclamation-point energy in copy or visuals

## 8. Responsive Behavior

- Breakpoints: 640 / 900 / 1120px
- Hero H1 scales 56 → 36px on mobile; section padding 128 → 64px
- Cards stack single-column below 900px; stat rows become 2-up grid
- Touch targets ≥ 44px

## 9. Agent Prompt Guide

### Quick Color Reference
`bg #f6f7f4 · surface #e9eee8 · text #14211f · muted #63706d · brand #075a3b · brand-hover #0c7a56 · mint #47b38a · mint-wash #dff5ec · gold #b48a47 · border #d8dfda`

### Example Component Prompts
- "Pricing card, HeyRoya style": Moss Tint card, radius 16, Border Sage, Forest Green price, one Gold 'Rekommenderas' badge on the middle tier
- "Hero, HeyRoya style": Sage Paper bg, eyebrow label in Forest Green caps, 52px Ink Green headline, 17px Gray Green subcopy, primary Forest Green button + secondary outline button, trust row of publisher logos in grayscale
