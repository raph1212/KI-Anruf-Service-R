import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  const orders = await prisma.order.findMany({ orderBy: { createdAt: "desc" }, take: 200 });
  const calls = await prisma.call.findMany({ orderBy: { createdAt: "desc" }, take: 200 });
  return NextResponse.json({ orders, calls });
}
