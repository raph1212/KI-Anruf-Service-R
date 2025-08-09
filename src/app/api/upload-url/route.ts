import { NextRequest, NextResponse } from "next/server";
import { createUploadUrl } from "@/lib/s3";

export async function POST(req: NextRequest) {
  const { filename, type } = await req.json();
  const key = `uploads/${Date.now()}-${filename}`;
  const url = await createUploadUrl(key, type);
  return NextResponse.json({ url, key });
}
