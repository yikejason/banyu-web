import { decryptUtf8, encryptUtf8 } from "@/lib/crypto/aes";
import { fromBase64url, toBase64url } from "@/lib/crypto/bytes";
import { deriveKey } from "@/lib/crypto/key";
import {
  deleteDb,
  openDb,
  type EncryptedRecord,
  type RecordKind,
} from "@/lib/storage/db";
import { getVaultKey, isUnlocked, setVaultKey } from "@/lib/storage/session";

const VERIFIER = "banyu-vault-ok";

export async function isVaultInitialized(): Promise<boolean> {
  if (typeof indexedDB === "undefined") return false;
  const db = await openDb();
  try {
    return Boolean(await db.get("meta", "vault"));
  } finally {
    db.close();
  }
}

export async function createVault(passphrase: string, iterations = 310_000): Promise<void> {
  const salt = crypto.getRandomValues(new Uint8Array(32));
  const key = await deriveKey(passphrase, salt, iterations);
  const verifier = await encryptUtf8(VERIFIER, key);
  const db = await openDb();
  try {
    await db.put("meta", { salt: toBase64url(salt), verifier }, "vault");
  } finally {
    db.close();
  }
  setVaultKey(key);
}

export async function unlockVault(passphrase: string, iterations = 310_000): Promise<void> {
  const db = await openDb();
  try {
    const meta = await db.get("meta", "vault");
    if (!meta) throw new Error("尚未设置口令");
    const key = await deriveKey(passphrase, fromBase64url(meta.salt), iterations);
    try {
      const ok = await decryptUtf8(meta.verifier, key);
      if (ok !== VERIFIER) throw new Error("口令不正确");
    } catch {
      throw new Error("口令不正确");
    }
    setVaultKey(key);
  } finally {
    db.close();
  }
}

const DEVICE_KEY_ITERS = 10_000;

export async function ensureDeviceVault(): Promise<void> {
  if (isUnlocked()) return;
  const secret = getOrCreateDeviceSecret();
  if (!(await isVaultInitialized())) {
    await createVault(secret, DEVICE_KEY_ITERS);
    return;
  }
  try {
    await unlockVault(secret, DEVICE_KEY_ITERS);
  } catch {
    const db = await openDb();
    db.close();
    await deleteDb();
    await createVault(secret, DEVICE_KEY_ITERS);
  }
}

const DEVICE_SECRET_KEY = "banyu-device-secret";

function getOrCreateDeviceSecret(): string {
  if (typeof localStorage === "undefined") return "banyu-device-dev-secret";
  const existing = localStorage.getItem(DEVICE_SECRET_KEY);
  if (existing && existing.length >= 24) return existing;
  const secret = toBase64url(crypto.getRandomValues(new Uint8Array(32)));
  localStorage.setItem(DEVICE_SECRET_KEY, secret);
  return secret;
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
