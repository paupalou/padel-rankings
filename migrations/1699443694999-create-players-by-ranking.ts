import db from "services/database.ts";

import type { Player, Ranking } from "types";

const atomic = db.atomic();
const split1Ranking = await db.get<Ranking>([
  "rankings",
  "01HDGT5C9X2VR900P36QEQW72Y",
]);

console.debug("# Migration start");

if (split1Ranking && split1Ranking.value) {
  console.debug("# Split1 Ranking found");

  const {
    players: _players,
    users: _users,
    admins: _admins,
    ...restRankingProps
  } = split1Ranking.value;

  for await (const res of db.list<Player>({ prefix: ["players"] })) {
    await atomic
      .delete(res.key)
      .set(split1Ranking.key, restRankingProps)
      .set(
        ["players", res.value.id],
        { id: res.value.id, createdAt: new Date() },
      )
      .set(
        ["players_by_ranking", "01HDGT5C9X2VR900P36QEQW72Y", res.value.id],
        res.value,
      )
      .commit();
  }

  console.debug(`# Inserted players into ranking Split1`);
  console.debug(`# Removed unused props from ranking`);
  console.debug(`# Deleted old collection 'player'`);

  console.debug(`# Migration finish`);
} else {
  console.debug("# Split1 Ranking not found");
}
