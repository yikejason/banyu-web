export type ShareRecord = {
  iv: string;
  ciphertext: string;
  expiresAt: string;
  revokeTokenHash: string;
  viewCodeHash?: string;
  revoked?: boolean;
};

const g = globalThis as unknown as { __banyuShares?: Map<string, ShareRecord> };
if (!g.__banyuShares) g.__banyuShares = new Map();
const shares = g.__banyuShares;

export function putShare(id: string, record: ShareRecord) {
  shares.set(id, record);
}

export function getShare(id: string): ShareRecord | undefined {
  return shares.get(id);
}

export function markRevoked(id: string): boolean {
  const row = shares.get(id);
  if (!row) return false;
  row.revoked = true;
  shares.set(id, row);
  return true;
}

export function isReadable(row: ShareRecord | undefined): row is ShareRecord {
  if (!row || row.revoked) return false;
  return Date.parse(row.expiresAt) > Date.now();
}
