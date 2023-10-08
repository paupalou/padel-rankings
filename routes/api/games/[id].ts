import { Handlers } from "$fresh/server.ts";
import type { Game } from "../../../types.ts";
import * as GameService from "../../../services/games.ts";

export const handler: Handlers<Game | null> = {
  async GET(_req, ctx) {
    const gameId = ctx.params.id;
    return await GameService.get(gameId);
  },

  async DELETE(_req, ctx) {
    const gameId = ctx.params.id;
    return await GameService.remove(gameId);
  },
};
