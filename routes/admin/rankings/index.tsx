import { Handlers } from "$fresh/server.ts";
import { list as listRankings } from "services/rankings.ts";
import { Data, Ranking } from "types";
import Button from "components/button.tsx";

export const handler: Handlers = {
  async GET(req, ctx) {
    const rankings = await listRankings();
    return ctx.render({ rankings });
  },
};

export default function Rankings(
  { data: { rankings } }: Data<{ rankings: Ranking[] }>,
) {
  return (
    <section class="flex flex-col gap-2">
      <h2>
        <a class="text-cyan-800 mr-2" href={"."}>Admin &gt;</a>
        <span class="text-slate-800">Rankings</span>
      </h2>

      {rankings.map((ranking) => (
        <a href={`/admin/rankings/${ranking.id}`}>
          <Button
            class="w-full justify-between py-1.5 my-2"
            key={`ranking-${ranking.id}`}
          >
            <span class="w-28">{ranking.name}</span>
          </Button>
        </a>
      ))}
    </section>
  );
}
