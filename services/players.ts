import { ulid } from "https://deno.land/x/ulid@v0.3.0/mod.ts";

import type { Player } from "../types.ts";
import db from "./database.ts";

export async function create(player: Player) {
  const playerId = player.id ?? ulid();
  const playerKey = ["player", playerId];

  await db.atomic().set(playerKey, player).commit();
  return new Response(playerId);
}

export async function get(playerId: string) {
  const playerKey = ["player", playerId];
  const playerRes = await db.get(playerKey);

  const ok = db.atomic().check(playerRes);
  if (!ok) throw new Error("Something went wrong");

  return new Response(JSON.stringify(playerRes.value));
}

export async function list() {
  const players = [];
  for await (const res of db.list({ prefix: ["player"] })) {
    players.push(res.value);
  }

  return new Response(JSON.stringify(players));
}

export async function wipeAll() {
  const playerKeys = [];
  for await (const res of db.list({ prefix: ["player"] })) {
    playerKeys.push(res.key);
  }

  for await (const playerKey of playerKeys) {
    const playerRes = await db.get(playerKey);
    const ok = await db.atomic().check(playerRes).delete(playerKey).commit();
    if (!ok) throw new Error("Something went wrong");
  }

  return new Response("all players deleted");
}

export async function remove(playerId: string) {
  const playerKey = ["player", playerId];
  const playerRes = await db.get(playerKey);

  if (!playerRes.value) {
    return new Response(`no player with id ${playerId} found`);
  }

  const ok = await db.atomic().check(playerRes).delete(playerKey).commit();
  if (!ok) throw new Error("Something went wrong");

  return new Response(`player ${playerId} deleted`);
}
