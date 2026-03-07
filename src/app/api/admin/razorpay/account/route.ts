import { NextResponse } from "next/server";

const RAZORPAY_BASE = "https://api.razorpay.com/v1";

function getAuthHeader(): string | null {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keyId || !keySecret) return null;
  const encoded = Buffer.from(`${keyId}:${keySecret}`).toString("base64");
  return `Basic ${encoded}`;
}

export async function GET() {
  const auth = getAuthHeader();
  if (!auth) {
    return NextResponse.json(
      { error: "Razorpay is not configured" },
      { status: 503 },
    );
  }

  try {
    const res = await fetch(`${RAZORPAY_BASE}/payments?count=1`, {
      headers: { Authorization: auth },
    });

    if (!res.ok) {
      const data = await res.json();
      return NextResponse.json(
        { error: data.error?.description ?? data.error?.reason ?? "Invalid credentials" },
        { status: res.status },
      );
    }

    return NextResponse.json({ connected: true });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Request failed" },
      { status: 500 },
    );
  }
}
