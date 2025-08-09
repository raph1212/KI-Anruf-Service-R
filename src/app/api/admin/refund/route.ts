import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { stripe } from "@/lib/stripe";

export async function POST(req: NextRequest) {
  const { orderId } = await req.json();
  const order = await prisma.order.findUnique({ where: { id: orderId } });
  if (!order) return NextResponse.json({ error: "not found" }, { status: 404 });

  const session = await stripe.checkout.sessions.retrieve(order.stripeSession);
  if (!session.payment_intent) return NextResponse.json({ error: "no payment" }, { status: 400 });

  const refund = await stripe.refunds.create({ payment_intent: String(session.payment_intent) });
  await prisma.order.update({ where: { id: order.id }, data: { status: "refunded" } });
  return NextResponse.json({ ok: true, refundId: refund.id });
}
