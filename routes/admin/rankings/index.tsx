import { Handlers } from "$fresh/server.ts";
import { list as listRankings } from "services/rankings.ts";
import { Data, Ranking } from "types";
import Button from "components/button.tsx";
import BreadCrumb from "components/breadcrumb.tsx";

export const handler: Handlers = {
  async GET(_req, ctx) {
    const rankings = await listRankings();
    return ctx.render({ rankings });
  },
};

export default function Rankings(
  { data: { rankings } }: Data<{ rankings: Ranking[] }>,
) {
  return (
    <section className="flex flex-col gap-2">
      <BreadCrumb
        items={[
          { href: ".", label: "Admin" },
          { label: "Rankings" },
        ]}
      />

      {rankings.map((ranking) => (
        <a href={`/admin/rankings/${ranking.id}`}>
          <Button
            className="w-full justify-between py-1.5 my-2"
            key={`ranking-${ranking.id}`}
          >
            <span className="w-28">{ranking.name}</span>
          </Button>
        </a>
      ))}
    </section>
  );
}
