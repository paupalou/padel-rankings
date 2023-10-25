import { Handlers } from "$fresh/server.ts";

import Button from "components/button.tsx";
import {
  create as createGame,
  list as listGames,
  wipeAll as wipeAllGames,
} from "services/games.ts";

export const handler: Handlers = {
  GET(_req, ctx) {
    return ctx.render({ converted: false });
  },
  async POST(_req, ctx) {
    const { rankingId } = ctx.params;
    const games = await listGames();
    await wipeAllGames();
    for await (const game of games) {
      await createGame(game, rankingId);
    }

    return await ctx.render({ converted: true });
  },
};

export default function Conv({ converted }: { converted: boolean }) {
  return (
    <form method="post">
      {converted && <span>OK!</span>}
      {!converted && <Button type="submit">Convert</Button>}
    </form>
  );
}
