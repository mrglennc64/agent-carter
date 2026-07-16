export interface ArtifactType {
  id: string;
  label: string;
  instructions: string;
}

export const ARTIFACT_TYPES: ArtifactType[] = [
  {
    id: "landing-page",
    label: "Landing page",
    instructions:
      "Produce a complete single-page marketing landing page: sticky nav, hero with primary CTA, 3-6 content sections (features, social proof, stats, pricing or FAQ as fits the brief), and a footer. Fully responsive. Subtle scroll-reveal animations with IntersectionObserver are welcome.",
  },
  {
    id: "deck",
    label: "Pitch deck",
    instructions:
      "Produce a slide deck as a single HTML file: each slide is a full-viewport <section>. Include keyboard navigation (arrow keys / space), a slide counter, and print CSS so each slide prints as one page (that is the PDF export path). 8-12 slides unless the brief says otherwise: title, problem, solution, how it works, proof/stats, and a closing CTA slide.",
  },
  {
    id: "dashboard",
    label: "Dashboard",
    instructions:
      "Produce a data dashboard: top KPI stat cards, at least two charts rendered with inline SVG or canvas (no external chart libraries), and a data table. Use plausible realistic sample data that fits the brief. Sidebar or top navigation as fits the design system.",
  },
  {
    id: "poster",
    label: "Poster / hero",
    instructions:
      "Produce a single striking poster or hero visual as one full-viewport composition: strong typographic hierarchy, one focal message, decorative elements built from CSS/SVG only. No page chrome, no nav, no footer. It should look like a designed artwork, not a website.",
  },
  {
    id: "social-card",
    label: "Social card",
    instructions:
      "Produce a social media card as a fixed 1200x630px composition centered on the page against a neutral backdrop. Brand mark or wordmark, headline, and one supporting element. Everything inside the 1200x630 frame; it will be screenshotted for export.",
  },
  {
    id: "email",
    label: "Email template",
    instructions:
      "Produce an HTML email: max-width 600px centered column, table-based layout, all styles inline, web-safe font fallbacks. Header, body sections per the brief, one clear CTA button, footer with unsubscribe placeholder. It must render acceptably in email clients.",
  },
];

export function buildSystemPrompt(designMd: string, tokensCss: string | null, artifact: ArtifactType): string {
  return `You are an expert design engineer producing a single self-contained HTML artifact.

# Design system contract
The artifact MUST follow this design system exactly — its colors, typography, spacing, component styles, and do's/don'ts:

${designMd}
${tokensCss ? `\n# CSS tokens\nUse these custom properties as the base of your stylesheet:\n\n\`\`\`css\n${tokensCss}\n\`\`\`\n` : ""}
# Artifact type
${artifact.instructions}

# Hard rules
- Output ONLY a complete HTML document, starting with <!DOCTYPE html> and ending with </html>. No markdown fences, no commentary before or after.
- Single file: all CSS in one <style> block, all JS (if any) in one <script> block. No external requests except Google Fonts <link> tags when the design system names a Google font.
- The page must be polished and production-quality: real copy written for the brief (never lorem ipsum), consistent spacing rhythm, accessible contrast, and a responsive layout.
- Inline SVG for icons and illustrations; never reference external images.`;
}
