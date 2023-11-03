import { ComponentChildren, hydrate } from "preact";
import { useCallback } from "preact/hooks";

import PlayerBadge from "components/player-badge.tsx";
import { isOpen } from "signals";

import type { Game, Player, PlayerPoints } from "types";

function GameCard({ game, player, ...rest }: { game: Game; player: Player }) {
  return (
    <li
      className="flex flex-wrap gap-2 bg-turque/10 rounded-lg justify-center"
      {...rest}
    >
      <div className="flex justify-between items-center w-full bg-blue text-white rounded-t-lg text-sm font-normal px-2 py-1">
        <span className="capitalize ">
          {new Date(game.playedAt).toLocaleDateString("es-ES", {
            month: "short",
            day: "numeric",
            weekday: "long",
          })}
        </span>
        <span>
          {game.field}
        </span>
      </div>
      <div className="grid grid-cols-9 w-full items-center justify-between px-2">
        <span className="flex gap-1 md:gap-2 justify-center col-span-4">
          <PlayerBadge
            className={player.id === game.team1[0].id ? "bg-[#ffe1a8]" : ""}
          >
            {game.team1[0].name}
          </PlayerBadge>
          <PlayerBadge
            className={player.id === game.team1[1].id ? "bg-[#ffe1a8]" : ""}
          >
            {game.team1[1].name}
          </PlayerBadge>
        </span>
        <span className="text-xs px-2 text-center">vs</span>

        <span class="flex gap-1 md:gap-2 justify-center col-span-4">
          <PlayerBadge
            className={player.id === game.team2[0].id ? "bg-[#ffe1a8]" : ""}
          >
            {game.team2[0].name}
          </PlayerBadge>
          <PlayerBadge
            className={player.id === game.team2[1].id ? "bg-[#ffe1a8]" : ""}
          >
            {game.team2[1].name}
          </PlayerBadge>
        </span>
      </div>
      <div class="flex basis-full justify-center gap-4 py-2 text-center mx-auto font-bitter text-lg">
        <span>
          <span
            className={game.set1[0] > game.set1[1]
              ? "font-bold text-slate-700"
              : "font-semibold text-slate-600"}
          >
            {game.set1[0]}
          </span>
          <span className="px-1 font-semibold">-</span>
          <span
            className={game.set1[1] > game.set1[0]
              ? "font-bold text-slate-700"
              : "font-semibold text-slate-600"}
          >
            {game.set1[1]}
          </span>
        </span>

        <span>
          <span
            className={game.set2[0] > game.set2[1]
              ? "font-bold text-slate-700"
              : "font-semibold text-slate-600"}
          >
            {game.set1[0]}
          </span>
          <span className="px-1 font-semibold">-</span>
          <span
            className={game.set2[1] > game.set2[0]
              ? "font-bold text-slate-700"
              : "font-semibold text-slate-600"}
          >
            {game.set2[1]}
          </span>
        </span>

        {game.set3 && game.set3.length === 2 &&
          (
            <span>
              <span
                className={game.set3[0] > game.set3[1]
                  ? "font-bold text-slate-700"
                  : "font-semibold text-slate-600"}
              >
                {game.set3[0]}
              </span>
              <span className="px-1 font-semibold">-</span>
              <span
                className={game.set3[1] > game.set3[0]
                  ? "font-bold text-slate-700"
                  : "font-semibold text-slate-600"}
              >
                {game.set3[1]}
              </span>
            </span>
          )}
      </div>
    </li>
  );
}

function PlayerGames({ player }: { player: PlayerPoints }) {
  return (
    <div className="flex flex-wrap">
      <h3 className="basis-full text-center text-lg  mb-4">
        <span className="font-semibold">{player.name}</span>'s games
      </h3>
      <ul className="w-full flex flex-col gap-2">
        {player.games.map((game) => (
          <GameCard key={game.id} game={game} player={player} />
        ))}
      </ul>
    </div>
  );
}

export default function PlayerData(
  { children, player }: { children: ComponentChildren; player: PlayerPoints },
) {
  const toggle = useCallback(() => {
    isOpen.value = !isOpen.value;
    if (isOpen.value) {
      hydrate(
        <PlayerGames player={player} />,
        document.getElementById("modal-content")!,
      );
    }
  }, [isOpen]);

  const openPlayerInfo = useCallback((e: MouseEvent) => {
    toggle();
    e.stopPropagation();
  }, []);

  return (
    <button
      class="flex w-full h-12 gap-2 items-center bg-turque/30 rounded-lg justify-between drop-shadow-md"
      type="button"
      onClick={openPlayerInfo}
    >
      {children}
    </button>
  );
}
