import Anthropic from "@anthropic-ai/sdk";
import { NextRequest } from "next/server";
import { readSystemContext } from "@/lib/systems";
import { ARTIFACT_TYPES, buildSystemPrompt } from "@/lib/artifactTypes";

export const maxDuration = 600;

export async function POST(req: NextRequest) {
  let body: { systemId?: string; artifactTypeId?: string; brief?: string };
  try {
    body = await req.json();
  } catch {
    return new Response("invalid JSON body", { status: 400 });
  }
  const { systemId, artifactTypeId, brief } = body;
  if (!systemId || !artifactTypeId || !brief?.trim()) {
    return new Response("systemId, artifactTypeId and brief are required", { status: 400 });
  }
  const artifact = ARTIFACT_TYPES.find((a) => a.id === artifactTypeId);
  if (!artifact) return new Response("unknown artifact type", { status: 400 });

  let system: string;
  try {
    const { design, tokens } = readSystemContext(systemId);
    system = buildSystemPrompt(design, tokens, artifact);
  } catch {
    return new Response("unknown design system", { status: 400 });
  }

  const client = new Anthropic();
  const encoder = new TextEncoder();

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        const messageStream = client.messages.stream({
          model: "claude-opus-4-8",
          max_tokens: 64000,
          thinking: { type: "adaptive" },
          system: [{ type: "text", text: system, cache_control: { type: "ephemeral" } }],
          messages: [{ role: "user", content: `Brief:\n${brief.trim()}` }],
        });
        for await (const event of messageStream) {
          if (event.type === "content_block_delta" && event.delta.type === "text_delta") {
            controller.enqueue(encoder.encode(event.delta.text));
          }
        }
        await messageStream.finalMessage();
        controller.close();
      } catch (err) {
        controller.enqueue(
          encoder.encode(`\n<!-- GENERATION_ERROR: ${err instanceof Error ? err.message : "unknown"} -->`)
        );
        controller.close();
      }
    },
    cancel() {
      // client disconnected; the SDK stream is garbage-collected with the handler
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-cache",
      "X-Accel-Buffering": "no",
    },
  });
}
