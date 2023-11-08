import { Handlers } from "$fresh/server.ts";
import { getSessionId } from "$kv_auth";

import { consumeInviteLink } from "services/rankings.ts";
import { getSession } from "services/auth.ts";

import type { Data } from "types";

export const handler: Handlers = {
  async GET(req, ctx) {
    const sessionId = await getSessionId(req);
    if (!sessionId) {
      return await ctx.render({ success: false });
    }

    const userSession = await getSession(sessionId);
    let res;

    if (userSession) {
      res = await consumeInviteLink(ctx.params.inviteLinkId, userSession.email);
    }
    return await ctx.render({ success: res });
  },
};

export default function InviteToRanking(
  { data: { success } }: Data<{ success: boolean }>,
) {
  return (
    <>
      <span>{success ? "Hello" : "Nope"}</span>
    </>
  );
}
