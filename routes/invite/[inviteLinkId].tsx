import { Handlers } from "$fresh/server.ts";
import Input from "components/input.tsx";
import Button from "components/button.tsx";

import { consumeInviteLink } from "services/rankings.ts";
import { Data } from "types";
import { getSessionId } from "$kv_auth";
import { getSession } from "services/auth.ts";

export const handler: Handlers = {
  async GET(req, ctx) {
    const sessionId = getSessionId(req);
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
