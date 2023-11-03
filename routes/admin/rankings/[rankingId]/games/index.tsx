import { Handlers } from "$fresh/server.ts";

import Button from "components/button.tsx";
import PlayerBadge from "components/player-badge.tsx";
import {
  get as getRanking,
  listGames as listRankingGames,
} from "services/rankings.ts";
import { listById as listPlayersById } from "services/players.ts";

import type { Data, Game, Ranking } from "types";

export const handler: Handlers = {
  async GET(_req, ctx) {
    const { rankingId } = ctx.params;
    const ranking = await getRanking(rankingId);
    const games = await listRankingGames(rankingId);
    const playersById = await listPlayersById();

    return ctx.render({
      ranking,
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
  { data: { games, ranking } }: Data<
    { games: Game[]; ranking: Ranking }
  >,
) {
  return (
    <section class="flex flex-col gap-2">
      <h2>
        <a class="text-cyan-800 mr-2" href={"/admin"}>Admin &gt;</a>
        <a class="text-cyan-800 mr-2" href={"/admin/rankings"}>Rankings &gt;</a>
        <a class="text-cyan-800 mr-2" href={"."}>{ranking.name} &gt;</a>
        <span class="text-slate-800">Games</span>
      </h2>
      <Button type="button">
        <a href="games/create">Create</a>
      </Button>
      <ul class="p-2">
        {games.map((game) => (
          <li
            class="flex flex-col justify-between my-2 border border-slate-400 rounded-lg"
            key={`player-${game.id}`}
          >
            <div class="flex justify-between border-b border-slate-400 text-sm bg-slate-200 px-2 rounded-t-lg">
              <span>{new Date(game.playedAt).toLocaleDateString("es-ES")}</span>
              <span>{game.field}</span>
            </div>

            <div class="flex gap-2 py-4 text-md justify-between px-2">
              <span class="flex gap-2 basis-2/6">
                <PlayerBadge>
                  {game.team1[0].name}
                </PlayerBadge>
                <PlayerBadge>
                  {game.team1[1].name}
                </PlayerBadge>
              </span>
              <span>vs</span>
              <span class="flex gap-2 basis-2/6">
                <PlayerBadge>
                  {game.team2[0].name}
                </PlayerBadge>
                <PlayerBadge>
                  {game.team2[1].name}
                </PlayerBadge>
              </span>
            </div>

            <div class="flex gap-4 py-2 text-center mx-auto font-bitter font-semibold text-lg">
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
    </section>
  );
}
