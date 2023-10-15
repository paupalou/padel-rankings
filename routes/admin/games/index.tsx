import { Handlers } from "$fresh/server.ts";
import { list as listGames } from "services/games.ts";
import { listById as listPlayersById } from "services/players.ts";
import { Data, Game, Player } from "types";

export const handler: Handlers = {
  async GET(req, ctx) {
    const games = await listGames();
    const playersById = await listPlayersById();

    return ctx.render({
      games: games.sort((a, b) => {
        const gameATime = new Date(a.playedAt).getTime();
        const gameBTime = new Date(b.playedAt).getTime();

        if (gameATime > gameBTime) {
          return -1;
        } else if (gameBTime > gameATime) {
          return 1;
        }

        return 0;
      }),
      players: playersById,
    });
  },
};

export default function Games(
  { data: { games, players } }: Data<
    { games: Game[]; players: Record<string, Player> }
  >,
) {
  return (
    <main className="p-1 xl:max-w-xl">
      <ul className="border border-slate-300 p-2">
        {games.map((game) => (
          <li
            className="flex flex-col justify-between my-2 px-1 border border-slate-400"
            key={`player-${game.id}`}
          >
            <div className="flex justify-between border-b border-slate-400 text-sm">
              <span>{new Date(game.playedAt).toLocaleDateString("es-ES")}</span>
              <span>{game.field}</span>
            </div>

            <div className="flex gap-2 py-4 text-md justify-between">
              <span className="flex gap-2 basis-2/6">
                <span className="border border-dashed border-slate-300 rounded-lg px-2">
                  {players[game.team1[0]]["name"]}
                </span>
                <span className="border border-dashed border-slate-300 rounded-lg px-2">
                  {players[game.team1[1]]["name"]}
                </span>
              </span>
              <span className="text-slate-500">vs</span>
              <span className="flex gap-2 basis-2/6">
                <span className="border border-dashed border-slate-300 rounded-lg px-2">
                  {players[game.team2[0]]["name"]}
                </span>
                <span className="border border-dashed border-slate-300 rounded-lg px-2">
                  {players[game.team2[1]]["name"]}
                </span>
              </span>
            </div>

            <div className="flex gap-4 py-2 text-center mx-auto">
              <span>
                {game.set1[0]} - {game.set1[1]}
              </span>

              <span>
                {game.set2[0]} - {game.set2[1]}
              </span>

              {game.set3 && game.set3.length === 2 &&
                (
                  <span>
                    {game.set3[0]} - {game.set3[1]}
                  </span>
                )}
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}
