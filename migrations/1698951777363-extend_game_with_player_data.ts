import db from "services/database.ts";
import { listById as listPlayers } from "services/players.ts";

import type { Game } from "types";

const atomic = db.atomic();
const players = await listPlayers();

for await (const res of db.list<Game>({ prefix: ["games"] })) {
  if (!res.value.ranking) {
    db.set(res.key, { ...res.value, ranking: "01HDGT5C9X2VR900P36QEQW72Y" });
  }
}

for await (const res of db.list<Game>({ prefix: ["games"] })) {
  const [player1Id, player2Id] = res.value.team1;
  const [player3Id, player4Id] = res.value.team2;

  const player1 = players[`${player1Id}`];
  const player2 = players[`${player2Id}`];
  const player3 = players[`${player3Id}`];
  const player4 = players[`${player4Id}`];

  const game = {
    ...res.value,
    team1: [player1, player2],
    team2: [player3, player4],
  };

  atomic
    .set(res.key, game)
    .set(["games_by_ranking", res.value.ranking, res.key[1]], res.value)
    .commit();
}

await atomic.commit();
