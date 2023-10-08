import { useSignal } from "@preact/signals";
import Counter from "../islands/Counter.tsx";
import { Handlers } from "$fresh/server.ts";
import { Game } from "../types.ts";
import db from "../services/database.ts";
import { getRanking, initPlayerPoints } from "../services/scoring.ts";

const env = "http://localhost:8000/api";

export default async function Home() {
  const playerRes = await fetch(`${env}/players`);
  const gameRes = await fetch(`${env}/games`);

  if (!playerRes.ok || !gameRes.ok) {
    return <h1>An error occurred</h1>;
  }

  const players = await playerRes.json();
  const games = await gameRes.json();

  const playerPoints = initPlayerPoints(players);
  const ranking = getRanking(games, playerPoints);

  return (
    <main className="p-1 flex">
      <ul className="border border-slate-300">
        <li className="flex gap-2 px-2 py-1 items-center text-xs bg-green-200 border-b text-slate-600 border-slate-900">
          <span className="w-4 leading-6"></span>
          <span className="w-28">player</span>
          <span className="w-12 text-right">games</span>
          <span className="w-12 text-right">wins</span>
          <span className="w-12 text-right">loses</span>
          <span className="w-12 text-right">points</span>
          <span className="w-12 text-right">average</span>
          <span className="w-12 text-right">score</span>
          <span className="w-16 text-right">win ratio</span>
        </li>
        {ranking.map((player, index) => (
          <li className="flex gap-2 px-2 py-0.5 items-center" key={`player-${player.id}`}>
            <span className="w-4 text-xs leading-6">{index + 1}</span>
            <span className="w-28">{player.name}</span>
            <span className="w-12 text-right">{player.games}</span>
            <span className="w-12 text-right">{player.wins}</span>
            <span className="w-12 text-right">{player.loses}</span>
            <span className="w-12 text-right">{player.points}</span>
            <span className="w-12 text-right">
              {Math.round(player.average)}
            </span>
          <span className="w-12 text-right font-semibold">{Math.round(player.score)}</span>
            <span className="w-16 text-right text-xs">
              {player.games === 0 ? 0 : Math.round(player.wins / player.games * 100)}%
            </span>
          </li>
        ))}
      </ul>
    </main>
  );
}
