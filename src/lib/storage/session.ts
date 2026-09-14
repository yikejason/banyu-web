let vaultKey: CryptoKey | null = null;

export function setVaultKey(key: CryptoKey | null) {
  vaultKey = key;
}

export function getVaultKey(): CryptoKey {
  if (!vaultKey) throw new Error("金库未解锁");
  return vaultKey;
}

export function isUnlocked(): boolean {
  return vaultKey !== null;
}
