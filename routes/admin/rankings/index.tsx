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
    <main class="p-1 xl:max-w-xl">
      <h2>Rankings</h2>

        {rankings.map((ranking) => (
          <a href={`/admin/rankings/${ranking.id}/games`}>
            <Button
              class="w-full justify-between py-1.5 my-2"
              key={`ranking-${ranking.id}`}
            >
              <span class="w-28">{ranking.name}</span>
            </Button>
          </a>
        ))}
    </main>
  );
}
