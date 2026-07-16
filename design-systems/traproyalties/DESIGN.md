# Design System — TrapRoyaltiesPro

> Category: Music & Fintech
> Enterprise music rights management (traproyaltiespro.com). Deep-space navy, Orbitron display type, neon purple/amber signals. A trading terminal for royalties.

## 1. Visual Theme & Atmosphere

TrapRoyaltiesPro looks like a Bloomberg terminal that grew up on trap music. The entire product lives in dark mode: layered deep-navy surfaces (`#0a0f1e` → `#0f1623` → `#0f172a` → `#1e293b`) create a night-studio atmosphere where data glows. This is enterprise software — catalog audits, royalty recovery, DDEX distribution — but the audience is music people, so the visual language borrows from studio gear and streaming dashboards: neon accents, LED-like status colors, and a futuristic display face.

Typography does the genre-signaling: **Orbitron** (geometric, sci-fi, all-caps friendly) for headlines, logos, and big numbers; **Inter** for everything readable. The accent system behaves like signal lights on a mixing console — purple (`#a855f7`) is the brand/interactive glow, amber (`#f59e0b`) is money and warnings, pink/magenta (`#ec4899`) is energy and highlights, cyan (`#06b6d4`) is informational telemetry. Color means something; it is never decoration.

**Key Characteristics:**
- Permanent dark mode on layered navy surfaces — never pure black pages
- Orbitron display type for headlines and figures; Inter for body and UI
- Purple neon (`#a855f7`) as the primary interactive/brand glow
- Amber (`#f59e0b`, `#fbbf24`) reserved for money: royalty amounts, recovered revenue
- Terminal energy: monospace-feeling data tables, status dots, glowing borders
- Deep green (`#2B6F4B`) as the "verified / recovered / paid" institutional signal

## 2. Color Palette & Roles

### Primary
- **Void Navy** (`#0a0f1e`): Page background — the deepest layer.
- **Panel Navy** (`#0f1623` / `#0f172a`): Card and panel surfaces, one step up from the void.
- **Slate Raise** (`#1e293b`): Elevated surfaces, hover fills, table header rows.
- **Neon Purple** (`#a855f7`): Primary brand + interactive color — CTAs, links, active states, glows.

### Secondary & Accent
- **Soft Violet** (`#a78bfa`): Secondary purple for hover text, secondary icons.
- **Deep Purple** (`#9333ea` / `#581c87`): Pressed states and purple gradient stops.
- **Money Amber** (`#f59e0b` / `#fbbf24` / `#facc15`): Royalty figures, revenue stats, premium tier markers.
- **Signal Pink** (`#ec4899` / `#db2777`): High-energy highlights, marketing moments; neon magenta `#ff00de` only for rare glow effects.
- **Telemetry Cyan** (`#06b6d4`): Informational accents, chart series, live indicators.
- **Rights Green** (`#2B6F4B`): Verified, recovered, paid, contract-signed states. Light tint `#F0F9F4` for rare light-context chips.

### Semantic
- **Success:** Rights Green `#2B6F4B` · **Warning:** Money Amber `#f59e0b` · **Danger:** `#ef4444` (tint `#FEE2E2` for chips) · **Info:** Telemetry Cyan `#06b6d4`

### Neutrals & Text
- **White** (`#ffffff`): Headlines and primary text on navy.
- **Slate Light** (`#E2E8F0`): Body text on dark surfaces.
- **Muted:** `rgba(255,255,255,0.55)` for secondary text, `rgba(255,255,255,0.3)` for disabled/dividers.
- Borders: `rgba(255,255,255,0.08)` hairlines; purple-tinted `rgba(168,85,247,0.35)` for active/focus borders.

### Gradient System
- Hero/CTA gradient: `#9333ea → #ec4899` (135deg), used at low frequency and high impact
- Ambient depth: radial purple glow `rgba(88,28,135,0.35)` bleeding from corners of hero sections
- Chart fills: vertical fade from accent color to transparent

## 3. Typography Rules

### Font Family
- **Display:** `Orbitron, sans-serif` — weights 500–900. Headlines, nav logo, stat figures, section labels.
- **Body/UI:** `Inter, sans-serif` — weights 300–800. Everything readable.
- Google Fonts: `family=Inter:wght@300;400;500;600;700;800&family=Orbitron:wght@400;500;600;700;800;900`

