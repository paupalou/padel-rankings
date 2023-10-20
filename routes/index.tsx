import { getRanking, initPlayerPoints } from "services/scoring.ts";
import { getSessionId } from "$kv_auth";
import { Handlers } from "$fresh/server.ts";
import Button from "components/button.tsx";
import { list as listPlayers } from "services/players.ts";
import { list as listGames } from "services/games.ts";
import db from "services/database.ts";
import { Data, Game, GoogleUserInfo, Player } from "types";

type UserProps = {
  user: {
    isLogged: boolean;
    isAdmin: boolean;
    email?: string;
  };
};

type RankingProps = {
  players: Player[];
  games: Game[];
};

export const handler: Handlers = {
  async GET(req, ctx) {
    const sessionId = getSessionId(req);
    const players = await listPlayers();
    const games = await listGames();

    const props: RankingProps & UserProps = {
      user: {
        isLogged: !!sessionId,
        isAdmin: false,
      },
      players,
      games,
    };

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
    <div className="flex py-2 justify-between">
      <span className="flex text-sm gap-1">
        Hello
        {user.isLogged && <span className="text-slate-600">{user.email}</span>}
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
  const { user, players, games } = props.data;
  const playerPoints = initPlayerPoints(players);
  const ranking = getRanking(games, playerPoints);

  return (
    <main className="p-1 xl:max-w-xl">
      <User user={user} />
      <ul className="border border-slate-300">
        <li className="flex gap-2 px-2 py-1 items-center text-xs bg-green-200 border-b text-slate-600 border-slate-900">
          <span className="w-4 leading-6"></span>
          <span className="w-28">player</span>
          <span className="w-12 text-right">games</span>
          <span className="w-12 text-right">wins</span>
          <span className="w-12 text-right">loses</span>
          <span className="w-12 text-right">points</span>
          <span className="w-12 text-right">average</span>
          <span className="w-12 text-right">score</span>
          <span className="w-16 text-right">win ratio</span>
        </li>
        {ranking.map((player, index) => (
          <li
            className="flex gap-2 px-2 py-0.5 items-center"
            key={`player-${player.id}`}
          >
            <span className="w-4 text-xs leading-6">{index + 1}</span>
            <span className="w-28">{player.name}</span>
            <span className="w-12 text-right">{player.games}</span>
            <span className="w-12 text-right">{player.wins}</span>
            <span className="w-12 text-right">{player.loses}</span>
            <span className="w-12 text-right">{player.points}</span>
            <span className="w-12 text-right">
              {player.average}
            </span>
            <span className="w-12 text-right font-semibold">
              {player.score}
            </span>
            <span className="w-16 text-right text-xs">
              {player.winratio}%
            </span>
          </li>
        ))}
      </ul>
    </main>
  );
}
