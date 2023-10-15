import { Handlers } from "$fresh/server.ts";
import { remove as deletePlayer } from "services/players.ts";
import { Data } from "types";

export const handler: Handlers = {
  async GET(_req, ctx) {
    const deleteOperation = await deletePlayer(ctx.params.playerId);
    return ctx.render({ success: deleteOperation.ok });
  },
};

export default function DeletePlayer(
  { data: { success } }: Data<{ success: boolean }>,
) {
  return (
    <main className="p-1 xl:max-w-xl">
      hello
      {success && "Player deleted"}
    </main>
  );
}
