import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { stripe } from "@/lib/stripe";

const PRICE_MAP: Record<string, { priceIdEnv: string, minutes: number }> = {
  "5m": { priceIdEnv: "STRIPE_PRICE_ID_5M", minutes: 5 },
  "10m": { priceIdEnv: "STRIPE_PRICE_ID_10M", minutes: 10 },
  "20m": { priceIdEnv: "STRIPE_PRICE_ID_20M", minutes: 20 },
};

export async function POST(req: NextRequest) {
  const { phoneE164, consent, audioKey, consentKey, tier } = await req.json();
  if (!consent) return NextResponse.json({ error: "Consent required" }, { status: 400 });
  if (!phoneE164) return NextResponse.json({ error: "Phone required" }, { status: 400 });
  if (!PRICE_MAP[tier]) return NextResponse.json({ error: "Invalid tier" }, { status: 400 });

  const priceId = process.env[PRICE_MAP[tier].priceIdEnv]!;
  if (!priceId) return NextResponse.json({ error: "Stripe price not configured" }, { status: 400 });

  const order = await prisma.order.create({
    data: {
      amount: 0,
      currency: "eur",
      status: "created",
      phoneE164,
      consent: true,
      audioUrl: audioKey ? `s3://${process.env.S3_BUCKET}/${audioKey}` : null,
      consentProofUrl: consentKey ? `s3://${process.env.S3_BUCKET}/${consentKey}` : null,
      stripeSession: "",
      ip: req.ip ?? req.headers.get("x-forwarded-for") ?? undefined,
      durationMin: PRICE_MAP[tier].minutes,
      priceTier: tier,
    },
  });

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${req.nextUrl.origin}/?success=1&order=${order.id}`,
    cancel_url: `${req.nextUrl.origin}/?canceled=1`,
    metadata: { orderId: order.id },
  });

  await prisma.order.update({ where: { id: order.id }, data: { stripeSession: session.id } });
  return NextResponse.json({ url: session.url });
}
