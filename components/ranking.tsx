import { ComponentChildren } from "preact";

import PlayerData from "islands/player-data.tsx";

import type { PlayerPoints } from "types";

type RankingProps = {
  ranking: PlayerPoints[];
};

function Position({ children }: { children: ComponentChildren }) {
  return (
    <div class="bg-blue w-8 h-full flex items-center font-bitter rounded-l-lg drop-shadow-md">
      <span className="text-white mx-auto font-bold text-xl">
        {children}
      </span>
    </div>
  );
}

function Stat({ label, value, className }: Record<string, string | number>) {
  return (
    <span class={`flex flex-col bg-slate-200 rounded-lg px-1 ${className}`}>
      <span class="text-[10px] text-slate-400 font-varela">{label}</span>
      <span>{value}</span>
    </span>
  );
}

export function RankingRow(
  { player, position }: { player: PlayerPoints; position: number },
) {
  return (
    <PlayerData player={player}>
      <div class="flex items-center h-full gap-4">
        <Position>{position}</Position>
        <span class="max-w-[150px] text-lg font-varela truncate text-slate-800 tracking-wide">
          {player.name}
        </span>
      </div>

      <div class="flex gap-1 font-bitter align-end pr-2 overflow-hidden">
        <span class="flex flex-col bg-[#ffe1a8] rounded-lg px-1">
          <span class="text-[10px] text-slate-500 font-varela">score</span>
          <span class="font-bold">{player.score}</span>
        </span>

        <Stat label="wins" value={player.wins} />
        <Stat label="loses" value={player.loses} />
        <Stat label="points" value={player.points} />
        <Stat label="ratio" value={`${player.winratio}%`} className="w-12" />
      </div>
    </PlayerData>
  );
}

export default function Ranking({ ranking }: RankingProps) {
  return (
    <div className="flex flex-col gap-2">
      {ranking.map((player, index) => (
        <RankingRow
          player={player}
          position={index + 1}
          key={`ranking-position-${index + 1}`}
        />
      ))}
    </div>
  );
}
