import { Handlers } from "$fresh/server.ts";
import Input from "components/input.tsx";
import Button from "components/button.tsx";

import { list as listPlayers } from "services/players.ts";
import { create as createGame } from "services/games.ts";
import { Data, Game, Player } from "types";
import PlayerSelection from "islands/player-selection.tsx";
import SetSelection from "islands/set-selection.tsx";
import Select from "components/select.tsx";
import { ulid } from "$ulid";

export const handler: Handlers = {
  async GET(_req, ctx) {
    const players = await listPlayers();
    return await ctx.render({ players });
  },
  async POST(req, _ctx) {
    const form = await req.formData();
    const game: Game = {
      id: ulid(),
      playedAt: new Date(form.get('playedAt') as string),
      createdAt: new Date(),
      field: form.get('field') as string,
      team1: [form.get('team1player1') as string, form.get('team1player2') as string],
      team2: [form.get('team2player1') as string, form.get('team2player2') as string],
      set1: [Number(form.get('set1team1')), Number(form.get('set1team2'))],
      set2: [Number(form.get('set2team1')), Number(form.get('set2team2'))],
    }

    const existsThirdSet = form.get('set3team1') && form.get('set3team2')
    if (existsThirdSet) {
      game.set3 = [Number(form.get('set3team1')), Number(form.get('set3team2'))];
    }

    await createGame(game)

    return new Response(null, {
      status: 303, // See Other
    });
  },
};

export default function CreateGame(
  { data: { players } }: Data<{ players: Player[] }>,
) {
  return (
    <>
      <form method="post" className="flex flex-col max-w-lg p-4 gap-2">
        <div className="flex gap-2">
          <span>Date</span>
          <Input name="playedAt" type="date" />
        </div>

        <div className="flex gap-2">
          <span>Field</span>
          <Select
            name="field"
            options={["Sometimes", "Factory"].map((field) => (
              <option value={field}>{field}</option>
            ))}
          />
        </div>
        <PlayerSelection players={players} />
        <SetSelection />

        <div className="flex gap-2 mt-4 justify-end">
          <Button type="submit">Create</Button>
          <Button type="button"><a href="/admin">Cancel</a></Button>
        </div>
      </form>
    </>
  );
}
