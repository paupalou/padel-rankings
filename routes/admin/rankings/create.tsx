import { Handlers } from "$fresh/server.ts";
import Input from "components/input.tsx";
import Button from "components/button.tsx";
import db from "services/database.ts";

import { create as createRanking } from "services/rankings.ts";
import { getSessionId } from "$kv_auth";
import { GoogleUserInfo } from "types";

export const handler: Handlers = {
  async GET(_req, ctx) {
    return await ctx.render();
  },
  async POST(req, _ctx) {
    const sessionId = getSessionId(req);

    if (sessionId) {
      const userSession = await db.get<GoogleUserInfo>([
        "user_session",
        sessionId,
      ]);

      const form = await req.formData();
      const rankingName = form.get("name")?.toString() ?? "";
      const rankingId = form.get("id")?.toString() ?? "";

      createRanking({
        name: rankingName,
        id: rankingId,
        creator: userSession.value?.email!,
        players: [],
        admins: [],
        createdAt: new Date(),
      });

      return new Response(null, {
        status: 303, // See Other
      });
    }

    return new Response(null, { status: 401 });
  },
};

export default function CreateRanking() {
  return (
    <>
      <form method="post" className="flex flex-col max-w-lg p-4">
        <Input name="name" label="Name" />
        <Input name="id" label="Id" />

        <Button type="submit">Create</Button>
      </form>
    </>
  );
}
