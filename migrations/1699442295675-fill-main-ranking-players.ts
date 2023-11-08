import db from "services/database.ts";

import type { Player, Ranking } from "types";

const split1Ranking = await db.get<Ranking>([
  "rankings",
  "01HDHWWW0748HF3WB2182W4KF1",
]);

console.debug("# Migration start");

if (split1Ranking) {
  console.debug("# Split1 Ranking found");

  const rankingPlayers = [];
  for await (const res of db.list<Player>({ prefix: ["player"] })) {
    rankingPlayers.push(res.value.id);
  }

  console.debug(`# Inserting ${rankingPlayers.length} players into Split1`);
  await db.set(split1Ranking.key, {
    ...split1Ranking.value,
    players: rankingPlayers,
  });

  console.debug(`# Migration finish`);
} else {
  console.debug("# Split1 Ranking not found");
}
