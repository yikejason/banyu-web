import { NextResponse } from "next/server";
import { putShare } from "@/lib/share/store";
import type { ShareCreateRequest } from "@/lib/share/types";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const body = (await req.json()) as ShareCreateRequest;
  if (!body.iv || !body.ciphertext || !body.expiresAt || !body.revokeTokenHash) {
    return NextResponse.json({ error: "invalid" }, { status: 400 });
  }
  const id = crypto.randomUUID();
  putShare(id, {
    iv: body.iv,
    ciphertext: body.ciphertext,
    expiresAt: body.expiresAt,
    revokeTokenHash: body.revokeTokenHash,
    viewCodeHash: body.viewCodeHash,
  });
  return NextResponse.json({ id }, { status: 201 });
}
