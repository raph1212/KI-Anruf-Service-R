import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(req: NextRequest) {
  const form = await req.formData();
  const callSid = String(form.get("CallSid") || "");
  const callStatus = String(form.get("CallStatus") || "");
  await prisma.call.updateMany({ where: { sid: callSid }, data: { status: callStatus } });
  return NextResponse.json({ ok: true });
}
