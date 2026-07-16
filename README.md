# Design Studio

A lean, self-hosted AI design studio. Pick a design system and a skill, type a
brief, and Claude generates an on-brand single-page HTML artifact previewed in a
sandboxed iframe.

Built on assets from [Open Design](https://github.com/nexu-io/open-design)
(Apache 2.0 — see `NOTICE` and `LICENSE-open-design`), with a thin custom
Next.js studio instead of their desktop app.

## Layout

- `design-systems/` — 150+ brand contracts (`DESIGN.md` + tokens + component galleries), including custom systems for our own brands (`heyroya/`, `traproyalties/`)
- `skills/` — design skills in Claude Code skill format (decks, posters, social cards, exports, …)
- `templates/` — deck and live-artifact HTML frameworks
- `prompt-templates/` — image / video prompt templates
- `studio/` — the Next.js app (system + skill picker → brief → streamed artifact preview → export)

## Run

```bash
cd studio
npm install
# set ANTHROPIC_API_KEY in studio/.env.local
npm run dev
```
