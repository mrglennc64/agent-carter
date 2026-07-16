import fs from "fs";
import path from "path";
import { NextRequest } from "next/server";

const PROJECTS_DIR =
  process.env.PROJECTS_DIR ?? path.join(process.cwd(), "data", "projects");

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  if (!/^[a-z0-9-]+$/i.test(id)) return new Response("bad id", { status: 400 });
  const file = path.join(PROJECTS_DIR, `${id}.html`);
  if (!fs.existsSync(file)) return new Response("not found", { status: 404 });
  return new Response(fs.readFileSync(file, "utf8"), {
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}
