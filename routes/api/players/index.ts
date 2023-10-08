import { Handlers } from "$fresh/server.ts";

import type { Player } from "../../../types.ts";
import * as PlayerService from "../../../services/players.ts";

export const handler: Handlers<Player | null> = {
  async GET(_req, _ctx) {
    return await PlayerService.list();
  },

  async POST(req, _ctx) {
    const game = await req.json() as Player;
    return await PlayerService.create(game);
  },

  async DELETE(_req, _ctx) {
    return await PlayerService.wipeAll();
  },
};
