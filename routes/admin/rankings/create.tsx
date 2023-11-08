import { Handlers } from "$fresh/server.ts";
import { getSessionId } from "$kv_auth";

import Input from "components/input.tsx";
import Button from "components/button.tsx";
import Section from "components/section.tsx";
import BreadCrumb from "components/breadcrumb.tsx";
import db from "services/database.ts";
import { create as createRanking } from "services/rankings.ts";
import { getUser } from "services/auth.ts";

import type { GoogleUserInfo, User } from "types";

export const handler: Handlers = {
  async GET(_req, ctx) {
    return await ctx.render();
  },
  async POST(req, _ctx) {
    const sessionId = await getSessionId(req);

    if (sessionId) {
      const userSession = await db.get<GoogleUserInfo>([
        "user_session",
        sessionId,
      ]);

      const form = await req.formData();
      const rankingName = form.get("name")?.toString() ?? "";
      const rankingId = form.get("id")?.toString() ?? "";
      const creator = await getUser(userSession.value?.id!) as User;

      createRanking({
        name: rankingName,
        id: rankingId,
        creator,
        players: [],
        admins: [],
        users: [],
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
    <Section>
      <BreadCrumb
        items={[
          { href: "/admin", label: "Admin" },
          { href: ".", label: "Rankings" },
          { label: "Create" },
        ]}
      />
      <form method="post" className="flex flex-col max-w-lg p-4 gap-1">
        <Input name="name" label="Name" />
        <Input name="id" label="Id" />

        <Button className="mt-4" type="submit">Create</Button>
      </form>
    </Section>
  );
}
