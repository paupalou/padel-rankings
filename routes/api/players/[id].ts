import { Handlers } from "$fresh/server.ts";
import type { Player } from "../../../types.ts";
import * as PlayerService from "../../../services/players.ts";

export const handler: Handlers<Player | null> = {
  async GET(_req, ctx) {
    const playerId = ctx.params.id;
    return await PlayerService.get(playerId);
  },

  async DELETE(_req, ctx) {
    const playerId = ctx.params.id;
    return await PlayerService.remove(playerId);
  },
};
