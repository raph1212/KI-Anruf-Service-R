import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { twilioClient } from "@/lib/twilio";

export async function POST(req: NextRequest) {
  const { callId } = await req.json();
  const call = await prisma.call.findUnique({ where: { id: callId } });
  if (!call || !call.sid) return NextResponse.json({ error: "not found" }, { status: 404 });
  await twilioClient.calls(call.sid).update({ status: "completed" });
  await prisma.call.update({ where: { id: call.id }, data: { status: "completed" } });
  return NextResponse.json({ ok: true });
}
