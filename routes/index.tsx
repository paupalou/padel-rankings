import { getSessionId } from "$kv_auth";
import { Handlers } from "$fresh/server.ts";

import getEnv from "env";
import Ranking from "components/ranking.tsx";
import db from "services/database.ts";
import { list as listGames } from "services/games.ts";
import { listByRankingId } from "services/players.ts";
import { getScoring, initPlayerPoints } from "services/scoring.ts";

import type { Data, GoogleUserInfo, PlayerPoints } from "types";

type UserProps = {
  user: {
    isLogged: boolean;
    isAdmin: boolean;
    email?: string;
  };
};

type RankingProps = {
  ranking?: PlayerPoints[];
};

export const handler: Handlers = {
  async GET(req, ctx) {
    const sessionId = await getSessionId(req);
    const props: RankingProps & UserProps = {
      user: {
        isLogged: !!sessionId,
        isAdmin: false,
      },
    };
    const defaultRanking = getEnv("DEFAULT_RANKING_IN_HOME");

    if (defaultRanking) {
      const players = await listByRankingId(defaultRanking);
      const games = await listGames();
      const playerPoints = initPlayerPoints(players);

      props.ranking = getScoring(games, playerPoints);
    }

    if (sessionId) {
      const userSession = await db.get<GoogleUserInfo>([
        "user_session",
        sessionId,
      ]);
      props.user.isAdmin = Boolean(userSession.value?.admin);
      props.user.email = userSession.value?.email!;
    }

    return ctx.render(props);
  },
};

export default function Home(
  { data: { ranking } }: Data<RankingProps & UserProps>,
) {
  if (ranking) {
    return <Ranking ranking={ranking} />;
  }

  return null;
}
