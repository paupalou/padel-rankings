import { Handlers } from "$fresh/server.ts";
import { listRankingGames } from "services/games.ts";
import { gerenateInviteLink, get as getRanking } from "services/rankings.ts";
import { listById as listPlayersById } from "services/players.ts";
import { Data, Game, Player, Ranking } from "types";
import { Component } from "preact";
import Button from "components/button.tsx";

export const handler: Handlers = {
  async GET(_req, ctx) {
    const { rankingId } = ctx.params;
    const ranking = await getRanking(rankingId);

    return ctx.render({ ranking });
  },

  async POST(req, ctx) {
    const { rankingId } = ctx.params;
    const ranking = await getRanking(rankingId);
    const inviteLink = await gerenateInviteLink(rankingId);

    return ctx.render({ ranking, inviteLink });
  },
};

export default function Players(
  { data: { ranking, inviteLink } }: Data<
    { ranking: Ranking; inviteLink?: string }
  >,
) {
  return (
    <section class="flex flex-col gap-2">
      <h2>
        <a class="text-cyan-800 mr-2" href={"/admin"}>Admin &gt;</a>
        <a class="text-cyan-800 mr-2" href={"/admin/rankings"}>Rankings &gt;</a>
        <a class="text-cyan-800 mr-2" href={"."}>{ranking.name} &gt;</a>
        <span class="text-slate-800">Players</span>
      </h2>

      <form method="post" class="flex flex-col">
        <Button type="submit">
          Generate invite link
        </Button>

        {inviteLink && <span>{inviteLink}</span>}
      </form>
    </section>
  );
}