### Hierarchy
- Hero H1: Orbitron 40–56px, weight 800, white, tracking +0.01em, line-height 1.1
- H2: Orbitron 28–32px, weight 700
- Eyebrow/section label: Orbitron 12–13px, weight 600, letter-spacing 0.2em, uppercase, Neon Purple or Telemetry Cyan
- Body: Inter 15–16px, weight 400, `#E2E8F0`, line-height 1.65
- Stat figures: Orbitron 32–48px, weight 700, Money Amber (revenue) or white (counts)
- Data tables: Inter 13–14px, `tabular-nums`

### Principles
- Orbitron never for paragraphs — display only; if it's more than 8 words, it's Inter
- Uppercase belongs to Orbitron labels; Inter stays sentence case
- Money is always amber, always tabular, always precise ($12,847.32 — never rounded in tables)

## 4. Component Stylings

### Buttons
- **Primary:** purple→pink gradient (`#9333ea → #ec4899`) or solid Neon Purple, white Inter 600 text, radius 8px, padding 12px 24px; hover lifts brightness + soft purple glow `0 0 24px rgba(168,85,247,0.4)`
- **Secondary:** transparent, 1px `rgba(168,85,247,0.35)` border, Soft Violet text; hover fills `rgba(168,85,247,0.1)`
- **Ghost:** Slate Light text, hover `rgba(255,255,255,0.06)` fill

### Cards & Containers
- Panel Navy fill, radius 12–16px, 1px `rgba(255,255,255,0.08)` border
- Featured cards get a 1px purple-tinted border + faint inner glow
- Stat cards: label (Inter 13px muted) over figure (Orbitron, amber/white) over delta chip (green/red)

### Inputs & Forms
- `#0f172a` fill, 1px `rgba(255,255,255,0.12)` border, radius 8px, Slate Light text
- Focus: border → Neon Purple + `0 0 0 3px rgba(168,85,247,0.25)` ring

### Navigation
- Sticky, Void Navy at 85% opacity with backdrop blur, hairline bottom border
- Logo in Orbitron; active link Neon Purple with 2px underline glow

### Distinctive Components
- **Terminal tables:** Slate Raise header row, hairline row dividers, amber money columns, Rights Green "RECOVERED"/"PAID" status chips
- **Status dots:** 8px glowing dots (green live, amber pending, red failed) preceding labels
- **Recovery ticker:** horizontally scrolling strip of recovered-royalty events, Orbitron figures

## 5. Layout Principles

- Spacing scale: 4 / 8 / 12 / 16 / 24 / 32 / 48 / 64 / 96px
- Container: max-width 1200px, 24px side padding; dashboards may go fluid to 1440px
- Section rhythm: 80–112px vertical padding; sections separated by hairlines or ambient glow shifts, not background swaps
- Radius scale: 8px (controls) / 12–16px (cards) / 20px (feature panels)

## 6. Depth & Elevation

- Depth = layered navy + glow, not drop shadows: Void → Panel → Slate Raise
- Interactive glow: `0 0 24px rgba(168,85,247,0.4)` on primary hover; amber equivalent for money moments
- Ambient radial purple glows anchor hero and CTA sections; max two per page

## 7. Do's and Don'ts

### Do
- Keep money amber and status green — semantic color discipline is the brand
- Use Orbitron for anything that should feel like hardware or a headline
- Let charts and tables glow subtly against the navy
- Keep hierarchy readable: one gradient CTA per viewport

### Don't
- Don't use pure black backgrounds or light mode
- Don't set body copy in Orbitron or all-caps
- Don't mix more than two accent colors in one component
- Don't use `#ff00de` neon except as a rare glow — never as text or fills

## 8. Responsive Behavior

- Breakpoints: 640 / 960 / 1200px
- Hero H1 scales 56 → 32px; Orbitron tracking loosens slightly at small sizes
- Terminal tables become stacked cards below 640px, money figures stay amber and prominent
- Touch targets ≥ 44px; glows reduced on mobile for performance

## 9. Agent Prompt Guide

### Quick Color Reference
`bg #0a0f1e · panel #0f1623 · raise #1e293b · text #E2E8F0 · heading #fff · brand #a855f7 · brand-2 #a78bfa · gradient #9333ea→#ec4899 · money #f59e0b · green #2B6F4B · cyan #06b6d4 · danger #ef4444 · border rgba(255,255,255,0.08)`

### Example Component Prompts
- "Stat row, TRP style": four Panel Navy cards, Inter muted labels, Orbitron figures (amber for $ values), green/red delta chips, hairline borders
- "Hero, TRP style": Void Navy with corner purple radial glow, cyan Orbitron eyebrow 'ROYALTY RECOVERY', 52px Orbitron white headline, Inter subcopy, gradient primary CTA + outlined secondary, recovery ticker strip beneath
