import { fromBase64url, toBase64url } from "./bytes";

export async function encryptUtf8(
  plain: string,
  key: CryptoKey,
): Promise<{ iv: string; ciphertext: string }> {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const cipher = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    key,
    new TextEncoder().encode(plain),
  );
  return { iv: toBase64url(iv), ciphertext: toBase64url(new Uint8Array(cipher)) };
}

export async function decryptUtf8(
  payload: { iv: string; ciphertext: string },
  key: CryptoKey,
): Promise<string> {
  const plain = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv: fromBase64url(payload.iv) as BufferSource },
    key,
    fromBase64url(payload.ciphertext) as BufferSource,
  );
  return new TextDecoder().decode(plain);
}
