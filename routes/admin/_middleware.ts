import { getSessionId } from "$kv_auth";
import { MiddlewareHandlerContext } from "$fresh/server.ts";

import db from "services/database.ts";
import { GoogleUserInfo } from "types";

export async function handler(
  req: Request,
  ctx: MiddlewareHandlerContext,
) {
  const sessionId = await getSessionId(req);

  if (!sessionId) {
    return new Response("Unauthorized", { status: 401 });
  }

  const userSession = await db.get<GoogleUserInfo>([
    "user_session",
    sessionId,
  ]);
  const isAdmin = Boolean(userSession.value?.admin);

  return isAdmin
    ? await ctx.next()
    : new Response("Unauthorized", { status: 401 });
}
