import { ulid } from "$ulid";

import type { Game, Ranking } from "types";
import db from "services/database.ts";
import getEnv from "env";
import { getUser } from "services/auth.ts";

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

export async function listGames(rankingId: string) {
  const games = [];
  for await (
    const res of db.list<Game>({ prefix: ["games_by_ranking", rankingId] })
  ) {
    games.push(res.value);
  }

  return games;
}

export async function generateInviteLink(rankingId: string) {
  const inviteLinkId = ulid();
  const inviteLinkKey = ["invite_link_to_ranking", inviteLinkId, rankingId];

  await db.atomic().set(inviteLinkKey, null, { expireIn: 86400000 }).commit();

  return `${getEnv("RANKING_ROOT_URL")}/invite/${inviteLinkId}`;
}

export async function consumeInviteLink(inviteLinkId: string, email: string) {
  const inviteLinkKey = ["invite_link_to_ranking", inviteLinkId];
  const p = db.list({ prefix: ["invite_link_to_ranking", inviteLinkId] });
  const inviteLink = await p.next();

  if (inviteLink.value) {
    const [, , rankingId] = inviteLink.value?.key;
    const ranking = await get(rankingId as string);
    const user = await getUser(email);

    await db.atomic()
      .set(["rankings", rankingId], {
        ...ranking,
        users: [...(ranking?.users ?? []), user],
      })
      .delete([...inviteLinkKey, rankingId])
      .commit();
    return true;
  }

  return false;
}
