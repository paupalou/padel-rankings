import { Handlers } from "$fresh/server.ts";

import { get as getRanking } from "services/rankings.ts";
import { Data, Ranking } from "types";
import Button from "components/button.tsx";

export const handler: Handlers = {
  async GET(req, ctx) {
    const ranking = await getRanking(ctx.params.rankingId);
    return ctx.render({ ranking });
  },
};

export default function RankingAdminView(
  { data: { ranking } }: Data<{ ranking: Ranking }>,
) {
  return (
    <section class="flex flex-col gap-2">
      <h2>
        <a class="text-cyan-800 mr-2" href={"/admin"}>Admin &gt;</a>
        <a class="text-cyan-800 mr-2" href={"."}>Rankings &gt;</a>
        <span class="text-slate-800">{ranking.name}</span>
      </h2>

      <Button>
        <a href={`${ranking.id}/games`}>Games</a>
      </Button>

      <Button>
        <a href={`${ranking.id}/players`}>Players</a>
      </Button>
    </section>
  );
}
