import { load } from "https://deno.land/std@0.203.0/dotenv/mod.ts";

const env = await load();
const DB_URL = Deno.env.has("DB_URL") ? Deno.env.get("DB_URL") : env["DB_URL"];

export default await Deno.openKv(DB_URL);
