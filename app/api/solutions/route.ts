import { NextResponse } from "next/server";

// Solutions endpoint removed. Return 410 Gone for any requests to make
// callers aware that the resource is no longer available.

export async function GET() {
  return NextResponse.json({ error: "Solutions removed" }, { status: 410 });
}

export async function POST() {
  return NextResponse.json(
    { error: "Solutions endpoint has been removed" },
    { status: 410 }
  );
}
