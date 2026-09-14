import { decryptUtf8, encryptUtf8 } from "@/lib/crypto/aes";
import { fromBase64url, toBase64url } from "@/lib/crypto/bytes";
import { deriveKey } from "@/lib/crypto/key";
import {
  openDb,
  type EncryptedRecord,
  type RecordKind,
} from "@/lib/storage/db";
import { getVaultKey, setVaultKey } from "@/lib/storage/session";

const VERIFIER = "banyu-vault-ok";

export async function isVaultInitialized(): Promise<boolean> {
  if (typeof indexedDB === "undefined") return false;
  const db = await openDb();
  return Boolean(await db.get("meta", "vault"));
}

export async function createVault(passphrase: string): Promise<void> {
  const salt = crypto.getRandomValues(new Uint8Array(32));
  const key = await deriveKey(passphrase, salt);
  const verifier = await encryptUtf8(VERIFIER, key);
  const db = await openDb();
  await db.put("meta", { salt: toBase64url(salt), verifier }, "vault");
  setVaultKey(key);
}

export async function unlockVault(passphrase: string): Promise<void> {
  const db = await openDb();
  const meta = await db.get("meta", "vault");
  if (!meta) throw new Error("尚未设置口令");
  const key = await deriveKey(passphrase, fromBase64url(meta.salt));
  try {
    const ok = await decryptUtf8(meta.verifier, key);
    if (ok !== VERIFIER) throw new Error("口令不正确");
  } catch {
    throw new Error("口令不正确");
  }
  setVaultKey(key);
}

export function lockVault() {
  setVaultKey(null);
}

export async function putRecord(
  kind: RecordKind,
  id: string,
  value: unknown,
): Promise<void> {
  const key = getVaultKey();
  const payload = await encryptUtf8(JSON.stringify(value), key);
  const row: EncryptedRecord = {
    id,
    kind,
    iv: payload.iv,
    ciphertext: payload.ciphertext,
    updatedAt: new Date().toISOString(),
  };
  const db = await openDb();
  await db.put("records", row);
}

export async function getRecord<T>(kind: RecordKind, id: string): Promise<T | null> {
  const key = getVaultKey();
  const db = await openDb();
  const row = await db.get("records", id);
  if (!row || row.kind !== kind) return null;
  return JSON.parse(await decryptUtf8(row, key)) as T;
}

export async function listRecords<T>(kind: RecordKind): Promise<T[]> {
  const key = getVaultKey();
  const db = await openDb();
  const rows = await db.getAllFromIndex("records", "byKind", kind);
  const out: T[] = [];
  for (const row of rows) {
    out.push(JSON.parse(await decryptUtf8(row, key)) as T);
  }
  return out;
}

export async function deleteRecord(kind: RecordKind, id: string): Promise<void> {
  getVaultKey();
  const db = await openDb();
  const row = await db.get("records", id);
  if (!row || row.kind !== kind) return;
  await db.delete("records", id);
}

export async function getRawRecord(id: string): Promise<EncryptedRecord | undefined> {
  const db = await openDb();
  return db.get("records", id);
}
