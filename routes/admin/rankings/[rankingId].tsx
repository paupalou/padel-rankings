import { Handlers } from "$fresh/server.ts";

import { get as getRanking } from "services/rankings.ts";
import { Data, Ranking } from "types";
import Button from "components/button.tsx";
import BreadCrumb from "components/breadcrumb.tsx";

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
      <BreadCrumb
        items={[
          { href: "/admin", label: "Admin" },
          { href: ".", label: "Rankings" },
          { label: ranking.name },
        ]}
      />

      <Button>
        <a href={`${ranking.id}/games`}>Games</a>
      </Button>

      <Button>
        <a href={`${ranking.id}/players`}>Players</a>
      </Button>
    </section>
  );
}
