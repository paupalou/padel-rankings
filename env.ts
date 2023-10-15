import { load } from "$std/dotenv/mod.ts";

const env = await load();

export default function getEnv(name: string) {
  return Deno.env.has(name) ? Deno.env.get(name) : env[name];
}
