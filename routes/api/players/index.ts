import { Handlers } from "$fresh/server.ts";
import { getSessionId } from "$kv_auth";

import type { Player } from "types";
import * as PlayerService from "services/players.ts";
import { JSONResponse } from "services/utils.ts";

export const handler: Handlers<Player | null> = {
  async GET(_req, _ctx) {
    return JSONResponse(await PlayerService.list());
  },

  async POST(req, _ctx) {
    if (getSessionId(req) === undefined) {
      return new Response("Unauthorized", { status: 401 });
    }

    const game = await req.json() as Player;
    return await PlayerService.create(game);
  },

  async DELETE(_req, _ctx) {
    return await PlayerService.wipeAll();
  },
};
