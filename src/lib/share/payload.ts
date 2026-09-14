import { decryptUtf8, encryptUtf8 } from "@/lib/crypto/aes";
import { toBase64url } from "@/lib/crypto/bytes";
import type { EncryptedShare, ShareSnapshot } from "./types";

export async function hashToken(token: string): Promise<string> {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(token));
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function newShareSecrets(): Promise<{
  contentKey: CryptoKey;
  contentKeyParam: string;
  revokeToken: string;
}> {
  const contentKey = await crypto.subtle.generateKey(
    { name: "AES-GCM", length: 256 },
    true,
    ["encrypt", "decrypt"],
  );
  const raw = new Uint8Array(await crypto.subtle.exportKey("raw", contentKey));
  const revokeToken = toBase64url(crypto.getRandomValues(new Uint8Array(32)));
  return { contentKey, contentKeyParam: toBase64url(raw), revokeToken };
}

export async function importContentKey(param: string): Promise<CryptoKey> {
  const { fromBase64url } = await import("@/lib/crypto/bytes");
  return crypto.subtle.importKey(
    "raw",
    fromBase64url(param) as BufferSource,
    { name: "AES-GCM" },
    false,
    ["encrypt", "decrypt"],
  );
}

export async function encryptSnapshot(
  snapshot: ShareSnapshot,
  contentKey: CryptoKey,
  opts?: { forbiddenJournalBody?: string },
): Promise<EncryptedShare> {
  const json = JSON.stringify(snapshot);
  if (opts?.forbiddenJournalBody && json.includes(opts.forbiddenJournalBody)) {
    throw new Error("分享不能包含日记正文");
  }
  return encryptUtf8(json, contentKey);
}

export async function decryptSnapshot(
  enc: EncryptedShare,
  contentKey: CryptoKey,
): Promise<ShareSnapshot> {
  return JSON.parse(await decryptUtf8(enc, contentKey)) as ShareSnapshot;
}

export function buildShareUrl(origin: string, id: string, contentKeyParam: string): string {
  return `${origin}/s/${id}#k=${contentKeyParam}`;
}
