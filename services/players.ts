import { ulid } from "$ulid";

import type { Player } from "types";
import db from "services/database.ts";

export async function create(player: Player) {
  const playerId = player.id ?? ulid();
  const playerKey = ["players", playerId];

  await db.atomic().set(playerKey, player).commit();
  return new Response(playerId);
}

export async function get(playerId: string) {
  const playerKey = ["players", playerId];
  const playerRes = await db.get(playerKey);

  const ok = db.atomic().check(playerRes);
  if (!ok) throw new Error("Something went wrong");

  return new Response(JSON.stringify(playerRes.value));
}

export async function list() {
  const players = [];
  for await (const res of db.list<Player>({ prefix: ["players"] })) {
    players.push(res.value);
  }

  return players;
}

export async function listById() {
  const players: Record<string, Player> = {};
  for await (const res of db.list<Player>({ prefix: ["players"] })) {
    players[res.value.id] = res.value;
  }

  return players;
}

export async function listByRanking(rankingId: string) {
  const players: Record<string, Player> = {};
  for await (
    const res of db.list<Player>({ prefix: ["players_by_ranking", rankingId] })
  ) {
    players[res.value.id] = res.value;
  }

  return players;
}

export async function wipeAll() {
  const playerKeys = [];
  for await (const res of db.list({ prefix: ["players"] })) {
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
  const playerKey = ["players", playerId];
  const playerRes = await db.get(playerKey);

  if (!playerRes.value) {
    return new Response(`no player with id ${playerId} found`);
  }

  const ok = await db.atomic().check(playerRes).delete(playerKey).commit();
  if (!ok) throw new Error("Something went wrong");

  return new Response(`player ${playerId} deleted`);
}
