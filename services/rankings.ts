import { ulid } from "$ulid";

import type { Ranking } from "types";
import db from "services/database.ts";

export async function create(ranking: Ranking) {
  const rankingId = ranking.id?.length > 0 ? ranking.id : ulid();
  const rankingKey = ["rankings", rankingId];

  await db.atomic().set(rankingKey, { ...ranking, id: rankingId }).commit();

  return "ranking created";
}

export async function list() {
  const rankings = [];
  for await (const res of db.list<Ranking>({ prefix: ["rankings"] })) {
    rankings.push(res.value);
  }

  return rankings;
}
