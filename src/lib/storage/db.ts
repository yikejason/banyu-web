import { openDB, type DBSchema, type IDBPDatabase } from "idb";

export type RecordKind = "emotion" | "journal" | "temperament";

export type EncryptedRecord = {
  id: string;
  kind: RecordKind;
  iv: string;
  ciphertext: string;
  updatedAt: string;
};

export type VaultMeta = {
  salt: string;
  verifier: { iv: string; ciphertext: string };
};

interface BanyuDB extends DBSchema {
  meta: { key: string; value: VaultMeta };
  records: {
    key: string;
    value: EncryptedRecord;
    indexes: { byKind: string };
  };
}

const DB_NAME = "banyu";

export function openDb(): Promise<IDBPDatabase<BanyuDB>> {
  return openDB<BanyuDB>(DB_NAME, 1, {
    upgrade(db) {
      db.createObjectStore("meta");
      const records = db.createObjectStore("records", { keyPath: "id" });
      records.createIndex("byKind", "kind");
    },
  });
}

export async function deleteDb() {
  const { deleteDB } = await import("idb");
  await deleteDB(DB_NAME);
}
