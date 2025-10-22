import { NextResponse } from "next/server";

// Skill badges endpoint removed. Return 410 Gone for any requests to make
// callers aware that the resource is no longer available.

export async function GET() {
  return NextResponse.json({ error: "Skill badges removed" }, { status: 410 });
}

export async function POST() {
  return NextResponse.json(
    { error: "Skill badges endpoint has been removed" },
    { status: 410 }
  );
}
