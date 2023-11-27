import { ComponentChildren, render } from "preact";
import { useCallback } from "preact/hooks";
import { cx } from "@twind/core";

import PlayerBadge from "components/player-badge.tsx";
import WinIcon from "components/icons/win.tsx";
import { isOpen } from "signals";

import type { ParsedGame, Player, PlayerPoints } from "types";

function GameCard(
  { game, player, ...rest }: { game: ParsedGame; player: Player },
) {
  const isPlayerInTeam1 = !!game.team1.find((p) => p.id === player.id);

  const team1Won = [
    game.set1[0] - game.set1[1],
    game.set2[0] - game.set2[1],
    game.set3 ? game.set3[0] - game.set3[1] : 0,
  ].filter((res) => res > 0).length >= 2;
  const team2Won = !team1Won;

  const playerWinsMatch = isPlayerInTeam1 ? team1Won : team2Won;

  return (
    <li
      className={cx("flex flex-wrap gap-2 rounded-lg justify-center relative", {
        "bg-lime-400/30": playerWinsMatch,
        "bg-turque/10": !playerWinsMatch,
      })}
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
        <span className="flex gap-1 md:gap-2 justify-end col-span-4 items-center">
          {team1Won && <WinIcon className="h-4 top-10 left-2 shrink-0" />}
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

        <span class="flex gap-1 md:gap-2 justify-start col-span-4 items-center">
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
          {team2Won && <WinIcon className="h-4 top-10 right-2 shrink-0" />}
        </span>
      </div>
      <div class="flex basis-full justify-center gap-4 py-1 text-center mx-auto font-bitter text-lg">
        <span>
          <span
            className={cx("font-semibold", {
              "text-slate-700": game.set1[0] > game.set1[1],
              "text-slate-500": game.set1[0] < game.set1[1],
            })}
          >
            {game.set1[0]}
          </span>
          <span className="text-slate-600 px-1 font-semibold">-</span>
          <span
            className={cx("font-semibold", {
              "text-slate-700": game.set1[0] < game.set1[1],
              "text-slate-500": game.set1[0] > game.set1[1],
            })}
          >
            {game.set1[1]}
          </span>
        </span>

        <span>
          <span
            className={cx("font-semibold", {
              "text-slate-700": game.set2[0] > game.set2[1],
              "text-slate-500": game.set2[0] < game.set2[1],
            })}
          >
            {game.set2[0]}
          </span>
          <span className="text-slate-600 px-1 font-semibold">-</span>
          <span
            className={cx("font-semibold", {
              "text-slate-700": game.set2[0] < game.set2[1],
              "text-slate-500": game.set2[0] > game.set2[1],
            })}
          >
            {game.set2[1]}
          </span>
        </span>

        {game.set3 && game.set3.length === 2 &&
          (
            <span>
              <span
                className={cx("font-semibold", {
                  "text-slate-700": game.set3[0] > game.set3[1],
                  "text-slate-500": game.set3[0] < game.set3[1],
                })}
              >
                {game.set3[0]}
              </span>
              <span className="text-slate-600 px-1 font-semibold">-</span>
              <span
                className={cx("font-semibold", {
                  "text-slate-700": game.set3[0] < game.set3[1],
                  "text-slate-500": game.set3[0] > game.set3[1],
                })}
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
  const sortedGames = player.games.sort((a, b) => {
    const gameATime = new Date(a.playedAt).getTime();
    const gameBTime = new Date(b.playedAt).getTime();

    if (gameATime > gameBTime) {
      return -1;
    } else if (gameBTime > gameATime) {
      return 1;
    }

    return 0;
  });

  return (
    <div className="flex flex-wrap">
      <h3 className="basis-full text-center text-lg -mt-[20px] mb-3">
        <span className="font-semibold">{player.name}</span>'s games
      </h3>
      <ul className="w-full flex flex-col gap-2">
        {sortedGames.map((game) => (
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
      render(
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
      class="flex w-full h-12 gap-2 items-center bg-turque/30 rounded-lg justify-between"
      type="button"
      onClick={openPlayerInfo}
    >
      {children}
    </button>
  );
}
