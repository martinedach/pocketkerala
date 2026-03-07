import { NextRequest, NextResponse } from "next/server";

const RAZORPAY_BASE = "https://api.razorpay.com/v1";

function getAuthHeader(): string | null {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keyId || !keySecret) return null;
  const encoded = Buffer.from(`${keyId}:${keySecret}`).toString("base64");
  return `Basic ${encoded}`;
}

export async function GET(request: NextRequest) {
  const auth = getAuthHeader();
  if (!auth) {
    return NextResponse.json(
      { error: "Razorpay is not configured. Set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in .env" },
      { status: 503 },
    );
  }

  const { searchParams } = new URL(request.url);
  const count = Math.min(parseInt(searchParams.get("count") ?? "25", 10), 100);
  const skip = parseInt(searchParams.get("skip") ?? "0", 10);
  const from = searchParams.get("from");
  const to = searchParams.get("to");

  let url = `${RAZORPAY_BASE}/payments?count=${count}&skip=${skip}`;
  if (from) url += `&from=${from}`;
  if (to) url += `&to=${to}`;

  try {
    const res = await fetch(url, {
      headers: { Authorization: auth },
    });
    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json(
        { error: data.error?.description ?? data.error?.reason ?? "Failed to fetch payments" },
        { status: res.status },
      );
    }

    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Request failed" },
      { status: 500 },
    );
  }
}
