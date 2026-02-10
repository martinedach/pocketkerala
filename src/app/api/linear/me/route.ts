import { LinearClient } from "@linear/sdk";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET() {
  const apiKey = process.env.LINEAR_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "Missing LINEAR_API_KEY" },
      { status: 500 },
    );
  }

  const linear = new LinearClient({ apiKey });
  const viewer = await linear.viewer;

  return NextResponse.json({
    id: viewer.id,
    name: viewer.name,
    email: viewer.email,
  });
}

