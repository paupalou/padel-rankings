import { Handlers } from "$fresh/server.ts";
import {
  list as listPlayers,
  remove as deletePlayer,
} from "services/players.ts";
import { Data, Player } from "types";
import Button from "components/button.tsx";

export const handler: Handlers = {
  async GET(req, ctx) {
    const players = await listPlayers();
    return ctx.render({ players });
  },
};

export default function Players(
  { data: { players } }: Data<{ players: Player[] }>,
) {
  return (
    <main className="p-1 xl:max-w-xl">
      <ul className="border border-slate-300 p-2">
        {players.map((player) => (
          <li
            className="flex justify-between py-0.5"
            key={`player-${player.id}`}
          >
            <span className="w-28">{player.name}</span>
            <Button>
              <a href={`/admin/players/remove/${player.id}`}>Delete</a>
            </Button>
          </li>
        ))}
      </ul>
    </main>
  );
}
