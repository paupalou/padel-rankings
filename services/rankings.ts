import { ulid } from "$ulid";

import type { Ranking } from "types";
import db from "services/database.ts";
import getEnv from "env";

export async function get(rankingId: string) {
  const rankingKey = ["rankings", rankingId];
  return (await db.get<Ranking>(rankingKey)).value;
}

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

export async function gerenateInviteLink(rankingId: string) {
  const inviteLinkId = ulid();
  const inviteLinkKey = ["invite_link_to_ranking", inviteLinkId, rankingId];

  await db.atomic().set(inviteLinkKey, null, { expireIn: 20000 }).commit();

  return `${getEnv("RANKING_ROOT_URL")}/invite/${inviteLinkId}`;
}
