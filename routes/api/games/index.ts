import { Handlers } from "$fresh/server.ts";

import type { Game } from "types";
import * as GameService from "services/games.ts";
import { JSONResponse } from "services/utils.ts";

export const handler: Handlers<Game | null> = {
  async GET(_req, _ctx) {
    const games = await GameService.list();
    return JSONResponse(games);
  },

  async DELETE(_req, _ctx) {
    const message = await GameService.wipeAll();
    return new Response(message);
  },

  async POST(req, _ctx) {
    const game = await req.json() as Game;
    return await GameService.create(game);
  },
};
