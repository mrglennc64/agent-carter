import fs from "fs";
import path from "path";

export interface DesignSystemMeta {
  id: string;
  name: string;
  category: string;
  description: string;
}

const SYSTEMS_DIR =
  process.env.DESIGN_SYSTEMS_DIR ?? path.join(process.cwd(), "..", "design-systems");

export function listSystems(): DesignSystemMeta[] {
  const entries = fs.readdirSync(SYSTEMS_DIR, { withFileTypes: true });
  const systems: DesignSystemMeta[] = [];
  for (const entry of entries) {
    if (!entry.isDirectory() || entry.name.startsWith("_")) continue;
    const dir = path.join(SYSTEMS_DIR, entry.name);
    if (!fs.existsSync(path.join(dir, "DESIGN.md"))) continue;
    let name = entry.name;
    let category = "Uncategorized";
    let description = "";
    const manifestPath = path.join(dir, "manifest.json");
    if (fs.existsSync(manifestPath)) {
      try {
        const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
        name = manifest.name ?? name;
        category = manifest.category ?? category;
        description = manifest.description ?? "";
      } catch {
        // unreadable manifest — fall back to directory name
      }
    }
    systems.push({ id: entry.name, name, category, description });
  }
  return systems.sort((a, b) => a.name.localeCompare(b.name));
}

export function readSystemContext(id: string): { design: string; tokens: string | null } {
  // ids come from the client — restrict to a real child directory of SYSTEMS_DIR
  if (!/^[a-z0-9-]+$/i.test(id)) throw new Error("invalid system id");
  const dir = path.join(SYSTEMS_DIR, id);
  const design = fs.readFileSync(path.join(dir, "DESIGN.md"), "utf8");
  const tokensPath = path.join(dir, "tokens.css");
  const tokens = fs.existsSync(tokensPath) ? fs.readFileSync(tokensPath, "utf8") : null;
  return { design, tokens };
}
