import { NextResponse } from "next/server";
import { hashToken } from "@/lib/share/payload";
import { getShare, isReadable, markRevoked } from "@/lib/share/store";

export const dynamic = "force-dynamic";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const row = getShare(id);
  if (!isReadable(row)) return NextResponse.json({ error: "gone" }, { status: 404 });
  return NextResponse.json({ iv: row.iv, ciphertext: row.ciphertext, expiresAt: row.expiresAt });
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const token = req.headers.get("x-revoke-token") ?? "";
  const row = getShare(id);
  if (!row) return NextResponse.json({ error: "gone" }, { status: 404 });
  const hash = await hashToken(token);
  if (hash !== row.revokeTokenHash) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }
  markRevoked(id);
  return new NextResponse(null, { status: 204 });
}
