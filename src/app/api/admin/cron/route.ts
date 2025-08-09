import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { twilioClient } from "@/lib/twilio";

export async function GET() {
  const now = new Date();
  const overdue = await prisma.call.findMany({
    where: { status: { in: ["in-progress", "initiated"] }, endAt: { lte: now } },
  });
  for (const c of overdue) {
    if (c.sid) {
      try { await twilioClient.calls(c.sid).update({ status: "completed" }); } catch {}
    }
    await prisma.call.update({ where: { id: c.id }, data: { status: "completed" } });
  }
  return NextResponse.json({ ended: overdue.length });
}
