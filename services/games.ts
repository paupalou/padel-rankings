import { z } from "$zod";
import { ulid } from "$ulid";

import { Game } from "types";
import db from "services/database.ts";
import { JSONResponse } from "services/utils.ts";

const TeamValidation = z.array(z.string());

export const GameValidation = z.object({
  team1: TeamValidation,
  team2: TeamValidation,
});

export async function wipeAll() {
  const gameKeys = [];
  for await (const res of db.list({ prefix: ["game"] })) {
    gameKeys.push(res.key);
  }

  for await (const gameKey of gameKeys) {
    const gameRes = await db.get(gameKey);
    const ok = await db.atomic().check(gameRes).delete(gameKey).commit();
    if (!ok) throw new Error("Something went wrong");
  }

  return "all games deleted";
}

export async function list() {
  const games = [];
  for await (const res of db.list<Game>({ prefix: ["game"] })) {
    games.push(res.value);
  }

  return games;
}

export async function create(game: Game) {
  // game.createdAt = new Date();
  const gameId = game.id ?? ulid();
  const gameKey = ["game", gameId];

  console.debug("create game pre");

  try {
    GameValidation.parse(game);
  } catch (e) {
    console.debug(e);
    return new Response(
      `Game payload is not correct. \n\nError: ${JSON.stringify(e, null, 2)}`,
      { status: 400 },
    );
  }

  console.debug("create game post");

  const ok = await db.atomic().set(gameKey, game).commit();
  if (!ok) throw new Error("Something went wrong.");
  return new Response(gameId);
}

export async function remove(gameId: string) {
  const gameKey = ["game", gameId];
  const gameRes = await db.get(gameKey);

  if (!gameRes.value) return new Response(`no game with id ${gameId} found`);

  const ok = await db.atomic().check(gameRes).delete(gameKey).commit();
  if (!ok) throw new Error("Something went wrong");

  return new Response(`game ${gameId} deleted`);
}

export async function get(gameId: string) {
  const gameKey = ["game", gameId];
  const gameRes = (await db.get<Game>(gameKey)).value;

  if (!gameRes) return new Response(`no game with id ${gameId} found`);

  return JSONResponse(gameRes);
}
