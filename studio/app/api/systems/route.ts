import { NextResponse } from "next/server";
import { listSystems } from "@/lib/systems";

export function GET() {
  try {
    return NextResponse.json(listSystems());
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "failed to list design systems" },
      { status: 500 }
    );
  }
}
