import { load } from "$std/dotenv/mod.ts";
import { DatabaseMigration } from "types";

const env = await load();
const DB_URL = Deno.env.has("DB_URL") ? Deno.env.get("DB_URL") : env["DB_URL"];

const db = await Deno.openKv(DB_URL);

const migrationVersionKey = ["db_last_migration"];

export async function getMigrateVersion() {
  const migrateVersionRes =
    (await db.get<DatabaseMigration>(migrationVersionKey)).value;
  if (!migrateVersionRes) return false;
  return migrateVersionRes;
}

export async function setMigrateVersion(fileName: string) {
  const migrateVersionRes = await getMigrateVersion();

  if (migrateVersionRes) await db.delete(migrationVersionKey);

  const res = await db.set(migrationVersionKey, {
    createdAt: new Date(),
    fileName,
  });

  if (!res.ok) throw new Error("Something went wrong.");

  return `Migrated db to file ${fileName}`;
}

export default db;
