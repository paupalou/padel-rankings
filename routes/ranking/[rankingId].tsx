import { Handlers } from "$fresh/server.ts";
import { getSessionId } from "$kv_auth";

import { Data, Game, GoogleUserInfo, Player, PlayerPoints } from "types";
import { list as listPlayers } from "services/players.ts";
import { list as listGames } from "services/games.ts";
import db from "services/database.ts";
import Ranking from "components/ranking.tsx";
import { getScoring, initPlayerPoints } from "services/scoring.ts";

type RankingProps = {
  ranking: PlayerPoints[];
};

type UserProps = {
  user: {
    isLogged: boolean;
    isAdmin: boolean;
    email?: string;
  };
};

export const handler: Handlers = {
  async GET(req, ctx) {
    const sessionId = await getSessionId(req);
    const players = await listPlayers();
    const games = await listGames();

    const props: RankingProps = {
      ranking: [],
    };

    if (sessionId) {
      // const userSession = await db.get<GoogleUserInfo>([
      //   "user_session",
      //   sessionId,
      // ]);
      // props.user.isAdmin = Boolean(userSession.value?.admin);
      // props.user.email = userSession.value?.email!;
      props.ranking = getScoring(games, initPlayerPoints(players));
    }

    return ctx.render(props);
  },
};

export default function RankingBoard(props: Data<RankingProps>) {
  return <Ranking ranking={props.data.ranking} />;
}
