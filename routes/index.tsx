import { getRanking, initPlayerPoints } from "services/scoring.ts";
import { getSessionId } from "$kv_auth";
import { Handlers } from "$fresh/server.ts";
import Button from "components/button.tsx";
import { list as listPlayers } from "services/players.ts";
import { list as listGames } from "services/games.ts";
import db from "services/database.ts";
import { Data, GoogleUserInfo, PlayerPoints } from "types";
import Ranking from "components/ranking.tsx";
import getEnv from "env";

type UserProps = {
  user: {
    isLogged: boolean;
    isAdmin: boolean;
    email?: string;
  };
};

type RankingProps = {
  ranking?: PlayerPoints[]
};

export const handler: Handlers = {
  async GET(req, ctx) {
    const sessionId = getSessionId(req);
    const props: RankingProps & UserProps = {
      user: {
        isLogged: !!sessionId,
        isAdmin: false,
      },
    };
    const defaultRanking =getEnv("DEFAULT_RANKING_IN_HOME")

    if (defaultRanking) {
      const players = await listPlayers();
      const games = await listGames();
      const playerPoints = initPlayerPoints(players);

      props.ranking = getRanking(games, playerPoints);
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

function User({ user }: UserProps) {
  return (
    <div className="flex py-2 justify-between items-center">
      <span className="flex text-sm gap-1">
        {user.isLogged && <>Hello <span className="text-slate-400">{user.email}</span></>}
      </span>
      <div name="user-actions" className="flex gap-1">
        {user.isAdmin &&
          (
            <Button>
              <a href="/admin">Admin</a>
            </Button>
          )}
        <Button>
          {user.isLogged
            ? <a href="/oauth/signout">Logout</a>
            : <a href="/oauth/signin">Login</a>}
        </Button>
      </div>
    </div>
  );
}

export default function Home(props: Data<RankingProps & UserProps>) {
  const { user, ranking } = props.data;

  return (
    <main class="p-1 xl:max-w-xl font-varela h-screen relative">
      <User user={user} />
      {ranking && <Ranking ranking={ranking} />}
      <div class="absolute bg-[#e5f2e8] bg-main bg-no-repeat bg-center bg-contain h-full w-full top-0 left-0 opacity-30 z-[-1]" />
    </main>
  );
}
