import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/db";
import { twilioClient } from "@/lib/twilio";

export async function POST(req: NextRequest) {
  const sig = req.headers.get("stripe-signature");
  const body = await req.text();
  let event;
  try {
    event = stripe.webhooks.constructEvent(body, sig!, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err: any) {
    return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as any;
    const orderId = session.metadata?.orderId as string;
    const order = await prisma.order.findUnique({ where: { id: orderId } });
    if (!order) return NextResponse.json({ ok: true });

    // Blocklist check
    const bl = await prisma.blocklist.findUnique({ where: { phoneE164: order.phoneE164 } });
    if (bl) {
      await prisma.order.update({ where: { id: order.id }, data: { status: "failed" } });
      return NextResponse.json({ blocked: true });
    }

    const start = new Date();
    const end = new Date(start.getTime() + order.durationMin * 60 * 1000);
    const callRec = await prisma.call.create({ data: { orderId: order.id, startAt: start, endAt: end, to: order.phoneE164, status: "initiated" } });

    const call = await twilioClient.calls.create({
      to: order.phoneE164,
      from: process.env.TWILIO_FROM_NUMBER!,
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/twiml?order=${order.id}`,
      statusCallback: `${process.env.NEXT_PUBLIC_BASE_URL}/api/twilio/callback`,
      statusCallbackEvent: ["initiated", "ringing", "answered", "completed"],
      statusCallbackMethod: "POST",
    });

    await prisma.call.update({ where: { id: callRec.id }, data: { sid: call.sid, status: "in-progress" } });
    await prisma.order.update({ where: { id: order.id }, data: { status: "paid" } });
  }

  return NextResponse.json({ received: true });
}
