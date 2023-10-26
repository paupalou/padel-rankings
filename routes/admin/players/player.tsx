import { Handlers } from "$fresh/server.ts";
import Input from "components/input.tsx";
import Button from "components/button.tsx";

import { create as createPlayer } from "services/players.ts";

export const handler: Handlers = {
  async GET(_req, ctx) {
    return await ctx.render();
  },
  async POST(req, _ctx) {
    const form = await req.formData();
    const playerName = form.get("name")?.toString() ?? "";
    const playerId = form.get("id")?.toString() ?? "";

    createPlayer({ name: playerName, id: playerId });

    return new Response(null, {
      status: 303, // See Other
    });
  },
};

export default function CreatePlayer() {
  return (
    <>
      <form method="post" class="flex flex-col max-w-lg p-4">
        <Input name="name" label="Name" />
        <Input name="id" label="Id" />

        <Button type="submit">Create</Button>
      </form>
    </>
  );
}
