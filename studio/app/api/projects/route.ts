import fs from "fs";
import path from "path";
import { NextRequest, NextResponse } from "next/server";

const PROJECTS_DIR =
  process.env.PROJECTS_DIR ?? path.join(process.cwd(), "data", "projects");

interface ProjectMeta {
  id: string;
  title: string;
  systemId: string;
  artifactTypeId: string;
  brief: string;
  createdAt: string;
}

function ensureDir() {
  fs.mkdirSync(PROJECTS_DIR, { recursive: true });
}

export function GET() {
  ensureDir();
  const metas: ProjectMeta[] = [];
  for (const file of fs.readdirSync(PROJECTS_DIR)) {
    if (!file.endsWith(".json")) continue;
    try {
      metas.push(JSON.parse(fs.readFileSync(path.join(PROJECTS_DIR, file), "utf8")));
    } catch {
      // skip corrupt entries
    }
  }
  metas.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  return NextResponse.json(metas);
}

export async function POST(req: NextRequest) {
  ensureDir();
  const { title, systemId, artifactTypeId, brief, html } = await req.json();
  if (!title || !html) {
    return NextResponse.json({ error: "title and html are required" }, { status: 400 });
  }
  const id = `${Date.now()}-${title.toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 40)}`;
  const meta: ProjectMeta = {
    id,
    title,
    systemId: systemId ?? "",
    artifactTypeId: artifactTypeId ?? "",
    brief: brief ?? "",
    createdAt: new Date().toISOString(),
  };
  fs.writeFileSync(path.join(PROJECTS_DIR, `${id}.json`), JSON.stringify(meta, null, 2));
  fs.writeFileSync(path.join(PROJECTS_DIR, `${id}.html`), html);
  return NextResponse.json(meta);
}
