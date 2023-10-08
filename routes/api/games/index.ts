import { Handlers } from "$fresh/server.ts";

import type { Game } from "../../../types.ts";
import * as GameService from "../../../services/games.ts";

export const handler: Handlers<Game | null> = {
  async GET(_req, _ctx) {
    return await GameService.list();
  },

  async DELETE(_req, _ctx) {
    return await GameService.wipeAll();
  },

  async POST(req, _ctx) {
    const game = await req.json() as Game;
    return await GameService.create(game);
  },
};
